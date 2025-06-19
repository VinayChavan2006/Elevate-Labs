import express from 'express'
import { editUserProfile, getAllUsers, getUserProfile, login, logout, register } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

export const userRouter = express.Router();

userRouter
    .post('/login',login)
    .post('/register',register)
    .get('/profile/:userId',authenticate,getUserProfile)
    .put('/edit-profile',authenticate,editUserProfile)
    .post('/logout',authenticate,logout)
    .get('/',authenticate,getAllUsers)
    // .patch('/update-status/:userId',authenticate, updateUserStatus)