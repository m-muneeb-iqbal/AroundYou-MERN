import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useFriendStore = create((set) => ({

    nonFriends: [],
    pendingRequests: [],
    friends: [],

    fetchNonFriends: async () => {
        const res = await axiosInstance.get("/friend/non-friends", { withCredentials: true });
        set({ nonFriends: res.data });
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
        
        await axiosInstance.post("/friend/request", { recipientId }, { withCredentials: true });
        set((state) => ({
            nonFriends: state.nonFriends.filter((u) => u._id !== recipientId),
        }));

    },

    acceptFriendRequest: async (requestId, onAccepted) => {
        await axiosInstance.put(`/friend/accept/${requestId}`, {}, { withCredentials: true });
        set((state) => ({
            pendingRequests: state.pendingRequests.filter((r) => r._id !== requestId),
        }));
        // Callback so caller can refresh message users
        onAccepted?.();
    },

    rejectFriendRequest: async (requestId) => {

        await axiosInstance.delete(`/friend/reject/${requestId}`, { withCredentials: true });

        set((state) => ({
            pendingRequests: state.pendingRequests.filter((r) => r._id !== requestId),
        }));

    },

    // Register socket listeners for live friend events
    initializeFriendSocket: () => {

        const handleFriendRequestReceived = (request) => {
            set((state) => ({

                // Add to pending requests if not already there
                pendingRequests: state.pendingRequests.some((r) => r._id === request._id)
                    ? state.pendingRequests
                    : [...state.pendingRequests, request],

                // Remove from nonFriends since request now exists
                nonFriends: state.nonFriends.filter(
                    (u) => u._id.toString() !== request.requester._id.toString()
                ),

            }));

        };

        const handleFriendRequestAccepted = ({ friend }, fetchUsers) => {

            set((state) => ({

                // Remove from nonFriends
                nonFriends: state.nonFriends.filter((u) => u._id.toString() !== friend._id.toString()),

                // Add to friends list
                friends: state.friends.some((f) => f._id.toString() === friend._id.toString())
                    ? state.friends
                    : [...state.friends, friend],
            }));

            // Refresh message sidebar so new friend appears immediately
            fetchUsers?.();
        };

        return { handleFriendRequestReceived, handleFriendRequestAccepted };
    },

}));