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

        // Remove from nonFriends immediately
        set((state) => ({
            nonFriends: state.nonFriends.filter((u) => u._id !== recipientId),
        }));

    },

    acceptFriendRequest: async (requestId) => {

        await axiosInstance.put(`/friend/accept/${requestId}`, {}, { withCredentials: true });
        set((state) => ({
            pendingRequests: state.pendingRequests.filter((r) => r._id !== requestId),
        }));

    },

    rejectFriendRequest: async (requestId) => {
        
        await axiosInstance.delete(`/friend/reject/${requestId}`, { withCredentials: true });
        set((state) => ({
            pendingRequests: state.pendingRequests.filter((r) => r._id !== requestId),
        }));

    },

}));