import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAdminStore = create((set) => ({

    stats: null,
    users: [],
    totalUsers: 0,
    totalPages: 0,
    currentPage: 1,
    currentLimit: 10,
    friendRequests: [],
    loading: false,
    selectedUser: null,

    fetchStats: async () => {
        const res = await axiosInstance.get("/admin/stats", { withCredentials: true });
        set({ stats: res.data });
    },

    fetchUsers: async ({

        q = "", role = "", location = "",
        sortBy = "createdAt", sortOrder = "desc",
        page = 1, limit = 10,

    } = {}) => {

        set({ loading: true });
        try {

            const params = new URLSearchParams({ page, limit, sortBy, sortOrder });
            if (q)              params.append("q", q);
            if (role)           params.append("role", role);
            if (location)       params.append("location", location);

            const res = await axiosInstance.get(`/admin/users?${params}`, { withCredentials: true });
            set({
                users: res.data.users,
                totalUsers: res.data.total,
                totalPages: res.data.pages,
                currentPage: res.data.page,
                currentLimit: res.data.limit,
            });

        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            set({ loading: false });
        }
        
    },

    // Load full user details into drawer
    fetchUserById: async (userId) => {
        const res = await axiosInstance.get(`/admin/users/${userId}`, { withCredentials: true });
        set({ selectedUser: res.data });
    },

    clearSelectedUser: () => set({ selectedUser: null }),

    // Update user fields — refreshes both drawer and table row
    updateUser: async (userId, updates) => {
        const [res] = await Promise.all([
            axiosInstance.patch(`/admin/users/${userId}`, updates, { withCredentials: true }),
            new Promise((resolve) => setTimeout(resolve, 800)),
        ]);

        const fullUser = await axiosInstance.get(`/admin/users/${userId}`, { withCredentials: true });

        set((state) => ({
            selectedUser: fullUser.data,
            users: state.users.map((u) =>
                u._id === userId ? { ...u, ...res.data } : u
            ), 
        }));
    },

    deleteUser: async (userId) => {
        await axiosInstance.delete(`/admin/users/${userId}`, { withCredentials: true });
        set((state) => ({
            users: state.users.filter((u) => u._id !== userId),
            totalUsers: state.totalUsers - 1,
            selectedUser: null,
        }));
    },

    removeProfilePic: async (userId) => {
        const res = await axiosInstance.delete(`/admin/users/${userId}/profile-pic`, { withCredentials: true });
        set((state) => ({
            selectedUser: res.data,
            users: state.users.map((u) => u._id === userId ? { ...u, profilePic: "" } : u),
        }));
    },

    clearEducation: async (userId) => {
        const res = await axiosInstance.delete(`/admin/users/${userId}/education`, { withCredentials: true });
        set({ selectedUser: res.data });
    },

    clearExperience: async (userId) => {
        const res = await axiosInstance.delete(`/admin/users/${userId}/experience`, { withCredentials: true });
        set({ selectedUser: res.data });
    },

    clearSkills: async (userId) => {
        const res = await axiosInstance.delete(`/admin/users/${userId}/skills`, { withCredentials: true });
        set({ selectedUser: res.data });
    },

    clearFriends: async (userId) => {
        await axiosInstance.delete(`/admin/users/${userId}/friends`, { withCredentials: true });
        set((state) => ({
            users: state.users.map((u) => u._id === userId ? { ...u, friendCount: 0 } : u),
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