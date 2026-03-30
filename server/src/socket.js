import { Server } from "socket.io";
import { saveMessage } from "./services/message.service.js";
import jwt from "jsonwebtoken";
import User from "./models/user.model.js";

import Friend from "./models/friend.model.js";
import Conversation from "./models/conversation.model.js";
import Message from "./models/message.model.js";

let io;
export const onlineUsers = new Map();

export const initSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type", "Authorization"],
        },
        transports: ["websocket", "polling"],
        allowEIO3: true,
        pingInterval: 25000,
        pingTimeout: 5000,
    });

    // Authenticate every socket connection via JWT cookie
    io.use(async (socket, next) => {
        try {
            const cookie = socket.handshake.headers.cookie || "";
            const match = cookie.match(/(?:^|;\s*)jwt=([^;]+)/);
            if (!match) return next(new Error("Unauthorized"));

            const decoded = jwt.verify(match[1], process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select("_id");
            if (!user) return next(new Error("Unauthorized"));

            socket.data.userId = user._id.toString();
            next();
        } catch {
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {

        // Register authenticated user as online immediately
        const userId = socket.data.userId;
        onlineUsers.set(userId, socket.id);

        // Join a user-specific room so we can broadcast to all tabs of this user
        socket.join(`user:${userId}`);

        // Deliver any messages that arrived while this user was offline
        (async () => {
            try {

                const undeliveredMessages = await Message.find({
                    receiverId: userId,
                    status: "sent",
                });

                if (undeliveredMessages.length === 0) return;

                await Message.updateMany(
                    { receiverId: userId, status: "sent" },
                    { $set: { status: "delivered" } }
                );

                const senderMap = new Map();
                for (const msg of undeliveredMessages) {
                    const sid = msg.senderId.toString();
                    if (!senderMap.has(sid)) senderMap.set(sid, []);
                    senderMap.get(sid).push(msg._id.toString());
                }

                for (const [senderId, messageIds] of senderMap) {
                    const senderSocketId = onlineUsers.get(senderId);
                    if (!senderSocketId) continue;
                    for (const messageId of messageIds) {
                        io.to(senderSocketId).emit("messageDelivered", {
                            messageId,
                            conversationId: undeliveredMessages
                                .find(m => m._id.toString() === messageId)
                                ?.conversationId.toString(),
                        });
                    }
                }

            } catch (error) {
                console.error("Error upgrading undelivered messages:", error);
            }
        })();

        socket.on("sendMessage", async (data) => {

            const senderId = socket.data.userId;
            const { text, image, tempId, conversationId } = data;

            try {

                const conv = await Conversation.findById(conversationId);
                if (!conv) {
                    socket.emit("messagingError", { message: "Conversation not found." });
                    return;
                }

                const receiverId = conv.participants.find((p) => p.toString() !== senderId);

                const friendship = await Friend.findOne({

                    $or: [
                        { requester: senderId, recipient: receiverId },
                        { requester: receiverId, recipient: senderId },
                    ],

                    status: "accepted",
                });



                if (!friendship) {

                    socket.emit("messagingError", {
                        message: "You can only message friends.",
                    });

                    return;

                }

                const newMessage = await saveMessage({ senderId, receiverId, text, image });

                // Fetch fresh conversation to get accurate unread count
                const updatedConv = await Conversation.findById(newMessage.conversationId);

                const receiverEntry = updatedConv.unreadCounts?.find(
                    (u) => u.userId.toString() === receiverId.toString()
                );

                const unreadCount = receiverEntry?.count || 0;

                const basePayload = {
                    _id: newMessage._id,
                    conversationId: newMessage.conversationId.toString(),
                    text: newMessage.text,
                    image: newMessage.image,
                    status: newMessage.status,
                    createdAt: newMessage.createdAt,
                    tempId,
                };

                // Emit to sender for instant update
                socket.emit("receiveMessage", { ...basePayload, isMine: true });

                // Emit to receiver using their socketId
                const receiverSocketId = onlineUsers.get(receiverId.toString());

                if (receiverSocketId) {

                    io.to(receiverSocketId).emit("receiveMessage", { ...basePayload, isMine: false });
                    io.to(receiverSocketId).emit("updateUnread", {
                        conversationId: newMessage.conversationId.toString(),
                        unreadCount,
                    });

                    await Message.findByIdAndUpdate(newMessage._id, { status: "delivered" });
                    socket.emit("messageDelivered", {

                        messageId: newMessage._id.toString(),
                        conversationId: newMessage.conversationId.toString()

                    });


                }

            } catch (error) {
                console.error("Error saving message via Socket.io:", error);
            }

        });

        socket.on("callUser", async ({ to: friendshipId, offer, callerInfo }) => {
            const friendship = await Friend.findById(friendshipId);
            if (!friendship) return;
            const calleeId =
                friendship.requester.toString() === socket.data.userId
                    ? friendship.recipient.toString()
                    : friendship.requester.toString();
            const receiverSocketId = onlineUsers.get(calleeId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("incomingCall", {
                    friendshipId,
                    offer,
                    callerInfo,
                });
            }
        });

        socket.on("answerCall", async ({ to: friendshipId, answer }) => {
            const friendship = await Friend.findById(friendshipId);
            if (!friendship) return;
            for (const participantId of [friendship.requester.toString(), friendship.recipient.toString()]) {
                const sid = onlineUsers.get(participantId);
                if (sid && sid !== socket.id) {
                    io.to(sid).emit("callAnswered", { answer });
                }
            }
        });

        socket.on("rejectCall", async ({ to: friendshipId }) => {
            const friendship = await Friend.findById(friendshipId);
            if (!friendship) return;
            for (const participantId of [friendship.requester.toString(), friendship.recipient.toString()]) {
                const sid = onlineUsers.get(participantId);
                if (sid && sid !== socket.id) {
                    io.to(sid).emit("callRejected");
                }
            }
        });

        socket.on("iceCandidate", async ({ to: friendshipId, candidate }) => {
            const friendship = await Friend.findById(friendshipId);
            if (!friendship) return;
            for (const participantId of [friendship.requester.toString(), friendship.recipient.toString()]) {
                const sid = onlineUsers.get(participantId);
                if (sid && sid !== socket.id) {
                    io.to(sid).emit("iceCandidate", { candidate });
                }
            }
        });

        socket.on("endCall", async ({ to: friendshipId }) => {
            const friendship = await Friend.findById(friendshipId);
            if (!friendship) return;
            for (const participantId of [friendship.requester.toString(), friendship.recipient.toString()]) {
                const sid = onlineUsers.get(participantId);
                if (sid && sid !== socket.id) {
                    io.to(sid).emit("callEnded");
                }
            }
        });

        socket.on("disconnect", () => {

            for (const [key, value] of onlineUsers.entries()) {
                if (value === socket.id) onlineUsers.delete(key);
            }

        });
        
    });

    return { io };
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};