import { io } from "socket.io-client";

const socketURL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

console.log("Socket connecting to:", socketURL);

export const socket = io(socketURL, {
    transports: ["websocket", "polling"],
    autoConnect: false,
    reconnection: true,
});

socket.on("connect", () => {
    console.log("🔌 Socket connected:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Socket disconnected");
});

socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
});