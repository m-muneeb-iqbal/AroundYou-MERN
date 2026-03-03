import { Server } from "socket.io";
import { saveMessage } from "./services/message.service.js";

let io;
export const onlineUsers = new Map();

export const initSocket = (server) => {

    io = new Server (server, {

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

                if (receiverSocketId) io.to(receiverSocketId).emit("receiveMessage", newMessage);

                // Emit to sender for instant update
                socket.emit("receiveMessage", newMessage);

            } catch (error) {
                console.error("Error saving message via Socket.io:", error);
            }
        });

        // Disconnect
        socket.on("disconnect", () => {

            console.log("User disconnected:", socket.id);
            
           for (const [key, value] of onlineUsers.entries()) {

                if (value === socket.id) onlineUsers.delete(key);

            }

            console.log("Online users: ", Array.from(onlineUsers.keys()));
        });
    });

    return { io };
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};