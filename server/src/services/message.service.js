import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const saveMessage = async ({ senderId, receiverId, text, image }) => {

    // Query for existing conversation - $all matches regardless of order
    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
        try {
            // Create with unsorted participants - order doesn't matter for $all queries
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                unreadCounts: [
                    { userId: senderId, count: 0 },
                    { userId: receiverId, count: 0 },
                ],
            });
            console.log("✓ New conversation created:", conversation._id);
        } catch (err) {
            console.error("Creation error:", err.code, err.message);
            
            // Handle race condition: another request may have created it
            if (err.code === 11000 || err.message.includes('duplicate')) {
                console.log("Retrying findOne after 11000 error...");
                conversation = await Conversation.findOne({
                    participants: { $all: [senderId, receiverId] },
                });
                console.log("Found after retry:", conversation?._id);
            } else {
                // Some other error - wait a bit and retry once more
                console.log("Unknown error, retrying after 100ms...");
                await new Promise(resolve => setTimeout(resolve, 100));
                conversation = await Conversation.findOne({
                    participants: { $all: [senderId, receiverId] },
                });
                if (!conversation) {
                    throw new Error(`Failed to create or find conversation: ${err.message}`);
                }
            }
        }
    }

    if (!conversation) {
        throw new Error("Conversation is null - this should not happen");
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