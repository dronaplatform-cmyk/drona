// store/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../services/api.js";

// Make sure axios sends cookies

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const res = await api.get(`/auth/me`, { withCredentials: true });
  // console.log("fetchUser() :: authSlice :: res.data", res.data);
  return res.data; // user object from backend
});

const initialState = {
  user: null,
  status: false,
  loading: false,
  error: null,
  pendingAction:null
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.user = action.payload.userData;
    },
    logout: (state) => {
      state.status = false;
      state.user = null;
    },
    setPendingAction: (state, action) => {
      state.pendingAction = action.payload;
    },
    clearPendingAction: (state) => {
      state.pendingAction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.currentUser;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { login, logout, setPendingAction, clearPendingAction } = authSlice.actions;
export default authSlice.reducer;
