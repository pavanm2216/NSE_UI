import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { translations } from '@/data/translations';
import type { Language } from '@/types/language.types';

const loadLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem('language') as Language;
    if (saved && translations[saved]) return saved;
  } catch {
    // ignore
  }
  return 'en';
};

interface LanguageState {
  language: Language;
}

const languageSlice = createSlice({
  name: 'language',
  initialState: { language: loadLanguage() } satisfies LanguageState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
      try {
        localStorage.setItem('language', action.payload);
      } catch {
        // ignore
      }
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;

export const getTranslation = (language: Language, key: string): string =>
  translations[language][key] ?? key;
