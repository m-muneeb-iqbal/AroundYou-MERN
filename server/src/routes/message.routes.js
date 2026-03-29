import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessagesByConversation, sendMessages, markAsRead } from "../controllers/message.controller.js";
import express from "express";

const router = express.Router();

router.get("/",     protectRoute, getMessagesByConversation);
router.post("/send", protectRoute, sendMessages);
router.put("/read",  protectRoute, markAsRead);

export default router;