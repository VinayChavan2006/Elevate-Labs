import { io } from "socket.io-client"

console.log(import.meta.env.VITE_BACKEND_URI)
export const socket = io('http://localhost:8000')