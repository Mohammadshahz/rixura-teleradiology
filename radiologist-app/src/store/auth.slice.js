// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialAccessToken = sessionStorage.getItem('accessToken');
const initialUser = sessionStorage.getItem('user');

const initialState = {
  user: initialUser ? JSON.parse(initialUser) : null,
  isAuthenticated: !!initialAccessToken,
  accessToken: initialAccessToken || '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.accessToken = accessToken;
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('user', JSON.stringify(user));

    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = '';
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');

    },
    setUser: (state, action) => {
      state.user = action.payload;
      sessionStorage.setItem('user', JSON.stringify(action.payload));

    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
      sessionStorage.setItem('accessToken', action.payload);
    },
  },
});

export const { loginSuccess, logout, setUser, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
