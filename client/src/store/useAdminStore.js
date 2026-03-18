import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAdminStore = create((set) => ({

    stats: null,
    users: [],
    totalUsers: 0,
    totalPages: 0,
    currentPage: 1,
    friendRequests: [],
    loading: false,

    fetchStats: async () => {
        const res = await axiosInstance.get("/admin/stats", { withCredentials: true });
        set({ stats: res.data });
    },

    fetchUsers: async ({ q = "", role = "", page = 1 } = {}) => {
        set({ loading: true });
        try {
            const params = new URLSearchParams({ page, limit: 10 });
            if (q) params.append("q", q);
            if (role) params.append("role", role);

            const res = await axiosInstance.get(`/admin/users?${params}`, { withCredentials: true });
            set({
                users: res.data.users,
                totalUsers: res.data.total,
                totalPages: res.data.pages,
                currentPage: res.data.page,
            });
        } finally {
            set({ loading: false });
        }
    },

    deleteUser: async (userId) => {
        await axiosInstance.delete(`/admin/users/${userId}`, { withCredentials: true });
        set((state) => ({
            users: state.users.filter((u) => u._id !== userId),
            totalUsers: state.totalUsers - 1,
        }));
    },

    fetchFriendRequests: async () => {
        const res = await axiosInstance.get("/admin/friend-requests", { withCredentials: true });
        set({ friendRequests: res.data });
    },

    deleteFriendRequest: async (requestId) => {
        await axiosInstance.delete(`/admin/friend-requests/${requestId}`, { withCredentials: true });
        set((state) => ({
            friendRequests: state.friendRequests.filter((r) => r._id !== requestId),
        }));
    },

}));