import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Async thunks
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/students/signup", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/students/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/students/logout");
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/students/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLogin: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    restoreAuthState: (state) => {
      const savedUser = localStorage.getItem("authUser");
      if (savedUser) {
        try {
          state.user = JSON.parse(savedUser);
          state.isLogin = true;
        } catch (error) {
          localStorage.removeItem("authUser");
          state.user = null;
          state.isLogin = false;
        }
      }
    },
  },
  extraReducers: (builder) => {

    // Signup
    builder.addCase(signup.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(signup.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.student;
      state.isLogin = true;
      localStorage.setItem("authUser", JSON.stringify(action.payload.student));
    });

    builder.addCase(signup.rejected, (state, action) => {
      state.isLoading = false;

      /* ✅ SAFE ADDITION (NO LINE REMOVED) */
      const errorMessage =
        typeof action.payload === "string"
          ? action.payload
          : action.payload?.message;

      state.error = errorMessage || "Signup failed";
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.student;
      state.isLogin = true;
      localStorage.setItem("authUser", JSON.stringify(action.payload.student));
    });

    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;

      /* ✅ SAFE ADDITION */
      const errorMessage =
        typeof action.payload === "string"
          ? action.payload
          : action.payload?.message;

      state.error = errorMessage || "Login failed";
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isLogin = false;
      localStorage.removeItem("authUser");
    });

    builder.addCase(logout.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isLogin = false;
      localStorage.removeItem("authUser");
    });

    // Get Current User
    builder.addCase(getCurrentUser.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.student;
      state.isLogin = true;
      localStorage.setItem("authUser", JSON.stringify(action.payload.student));
    });

    builder.addCase(getCurrentUser.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isLogin = false;
      localStorage.removeItem("authUser");
    });
  },
});

export const { clearError, restoreAuthState } = authSlice.actions;
export default authSlice.reducer;
