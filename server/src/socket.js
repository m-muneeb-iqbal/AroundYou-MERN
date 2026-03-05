import { Server } from "socket.io";
import { saveMessage } from "./services/message.service.js";
import Conversation from "./models/conversation.model.js";
import Message from "./models/message.model.js";

let io;
export const onlineUsers = new Map();

export const initSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {

        console.log("A user connected:", socket.id);

        socket.on("userOnline", (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log("Online users:", Array.from(onlineUsers.keys()));
        });

        socket.on("sendMessage", async (data) => {

            const { senderId, receiverId, text, image, tempId } = data;

            try {

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

            console.log("User disconnected:", socket.id);

            for (const [key, value] of onlineUsers.entries()) {
                if (value === socket.id) onlineUsers.delete(key);
            }
            console.log("Online users:", Array.from(onlineUsers.keys()));

        });
        
    });

    return { io };
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};