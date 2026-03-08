import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";
import { getIO, onlineUsers } from "../socket.js";

export const sendFriendRequest = async (req, res) => {

    try {

        const requester = req.user._id;
        const { recipientId } = req.body;

        if (requester.toString() === recipientId) {
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

        // Populate requester so recipient gets full user details in the event
        const populated = await friendRequest.populate("requester", "-password");

        // Notify recipient live if online
        const io = getIO();
        const recipientSocketId = onlineUsers.get(recipientId.toString());
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("friendRequestReceived", populated);
        }

        res.status(201).json(populated);

    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};

export const cancelFriendRequest = async (req, res) => {

    try {

        const { requestId } = req.params;
        const request = await Friend.findById(requestId);

        if (!request) return res.status(404).json({ message: "Request not found" });

        if (request.requester.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Friend.findByIdAndDelete(requestId);

        res.status(200).json({ message: "Request cancelled" });

    } catch (error) {
        console.error("Error cancelling friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const acceptFriendRequest = async (req, res) => {

    try {

        const { requestId } = req.params;
        const request = await Friend.findById(requestId);

        if (!request) return res.status(404).json({ message: "Request not found" });

        if (request.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        request.status = "accepted";
        await request.save();

        const [requester, recipient] = await Promise.all([
            User.findById(request.requester).select("-password"),
            User.findById(request.recipient).select("-password"),
        ]);

        const io = getIO();

        // Only notify requester
        const requesterSocketId = onlineUsers.get(request.requester.toString());
        if (requesterSocketId) {
            io.to(requesterSocketId).emit("friendRequestAccepted", {
                friend: recipient,
            });
        }

        res.status(200).json(request);

    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const rejectFriendRequest = async (req, res) => {

    try {

        const { requestId } = req.params;
        const request = await Friend.findById(requestId);

        if (!request) return res.status(404).json({ message: "Request not found" });

        if (request.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Friend.findByIdAndDelete(requestId);

        res.status(200).json({ message: "Request rejected" });

    } catch (error) {
        console.error("Error rejecting friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const unfriend = async (req, res) => {

    try {

        const { friendId } = req.params;
        const userId = req.user._id;

        const friendship = await Friend.findOneAndDelete({
            $or: [
                { requester: userId, recipient: friendId },
                { requester: friendId, recipient: userId },
            ],
            status: "accepted",
        });

        if (!friendship) return res.status(404).json({ message: "Friendship not found" });

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

        const friendIds = friendships.map((f) =>
            f.requester.toString() === userId.toString() ? f.recipient : f.requester
        );

        const friends = await User.find({ _id: { $in: friendIds } }).select("-password");
        res.status(200).json(friends);

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
        }).populate("requester", "-password");

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
        .select("-password")
        .limit(20);

        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        const nonFriends = pool.slice(0, 4);

        res.status(200).json(nonFriends);

    } catch (error) {
        console.error("Error fetching non-friends:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};