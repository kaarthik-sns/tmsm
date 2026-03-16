'use client';
import { useState, useEffect } from 'react';

const DEFAULT_LANG = 'en';

type Language = 'en' | 'ta';

export function useLanguage(): [Language, (lang: Language) => void] {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANG);

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as Language | null;
    if (storedLang === 'en' || storedLang === 'ta') {
      setLanguage(storedLang);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    localStorage.setItem('lang', lang);
    setLanguage(lang);
  };

  return [language, changeLanguage];
}
