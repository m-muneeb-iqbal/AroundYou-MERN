import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL;

const socketURL = apiUrl?.replace("/api", "") || "http://localhost:5000";
console.log("Socket connecting to:", socketURL);

export const socket = io(socketURL, {
    transports: ["websocket", "polling"],
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    withCredentials: true,
});

socket.on("connect", () => {
    console.log("Socket connected");
});

socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
});