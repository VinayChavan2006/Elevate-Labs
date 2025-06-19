
// map userId to socketId for online users
const onlineUsers = new Map();

export const connectSocketIO = (io) => {
  return io.on("connection", (socket) => {
    console.log(`New socket connection: ${socket.id}`);

    socket.on("setup",  (userId) => {
      console.log(`Socket setup for user: ${userId}`);
      socket.join(userId); // Join the user-specific room
      onlineUsers.set(userId, socket.id);

      console.log('emitted change online',onlineUsers)
      socket.emit("user-status-change", {
        userId,
        status: "online",
        onlineUsers : Array.from(onlineUsers.keys())
      });
    });
    socket.on("join-room", (chatId) => {
      console.log(`Socket joining room: ${chatId}`);
      socket.join(chatId); // Join the chat-specific room
    });

    socket.on("logout", ()=>{
      const userId = [...onlineUsers.entries()].find(([_,id]) => id === socket.id)?.[0]
      if(userId){
        onlineUsers.delete(userId);
        socket.emit('user-status-change',{
          userId,
          status: 'offline',
          onlineUsers: Array.from(onlineUsers.keys())
        })
      }
    })
    // Handle disconnection
    socket.on("disconnect",  () => {
      const userId = [...onlineUsers.entries()].find(([_,id]) => id === socket.id)?.[0]
      if(userId){
        onlineUsers.delete(userId);
        socket.emit('user-status-change',{
          userId,
          status: 'offline',
          onlineUsers: Array.from(onlineUsers.keys())
        })
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
