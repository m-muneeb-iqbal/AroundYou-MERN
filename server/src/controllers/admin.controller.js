import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// ── GET /admin/stats
export const getStats = async (req, res) => {

    try {

        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            totalUsers,
            totalFriendships,
            totalConversations,
            newUsersThisWeek,
            newUsersThisMonth,
        ] = await Promise.all([
            User.countDocuments({ role: "User" }),
            Friend.countDocuments({ status: "accepted" }),
            Conversation.countDocuments(),
            User.countDocuments({ role: "User", createdAt: { $gte: startOfWeek } }),
            User.countDocuments({ role: "User", createdAt: { $gte: startOfMonth } }),
        ]);

        res.status(200).json({
            totalUsers,
            totalFriendships,
            totalConversations,
            newUsersThisWeek,
            newUsersThisMonth,
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};

// ── GET /admin/users
export const getAllUsers = async (req, res) => {

    try {

        const { q, role, page = 1, limit = 10 } = req.query;
        const isSuperAdmin = req.user.role === "SuperAdmin";

        const filter = {};
        if (q) filter.fullName = { $regex: q.trim(), $options: "i" };
        if (role) filter.role = role;

        // Admin cannot see SuperAdmin in the list
        if (!isSuperAdmin) {
            filter.role = filter.role
                ? filter.role === "SuperAdmin" ? "User" : filter.role
                : { $in: ["User", "Admin"] };
        }

        const total = await User.countDocuments(filter);
        const users = await User.find(filter)
            .select("fullName email location role createdAt profilePic")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const usersWithFriendCount = await Promise.all(

            users.map(async (user) => {

                const friendCount = await Friend.countDocuments({
                    $or: [{ requester: user._id }, { recipient: user._id }],
                    status: "accepted",
                });

                return { ...user.toObject(), friendCount };
            })

        );

        res.status(200).json({
            users: usersWithFriendCount,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};

// ── GET /admin/users/:userId
export const getUserById = async (req, res) => {

    try {

        const isSuperAdmin = req.user.role === "SuperAdmin";
        const user = await User.findById(req.params.userId).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        // Admin cannot view SuperAdmin profile
        if (!isSuperAdmin && user.role === "SuperAdmin") {
            return res.status(403).json({ message: "Access denied." });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};

// ── PATCH /admin/users/:userId
export const updateUser = async (req, res) => {

    try {

        const { userId } = req.params;
        const isSuperAdmin = req.user.role === "SuperAdmin";

        const targetUser = await User.findById(userId);
        if (!targetUser) return res.status(404).json({ message: "User not found" });

        // Admin cannot edit SuperAdmin or other Admins
        if (!isSuperAdmin && targetUser.role !== "User") {
            return res.status(403).json({ message: "You can only edit regular users." });
        }

        // Fields available to both Admin and SuperAdmin
        const sharedFields = [
            "fullName", "email", "location", "designation", "description",
            "education", "field", "passingYear", "cgpa", "institute",
            "certificate", "provider", "company", "jobTitle", "joiningDate",
            "resignationDate", "currentlyWorking", "skills",
        ];

        // Role change — SuperAdmin only
        const allowedFields = isSuperAdmin
            ? [...sharedFields, "role"]
            : sharedFields;

        // Prevent SuperAdmin role from being assigned by anyone
        if (req.body.role === "SuperAdmin") {
            return res.status(403).json({ message: "SuperAdmin role cannot be assigned." });
        }

        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        if (Object.keys(updates).length === 0)
            return res.status(400).json({ message: "No valid fields provided." });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true, runValidators: true }
        ).select("-password");

        res.status(201).json({ message: "User info updated successfully" });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};

// ── DELETE /admin/users/:userId — SuperAdmin only
export const deleteUser = async (req, res) => {

    try {

        const { userId } = req.params;

        if (userId === req.user._id.toString())
            return res.status(400).json({ message: "Cannot delete your own account." });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Cannot delete SuperAdmin
        if (user.role === "SuperAdmin") {
            return res.status(403).json({ message: "SuperAdmin cannot be deleted." });
        }

        await Promise.all([
            Friend.deleteMany({ $or: [{ requester: userId }, { recipient: userId }] }),
            Conversation.deleteMany({ participants: userId }),
            Message.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] }),
            User.findByIdAndDelete(userId),
        ]);

        res.status(201).json({ message: "User deleted successfully" });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};

// ── DELETE /admin/users/:userId/profile-pic — both Admin and SuperAdmin
export const removeProfilePic = async (req, res) => {

    try {

        const isSuperAdmin = req.user.role === "SuperAdmin";
        const target = await User.findById(req.params.userId);

        if (!target) return res.status(404).json({ message: "User not found" });
        if (!isSuperAdmin && target.role !== "User")
            return res.status(403).json({ message: "You can only edit regular users." });

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { profilePic: "" },
            { new: true }
        ).select("-password");

        res.status(201).json({ message: "Profile picture removed successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// ── DELETE /admin/users/:userId/education
export const clearEducation = async (req, res) => {

    try {

        const isSuperAdmin = req.user.role === "SuperAdmin";
        const target = await User.findById(req.params.userId);

        if (!target) return res.status(404).json({ message: "User not found" });
        if (!isSuperAdmin && target.role !== "User")
            return res.status(403).json({ message: "You can only edit regular users." });

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $unset: { education: "", field: "", passingYear: "", cgpa: "", institute: "" } },
            { new: true }
        ).select("-password");

        res.status(201).json({ message: "Education cleared successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

};

// ── DELETE /admin/users/:userId/experience
export const clearExperience = async (req, res) => {

    try {

        const isSuperAdmin = req.user.role === "SuperAdmin";
        const target = await User.findById(req.params.userId);

        if (!target) return res.status(404).json({ message: "User not found" });
        if (!isSuperAdmin && target.role !== "User")
            return res.status(403).json({ message: "You can only edit regular users." });

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $unset: { company: "", jobTitle: "", joiningDate: "", resignationDate: "" }, currentlyWorking: false },
            { new: true }
        ).select("-password");

        res.status(201).json({ message: "Experience cleared successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

};

// ── DELETE /admin/users/:userId/skills
export const clearSkills = async (req, res) => {

    try {

        const isSuperAdmin = req.user.role === "SuperAdmin";
        const target = await User.findById(req.params.userId);

        if (!target) return res.status(404).json({ message: "User not found" });
        if (!isSuperAdmin && target.role !== "User")
            return res.status(403).json({ message: "You can only edit regular users." });

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { skills: [] },
            { new: true }
        ).select("-password");

        res.status(201).json({ message: "Skills cleared successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

};

// ── DELETE /admin/users/:userId/friends — SuperAdmin only
export const clearFriends = async (req, res) => {

    try {

        await Friend.deleteMany({
            $or: [{ requester: req.params.userId }, { recipient: req.params.userId }],
        });

        res.status(201).json({ message: "All friendships removed" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

};

// ── GET /admin/friend-requests
export const getAllFriendRequests = async (req, res) => {

    try {

        const requests = await Friend.find({ status: "pending" })
            .populate("requester", "fullName profilePic")
            .populate("recipient", "fullName profilePic")
            .sort({ createdAt: -1 });
        res.status(200).json(requests);

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });

    }

};

// ── DELETE /admin/friend-requests/:requestId
export const deleteFriendRequest = async (req, res) => {

    try {

        const request = await Friend.findByIdAndDelete(req.params.requestId);
        if (!request) return res.status(404).json({ message: "Request not found" });
        res.status(201).json({ message: "Friend request removed" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
    
};