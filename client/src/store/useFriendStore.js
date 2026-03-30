import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useFriendStore = create((set, get) => ({

    nonFriends: [],
    pendingRequests: [],
    friends: [],
    notifications: [],
    sentRequests: [],
    isLoadingNonFriends: false,

    fetchNonFriends: async () => {
        set({ isLoadingNonFriends: true });
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const res = await axiosInstance.get("/friend/non-friends", { withCredentials: true });
            set({ nonFriends: res.data });
        } finally {
            set({ isLoadingNonFriends: false });
        }
    },

    fetchPendingRequests: async () => {
        const res = await axiosInstance.get("/friend/pending", { withCredentials: true });
        set({ pendingRequests: res.data });
    },

    fetchFriends: async () => {
        const res = await axiosInstance.get("/friend/friends", { withCredentials: true });
        set({ friends: res.data });
    },

    sendFriendRequest: async (username) => {
        try {
            await axiosInstance.post("/friend/request", { username }, { withCredentials: true });
            set((state) => ({
                nonFriends: state.nonFriends.filter((u) => u.username !== username),
                sentRequests: state.sentRequests.includes(username)
                    ? state.sentRequests
                    : [...state.sentRequests, username],
            }));
            // Replenish right-panel suggestions
            try {
                const res = await axiosInstance.get("/friend/non-friends", { withCredentials: true });
                set({ nonFriends: res.data });
            } catch (_) {}
        } catch (err) {

            if (err.response?.status === 400) {
                get().addNotification({
                    type: "already_sent",
                    message: "You already sent a request to this person.",
                });
            }

            throw err;
        }
    },

    acceptFriendRequest: async (username, onAccepted) => {
        await axiosInstance.put(`/friend/accept`, { username }, { withCredentials: true });
        set((state) => ({
            pendingRequests: state.pendingRequests.filter((r) => r.requester.username !== username),
        }));
        onAccepted?.();
    },

    rejectFriendRequest: async (username) => {
        await axiosInstance.delete(`/friend/reject`, { data: { username }, withCredentials: true });
        set((state) => ({
            pendingRequests: state.pendingRequests.filter((r) => r.requester.username !== username),
        }));
    },

    cancelFriendRequest: async (username) => {
        await axiosInstance.delete(`/friend/cancel`, { data: { username }, withCredentials: true });
        set((state) => ({
            sentRequests: state.sentRequests.filter((u) => u !== username),
        }));
        // Replenish right-panel suggestions
        try {
            const res = await axiosInstance.get("/friend/non-friends", { withCredentials: true });
            set({ nonFriends: res.data });
        } catch (_) {}
    },

    unfriend: async (username) => {
        await axiosInstance.delete(`/friend/unfriend`, { data: { username }, withCredentials: true });
        set((state) => ({
            friends: state.friends.filter((f) => f.username !== username),
        }));
    },

    // Add a notification to the feed
    addNotification: (notification) => {

        set((state) => ({

            notifications: [
                { id: Date.now(), read: false, timestamp: new Date().toISOString(), ...notification },
                ...state.notifications,
            ],

        }));

    },

    // Mark all as read
    markNotificationsRead: () => {
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
    },

    clearNotifications: () => set({ notifications: [] }),

    initializeFriendSocket: () => {

        const handleFriendRequestReceived = (request) => {

                set((state) => ({

                    pendingRequests: state.pendingRequests.some((r) => r.requester.username === request.requester.username)
                        ? state.pendingRequests
                        : [...state.pendingRequests, request],
                    nonFriends: state.nonFriends.filter(
                        (u) => u.username !== request.requester.username
                    ),

                }));

                get().addNotification({
                    type: "request_received",
                    user: request.requester,
                    message: `${request.requester.fullName} sent you a friend request.`,
                });

            };

        // Only requester (User A) receives this socket event
        const handleFriendRequestAccepted = ({ friend }, fetchUsers) => {

            set((state) => ({
                nonFriends: state.nonFriends.filter(
                    (u) => u.username !== friend.username
                ),
                sentRequests: state.sentRequests.filter((u) => u !== friend.username),
            }));

            get().addNotification({
                type: "request_accepted",
                user: friend,
                message: `${friend.fullName} accepted your friend request.`,
            });
            
            fetchUsers?.();
        };

        // Recipient's pending request disappears when requester cancels
        const handleFriendRequestCancelled = ({ requester }) => {
            set((state) => ({
                pendingRequests: state.pendingRequests.filter(
                    (r) => r.requester.username !== requester.username
                ),
            }));
        };

        // Only requester receives this — their request was rejected
        const handleFriendRequestRejected = ({ recipient }) => {
            set((state) => ({
                sentRequests: state.sentRequests.filter((u) => u !== recipient.username),
            }));
        };

        // Receives this when someone unfriends you
        const handleUnfriended = ({ unfriender }) => {
            set((state) => ({
                friends: state.friends.filter((f) => f.username !== unfriender.username),
            }));
        };

        return {
            handleFriendRequestReceived,
            handleFriendRequestAccepted,
            handleFriendRequestCancelled,
            handleFriendRequestRejected,
            handleUnfriended,
        };
    },

}));