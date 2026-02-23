import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    setAuthUser: (user) => set((state) => ({ ...state, authUser: user })),

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check", {
                withCredentials: true,
            });
            console.log("CheckAuth response:", res.data);
            set({ authUser: res.data });

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
                withCredentials: true, // so JWT cookie is stored
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
            console.log("Login response:", res.data);
            await useAuthStore.getState().checkAuth();
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
            set({ authUser: null });

        } catch (error) {
            console.error("Error in logout:", error.response?.data || error.message);
        }
    },

}));