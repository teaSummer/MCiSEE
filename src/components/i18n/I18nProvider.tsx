import { createContext, useContext, type ReactNode } from 'react';
import type { Translations } from '@/i18n/utils';
import { t as translate } from '@/i18n/utils';

interface I18nContextValue {
  t: (key: string, params?: Record<string, string | number>) => string;
  translations: Translations;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n(fallbackTranslations?: Translations) {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    const translations = fallbackTranslations ?? {};
    return {
      translations,
      t: (key: string, params?: Record<string, string | number>) =>
        translate(translations, key, params),
    };
  }
  return ctx;
}

interface I18nProviderProps {
  translations: Translations;
  children: ReactNode;
}

export function I18nProvider({ translations, children }: I18nProviderProps) {
  return (
    <I18nContext.Provider
      value={{
        translations,
        t: (key, params) => translate(translations, key, params),
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}
