import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// ── GET /admin/users
export const getAllUsers = async (req, res) => {
    try {
        const { q, role, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (q) filter.fullName = { $regex: q.trim(), $options: "i" };
        if (role) filter.role = role;

        const total = await User.countDocuments(filter);
        const users = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ── DELETE /admin/users/:userId
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (userId === req.user._id.toString()) {
            return res.status(400).json({ message: "Cannot delete your own account." });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Clean up all related data
        await Promise.all([
            Friend.deleteMany({ $or: [{ requester: userId }, { recipient: userId }] }),
            Conversation.deleteMany({ participants: userId }),
            Message.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] }),
            User.findByIdAndDelete(userId),
        ]);

        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ── GET /admin/stats
export const getStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalAdmins,
            totalFriendships,
            totalPendingRequests,
            totalMessages,
            totalConversations,
            recentUsers,
        ] = await Promise.all([
            User.countDocuments({ role: "User" }),
            User.countDocuments({ role: "Admin" }),
            Friend.countDocuments({ status: "accepted" }),
            Friend.countDocuments({ status: "pending" }),
            Message.countDocuments(),
            Conversation.countDocuments(),
            User.find({ role: "User" })
                .select("-password")
                .sort({ createdAt: -1 })
                .limit(5),
        ]);

        res.status(200).json({
            totalUsers,
            totalAdmins,
            totalFriendships,
            totalPendingRequests,
            totalMessages,
            totalConversations,
            recentUsers,
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ── GET /admin/friend-requests
export const getAllFriendRequests = async (req, res) => {
    try {
        const requests = await Friend.find({ status: "pending" })
            .populate("requester", "-password")
            .populate("recipient", "-password")
            .sort({ createdAt: -1 });

        res.status(200).json(requests);

    } catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ── DELETE /admin/friend-requests/:requestId
export const deleteFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await Friend.findByIdAndDelete(requestId);
        if (!request) return res.status(404).json({ message: "Request not found" });
        res.status(200).json({ message: "Friend request removed" });
    } catch (error) {
        console.error("Error deleting friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};