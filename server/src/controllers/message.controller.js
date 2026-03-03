import { getIO, onlineUsers } from "../socket.js";

import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

import { saveMessage } from "../services/message.service.js";

export const getUsersForSidebar = async (req, res) => {

    try {

        const userId = req.user._id;

        // Fetch all other users (for the sidebar)
        const users = await User.find({ _id: { $ne: userId } }).select("-password");

        // Fetch conversations that include the current user
        const conversations = await Conversation.find({
            participants: userId
        }).populate("lastMessage");

const usersWithConversation = users.map((user) => {
    const conversation = conversations.find((conv) =>
        conv.participants.some((p) => p.toString() === user._id.toString())
    );

    let unreadCount = 0;

    if (conversation) {
        // Convert Map/Object to plain object safely
        const unreadObj = conversation.unreadCount?.toObject?.() || conversation.unreadCount || {};
        unreadCount = unreadObj[userId.toString()] || 0;
    }

    return {
        _id: user._id,
        fullName: user.fullName,
        conversationId: conversation?._id || null,
        lastMessage: conversation?.lastMessage || null,
        unreadCount,
    };
});

        res.status(200).json(usersWithConversation);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getConversations = async (req, res) => {

    try {

        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: userId,
        })
        .populate("participants", "-password")
        .populate("lastMessage")
        .sort({ updatedAt: -1 });

        res.status(200).json(conversations);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {

    try {

        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) return res.status(200).json([]);

        const messages = await Message.find({
            conversationId: conversation._id,
        }).sort({ createdAt: 1 });

        // Convert to plain JS objects and attach conversationId explicitly
        const messagesWithConvId = messages.map((msg) => ({
            ...msg.toObject(),
            conversationId: conversation._id.toString(),
        }));

        res.status(200).json(messagesWithConvId);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessages = async (req, res) => {

    try {

        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await saveMessage({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in sendMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const markAsRead = async (req, res) => {

    try {

        const { conversationId } = req.params;
        const userId = req.user._id;
        const io = getIO();

        // Validate conversationId string length first
        if (!conversationId || conversationId.length !== 24) {
            return res.status(400).json({ error: "Invalid conversationId" });
        }

        // Mark all messages as read
        await Message.updateMany(

            {
                conversationId: conversationId, // string is fine
                readBy: { $ne: userId },
            },
            { $addToSet: { readBy: userId } }

        );

        // Reset unread count
        await Conversation.updateOne(
            { _id: conversationId },
            { $set: { [`unreadCount.${userId}`]: 0 } }
        );

        const conversation = await Conversation.findById(conversationId);

        // Emit to other users safely
        conversation.participants.forEach((participantId) => {

            const socketId = onlineUsers.get(participantId.toString());

            if (socketId) {

                // Notify read receipt
                io.to(socketId).emit("messagesRead", conversation._id.toString());

                // Force unread badge update for everyone
                io.to(socketId).emit("updateUnread", {
                    conversationId: conversation._id.toString(),
                    increment: 0
                });
            }
            
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("markAsRead error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};