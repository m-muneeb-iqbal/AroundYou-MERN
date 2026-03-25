import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const saveMessage = async ({ senderId, receiverId, text, image }) => {

    // Sort participants to ensure consistent ordering
    const sortedParticipants = [senderId, receiverId].sort((a, b) => a.toString().localeCompare(b.toString()));

    let conversation = await Conversation.findOne({
        participants: { $all: sortedParticipants },
    });

    if (!conversation) {

        // Initialize unreadCounts subdocument for both participants
        conversation = await Conversation.create({

            participants: sortedParticipants,
            unreadCounts: [
                { userId: senderId, count: 0 },
                { userId: receiverId, count: 0 },
            ],

        });

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