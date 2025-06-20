import express from "express";
import { Chat } from "../models/ChatModel.js";
import { Message } from "../models/MessageModel.js";
import mongoose from "mongoose";

export const sendMessage = async (req, res) => {
  try {
    // get chatId and message content
    const { chatId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(400).json({
        success: false,
        message: "Chat for message not found!",
      });
    }

    // create message
    const newMessage = await Message.create({
      sender: req.user?._id,
      reciever: new mongoose.Types.ObjectId(chatId),
      message: message,
    });

    // append this message to chat
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: newMessage._id },
      $set: { lastMessage: newMessage._id },
    });

    // TODO: emit socket event
    const io = req.app.get("io");
    if (io) {
      io.to(chatId).emit("recieved-message", {
        messageItem: newMessage,
        chatId: chatId,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      sentMessage: newMessage,
    });
  } catch (error) {
    console.error(`Error sending message: ${error}`);
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: "Message Id not found",
      });
    }

    // get message by id
    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message not found",
      });
    }

    // delete message sucess response
    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
      deletedMessage: {
        _id: message?._id,
        message: message?.message,
      },
    });
  } catch (error) {
    console.error(`Error deleting message: ${error}`);
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a char Id",
      });
    }
    // get chat
    const chat = await Chat.findById(chatId).populate("messages");
    if (!chat) {
      return res.status(400).json({
        success: false,
        message: "Chat does not exists",
      });
    }

    // return the messages for the chat
    return res.status(200).json(chat.messages);
  } catch (error) {
    console.error(`Error getting all chat messages: ${error}`);
  }
};

export const updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;
    const message = await Message.findByIdAndUpdate(
      { _id: messageId },
      { $set: { status } }
    );
    if(!message){
      return res.status(400).json({
        success: false,
        message : "Message not found"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Status Updated Succesfully",
      status: message?.status
    })
  } catch (error) {
    console.error(`Error updating message status: ${error}`);
  }
};

export const deleteChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params
    const chat = await Chat.findById(chatId)
    if(!chat){
      res.status(400).json({
        success: false,
        message: "Chat Not Found"
      })
    }
    // delete from chat refs
    chat.messages = []
    chat.lastMessage = null 
    await chat.save()

    // delete it from messages
    await Message.deleteMany({reciever: chatId})

    res.status(200).json({
      success: true,
      message: "Chat messages deleted for everyone successfully"
    })

  } catch (error) {
    console.error(`Error deleting messages`)
  }
}