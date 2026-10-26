import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLanguage as setLanguageAction, getTranslation } from '@/redux/slices/languageSlice';
import type { Language } from '@/types/language.types';

export function useLanguage() {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.language);

  const setLanguage = useCallback(
    (newLanguage: Language) => {
      dispatch(setLanguageAction(newLanguage));
    },
    [dispatch]
  );

  const t = useCallback((key: string) => getTranslation(language, key), [language]);

  return useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );
}

export type { Language } from '@/types/language.types';
export { languages } from '@/data/translations';
