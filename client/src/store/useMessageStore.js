import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

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

        const res = await axiosInstance.get("/message/users", 
            { withCredentials: true }
        );
        set({ users: res.data });

    },

    // Initialize socket
    initializeSocket: (authUserId) => {

        if (!authUserId) return;

        socket.emit("userOnline", authUserId);

        const handleReceiveMessage = (msg) => {

            const { openConversationId } = get();

            if (openConversationId === msg.conversationId) {
                set((state) => ({
                    messages: [...state.messages, msg].filter(
                        (v, i, a) => a.findIndex((m) => m._id === v._id) === i
                    ),
                }));
            }

            set((state) => ({
                users: state.users.map((u) =>
                    u.conversationId === msg.conversationId
                        ? {
                            ...u,
                            lastMessage: msg,

                            unreadCount:
                                openConversationId === msg.conversationId
                                    ? u.unreadCount
                                    : (u.unreadCount || 0) + 1,
                        }
                        : u
                ),
            }));
        };

        const handleMessagesRead = (conversationId) => {

            const { selectedUser } = get();

            set((state) => ({

                users: state.users.map((u) =>

                u.conversationId === conversationId
                    ? {
                        ...u,
                        readBy: [...new Set([...(u.readBy || []), selectedUser?._id])],
                    }
                    : u
                ),

            }));

        };

        const handleUpdateUnread = ({ conversationId, unreadCount }) => {

            const { openConversationId } = get();

            set(state => ({

                users: state.users.map(u =>

                u.conversationId === conversationId
                    ? { ...u, unreadCount: openConversationId === conversationId ? 0 : unreadCount  } // overwrite for other participants
                    : u
                )

            }));

        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("messagesRead", handleMessagesRead);
        socket.on("updateUnread", handleUpdateUnread);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
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

        set(() => ({

            messages: res.data,
            openConversationId: selected.conversationId,

        }));

        get().markMessagesAsRead(selected.conversationId);

        // Mark messages as read on server
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

        // Notify server
        socket.emit("markAsRead", { conversationId: user.conversationId });

        // Load messages
        get().loadMessages(user);

    },

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
        socket.emit("sendMessage", payload);
    },
    
}));