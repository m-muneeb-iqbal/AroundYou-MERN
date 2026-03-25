import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useFriendStore = create((set, get) => ({

    nonFriends: [],
    pendingRequests: [],
    friends: [],
    notifications: [],
    isLoadingNonFriends: false,

    fetchNonFriends: async () => {
        set({ isLoadingNonFriends: true });
        try {
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

    sendFriendRequest: async (recipientId) => {
        try {
            await axiosInstance.post("/friend/request", { recipientId }, { withCredentials: true });
            set((state) => ({
                nonFriends: state.nonFriends.filter((u) => u._id !== recipientId),
            }));
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

    acceptFriendRequest: async (requestId, onAccepted) => {
        await axiosInstance.put(`/friend/accept/${requestId}`, {}, { withCredentials: true });
        set((state) => ({
            pendingRequests: state.pendingRequests.filter((r) => r._id !== requestId),
        }));
        onAccepted?.();
    },

    rejectFriendRequest: async (requestId) => {
        await axiosInstance.delete(`/friend/reject/${requestId}`, { withCredentials: true });
        set((state) => ({
            pendingRequests: state.pendingRequests.filter((r) => r._id !== requestId),
        }));
    },

    cancelFriendRequest: async (requestId) => {
        await axiosInstance.delete(`/friend/cancel/${requestId}`, { withCredentials: true });
    },

    unfriend: async (friendId) => {
        await axiosInstance.delete(`/friend/unfriend/${friendId}`, { withCredentials: true });
        set((state) => ({
            friends: state.friends.filter((f) => f._id.toString() !== friendId.toString()),
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

        // Only update pendingRequests — bell already shows them, no need for notification entry
        const handleFriendRequestReceived = (request) => {

                set((state) => ({

                    pendingRequests: state.pendingRequests.some((r) => r._id === request._id)
                        ? state.pendingRequests
                        : [...state.pendingRequests, request],
                    nonFriends: state.nonFriends.filter(
                        (u) => u._id.toString() !== request.requester._id.toString()
                    ),

                }));

            };

        // Only requester (User A) receives this socket event
        const handleFriendRequestAccepted = ({ friend }, fetchUsers) => {

            set((state) => ({

                nonFriends: state.nonFriends.filter(
                    (u) => u._id.toString() !== friend._id.toString()
                ),
                friends: state.friends.some((f) => f._id.toString() === friend._id.toString())
                    ? state.friends
                    : [...state.friends, friend],
            }));

            get().addNotification({
                type: "request_accepted",
                user: friend,
                message: `${friend.fullName} accepted your friend request.`,
            });
            
            fetchUsers?.();
        };

        return {
            handleFriendRequestReceived,
            handleFriendRequestAccepted,
        };
    },

}));