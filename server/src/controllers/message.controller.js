import { getIO, onlineUsers } from "../socket.js";

import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

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
            User.find({ _id: { $in: friendIds } }).select("-password -role -verificationToken -verificationTokenExpiry"),
            Conversation.find({ participants: userId }).populate("lastMessage"),
        ]);

        const usersWithConversation = users.map((user) => {

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
            .populate("participants", "username fullName profilePic headline location")
            .populate("lastMessage", "text image status createdAt senderId")
            .sort({ updatedAt: -1 });

        const result = conversations.map((conv) => {

            const peer = conv.participants.find((p) => p._id.toString() !== userId.toString());
            const unreadEntry = conv.unreadCounts?.find((u) => u.userId.toString() === userId.toString());

            return {
                conversationId: conv._id,
                peer: peer
                    ? { username: peer.username, fullName: peer.fullNamen }
                    : null,
                lastMessage: conv.lastMessage
                    ? {
                        text: conv.lastMessage.text,
                        image: conv.lastMessage.image,
                        status: conv.lastMessage.status,
                        createdAt: conv.lastMessage.createdAt,
                        isMine: conv.lastMessage.senderId.toString() === userId.toString(),
                      }
                    : null,
                unreadCount: unreadEntry?.count || 0,
                lastActivity: conv.updatedAt,
            };

        });

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── POST /message/conversation
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