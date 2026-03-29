import { create } from "zustand";
import { socket } from "../lib/socket";
import { axiosInstance } from "../lib/axios";

export const useMessageStore = create((set, get) => ({

    users: [],
    selectedUser: null,
    messages: [],
    openConversationId: null,
    messageInput: "",
    isLoadingUsers: false,
    isLoadingMessages: false,

    setAuthUser: (_user) => {},

    // Fetch users
    fetchUsers: async () => {
        set({ isLoadingUsers: true });
        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data });
        } finally {
            set({ isLoadingUsers: false });
        }
    },

    // Initialize socket
    initializeSocket: () => {

        const handleReceiveMessage = (msg) => {

            const { openConversationId } = get();

            const isCurrentConversation =
                openConversationId === msg.conversationId ||
                (openConversationId === null && !msg.isMine && get().selectedUser !== null);

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

                if (!msg.isMine && msg.conversationId) {

                    const peer = get().users.find((u) => u.conversationId === msg.conversationId);
                    if (peer?.username) {
                        axiosInstance.put(`/message/read`, { username: peer.username })
                            .catch((err) => console.error("Error marking as read on receive:", err));
                    }
                }

            }

            set((state) => {

                const updatedUsers = state.users.map ((u) => {

                    const matchByConvId = u.conversationId === msg.conversationId;

                    if (!matchByConvId) return u;

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
        socket.on("updateUnread", handleUpdateUnread);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("messageDelivered", handleMessageDelivered);
            socket.off("messagesSeen", handleMessagesSeen);
            socket.off("updateUnread", handleUpdateUnread);
        };
    },

    // Close conversation
    handleCloseConversation: async () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        if (selectedUser.conversationId) {
            try {
                await axiosInstance.put(`/message/read`, { username: selectedUser.username });
            } catch (err) {
                console.error("Error marking as read on close:", err);
            }
        }

        set((state) => ({

            selectedUser: null,
            messages: [],
            openConversationId: null,
            isLoadingMessages: false,
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
        if (!selected?.username) return;

        set({ isLoadingMessages: true });

        try {
            const res = await axiosInstance.get(
                `/message/conversation`,
                { params: { username: selected.username } }
            );
            set({ messages: res.data, openConversationId: selected.conversationId });
            get().markMessagesAsRead(selected.conversationId);

            if (selected.unreadCount > 0) {
                axiosInstance.put(`/message/read`, { username: selected.username })
                    .catch((err) => console.error("Error marking messages as read:", err));
            }
        } finally {
            set({ isLoadingMessages: false });
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
                    isMine: true,
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

        socket.emit("sendMessage", {
            conversationId: payload.conversationId,
            text: payload.text,
            image: payload.image,
            tempId,
        });
    },
    
}));