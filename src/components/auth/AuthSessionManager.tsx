import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { refreshAccessToken } from '@/redux/services/authApi';
import { SESSION_TIMEOUT_MS } from '@/constants/auth.constants';

const REFRESH_DEBOUNCE_MS = 60 * 1000;

export const AuthSessionManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRefreshCall = useRef(0);

  useEffect(() => {
    if (!user) return;

    const callRefreshToken = () => {
      const now = Date.now();
      if (now - lastRefreshCall.current < REFRESH_DEBOUNCE_MS) return;
      lastRefreshCall.current = now;
      refreshAccessToken(() => dispatch(logout()));
    };

    const resetInactivityTimer = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      callRefreshToken();
      inactivityTimer.current = setTimeout(() => {
        dispatch(logout());
        window.location.href = '/login?role=admin&reason=timeout';
      }, SESSION_TIMEOUT_MS);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const handler = () => resetInactivityTimer();
    events.forEach((e) => window.addEventListener(e, handler));
    resetInactivityTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [user, dispatch]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add('light');
    try {
      localStorage.setItem('theme', 'light');
    } catch {
      // ignore
    }
  }, []);

  return null;
};
