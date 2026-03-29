import { getIO, onlineUsers } from "../socket.js";

import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

import { saveMessage } from "../services/message.service.js";
import { getUnreadCount } from "../services/conversation.service.js";

// ─── GET /api/conversation?username=x
export const getMessagesByConversation = async (req, res) => {

    try {

        const { username } = req.query;
        const userId = req.user._id;

        if (!username) return res.status(400).json({ error: "username is required." });

        const targetUser = await User.findOne({ username: username.toLowerCase().trim() });
        if (!targetUser) return res.status(404).json({ error: "User not found." });

        const conversation = await Conversation.findOne({
            participants: { $all: [userId, targetUser._id] },
        });

        if (!conversation) return res.status(404).json({ error: "Conversation not found." });

        const conversationId = conversation._id;

        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

        const result = messages.map((msg) => ({
            _id: msg._id,
            conversationId: conversationId,
            isMine: msg.senderId.toString() === userId.toString(),
            text: msg.text,
            image: msg.image,
            status: msg.status,
            createdAt: msg.createdAt,
        }));

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── POST /message/send
export const sendMessages = async (req, res) => {

    try {

        const { text, image, username } = req.body;
        const senderId = req.user._id;
        const io = getIO();

        if (!username) return res.status(400).json({ error: "username is required." });

        const targetUser = await User.findOne({ username: username.toLowerCase().trim() });
        if (!targetUser) return res.status(404).json({ error: "User not found." });

        const receiverId = targetUser._id;

        const friendship = await Friend.findOne({
            $or: [
                { requester: senderId, recipient: receiverId },
                { requester: receiverId, recipient: senderId },
            ],
            status: "accepted",
        });

        if (!friendship) {
            return res.status(403).json({ error: "You can only message friends." });
        }

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

        const conv = await Conversation.findById(newMessage.conversationId);

        // Emit receiveMessage to both sender and receiver so both get live updates
        const senderSocketId = onlineUsers.get(senderId.toString());
        const receiverSocketId = onlineUsers.get(receiverId.toString());

        const basePayload = {
            _id: newMessage._id,
            conversationId: conv._id.toString(),
            text: newMessage.text,
            image: newMessage.image,
            status: newMessage.status,
            createdAt: newMessage.createdAt,
        };

        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", { ...basePayload, isMine: true });
        }

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", { ...basePayload, isMine: false });

            io.to(receiverSocketId).emit("updateUnread", {
                conversationId: conv._id.toString(),
                unreadCount: getUnreadCount(conv, receiverId),
            });
        }

        res.status(201).json({
            _id: newMessage._id,
            conversationId: newMessage.conversationId,
            text: newMessage.text,
            image: newMessage.image,
            status: newMessage.status,
            isMine: true,
            createdAt: newMessage.createdAt,
        });

    } catch (error) {
        console.error("Error in sendMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── PUT /message/read
export const markAsRead = async (req, res) => {

    try {

        const { username } = req.body;
        const userId = req.user._id;
        const io = getIO();

        if (!username) return res.status(400).json({ error: "username is required." });

        const targetUser = await User.findOne({ username: username.toLowerCase().trim() });
        if (!targetUser) return res.status(404).json({ error: "User not found." });

        const conversation = await Conversation.findOne({
            participants: { $all: [userId, targetUser._id] },
        });

        if (!conversation) return res.status(404).json({ error: "Conversation not found." });

        const conversationId = conversation._id;

        // Mark all messages as read
        await Message.updateMany(
            { conversationId, readBy: { $ne: userId } },
            { $addToSet: { readBy: userId } }
        );

        // 2. Only upgrade status to "seen" on messages sent TO this user
        await Message.updateMany(
            { conversationId, receiverId: userId, status: { $ne: "seen" } },
            { $set: { status: "seen" } }
        );

        // Reset unread count
        await Conversation.updateOne(
            { _id: conversationId, "unreadCounts.userId": userId },
            { $set: { "unreadCounts.$.count": 0 } }
        );

        const updatedConversation = await Conversation.findById(conversationId);

        for (const participantId of updatedConversation.participants) {

            const socketId = onlineUsers.get(participantId.toString());
            if (!socketId) continue;

            io.to(socketId).emit("messagesRead", updatedConversation._id.toString());

            io.to(socketId).emit("messagesSeen", {
                conversationId: updatedConversation._id.toString(),
                seenBy: userId.toString(),
            });

            io.to(socketId).emit("updateUnread", {
                conversationId: updatedConversation._id.toString(),
                unreadCount: getUnreadCount(updatedConversation, participantId),
            });
            
        }

        res.status(200).json({ success: true });

    } catch (error) {
        console.error("markAsRead error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};