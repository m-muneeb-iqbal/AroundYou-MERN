import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";

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

        const friendRequest = await Friend.create({
            requester,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);

    } catch (error) {
        console.error("Error sending friend request:", error);
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

// Returns all accepted friends with their user details
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

// Returns pending requests sent TO the current user
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

// Returns all non-friends for "people you may know"
export const getNonFriends = async (req, res) => {

    try {

        const userId = req.user._id;

        const friendships = await Friend.find({
            $or: [{ requester: userId }, { recipient: userId }],
        });

        // Exclude self, existing friends, and pending requests in either direction
        const excludedIds = new Set([userId.toString()]);
        friendships.forEach((f) => {
            excludedIds.add(f.requester.toString());
            excludedIds.add(f.recipient.toString());
        });

        const nonFriends = await User.find({
            _id: { $nin: Array.from(excludedIds) },
        }).select("-password").limit(4);

        res.status(200).json(nonFriends);

    } catch (error) {
        console.error("Error fetching non-friends:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};