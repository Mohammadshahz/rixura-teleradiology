import { createSlice } from '@reduxjs/toolkit';

// Read from sessionStorage
const initialAccessToken = sessionStorage.getItem('accessToken');
const initialUser = sessionStorage.getItem('user');
const initialCenterId    = sessionStorage.getItem('centerId');   // ← add this

const initialState = {
  user: initialUser ? JSON.parse(initialUser) : null,
  isAuthenticated: !!initialAccessToken,
  accessToken: initialAccessToken || '',
  centerId: initialCenterId || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, accessToken, centerId  } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.accessToken = accessToken;
      state.centerId=centerId;
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('centerId',centerId);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = '';
      state.centerId = null;
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('centerId')
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
