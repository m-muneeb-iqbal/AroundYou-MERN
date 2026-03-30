import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Notification from "../models/notification.model.js";
import { getIO, onlineUsers } from "../socket.js";

export const sendFriendRequest = async (req, res) => {

    try {

        const requester = req.user._id;
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Username is required." });
        }

        const recipientUser = await User.findOne({ username: username.toLowerCase().trim() });
        if (!recipientUser) {
            return res.status(404).json({ message: "User not found." });
        }
        const recipientId = recipientUser._id;

        if (requester.toString() === recipientId.toString()) {
            return res.status(400).json({ message: "Cannot add yourself." });
        }

        const existing = await Friend.findOne({
            $or: [
                { requester, recipient: recipientId },
                { requester: recipientId, recipient: requester },
            ],
        });

        if (existing) {
            return res.status(400).json({ message: "Request already sent." });
        }

        const friendRequest = await Friend.create({ requester, recipient: recipientId });

        // Populate requester
        const populated = await friendRequest.populate("requester", "fullName profilePic headline username");

        // Notify recipient live if online
        const io = getIO();
        const recipientSocketId = onlineUsers.get(recipientId.toString());
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("friendRequestReceived", populated);
        }

        res.status(201).json({
            requester: populated.requester,
            status: populated.status,
            createdAt: populated.createdAt,
        });

    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};

