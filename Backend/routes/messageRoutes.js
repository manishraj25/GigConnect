import express from "express";
import {
  sendMessage,
  getConversation,
  markAsRead,
  getChatsSummary,
} from "../controller/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const messageRouter = express.Router();

messageRouter.get("/", authMiddleware, getChatsSummary);
messageRouter.put("/mark-read", authMiddleware, markAsRead);
messageRouter.post("/", authMiddleware, sendMessage);
messageRouter.get("/:otherUserId", authMiddleware, getConversation);

export default messageRouter;
