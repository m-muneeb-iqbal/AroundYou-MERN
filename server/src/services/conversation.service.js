import Conversation from "../models/conversation.model.js";

export const findOrCreateConversation = async (senderId, receiverId) => {

    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
        try {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                unreadCounts: [
                    { userId: senderId, count: 0 },
                    { userId: receiverId, count: 0 },
                ],
            });
        } catch (err) {
            if (err.code !== 11000) throw err;

            // Race condition: another request already created it
            conversation = await Conversation.findOne({
                participants: { $all: [senderId, receiverId] },
            });

            if (!conversation) throw err;
        }
    }

    return conversation;

};

export const getUnreadCount = (conversation, userId) => {

    const entry = conversation.unreadCounts?.find(
        (u) => u.userId.toString() === userId.toString()
    );

    return entry?.count || 0;

};