export const cancelFriendRequest = async (req, res) => {

    try {

        const { username } = req.body;

        if (!username) return res.status(400).json({ message: "Username is required." });

        const targetUser = await User.findOne({ username: username.toLowerCase().trim() });
        if (!targetUser) return res.status(404).json({ message: "User not found." });

        const request = await Friend.findOne({
            requester: req.user._id,
            recipient: targetUser._id,
            status: "pending",
        });

        if (!request) return res.status(404).json({ message: "Request not found." });

        await request.deleteOne();

        // Notify recipient that the request was cancelled
        const io = getIO();
        const recipientSocketId = onlineUsers.get(targetUser._id.toString());
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("friendRequestCancelled", {
                requester: {
                    username: req.user.username,
                    fullName: req.user.fullName,
                },
            });
        }

        res.status(200).json({ message: "Request cancelled" });

    } catch (error) {
        console.error("Error cancelling friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const acceptFriendRequest = async (req, res) => {

    try {

        const { username } = req.body;

        if (!username) return res.status(400).json({ message: "Username is required." });

        const requesterUser = await User.findOne({ username: username.toLowerCase().trim() });
        if (!requesterUser) return res.status(404).json({ message: "User not found." });

        const request = await Friend.findOne({
            requester: requesterUser._id,
            recipient: req.user._id,
            status: "pending",
        });

        if (!request) return res.status(404).json({ message: "Request not found." });

        request.status = "accepted";
        await request.save();

        // Eagerly create conversation so both users always have a conversationId
        const existingConv = await Conversation.findOne({
            participants: { $all: [request.requester, request.recipient] },
        });
        if (!existingConv) {
            await Conversation.create({
                participants: [request.requester, request.recipient],
                unreadCounts: [
                    { userId: request.requester, count: 0 },
                    { userId: request.recipient, count: 0 },
                ],
            });
        }

        const [requester, recipient] = await Promise.all([
            User.findById(request.requester).select("-password -role -verificationToken -verificationTokenExpiry"),
            User.findById(request.recipient).select("-password -role -verificationToken -verificationTokenExpiry"),
        ]);

        const io = getIO();

        // Persist notification for requester
        const notification = await Notification.create({
            recipient: request.requester,
            type: "request_accepted",
            actor: req.user._id,
        });

        // Only notify requester
        const requesterSocketId = onlineUsers.get(request.requester.toString());
        if (requesterSocketId) {
            io.to(requesterSocketId).emit("friendRequestAccepted", {
                friend: recipient,
                notificationId: notification._id,
            });
        }

        res.status(200).json({ message: "Request accepted" });

    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const rejectFriendRequest = async (req, res) => {

    try {

        const { username } = req.body;

        if (!username) return res.status(400).json({ message: "Username is required." });

        const requesterUser = await User.findOne({ username: username.toLowerCase().trim() });
        if (!requesterUser) return res.status(404).json({ message: "User not found." });

        const request = await Friend.findOne({
            requester: requesterUser._id,
            recipient: req.user._id,
            status: "pending",
        });

        if (!request) return res.status(404).json({ message: "Request not found." });

        await request.deleteOne();

        // Notify requester that their request was rejected
        const io = getIO();

        // Persist notification for requester
        const notification = await Notification.create({
            recipient: requesterUser._id,
            type: "request_rejected",
            actor: req.user._id,
        });

        const requesterSocketId = onlineUsers.get(requesterUser._id.toString());
        if (requesterSocketId) {
            io.to(requesterSocketId).emit("friendRequestRejected", {
                recipient: {
                    username: req.user.username,
                    fullName: req.user.fullName,
                    profilePic: req.user.profilePic,
                },
                notificationId: notification._id,
            });
        }

        res.status(200).json({ message: "Request rejected" });

    } catch (error) {
        console.error("Error rejecting friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const unfriend = async (req, res) => {

    try {

        const { username } = req.body;
        const userId = req.user._id;

        if (!username) return res.status(400).json({ message: "Username is required." });

        const targetUser = await User.findOne({ username: username.toLowerCase().trim() });
        if (!targetUser) return res.status(404).json({ message: "User not found." });

        const friendship = await Friend.findOne({
            $or: [
                { requester: userId, recipient: targetUser._id },
                { requester: targetUser._id, recipient: userId },
            ],
            status: "accepted",
        });

        if (!friendship) return res.status(404).json({ message: "Friendship not found." });

        const conversation = await Conversation.findOne({
            participants: { $all: [userId, targetUser._id] },
        });

        await friendship.deleteOne();

        if (conversation) {
            await Message.deleteMany({ conversationId: conversation._id });
            await conversation.deleteOne();
        }

        // Notify the unfriended user in real-time
        const io = getIO();

        // Persist notification for the unfriended user
        const notification = await Notification.create({
            recipient: targetUser._id,
            type: "unfriended",
            actor: userId,
        });

        const targetSocketId = onlineUsers.get(targetUser._id.toString());
        if (targetSocketId) {
            io.to(targetSocketId).emit("unfriended", {
                unfriender: {
                    username: req.user.username,
                    fullName: req.user.fullName,
                    profilePic: req.user.profilePic,
                },
                notificationId: notification._id,
            });
        }

        res.status(200).json({ message: "Unfriended successfully" });

    } catch (error) {
        console.error("Error unfriending:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};

export const getFriends = async (req, res) => {

    try {

        const userId = req.user._id;

        const friendships = await Friend.find({
            $or: [{ requester: userId }, { recipient: userId }],
            status: "accepted",
        });

        if (friendships.length === 0) return res.status(200).json([]);

        const friendData = await Promise.all(
            friendships.map(async (f) => {
                const friendId =
                    f.requester.toString() === userId.toString() ? f.recipient : f.requester;

                const [user, conversation] = await Promise.all([
                    User.findById(friendId).select("profilePic fullName headline location username"),
                    Conversation.findOne({ participants: { $all: [userId, friendId] } }).select("_id"),
                ]);

                if (!user) return null;

                return {
                    friendshipId: f._id,
                    conversationId: conversation?._id || null,
                    fullName: user.fullName,
                    profilePic: user.profilePic,
                    headline: user.headline,
                    location: user.location,
                    username: user.username,
                };
            })
        );

        res.status(200).json(friendData.filter(Boolean));

    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPendingRequests = async (req, res) => {

    try {

        const userId = req.user._id;

        const requests = await Friend.find({
            recipient: userId,
            status: "pending",
        }).populate("requester", "fullName profilePic jobTitle username");

        res.status(200).json(requests);

    } catch (error) {
        console.error("Error fetching pending requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};

export const getNonFriends = async (req, res) => {

    try {

        const userId = req.user._id;

        const friendships = await Friend.find({
            $or: [{ requester: userId }, { recipient: userId }],
        });

        const excludedIds = new Set([userId.toString()]);
        friendships.forEach((f) => {
            excludedIds.add(f.requester.toString());
            excludedIds.add(f.recipient.toString());
        });

        // Get a larger pool then shuffle and slice
        const pool = await User.find({
            _id: { $nin: Array.from(excludedIds) },
        })
        .select("profilePic fullName headline location username")
        .limit(20);

        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        const nonFriends = pool.slice(0, 4).map((u) => ({
            username: u.username,
            fullName: u.fullName,
            profilePic: u.profilePic,
            headline: u.headline,
            location: u.location,
        }));

        res.status(200).json(nonFriends);

    } catch (error) {
        console.error("Error fetching non-friends:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};