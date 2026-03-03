import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const saveMessage = async ({ senderId, receiverId, text, image }) => {

    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
        });
    }

    const newMessage = await Message.create({
        conversationId: conversation._id,
        senderId,
        text,
        image,
        readBy: [senderId], // sender has read it
    });

    //Update unread count
    conversation.participants.forEach((participantId) => {
        const id = participantId.toString();

        if (id !== senderId.toString()) {
        const current = conversation.unreadCount.get(id) || 0;
        conversation.unreadCount.set(id, current + 1);
        }
    });

    conversation.lastMessage = newMessage._id;
    await conversation.save();

    return newMessage;
};