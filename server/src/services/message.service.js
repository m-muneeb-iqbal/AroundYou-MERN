import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { findOrCreateConversation } from "./conversation.service.js";

export const saveMessage = async ({ senderId, receiverId, text, image }) => {

    const conversation = await findOrCreateConversation(senderId, receiverId);

    const newMessage = await Message.create({

        conversationId: conversation._id,
        senderId,
        receiverId,
        text,
        image,
        readBy: [senderId],

    });

    // Always update lastMessage on the conversation
    await Conversation.updateOne(
        { _id: conversation._id },
        { $set: { lastMessage: newMessage._id } }
    );

    // Increment unread count for receiver (only if their entry exists)
    await Conversation.updateOne(

        { _id: conversation._id, "unreadCounts.userId": receiverId },
        { $inc: { "unreadCounts.$.count": 1 } }

    );

    return newMessage;
};