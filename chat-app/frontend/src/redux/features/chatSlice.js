import { createSlice } from "@reduxjs/toolkit";
import { Logout } from "./authSlice.js";

const initialState = {
  chatItem: null,
  chatStatus: 'offline'
};


const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action) => {
      state.chatItem = action.payload.ChatItem;
      state.chatStatus = action.payload.chatStatus
    },
    updateChatLastMessage: (state, action) => {
      state.chatItem.lastMessage = action.payload
    },
    updateChatStatus: (state, action) => {
      state.chatItem.status = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(Logout().type, (state, action) => {
        // Reset chatItem to null when the user logs out       
        state.chatItem = null;
        state.chatStatus = 'offline'
    });
  },
});

export const { setChat, updateChatLastMessage, updateChatStatus } = chatSlice.actions;
export default chatSlice.reducer;
