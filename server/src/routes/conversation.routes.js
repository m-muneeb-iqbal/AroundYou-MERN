import { protectRoute } from "../middleware/auth.middleware.js";
import { getConversations } from "../controllers/conversation.controller.js";
import messageRoutes from "./message.routes.js";
import express from "express";

const router = express.Router();

router.get("/",         protectRoute, getConversations);
router.use("/message",  messageRoutes);

export default router;