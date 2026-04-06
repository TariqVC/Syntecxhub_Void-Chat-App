import express from "express";
import { createRoom, getRooms, getRoomMessages } from "../controllers/room.controller.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createRoom);
router.get("/", protectRoute, getRooms);
router.get("/:roomId/messages", protectRoute, getRoomMessages);

export default router;