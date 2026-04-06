import Room from "../models/room.model.js";
import Message from "../models/message.model.js";

export const createRoom = async (req, res) => {
  const { name } = req.body;
  try {
    const existing = await Room.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Room already exists" });

    const room = await Room.create({
      name,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("createdBy", "username");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getRoomMessages = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.find({ roomId })
      .populate("senderId", "username profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};