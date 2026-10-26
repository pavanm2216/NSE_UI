import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  logout as logoutAction,
  setRole as setRoleAction,
  switchRole as switchRoleAction,
  mockLogin,
  toggleCustomerTier as toggleCustomerTierAction,
  upgradeToPremium as upgradeToPremiumAction,
} from '@/redux/slices/authSlice';
import { useLoginMutation } from '@/redux/services/authApi';
import type { UserRole } from '@/types/user.types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [loginMutation] = useLoginMutation();

  const loginWithApi = useCallback(
    async (email: string, password: string, apiRole: string) => {
      await loginMutation({ email, password, role: apiRole }).unwrap();
    },
    [loginMutation]
  );

  const login = useCallback(
    (email: string, password: string) => {
      dispatch(mockLogin({ email, password }));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const setRole = useCallback(
    (role: UserRole) => {
      dispatch(setRoleAction(role));
    },
    [dispatch]
  );

  const switchRole = useCallback(
    (role: UserRole) => {
      dispatch(switchRoleAction(role));
    },
    [dispatch]
  );

  const toggleCustomerTier = useCallback(() => {
    dispatch(toggleCustomerTierAction());
  }, [dispatch]);

  const upgradeToPremium = useCallback(() => {
    dispatch(upgradeToPremiumAction());
  }, [dispatch]);

  return {
    user,
    isAuthenticated: !!user,
    loginWithApi,
    login,
    logout,
    setRole,
    switchRole,
    toggleCustomerTier,
    upgradeToPremium,
  };
}

export type { User, UserRole, CustomerTier } from '@/types/user.types';
export { labelToApiRole, roleLabels, roleColors } from '@/constants/auth.constants';
