import { configureStore } from "@reduxjs/toolkit";
import todoReducer from './todoSlice';
import userReducer from './userSlice'

export default configureStore({
    reducer:{
        user: userReducer,
        todos : todoReducer,
    }
});