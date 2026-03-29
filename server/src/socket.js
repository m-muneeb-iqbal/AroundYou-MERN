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

            const { senderId, text, image, tempId } = data;
            let { receiverId, conversationId } = data;

            try {

                // Derive receiverId from conversationId when provided (avoids exposing peer _id)
                if (!receiverId && conversationId) {
                    const conv = await Conversation.findById(conversationId);
                    if (!conv) {
                        socket.emit("messagingError", { message: "Conversation not found." });
                        return;
                    }
                    receiverId = conv.participants.find((p) => p.toString() !== senderId.toString());
                }

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

                const basePayload = {
                    _id: newMessage._id,
                    conversationId: newMessage.conversationId.toString(),
                    text: newMessage.text,
                    image: newMessage.image,
                    status: newMessage.status,
                    createdAt: newMessage.createdAt,
                    tempId,
                };

                // Emit to sender for instant update
                socket.emit("receiveMessage", { ...basePayload, isMine: true });

                // Emit to receiver using their socketId
                const receiverSocketId = onlineUsers.get(receiverId.toString());

                if (receiverSocketId) {

                    io.to(receiverSocketId).emit("receiveMessage", { ...basePayload, isMine: false });
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

        socket.on("callUser", async ({ to: friendshipId, offer, callerInfo }) => {
            const friendship = await Friend.findById(friendshipId);
            if (!friendship) return;
            const calleeId =
                friendship.requester.toString() === callerInfo.userId.toString()
                    ? friendship.recipient.toString()
                    : friendship.requester.toString();
            const receiverSocketId = onlineUsers.get(calleeId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("incomingCall", {
                    friendshipId,
                    offer,
                    callerInfo,
                });
            }
        });

        socket.on("answerCall", async ({ to: friendshipId, answer }) => {
            const friendship = await Friend.findById(friendshipId);
            if (!friendship) return;
            const callerId =
                friendship.requester.toString() !== onlineUsers.get(friendship.requester.toString())
                    ? friendship.requester.toString()
                    : friendship.recipient.toString();
            // Find caller socket by iterating — simpler: store callerId in friendship lookup
            // Use callerInfo.userId stored in the event chain instead
            // We route by emitting to all participants except self
            for (const participantId of [friendship.requester.toString(), friendship.recipient.toString()]) {
                const sid = onlineUsers.get(participantId);
                if (sid && sid !== socket.id) {
                    io.to(sid).emit("callAnswered", { answer });
                }
            }
        });

        socket.on("rejectCall", async ({ to: friendshipId }) => {
            const friendship = await Friend.findById(friendshipId);
            if (!friendship) return;
            for (const participantId of [friendship.requester.toString(), friendship.recipient.toString()]) {
                const sid = onlineUsers.get(participantId);
                if (sid && sid !== socket.id) {
                    io.to(sid).emit("callRejected");
                }
            }
        });

        socket.on("iceCandidate", async ({ to: friendshipId, candidate }) => {
            const friendship = await Friend.findById(friendshipId);
            if (!friendship) return;
            for (const participantId of [friendship.requester.toString(), friendship.recipient.toString()]) {
                const sid = onlineUsers.get(participantId);
                if (sid && sid !== socket.id) {
                    io.to(sid).emit("iceCandidate", { candidate });
                }
            }
        });

        socket.on("endCall", async ({ to: friendshipId }) => {
            const friendship = await Friend.findById(friendshipId);
            if (!friendship) return;
            for (const participantId of [friendship.requester.toString(), friendship.recipient.toString()]) {
                const sid = onlineUsers.get(participantId);
                if (sid && sid !== socket.id) {
                    io.to(sid).emit("callEnded");
                }
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