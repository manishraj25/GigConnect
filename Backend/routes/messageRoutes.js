import express from "express";
import {
  sendMessage,
  getConversation,
  markAsRead,
  getChatsSummary,
} from "../controller/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const messageRouter = express.Router();

messageRouter.post("/", authMiddleware, sendMessage);
messageRouter.get("/:otherUserId", authMiddleware, getConversation);
messageRouter.put("/mark-read", authMiddleware, markAsRead);
messageRouter.get("/", authMiddleware, getChatsSummary); //all chat summaries

export default messageRouter;
