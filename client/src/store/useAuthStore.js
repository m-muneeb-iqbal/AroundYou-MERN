import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { socket } from "../lib/socket.js";
import { useFriendStore } from "./useFriendStore.js"

export const useAuthStore = create((set) => ({

    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    isCheckingPassword: true,

    setAuthUser: (user) => set((state) => ({ ...state, authUser: user })),

    checkAuth: async () => {

        try {

            const res = await axiosInstance.get("/auth/check", {
                withCredentials: true,
            });

            set({ authUser: res.data });

            socket.connect();

            // Prefetch alongside auth so data is ready when HomePage mounts
            useFriendStore.getState().fetchNonFriends();

        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({ authUser: null });

        } finally {
            set({ isCheckingAuth: false });
        }

    },

    signup: async (data) => {

        set({ isSigningUp: true });

        try {

            const res = await axiosInstance.post("/auth/signup", data, {
                withCredentials: true, //JWT cookie is stored
            });
            return res.data;

        } catch (error) {
            console.error("Error in signup:", error.response?.data || error.message);
            throw error;

        } finally {
            set({ isSigningUp: false });
        }

    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data, {
                withCredentials: true,
            });
            return res.data;

        } catch (error) {
            console.error("Error in login:", error.response?.data || error.message);
            throw error;

        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {

        try {
            
            await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
            socket.disconnect()
            set({ authUser: null });
            console.log("Logged out successfully");

        } catch (error) {
            console.error("Error in logout:", error.response?.data || error.message);
        }
    },

    changePassword: async (formData) => {

        set({ isChangingPassword: true });

        try {

            const res = await axiosInstance.put("/auth/change-password", formData, { 
                withCredentials: true 
            });
            return res.data;

        } catch (error) {
            console.error("Error in changePassword:", error.response?.data || error.message);
            throw error;

        } finally {
            set({ isChangingPassword: false });
        }
    },

}));