import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem('user')? JSON.parse(localStorage.getItem("user")) : null,
};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    setCredentials: (state, action)=>{
        state.userInfo = action.payload;
        localStorage.setItem('user',JSON.stringify(action.payload))
    },
    Logout: (state, action) =>{
        state.userInfo = null
        localStorage.removeItem('user')
    }
  },
});

export const {setCredentials,Logout} = authSlice.actions;
export default authSlice.reducer;
