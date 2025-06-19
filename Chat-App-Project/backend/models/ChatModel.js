import mongoose, { mongo, Mongoose } from 'mongoose'

const chatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        required: true
    },
    chatProfileImage: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png"
    },
    unreadMessageCount: {
        type: Number,
        default: 0
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    description: {
        type : String,
    },
    isGroupChat:{
        type: Boolean,
        default: false
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
},{timestamps : true})

export const Chat = mongoose.model('Chat',chatSchema)
