import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const buildMessage = (type, fullName) => {
    switch (type) {
        case "request_accepted": return `${fullName} accepted your friend request.`;
        case "request_rejected": return `${fullName} declined your friend request.`;
        case "unfriended":       return `${fullName} removed you as a friend.`;
        default:                 return "";
    }
};

export const useFriendStore = create((set, get) => ({

    nonFriends: [],
    pendingRequests: [],
    friends: [],
    notifications: [],
    sentRequests: [],
    readPendingRequests: JSON.parse(localStorage.getItem("readPendingRequests") || "[]"),
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
            } catch (error) {
                console.error("Error sending friend request:", error);
            }
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
        set((state) => {
            const nextRead = state.readPendingRequests.filter((u) => u !== username);
            localStorage.setItem("readPendingRequests", JSON.stringify(nextRead));
            return {
                pendingRequests: state.pendingRequests.filter((r) => r.requester.username !== username),
                readPendingRequests: nextRead,
            };
        });
        onAccepted?.();
    },

    rejectFriendRequest: async (username) => {
        await axiosInstance.delete(`/friend/reject`, { data: { username }, withCredentials: true });
        set((state) => {
            const nextRead = state.readPendingRequests.filter((u) => u !== username);
            localStorage.setItem("readPendingRequests", JSON.stringify(nextRead));
            return {
                pendingRequests: state.pendingRequests.filter((r) => r.requester.username !== username),
                readPendingRequests: nextRead,
            };
        });
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
        } catch (error) {
            console.error("Error cancelling friend request:", error);
        }
    },

    unfriend: async (username) => {
        await axiosInstance.delete(`/friend/unfriend`, { data: { username }, withCredentials: true });
        set((state) => ({
            friends: state.friends.filter((f) => f.username !== username),
        }));
    },

    // Add a notification to the feed (and prune anything older than 7 days).
    // If the notification came from a socket event it will carry the DB id — use it
    // so mark-as-read can reference the real MongoDB document.
    addNotification: (notification) => {
        const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
        set((state) => ({
            notifications: [
                { id: Date.now(), read: false, timestamp: new Date().toISOString(), ...notification },
                ...state.notifications.filter((n) => new Date(n.timestamp).getTime() > cutoff),
            ],
        }));
    },

    // Fetch persisted notifications from the DB (called on app load)
    fetchNotifications: async () => {
        try {
            const res = await axiosInstance.get("/notifications", { withCredentials: true });
            const mapped = res.data.map((n) => ({
                id: n._id,
                type: n.type,
                user: n.actor,
                message: buildMessage(n.type, n.actor?.fullName),
                read: n.read,
                timestamp: n.createdAt,
            }));
            set({ notifications: mapped });
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    },

    // Remove notifications older than 7 days from state (client-side safety net)
    pruneOldNotifications: () => {
        const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
        set((state) => ({
            notifications: state.notifications.filter((n) => new Date(n.timestamp).getTime() > cutoff),
        }));
    },

    // Mark a pending request notification as seen (hides blue dot, reduces badge)
    markPendingRequestRead: (username) => {
        set((state) => {
            if (state.readPendingRequests.includes(username)) return {};
            const next = [...state.readPendingRequests, username];
            localStorage.setItem("readPendingRequests", JSON.stringify(next));
            return { readPendingRequests: next };
        });
    },

    // Mark a single notification as read — optimistic update + API call
    // Only hits the API for real MongoDB ObjectIds (not ephemeral client-only notifications)
    markNotificationRead: async (id) => {
        set((state) => ({
            notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
        }));
        if (/^[a-f\d]{24}$/i.test(String(id))) {
            try {
                await axiosInstance.patch(`/notifications/${id}/read`, {}, { withCredentials: true });
            } catch (error) {
                console.error("Error marking notification as read:", error);
            }
        }
    },

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
        const handleFriendRequestAccepted = ({ friend, notificationId }, fetchUsers) => {

            set((state) => ({
                nonFriends: state.nonFriends.filter(
                    (u) => u.username !== friend.username
                ),
                sentRequests: state.sentRequests.filter((u) => u !== friend.username),
            }));

            get().addNotification({
                id: notificationId,
                type: "request_accepted",
                user: friend,
                message: `${friend.fullName} accepted your friend request.`,
            });
            
            fetchUsers?.();
        };

        // Recipient's pending request disappears when requester cancels
        const handleFriendRequestCancelled = ({ requester }) => {
            set((state) => {
                const nextRead = state.readPendingRequests.filter((u) => u !== requester.username);
                localStorage.setItem("readPendingRequests", JSON.stringify(nextRead));
                return {
                    pendingRequests: state.pendingRequests.filter(
                        (r) => r.requester.username !== requester.username
                    ),
                    readPendingRequests: nextRead,
                };
            });
        };

        // Only requester receives this — their request was rejected
        const handleFriendRequestRejected = ({ recipient, notificationId }) => {
            set((state) => ({
                sentRequests: state.sentRequests.filter((u) => u !== recipient.username),
            }));
            get().addNotification({
                id: notificationId,
                type: "request_rejected",
                user: recipient,
                message: `${recipient.fullName} declined your friend request.`,
            });
        };

        // Receives this when someone unfriends you
        const handleUnfriended = ({ unfriender, notificationId }) => {
            set((state) => ({
                friends: state.friends.filter((f) => f.username !== unfriender.username),
            }));
            get().addNotification({
                id: notificationId,
                type: "unfriended",
                user: unfriender,
                message: `${unfriender.fullName} removed you as a friend.`,
            });
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