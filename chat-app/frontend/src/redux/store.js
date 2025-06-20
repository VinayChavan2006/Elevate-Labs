import {configureStore} from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from './api/apiSlice'
import authReducer from './features/authSlice.js'
import chatReducer from './features/chatSlice.js'

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath] : apiSlice.reducer,
        auth: authReducer,
        chat: chatReducer
    },
    middleware : (getDefaultMiddleware)=>{
        return getDefaultMiddleware().concat(apiSlice.middleware)
    }
})

setupListeners(store.dispatch)