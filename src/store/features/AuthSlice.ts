import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserInfo = {
  email: string;
  selectedCourses: string[];
};

type AuthState = {
  user: UserInfo | null;
  token: string;
  userName: string;
};

const initialState: AuthState = {
  user: null,
  token: '',
  userName: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfo>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload); 
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
      localStorage.setItem('userName', action.payload);
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = '';
      state.userName = '';
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, setToken, setUserName, clearAuth } = authSlice.actions;
export const authSliceReducer = authSlice.reducer;