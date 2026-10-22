import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  STORAGE_KEY,
  TOKEN_KEY,
  REFRESH_KEY,
  mockUsers,
} from '@/constants/auth.constants';
import type { User, UserRole } from '@/types/user.types';

interface AuthState {
  user: User | null;
}

const loadUser = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const persistUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
};

const initialState: AuthState = {
  user: loadUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      persistUser(action.payload);
    },
    logout(state) {
      state.user = null;
      persistUser(null);
    },
    setRole(state, action: PayloadAction<UserRole>) {
      const role = action.payload;
      const regName = localStorage.getItem('lendrix_reg_name');
      const regEmail = localStorage.getItem('lendrix_reg_email');
      if (role === 'customer' && (regName || regEmail)) {
        state.user = {
          ...mockUsers[role],
          name: regName || mockUsers[role].name,
          email: regEmail || mockUsers[role].email,
        };
      } else {
        state.user = mockUsers[role];
      }
      persistUser(state.user);
    },
    switchRole(state, action: PayloadAction<UserRole>) {
      state.user = mockUsers[action.payload];
      persistUser(state.user);
    },
    mockLogin(state, action: PayloadAction<{ email: string; password: string }>) {
      const { email } = action.payload;
      const foundUser = Object.values(mockUsers).find((u) => u.email === email);
      state.user = foundUser ?? mockUsers.customer;
      persistUser(state.user);
    },
    toggleCustomerTier(state) {
      if (state.user?.role === 'customer') {
        state.user = {
          ...state.user,
          customerTier: state.user.customerTier === 'normal' ? 'premium' : 'normal',
        };
        persistUser(state.user);
      }
    },
    upgradeToPremium(state) {
      if (state.user?.role === 'customer') {
        state.user = { ...state.user, customerTier: 'premium' };
        persistUser(state.user);
      }
    },
  },
});

export const {
  setUser,
  logout,
  setRole,
  switchRole,
  mockLogin,
  toggleCustomerTier,
  upgradeToPremium,
} = authSlice.actions;

export default authSlice.reducer;
