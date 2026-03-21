import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";

export const searchUsers = async (req, res) => {

    try {

        const { q } = req.query;
        const userId = req.user._id;

        if (!q || q.trim().length === 0) return res.status(200).json([]);

        // Case-insensitive name search, exclude self
        const users = await User.find({
            _id: { $ne: userId },
            fullName: { $regex: q.trim(), $options: "i" },
        })
        .select("-password")
        .limit(8);

        if (users.length === 0) return res.status(200).json([]);

        // Fetch all friendship records involving the current user and results
        const userIds = users.map((u) => u._id);
        const friendships = await Friend.find({
            $or: [
                { requester: userId, recipient: { $in: userIds } },
                { requester: { $in: userIds }, recipient: userId },
            ],
        });

        // Attach relationshipStatus to each user
        const results = users.map((user) => {

            const friendship = friendships.find(
                (f) =>
                    f.requester.toString() === user._id.toString() ||
                    f.recipient.toString() === user._id.toString()
            );

            let relationshipStatus = "none";

            if (friendship) {

                if (friendship.status === "accepted") {
                    relationshipStatus = "friends";
                    
                } else if (friendship.status === "pending") {
                    relationshipStatus =
                        friendship.requester.toString() === userId.toString()
                            ? "pending_sent"
                            : "pending_received";
                }
            }

            return {
                ...user.toObject(),
                relationshipStatus,
                friendshipId: friendship?._id || null,
            };
            
        });

        res.status(200).json(results);

    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};