import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

const onlineUsers = new Map(); // userId → socketId

export const getIO = () => io; // export so controllers can use it later

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
    origin: process.env.NODE_ENV === "production"
      ? process.env.CLIENT_URL
      : "http://localhost:5173",
    credentials: true,
  },
  });

  // Middleware — authenticate every socket connection via JWT cookie
  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.jwt;

      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Track online users
    onlineUsers.set(socket.userId, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    // --- Join a room ---
    socket.on("joinRoom", async (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.userId} joined room ${roomId}`);

      // Send last 50 messages of this room to the user who just joined
      const messages = await Message.find({ roomId })
        .populate("senderId", "username profilePic")
        .sort({ createdAt: -1 })
        .limit(50);

      socket.emit("roomHistory", messages.reverse());
    });

    // --- Leave a room ---
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.userId} left room ${roomId}`);
    });

    // --- Send a message ---
    socket.on("sendMessage", async ({ roomId, text }) => {
      try {
        if (!text?.trim()) return;

        // Save to MongoDB
        const message = await Message.create({
          senderId: socket.userId,
          roomId,
          text: text.trim(),
        });

        // Populate sender info before broadcasting
        const populated = await message.populate("senderId", "username profilePic");

        // Broadcast to everyone in the room (including sender)
        io.to(roomId).emit("newMessage", populated);
      } catch (error) {
        console.error("sendMessage error:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // --- Typing indicators ---
    socket.on("typing", ({ roomId, username }) => {
      socket.to(roomId).emit("userTyping", { username });
    });

    socket.on("stopTyping", ({ roomId }) => {
      socket.to(roomId).emit("userStopTyping");
    });

    // --- Disconnect ---
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      onlineUsers.delete(socket.userId);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};