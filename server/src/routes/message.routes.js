import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar, getConversations, getMessages, sendMessages, markAsRead } from "../controllers/message.controller.js";
import express from "express";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/conversations", protectRoute, getConversations);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessages);
router.put("/read/:conversationId", protectRoute, markAsRead);

export default router;