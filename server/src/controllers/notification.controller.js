import Notification from "../models/notification.model.js";
import { getIO } from "../socket.js";

// GET /api/notifications
// request_received types are handled by the pending-requests UI — exclude them here
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user._id,
            type: { $ne: "request_received" },
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate("actor", "fullName profilePic username headline location");

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// PATCH /api/notifications/:id/read
export const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { $set: { read: true } },
            { new: true }
        );

        if (!notification) return res.status(404).json({ message: "Notification not found" });

        // Broadcast to all other tabs of this user so read-state stays in sync
        getIO()
            .to(`user:${req.user._id}`)
            .emit("notificationRead", { id: req.params.id });

        res.status(200).json(notification);
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};