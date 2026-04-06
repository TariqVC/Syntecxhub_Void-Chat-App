import { useEffect } from "react";
import { io } from "socket.io-client";
import { useChatStore } from "../store/useChatStore";

let socket = null;

export const useSocket = (authUser) => {
  const { setOnlineUsers } = useChatStore();

  useEffect(() => {
    if (!authUser?._id) return;

    // Don't reconnect if socket already exists for this user
    if (socket?.connected) return;

    socket = io("/", {
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [authUser?._id]); // ← only re-run if the actual user ID changes
};

export const getSocket = () => socket;