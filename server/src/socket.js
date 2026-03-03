import { Server } from "socket.io";
import { saveMessage } from "./services/message.service.js";

const onlineUsers = new Map();

export const initSocket = (server) => {

    const io = new Server (server, {

        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        }

    });

    io.on("connection", (socket) => {

        console.log("A user connected: ", socket.id);

        // Store userId when they connect
        socket.on("userOnline", (userId) => {

            onlineUsers.set(userId, socket.id);
            console.log("Online users: ", Array.from(onlineUsers.keys()));

        });

        // Listen for sending message
        socket.on("sendMessage", async (data) => {

            const { senderId, receiverId, text } = data;

            try {

                const newMessage = await saveMessage({ senderId, receiverId, text });

                // Emit to receiver if online
                const receiverSocketId = onlineUsers.get(receiverId);

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receiveMessage", newMessage);
                }

                // Emit to sender for instant update
                socket.emit("receiveMessage", newMessage);

            } catch (error) {
                console.error("Error saving message via Socket.io:", error);
            }
        });

        // Disconnect
        socket.on("disconnect", () => {

            for (const [userId, id] of onlineUsers.entries()) {

                if (id === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }

            console.log("User disconnected: ", socket.id);
        });
    });

    return io;
};