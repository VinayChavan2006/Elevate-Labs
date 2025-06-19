import express from "express";
import {
  createGroupChat,
  createPrivateChat,
  deleteGroupChat,
  deletePrivateChat,
  exitGroupChat,
  getAllChats,
  getChatDetails,
  getUserChats,
} from "../controllers/chatController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

export const chatRouter = express.Router();

chatRouter
  .get("/",authenticate ,getAllChats)
  .get("/user/:userId", authenticate, getUserChats)
  .get("/chat-details/:chatId",authenticate, getChatDetails)
  .post("/create-private/:recieverId",authenticate, createPrivateChat)
  .post("/create-group",authenticate, createGroupChat)
  .post("/exit/:chatId",authenticate, exitGroupChat)
  .delete("/private/:chatId",authenticate, deletePrivateChat)
  .delete("/group/:chatId",authenticate, deleteGroupChat);
