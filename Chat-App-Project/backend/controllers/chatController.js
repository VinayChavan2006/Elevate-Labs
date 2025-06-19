import express from 'express'
import { Chat } from '../models/ChatModel.js'
import { User } from '../models/UserModel.js'
import { Message } from '../models/MessageModel.js'
import mongoose from 'mongoose'

export const getAllChats = async(req, res) => {
    try {
        const allChats = await Chat.find({})
        return res.status(200).json(allChats)
    } catch (error) {
        console.error(`Get All chats error: ${error}`);
    }
}

export const getUserChats = async(req, res) => {
    try {
        // get user id
        const {userId} = req.params
        // populate user chats and lastMessage in all chats
        const user = await User.findById(userId).populate({
            path: 'chats',
            populate: {
                path: 'lastMessage',
                model: "Message"
            }
        })
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json(user?.chats)
    } catch (error) {
        console.error(`Error getting user chats: ${error}`)
    }
}

export const getChatDetails = async(req, res) => {
    try {
        // get chat Id
        const {chatId} = req.params
    
        // find the chat in db
        const chat = await Chat.findById(chatId)
        if(!chat){
            return res.status(400).json({
                success:false,
                message:"Chat not found"
            })
        }
        return res.status(200).json(chat)
    } catch (error) {
        console.error(`Error getting chat details: ${error}`)
    }
}

export const createPrivateChat = async(req, res) => {
    try {
        const {recieverId} = req.params
        const ownerId = req.user?._id
        
        // get reciever details
        const reciever = await User.findById(recieverId)
        const owner = await User.findById(ownerId)

        if(!reciever){
            return res.status(400).json({
                success:false,
                message: "Reciever does not exist"
            })
        }
    
    
        // find if chat exists already
        const chat = await Chat.findOne({
            isGroupChat : false,
            members: {$all: [recieverId, ownerId], $size: 2}
        })
        
        if(chat){
            return res.status(400).json({
                success: false,
                message : "Chat alrady exists"
            })
        }
        // create new chat
        const newChat = new Chat({
            chatName : owner.name + "/" + reciever.name,
            chatProfileImage: reciever.profileImage,
            members: [
                new mongoose.Types.ObjectId(ownerId),
                new mongoose.Types.ObjectId(recieverId)
            ],
        });

        await newChat.save()

        // update users chat arrays
        owner.chats.push(newChat)
        if(owner?._id?.toString() !== reciever?._id?.toString()) reciever.chats.push(newChat)

        await owner.save()
        await reciever.save()

        // TODO: emit socket event for CREATED NEW CHAT


        // response send
        // console.log(newChat);
        
        return res.status(200).json(newChat)
    } catch (error) {
        console.error(`Error creating private chat: ${error}`)
    }
}

export const createGroupChat = async(req, res) => {
    try {
        const {chatName,chatProfileImage, members} = req.body
        
        if(!chatName){
            return res.status(400).json({
                success:false,
                message:"Please provide chat name"
            })
        }
        if(!members || members?.length < 3){
            return res.status(400).json({
                success:false,
                message: "Group cannot be of less than 3 members"
            })
        }
    
        // check if this chat already exists
        const chat = await Chat.findOne({
            isGroupChat : true,
            members: {$all: members}
        })

        if(chat){
            return res.status(400).json({
                success:false,
                message: "Chat already exists"
            })
        } 

        // create new chat
        const newChat = new Chat({
            chatName,
            isGroupChat: true,
            members,
            chatProfileImage,
            admin : req.user?._id
        })
        await newChat.save()
        // update all members chats array
        const users = await User.find({_id: {$in: members}})
        for(const user of users){
            user.chats.push(newChat._id)
            await user.save()
        }

        // TODO: emit socket event CREATED NEW GROUP CHAT

        return res.status(201).json(newChat)
    } catch (error) {
        console.error(`Error creating group chat: ${error}`)
    } 
}
export const deletePrivateChat = async(req, res) => {
   try {
     const {chatId} = req.params
     
     // get chat 
     const chat = await Chat.findById(chatId)
     if(!chat){
         return res.status(400).json({
             success:false,
             message: "Chat does not exists"
         })
     }
 
     // delete all messages
     await Message.deleteMany({
        _id : {$in: chat?.messages}
     })
 
     // delete the refs
     chat.messages = []
     await chat.save()
     await Chat.deleteOne({_id: chatId})

     // TODO: emit Socket Event CHAT DELETED
 
    return res.status(200).json({
         success: true,
         message: "Chat deleted successfully",
         messages: chat.messages
     })
   } catch (error) {
    console.error(`Error deleting chat: ${error}`)
   }

}

export const deleteGroupChat = async(req, res) => {
    try {
     const {chatId} = req.params
     
     // get chat 
     const chat = await Chat.findById(chatId)
     if(!chat){
         return res.status(400).json({
             success:false,
             message: "Chat does not exists"
         })
     }
 
     // delete all messages
     await Message.deleteMany({
        _id : {$in: chat?.messages}
     })
 
     // delete the refs
     chat.messages = []
     await chat.save()
     await Chat.deleteOne({_id: chatId})

     // TODO: emit Socket Event CHAT DELETED
 
    return res.status(200).json({
         success: true,
         message: "Chat deleted successfully",
         messages: chat.messages
     })
   } catch (error) {
    console.error(`Error deleting chat: ${error}`)
   }
}

export const exitGroupChat = async(req, res) => {
    try {
        const {chatId} = req.params
        if(!chatId){
            return res.status(400).json({
                success:false,
                message: "Select Chat to Exit"
            })
        }
    
        // get the chat
        const chat = await Chat.findById(chatId)
        if(!chat){
            return res.status(400).json({
                success: false,
                message : "Chat not found"
            })
        }
    
        // chack if it is a group chat
        if(!chat.isGroupChat){
            return res.status(400).json({
                success:false,
                message : "You can exit only a group chat"
            })
        }
    
        // remove the userId from members array
        let userExist = chat.members?.find((mem)=> mem.equals(req.user?._id))
        if(!userExist){
            return res.status(400).json({
                success: false,
                message : "You do not belong to this chat"
            })
        }
    
        // remove user from members list
        chat.members = chat.members?.filter((member)=> !member.equals(req.user?._id))
        await chat.save()

        // TODO: Emit EXIT group socket event
        
        return res.status(200).json({
            success: true,
            message: "Successfully exited the group",
            members: chat.members
        })
    } catch (error) {
        console.error(`Error exiting chat: ${error}`)
    }

}