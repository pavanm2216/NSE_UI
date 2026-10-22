import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { translateText, translateMultiple } from '@/services/translationService';

export const useDynamicTranslation = (originalText: string) => {
  const [translatedText, setTranslatedText] = useState(originalText);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const runTranslation = async () => {
      if (language === 'en') {
        setTranslatedText(originalText);
        return;
      }

      setIsLoading(true);
      try {
        const translated = await translateText(originalText, language);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(originalText);
      } finally {
        setIsLoading(false);
      }
    };

    runTranslation();
  }, [originalText, language]);

  return { translatedText, isLoading };
};

export const useMultipleTranslations = (texts: string[]) => {
  const [translatedTexts, setTranslatedTexts] = useState<string[]>(texts);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const runTranslations = async () => {
      if (language === 'en') {
        setTranslatedTexts(texts);
        return;
      }

      setIsLoading(true);
      try {
        const translated = await translateMultiple(texts, language);
        setTranslatedTexts(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedTexts(texts);
      } finally {
        setIsLoading(false);
      }
    };

    runTranslations();
  }, [texts, language]);

  return { translatedTexts, isLoading };
};
