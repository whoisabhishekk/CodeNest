import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import problemReducer from "./problemSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        problem: problemReducer,
    }
});

export default store;
