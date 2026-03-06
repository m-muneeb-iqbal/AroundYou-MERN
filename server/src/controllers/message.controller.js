import { getIO, onlineUsers } from "../socket.js";

import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

import { saveMessage } from "../services/message.service.js";

const getUnreadCount = (conversation, userId) => {

    const entry = conversation.unreadCounts?.find(
        (u) => u.userId.toString() === userId.toString()
    );

    return entry?.count || 0;
    
};

// ─── GET /message/users 
export const getUsersForSidebar = async (req, res) => {
    
    try {

        const userId = req.user._id;

        // Only fetch accepted friends
        const friendships = await Friend.find({
            $or: [{ requester: userId }, { recipient: userId }],
            status: "accepted",
        });

        const friendIds = friendships.map((f) =>
            f.requester.toString() === userId.toString() ? f.recipient : f.requester
        );

        if (friendIds.length === 0) return res.status(200).json([]);

        const [users, conversations] = await Promise.all([
            User.find({ _id: { $in: friendIds } }).select("-password"),
            Conversation.find({ participants: userId }).populate("lastMessage"),
        ]);

        const usersWithConversation = users.map((user) => {

            const conversation = conversations.find((conv) =>
                conv.participants.some((p) => p.toString() === user._id.toString())
            );

            return {

                _id: user._id,
                fullName: user.fullName,
                conversationId: conversation?._id || null,
                lastMessage: conversation?.lastMessage || null,
                unreadCount: conversation ? getUnreadCount(conversation, userId) : 0,
                lastActivity: conversation?.updatedAt || null,

            };

        })
        .sort ((a, b) => {

            if (!a.lastActivity) return 1;
            if (!b.lastActivity) return -1;
            return new Date(b.lastActivity) - new Date(a.lastActivity);

        })

        res.status(200).json(usersWithConversation);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── GET /message/conversations
export const getConversations = async (req, res) => {

    try {

        const userId = req.user._id;

        const conversations = await Conversation.find({ participants: userId })
            .populate("participants", "-password")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        res.status(200).json(conversations);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── GET /message/:id
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

        const messagesWithConvId = messages.map((msg) => ({
            ...msg.toObject(),
            conversationId: conversation._id.toString(),
        }));

        res.status(200).json(messagesWithConvId);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── POST /message/send/:id
export const sendMessages = async (req, res) => {

    try {

        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        const io = getIO();

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

        const payload = {
            ...newMessage.toObject(),
            conversationId: conv._id.toString(),
        };

        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", payload);
        }

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", payload);

            io.to(receiverSocketId).emit("updateUnread", {
                conversationId: conv._id.toString(),
                unreadCount: getUnreadCount(conv, receiverId),
            });
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in sendMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── PUT /message/read/:conversationId
export const markAsRead = async (req, res) => {

    try {

        const { conversationId } = req.params;
        const userId = req.user._id;
        const io = getIO();

        if (!conversationId || conversationId.length !== 24) {
            return res.status(400).json({ error: "Invalid conversationId" });
        }

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

        const conversation = await Conversation.findById(conversationId);

        for (const participantId of conversation.participants) {

            const socketId = onlineUsers.get(participantId.toString());
            if (!socketId) continue;

            io.to(socketId).emit("messagesRead", conversation._id.toString());

            io.to(socketId).emit("messagesSeen", {
                conversationId: conversation._id.toString(),
                seenBy: userId.toString(),
            });

            io.to(socketId).emit("updateUnread", {
                conversationId: conversation._id.toString(),
                unreadCount: getUnreadCount(conversation, participantId),
            });
            
        }

        res.status(200).json({ success: true });

    } catch (error) {
        console.error("markAsRead error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};