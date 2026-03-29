import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";
import Conversation from "../models/conversation.model.js";
import { getUnreadCount } from "../services/conversation.service.js";

// ─── GET /api/conversations
export const getConversations = async (req, res) => {

    try {

        const userId = req.user._id;

        const friendships = await Friend.find({
            $or: [{ requester: userId }, { recipient: userId }],
            status: "accepted",
        });

        const friendIds = friendships.map((f) =>
            f.requester.toString() === userId.toString() ? f.recipient : f.requester
        );

        if (friendIds.length === 0) return res.status(200).json([]);

        const [users, conversations] = await Promise.all([
            User.find({ _id: { $in: friendIds } }).select("-password -role -verificationToken -verificationTokenExpiry"),
            Conversation.find({ participants: userId }).populate("lastMessage"),
        ]);

        const result = users
            .map((user) => {

                const conversation = conversations.find((conv) =>
                    conv.participants.some((p) => p.toString() === user._id.toString())
                );

                const friendship = friendships.find((f) =>
                    f.requester.toString() === user._id.toString() ||
                    f.recipient.toString() === user._id.toString()
                );

                const lm = conversation?.lastMessage;

                return {
                    username: user.username,
                    fullName: user.fullName,
                    profilePic: user.profilePic,
                    friendshipId: friendship?._id || null,
                    conversationId: conversation?._id || null,
                    lastMessage: lm
                        ? { text: lm.text, image: lm.image, status: lm.status, createdAt: lm.createdAt }
                        : null,
                    unreadCount: conversation ? getUnreadCount(conversation, userId) : 0,
                    lastActivity: conversation?.updatedAt || null,
                };

            })
            .sort((a, b) => {
                if (!a.lastActivity) return 1;
                if (!b.lastActivity) return -1;
                return new Date(b.lastActivity) - new Date(a.lastActivity);
            });

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }

};