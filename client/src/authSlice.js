

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',

    // Shuru me koi user logged in nahi hai
    initialState: {
        user: null,
        loading: false,
        error: null,
    },

    // Reducers = Functions jo state change karte hain
    reducers: {
        // Jab API call shuru ho
        setLoading: (state) => {
            state.loading = true;
            state.error = null;
        },

        // Jab login/register success ho → user data save karo
        setUser: (state, action) => {
            state.user = action.payload;  // action.payload = jo data tum bhejoge
            state.loading = false;
            state.error = null;
        },

        // Jab error aaye
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        // Jab logout ho → sab saaf karo
        clearUser: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
        },
    }
});

// Ye actions export karo — inhe component me dispatch karoge
export const { setLoading, setUser, setError, clearUser } = authSlice.actions;

export default authSlice.reducer;
