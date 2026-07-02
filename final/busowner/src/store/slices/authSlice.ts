import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserSession, User } from '../../types/auth';

function fetchInitialData(): UserSession | null {
  const user = localStorage.getItem('user');
  if (user === null) {
    return null;
  }
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

const initialState: AuthState = {
  user: fetchInitialData(),
  otherUserinfo: {
    role: fetchInitialData()?.user?.role || '',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    Add_User: (state, action: PayloadAction<UserSession>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
      state.otherUserinfo.role = action.payload.user?.role || '';
    },
    Logout_User: (state) => {
      state.user = null;
      state.otherUserinfo = {
        role: '',
      };
      localStorage.removeItem('user');
    },
    setUserInfo: (state, action: PayloadAction<Partial<User>>) => {
      state.otherUserinfo.role = action.payload.role || '';
      if (state.user) {
        state.user.user = {
          ...state.user.user,
          ...action.payload,
        } as User;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { Add_User, Logout_User, setUserInfo } = authSlice.actions;
export default authSlice.reducer;
