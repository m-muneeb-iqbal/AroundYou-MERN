import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import friendRoutes from "./routes/friend.routes.js";
import userRoutes from "./routes/user.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

import { initSocket } from "./socket.js";

import { createServer } from "http";
import { connectDB } from "./lib/db.js";
import "./lib/passport.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true })); 
app.use(cookieParser());
app.use(
    cors({
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        optionsSuccessStatus: 200
    })
);


app.use(passport.initialize());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/friend", friendRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notifications", notificationRoutes);

const server = createServer (app);
initSocket (server);

server.listen (PORT, () => {

    console.log("Server (with Socket.io) is running on PORT:" + PORT);
    connectDB();

})