import { combineReducers } from '@reduxjs/toolkit';
import { authApi } from '@/redux/services/authApi';
import { clientAuthApi } from '@/redux/services/clientAuthApi';
import { membershipApi } from '@/redux/services/membershipApi';
import { adminApi } from '@/redux/services/adminApi';
import authReducer from '@/redux/slices/authSlice';
import languageReducer from '@/redux/slices/languageSlice';
import uiReducer from '@/redux/slices/uiSlice';
import policyReducer from '@/redux/slices/policySlice';
import membershipReducer from '@/redux/slices/membershipSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  language: languageReducer,
  ui: uiReducer,
  policy: policyReducer,
  membership: membershipReducer,
  [authApi.reducerPath]: authApi.reducer,
  [membershipApi.reducerPath]: membershipApi.reducer,
  [clientAuthApi.reducerPath]: clientAuthApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
