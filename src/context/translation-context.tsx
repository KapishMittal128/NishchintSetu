'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';

type Language = 'en' | 'hi';

const translations: Record<Language, any> = { en, hi };

// Helper to get nested property
const getDescendantProp = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

type TranslationContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: { values?: Record<string, string | number>; returnObjects?: boolean }) => any;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        const storedLang = localStorage.getItem('nishchint-setu-lang') as Language;
        if (storedLang && ['en', 'hi'].includes(storedLang)) {
            setLanguage(storedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('nishchint-setu-lang', lang);
    };

    const t = useCallback((key: string, options?: { values?: Record<string, string | number>; returnObjects?: boolean }): any => {
        let text = getDescendantProp(translations[language], key);

        if (!text) {
            // Fallback to English if translation is missing
            text = getDescendantProp(translations.en, key);
        }
        
        if (text === undefined) {
            return key; // Return key if not found in English either
        }

        if (options?.returnObjects) {
            return text;
        }
        
        if (typeof text !== 'string') {
            // If we expected a string but got an object/array, return the key.
            return key;
        }

        let processedText = text;
        if (options?.values) {
            Object.keys(options.values).forEach(valueKey => {
                processedText = processedText.replace(`{{${valueKey}}}`, String(options.values![valueKey]));
            });
        }

        return processedText;
    }, [language]);


    return (
        <TranslationContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
};

    