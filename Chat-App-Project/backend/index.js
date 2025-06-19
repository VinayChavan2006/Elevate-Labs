import express from 'express'
import { userRouter } from './routes/userRoutes.js'
import { chatRouter } from './routes/chatRoutes.js'
import { messageRouter } from './routes/messageRoutes.js'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv/config'
import {createServer} from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectSocketIO } from './socket/socket.js'


const PORT = process.env.PORT || 8080

const app = express()
const httpServer = createServer(app)

// socket io instatiation
const io = new Server(httpServer,{
    cors: {
        origin : process.env.FRONTEND_URI,
        credentials : true
    }
})

// initialise socket io
connectSocketIO(io)

// set io into app to use it globally
app.set('io',io)

connectDB()

// handle cors request
app.use(cors({
    origin: process.env.FRONTEND_URI || "*",
    credentials : true
}))
app.use(cookieParser())
// handle json format req.body
app.use(express.json())
app.use(express.urlencoded())

app.use('/users/',userRouter)
app.use('/chat/',chatRouter)
app.use('/message/',messageRouter)


httpServer.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})