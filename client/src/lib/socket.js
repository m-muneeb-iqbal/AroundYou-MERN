import { io } from "socket.io-client";

const socketURL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export const socket = io(socketURL, {
    transports: ["websocket", "polling"],
    autoConnect: false,
});