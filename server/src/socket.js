import { Server } from "socket.io";
import { saveMessage } from "./services/message.service.js";

import Friend from "./models/friend.model.js";
import Conversation from "./models/conversation.model.js";
import Message from "./models/message.model.js";

let io;
export const onlineUsers = new Map();

export const initSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type", "Authorization"],
        },
        transports: ["websocket", "polling"],
        allowEIO3: true,
        pingInterval: 25000,
        pingTimeout: 5000,
    });

    io.on("connection", (socket) => {

        // User connected

        socket.on("userOnline", async (userId) => {
            onlineUsers.set(userId, socket.id);

            try {

                const undeliveredMessages = await Message.find({
                    receiverId: userId,
                    status: "sent",
                });

                if (undeliveredMessages.length === 0) return;

                // Upgrade all to delivered in DB
                await Message.updateMany(
                    { receiverId: userId, status: "sent" },
                    { $set: { status: "delivered" } }
                );

                // Notify each sender whose message is now delivered
                // Group by senderId to send one event per sender, not one per message
                const senderMap = new Map();

                for (const msg of undeliveredMessages) {

                    const senderId = msg.senderId.toString();

                    if (!senderMap.has(senderId)) {
                        senderMap.set(senderId, []);
                    }
                    senderMap.get(senderId).push(msg._id.toString());
                }

                for (const [senderId, messageIds] of senderMap) {

                    const senderSocketId = onlineUsers.get(senderId);
                    if (!senderSocketId) continue; // sender is offline, they'll see it on next load

                    for (const messageId of messageIds) {

                        io.to(senderSocketId).emit("messageDelivered", {

                            messageId,
                            conversationId: undeliveredMessages
                                .find(m => m._id.toString() === messageId)
                                ?.conversationId.toString(),

                        });

                    }

                }

            } catch (error) {
                console.error("Error upgrading undelivered messages:", error);
            }
        });

        socket.on("sendMessage", async (data) => {

            const { senderId, receiverId, text, image, tempId } = data;

            try {

                const friendship = await Friend.findOne({

                    $or: [
                        { requester: senderId, recipient: receiverId },
                        { requester: receiverId, recipient: senderId },
                    ],

                    status: "accepted",
                });



                if (!friendship) {

                    socket.emit("messagingError", {
                        message: "You can only message friends.",
                    });

                    return;

                }

                const newMessage = await saveMessage({ senderId, receiverId, text, image });

                // Fetch fresh conversation to get accurate unread count
                const conv = await Conversation.findById(newMessage.conversationId);

                const receiverEntry = conv.unreadCounts?.find(
                    (u) => u.userId.toString() === receiverId.toString()
                );

                const unreadCount = receiverEntry?.count || 0;

                const payload = {
                    ...newMessage.toObject(),
                    conversationId: newMessage.conversationId.toString(),
                    tempId
                };

                // Emit to sender for instant update
                socket.emit("receiveMessage", payload);

                // Emit to receiver using their socketId
                const receiverSocketId = onlineUsers.get(receiverId.toString());

                if (receiverSocketId) {

                    io.to(receiverSocketId).emit("receiveMessage", payload);
                    io.to(receiverSocketId).emit("updateUnread", {
                        conversationId: newMessage.conversationId.toString(),
                        unreadCount,
                    });

                    await Message.findByIdAndUpdate(newMessage._id, { status: "delivered" });
                    socket.emit("messageDelivered", {

                        messageId: newMessage._id.toString(),
                        conversationId: newMessage.conversationId.toString()

                    });


                }

            } catch (error) {
                console.error("Error saving message via Socket.io:", error);
            }

        });

        socket.on("disconnect", () => {

            for (const [key, value] of onlineUsers.entries()) {
                if (value === socket.id) onlineUsers.delete(key);
            }

        });
        
    });

    return { io };
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};