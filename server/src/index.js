import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import messageRoutes from "./routes/message.routes.js";
import friendRoutes from "./routes/friend.routes.js";
import userRoutes from "./routes/user.routes.js";

import { initSocket } from "./socket.js";

import { createServer } from "http";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true })); 
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/friend", friendRoutes);
app.use("/api/user", userRoutes);

const server = createServer (app);

initSocket (server);

server.listen (PORT, () => {

    console.log("Server (with Socket.io) is running on PORT:" + PORT);
    connectDB();

})