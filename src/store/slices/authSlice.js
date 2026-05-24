import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const STORAGE_KEY = 'velune_refresh';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem(STORAGE_KEY, data.refreshToken);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Login failed');
  }
});

export const refreshToken = createAsyncThunk('auth/refresh', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem(STORAGE_KEY);
  if (!token) return rejectWithValue('No refresh token');
  try {
    const { data } = await api.post('/auth/refresh', { refreshToken: token });
    localStorage.setItem(STORAGE_KEY, data.refreshToken);
    return data;
  } catch (err) {
    localStorage.removeItem(STORAGE_KEY);
    return rejectWithValue('Session expired');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: null,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.error = null;
      localStorage.removeItem(STORAGE_KEY);
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.accessToken = payload.accessToken;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(refreshToken.fulfilled, (state, { payload }) => {
        state.accessToken = payload.accessToken;
        state.initialized = true;
      })
      .addCase(refreshToken.rejected, state => {
        state.user = null;
        state.accessToken = null;
        state.initialized = true;
      })
      .addCase(fetchMe.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.initialized = true;
      })
      .addCase(fetchMe.rejected, state => { state.initialized = true; });
  },
});

export const { logout, clearError } = authSlice.actions;

export const selectAuth = s => s.auth;
export const selectUser = s => s.auth.user;
export const selectIsLoggedIn = s => !!s.auth.accessToken;
export const selectIsAdmin = s => ['ADMIN', 'EDITOR'].includes(s.auth.user?.role);

export default authSlice.reducer;
