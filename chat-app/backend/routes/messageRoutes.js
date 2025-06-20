import express from 'express'
import { deleteChatMessages, deleteMessage, getAllMessages, sendMessage, updateMessageStatus } from '../controllers/messageController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

export const messageRouter = express.Router()

messageRouter
    .post('/send/:chatId',authenticate,sendMessage)
    .delete('delete-message/:messageId',deleteMessage)
    .get('/chat-messages/:chatId',authenticate,getAllMessages)
    .patch('/update-status/:messageId',authenticate, updateMessageStatus)
    .delete('/delete-messages/:chatId',authenticate, deleteChatMessages)