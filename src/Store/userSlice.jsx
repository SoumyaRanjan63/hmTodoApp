// authSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    authSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
    },
    authFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { authStart, authSuccess, authFailure } = authSlice.actions;
export default authSlice.reducer;
