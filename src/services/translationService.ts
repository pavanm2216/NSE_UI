import type { Language } from '@/types/language.types';

const APIFY_TOKEN = import.meta.env.VITE_APIFY_TOKEN ?? '';
const APIFY_API_URL =
  'https://api.apify.com/v2/acts/scrapestorm~deepl-translate-scraper/runs';

const languageMap: Record<Language, string> = {
  en: 'EN',
  hi: 'HI',
  te: 'TE',
  ta: 'TA',
  bn: 'BN',
  gu: 'GU',
  mr: 'MR',
  kn: 'KN',
  or: 'OR',
  es: 'ES',
};

const translationCache = new Map<string, string>();

const getCacheKey = (text: string, targetLang: string) => `${text}:${targetLang}`;

export const translateText = async (
  text: string,
  targetLanguage: Language,
  sourceLanguage: Language = 'en'
): Promise<string> => {
  if (sourceLanguage === targetLanguage) {
    return text;
  }

  const cacheKey = getCacheKey(text, targetLanguage);
  const cached = translationCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(`${APIFY_API_URL}?token=${APIFY_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage: languageMap[targetLanguage] || 'EN',
        sourceLanguage: languageMap[sourceLanguage] || 'EN',
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.translatedText || text;

    translationCache.set(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

export const translateMultiple = (
  texts: string[],
  targetLanguage: Language,
  sourceLanguage: Language = 'en'
): Promise<string[]> =>
  Promise.all(texts.map((text) => translateText(text, targetLanguage, sourceLanguage)));

export const clearTranslationCache = () => {
  translationCache.clear();
};
