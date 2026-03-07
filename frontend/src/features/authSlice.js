import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/authService";

const storedUser = JSON.parse(localStorage.getItem("user") || "null");
const storedToken = localStorage.getItem("accessToken");

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await authService.login(credentials);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("user", JSON.stringify(data.user));
            return data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Login failed"
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await authService.register(userData);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("user", JSON.stringify(data.user));
            return data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Registration failed"
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_payload, { rejectWithValue: _reject }) => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
        } catch {
            // Logout even if API fails
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchMe",
    async (userId, { rejectWithValue }) => {
        try {
            const { data } = await authService.getMe(userId);
            const user = data.user;
            localStorage.setItem("user", JSON.stringify(user));
            return user;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch user"
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: storedUser,
        token: storedToken,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
            })
            // Fetch current user
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
