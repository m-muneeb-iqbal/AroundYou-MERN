import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const saveMessage = async ({ senderId, receiverId, text, image }) => {

    // Sort participants to ensure consistent ordering
    const sortedParticipants = [senderId, receiverId].sort((a, b) => a.toString().localeCompare(b.toString()));

    // Try to find existing conversation
    let conversation = await Conversation.findOne({
        participants: { $all: sortedParticipants },
    });

    if (!conversation) {
        try {
            // Initialize unreadCounts subdocument for both participants
            conversation = await Conversation.create({
                participants: sortedParticipants,
                unreadCounts: [
                    { userId: senderId, count: 0 },
                    { userId: receiverId, count: 0 },
                ],
            });
        } catch (err) {
            // Handle race condition: another request may have created it
            if (err.code === 11000 || err.message.includes('duplicate')) {
                conversation = await Conversation.findOne({
                    participants: { $all: sortedParticipants },
                });
            } else {
                throw err;
            }
        }
    }

    const newMessage = await Message.create({

        conversationId: conversation._id,
        senderId,
        receiverId,
        text,
        image,
        readBy: [senderId],

    });

    // Increment unreadCount for receiver using subdocument array
    await Conversation.updateOne(

        { _id: conversation._id, "unreadCounts.userId": receiverId },
        {
            $inc: { "unreadCounts.$.count": 1 },
            $set: { lastMessage: newMessage._id },
        }

    );

    return newMessage;
};