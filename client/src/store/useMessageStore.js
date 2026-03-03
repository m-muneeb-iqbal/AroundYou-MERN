import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useMessageStore = create((set, get) => ({
    
    users: [],
    messages: [],
    selectedUser: null,
    isLoading: false,

    setSelectedUser: (user) => set({ selectedUser: user }),

    getUsers: async () => {

        try {

            const res = await axiosInstance.get("/message/users", {
                withCredentials: true,
            });

            set({ users: res.data });
            return res.data;

        } catch (error) {
            console.error(error);
        }

    },

    getMessages: async (id) => {

        try {

            const res = await axiosInstance.get(`/message/${id}`, {
                withCredentials: true,
            });

            set({ messages: res.data });
            return res.data;

        } catch (error) {
            console.error(error);
        }

    },

    sendMessage: async (text) => {

        const { selectedUser, messages } = get();
        try {

            const res = await axiosInstance.post(
                `/message/send/${selectedUser._id}`,
                { text },
                { withCredentials: true }
            );

            set({ messages: [...messages, res.data] });
            return res.data;

        } catch (error) {
            console.error(error);
        }

    },
}));