import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useUserStore = create((set, get) => ({

    users: [],
    isFetching: false,

    fetchUsers: async () => {

        set({ isFetching: true });

        try {

            const res = await axiosInstance.get("/users/random", {
                withCredentials: true,
            });

            set({ users: Array.isArray(res.data) ? res.data : [] });
            
        } catch (error) {

            console.error("Error fetching users:", error.response?.data || error.message);
            set({ users: [] });

        } finally {
            set({ isFetching: false });
        }
    },

}));