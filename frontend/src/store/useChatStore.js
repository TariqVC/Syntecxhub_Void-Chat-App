import { create } from "zustand";
import axiosInstance from "../lib/axios";

export const useChatStore = create((set, get) => ({
  rooms: [],
  activeRoom: null,
  messages: [],
  onlineUsers: [],
  isLoadingRooms: false,

  fetchRooms: async () => {
    set({ isLoadingRooms: true });
    try {
      const res = await axiosInstance.get("/rooms");
      set({ rooms: res.data });
    } catch (err) {
      console.error("fetchRooms error:", err);
    } finally {
      set({ isLoadingRooms: false });
    }
  },

  createRoom: async (name) => {
    try {
      const res = await axiosInstance.post("/rooms", { name });
      set((state) => ({ rooms: [...state.rooms, res.data] }));
      return { success: true, room: res.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to create room" };
    }
  },

  setActiveRoom: (room) => set({ activeRoom: room, messages: [] }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));