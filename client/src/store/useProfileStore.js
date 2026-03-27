import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useProfileStore = create ((set) => ({

    isUpdating: false,
    isDeleting: false,
    profileData: null,

    fetchProfile: async () => {

        const res = await axiosInstance.get("/auth/profile", { 
            withCredentials: true 
        });
        set({ profileData: res.data });

    },

    updatePersonalInformation: async (formData) => {

        set({ isUpdating: true });

        try {

            const res = await axiosInstance.put("/auth/update-personal-info", formData, { 
                withCredentials: true,
            });

            await useProfileStore.getState().fetchProfile();
            await useAuthStore.getState().checkAuth(); 
            set({ profileData: res.data });

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

            const res = await axiosInstance.put("/auth/update-education", data, { 
                withCredentials: true 
            });
            
            await useProfileStore.getState().fetchProfile();
            await useAuthStore.getState().setAuthUser(res.data);

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

            await useProfileStore.getState().fetchProfile();
            await useAuthStore.getState().setAuthUser(res.data.user);

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

            await useProfileStore.getState().fetchProfile();
            await useAuthStore.getState().setAuthUser(res.data.user);

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

            const res = await axiosInstance.put("/auth/update-experience", data, { 
                withCredentials: true 
            }); 

            await useProfileStore.getState().fetchProfile();
            await useAuthStore.getState().setAuthUser(res.data);

            return res.data;

        } catch (error) {
            console.error("Update experience error:", error.response?.data || error.message);
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

            await useProfileStore.getState().fetchProfile();
            await useAuthStore.getState().setAuthUser(res.data.user);

            return res.data;

        } catch (error) {
            console.error("Delete experience error:", error.response?.data || error.message);
            throw error;

        } finally {
            set({ isDeleting: false });
        }
    },

    updateSkills: async (data) => {

        set({ isUpdating: true });

        try {

            const res = await axiosInstance.put("/auth/update-skills", data, { 
                withCredentials: true 
            });

            await useProfileStore.getState().fetchProfile();
            await useAuthStore.getState().setAuthUser(res.data);

            return res.data;

        } catch (error) {
            console.error("Update skills error:", error.response?.data || error.message);
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

}));