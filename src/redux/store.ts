import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/redux/services/authApi';
import { clientAuthApi } from '@/redux/services/clientAuthApi';
import { membershipApi } from '@/redux/services/membershipApi';
import { adminApi } from '@/redux/services/adminApi';
import { rootReducer } from '@/redux/rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      membershipApi.middleware,
      clientAuthApi.middleware,
      adminApi.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
