import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useProfileStore = create ((set) => ({

    isUpdating: false,
    isDeleting: false,

    updatePersonalInformation: async (data) => {
        set({ isUpdating: true });

        try {

            const res = await axiosInstance.put("/auth/update-personal-info", data,
                { withCredentials: true }
            );

            useAuthStore.getState().setAuthUser(res.data);

            return res.data;

        } catch (error) {
            
            console.error("Update personal info error:", error.response?.data || error.message);
            throw error;

        } finally {
            set({ isUpdating: false });
        }
    },

    updateEducation: async (data) => {
        set({ isUpdating: true });

        try {
            const res = await axiosInstance.put("/auth/update-education", data,
                { withCredentials: true }
            );

            useAuthStore.getState().setAuthUser(res.data);

            return res.data;

        } catch (error) {
            console.error("Update education error:", error.response?.data || error.message);
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    deleteEducation: async () => {
        set({ isDeleting: true });

        try {
            const res = await axiosInstance.delete("/auth/delete-education",
                { withCredentials: true }
            );

            useAuthStore.getState().setAuthUser(res.data.user);

            return res.data;

        } catch (error) {
            console.error("Delete education error:", error.response?.data || error.message);
            throw error;

        } finally {
            set({ isDeleting: false });
        }
    },

    deleteCertification: async () => {
        set({ isDeleting: true });

        try {
            const res = await axiosInstance.delete("/auth/delete-certification",
                { withCredentials: true }
            );

            useAuthStore.getState().setAuthUser(res.data.user);

            return res.data;

        } catch (error) {
            console.error("Delete certification error:", error.response?.data || error.message);
            throw error;

        } finally {
            set({ isDeleting: false });
        }
    },

    updateExperience: async (data) => {
        set({ isUpdating: true });

        try {
            const res = await axiosInstance.put("/auth/update-experience", data,
                { withCredentials: true }
            );

            useAuthStore.getState().setAuthUser(res.data);

            return res.data;

        } catch (error) {
            console.error("Update education error:", error.response?.data || error.message);
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    deleteExperience: async () => {
        set({ isDeleting: true });

        try {
            const res = await axiosInstance.delete("/auth/delete-experience",
                { withCredentials: true }
            );

            useAuthStore.getState().setAuthUser(res.data.user);

            return res.data;

        } catch (error) {
            console.error("Delete certification error:", error.response?.data || error.message);
            throw error;

        } finally {
            set({ isDeleting: false });
        }
    },

    updateSkills: async (data) => {
        set({ isUpdating: true });

        try {
            const res = await axiosInstance.put("/auth/update-skills", data,
                { withCredentials: true }
            );

            useAuthStore.getState().setAuthUser(res.data);

            return res.data;

        } catch (error) {
            console.error("Update skills error:", error.response?.data || error.message);
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

}));