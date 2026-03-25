import { create } from "zustand";
import { socket } from "../lib/socket";
import { axiosInstance } from "../lib/axios";
import { normalizeSenderId } from "../lib/utils";

export const useMessageStore = create((set, get) => ({

    users: [],
    selectedUser: null,
    messages: [],
    authUser: null,
    openConversationId: null,
    messageInput: "",

    setAuthUser: (user) => set({ authUser: user }),

    // Fetch users
    fetchUsers: async () => {
        const res = await axiosInstance.get("/message/users", { withCredentials: true });
        set({ users: res.data });
    },

    // Initialize socket
    initializeSocket: (authUserId) => {

        if (!authUserId) return;

        const handleReceiveMessage = (msg) => {

            const { openConversationId, authUser } = get();

            const isSender = normalizeSenderId(msg.senderId) === authUser?._id.toString();
            
            const otherUserId = isSender
                ? msg.receiverId.toString()
                : normalizeSenderId(msg.senderId);

            const isCurrentConversation =
                openConversationId === msg.conversationId ||
                (openConversationId === null && get().selectedUser?._id?.toString() === otherUserId);

            if (isCurrentConversation) {

                set((state) => ({

                    openConversationId: msg.conversationId,

                    messages: [
                        ...state.messages.filter((m) => m._id !== msg.tempId),
                        msg,
                    ]
                    .filter(
                        (v, i, a) => a.findIndex((m) => m._id === v._id) === i
                    ),

                }));

                if (!isSender && msg.conversationId) {

                    axiosInstance.put(
                        `/message/read/${msg.conversationId}`,
                        {},
                        { withCredentials: true }
                    )
                    .catch((err) => console.error("Error marking as read on receive:", err));
                }

            }

            set((state) => {

                const updatedUsers = state.users.map ((u) => {

                    const matchByConvId = u.conversationId === msg.conversationId;
                    const matchByUserId = !u.conversationId && u._id.toString() === otherUserId;

                    if (!matchByConvId && !matchByUserId) return u;

                    return {

                        ...u,
                        conversationId: msg.conversationId,
                        lastMessage: msg,
                        lastActivity: msg.createdAt || new Date().toISOString(),
                        unreadCount: isCurrentConversation
                            ? 0
                            : (u.unreadCount || 0) + 1,
                    };

                });

                return {

                    users: updatedUsers.sort((a, b) => {
                        if (!a.lastActivity) return 1;
                        if (!b.lastActivity) return -1;
                        return new Date(b.lastActivity) - new Date(a.lastActivity);
                    }),

                };

            });

        };

        const handleMessageDelivered = ({ messageId }) => {
            
            set((state) => ({

                messages: state.messages.map((m) =>
                    m._id?.toString() === messageId?.toString()
                        ? { ...m, status: "delivered" }
                        : m
                ),

            }));

        };

        const handleMessagesSeen = ({ conversationId }) => {

            set((state) => ({

                messages: state.messages.map((m) =>
                    m.conversationId?.toString() === conversationId?.toString()
                        ? { ...m, status: "seen" }
                        : m
                ),

            }));

        };

        const handleMessagesRead = (conversationId) => {

            const { selectedUser } = get();

            set((state) => ({

                users: state.users.map((u) =>
                    u.conversationId === conversationId
                        ? { ...u, readBy: [...new Set([...(u.readBy || []), selectedUser?._id])] }
                        : u
                ),

            }));

        };

        const handleUpdateUnread = ({ conversationId, unreadCount }) => {

            const { openConversationId } = get();

            set((state) => ({

                users: state.users.map((u) =>
                    u.conversationId === conversationId
                        ? { ...u, unreadCount: openConversationId === conversationId ? 0 : unreadCount }
                        : u
                ),

            }));

        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("messageDelivered", handleMessageDelivered);
        socket.on("messagesSeen", handleMessagesSeen);
        socket.on("messagesRead", handleMessagesRead);
        socket.on("updateUnread", handleUpdateUnread);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("messageDelivered", handleMessageDelivered);
            socket.off("messagesSeen", handleMessagesSeen);
            socket.off("messagesRead", handleMessagesRead);
            socket.off("updateUnread", handleUpdateUnread);
        };
    },

    // Close conversation
    handleCloseConversation: async () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        if (selectedUser.conversationId) {
            try {
                await axiosInstance.put(
                    `/message/read/${selectedUser.conversationId}`,
                    {},
                    { withCredentials: true }
                );
            } catch (err) {
                console.error("Error marking as read on close:", err);
            }
        }

        set((state) => ({

            selectedUser: null,
            messages: [],
            openConversationId: null,
            users: state.users.map((u) =>
                u.conversationId === selectedUser.conversationId
                    ? { ...u, unreadCount: 0 }
                    : u
            ),

        }));

    },

    // Load messages
    loadMessages: async (user) => {

        const selected = user || get().selectedUser;
        if (!selected?.conversationId) return;

        const res = await axiosInstance.get(
            `/message/${selected._id}?page=1&limit=20`,
            { withCredentials: true }
        );

        set({ messages: res.data, openConversationId: selected.conversationId });
        get().markMessagesAsRead(selected.conversationId);

        if (selected.unreadCount > 0) {

            await axiosInstance.put(
                `/message/read/${selected.conversationId}`,
                { withCredentials: true }
            );

            try {
                await axiosInstance.put(
                    `/message/read/${selected.conversationId}`,
                    { withCredentials: true }
                );
                socket.emit("markAsRead", { conversationId: selected.conversationId });
            } catch (err) {
                console.error("Error marking messages as read:", err);
            }

        }
    },

    // Select user
    selectUser: (user) => {

        set((state) => ({

            selectedUser: user,
            openConversationId: user.conversationId,
            users: state.users.map((u) =>
                u.conversationId === user.conversationId
                    ? { ...u, unreadCount: 0 }
                    : u
            ),

        }));


        get().loadMessages(user);
    },

    // Mark as read locally
    markMessagesAsRead: (conversationId) => {

        set((state) => ({

            users: state.users.map((u) =>
                u.conversationId === conversationId
                    ? { ...u, unreadCount: 0 }
                    : u
            ),

        }));
        
    },

    // Send message
    sendMessage: (payload) => {
        const tempId = `temp_${Date.now()}`;

        set((state) => ({

            messages: [

                ...state.messages,

                {
                    _id: tempId,
                    tempId,
                    senderId: payload.senderId,
                    receiverId: payload.receiverId,
                    conversationId: state.openConversationId,
                    text: payload.text,
                    status: "sending",
                    createdAt: new Date().toISOString(),
                },

            ],
            
        }));

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("sendMessage", { ...payload, tempId });
    },
    
}));