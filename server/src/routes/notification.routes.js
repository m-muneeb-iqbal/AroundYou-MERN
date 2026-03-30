import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getNotifications, markNotificationRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/",                 protectRoute, getNotifications);
router.patch("/:id/read",       protectRoute, markNotificationRead);

export default router;