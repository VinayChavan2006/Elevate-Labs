import { createSlice } from "@reduxjs/toolkit";
import { Logout } from "./authSlice.js";

const initialState = {
  chatItem: null,
};


const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action) => {
      state.chatItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(Logout().type, (state, action) => {
        // Reset chatItem to null when the user logs out       
        state.chatItem = null;
    });
  },
});

export const { setChat } = chatSlice.actions;
export default chatSlice.reducer;
