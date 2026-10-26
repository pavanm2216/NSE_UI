import { useCallback } from 'react';
import { useAppSelector } from '@/redux/hooks';

type Theme = 'light';

export function useTheme() {
  const theme = useAppSelector((state) => state.ui.theme);

  const toggleTheme = useCallback(() => {
    // Theme is always light
  }, []);

  const setTheme = useCallback((_newTheme: Theme) => {
    // Theme is always light
  }, []);

  return { theme, toggleTheme, setTheme };
}
