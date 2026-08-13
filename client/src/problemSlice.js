// ===== PROBLEM SLICE =====
// Problems ka data yahan store hota hai
// API calls component me hogi, result yahan dispatch hoga

import { createSlice } from "@reduxjs/toolkit";

const problemSlice = createSlice({
    name: 'problem',

    initialState: {
        problems: [],          // Saari problems ki list
        currentProblem: null,  // Abhi jo problem open hai
        loading: false,
        error: null,
    },

    reducers: {
        setProblemLoading: (state) => {
            state.loading = true;
            state.error = null;
        },

        // Saari problems set karo (Problems List page ke liye)
        setProblems: (state, action) => {
            state.problems = action.payload;
            state.loading = false;
        },

        // Ek specific problem set karo (Problem Solver page ke liye)
        setCurrentProblem: (state, action) => {
            state.currentProblem = action.payload;
            state.loading = false;
        },

        setProblemError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        clearCurrentProblem: (state) => {
            state.currentProblem = null;
        }
    }
});

export const { setProblemLoading, setProblems, setCurrentProblem, setProblemError, clearCurrentProblem } = problemSlice.actions;
export default problemSlice.reducer;
