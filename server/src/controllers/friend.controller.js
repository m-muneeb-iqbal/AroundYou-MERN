import Friend from "../models/friend.model.js";

export const sendFriendRequest = async (req, res) => {

    try {

        const requester = req.user._id;
        const { recipientId } = req.body;

        if (requester.toString() === recipientId) {
            return res.status(400).json({ message: "Cannot add yourself." });
        }

        const existing = await Friend.findOne({
            requester,
            recipient: recipientId,
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

        if (!request) {
        return res.status(404).json({ message: "Request not found" });
        }

        request.status = "accepted";
        await request.save();

        res.status(200).json(request);

    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
};