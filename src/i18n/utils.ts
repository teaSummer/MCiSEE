import type { Locale } from './config';
import { defaultLocale, locales } from './config';

import zhCN from '@/i18n/zh-CN.json';
import zhTW from '@/i18n/zh-TW.json';
import zhHK from '@/i18n/zh-HK.json';
import enUS from '@/i18n/en-US.json';
import enUD from '@/i18n/en-UD.json';
import itIT from '@/i18n/it-IT.json';
import ptBR from '@/i18n/pt-BR.json';
import lzh from '@/i18n/lzh.json';

export type Translations = Record<string, string>;

const translationMap: Record<Locale, Translations> = {
  'zh-CN': zhCN as Translations,
  'zh-TW': zhTW as Translations,
  'zh-HK': zhHK as Translations,
  'en-US': enUS as Translations,
  'en-UD': enUD as Translations,
  'it-IT': itIT as Translations,
  'pt-BR': ptBR as Translations,
  lzh: lzh as Translations,
};

export function importTranslations(locale: Locale): Promise<Translations> {
  return Promise.resolve(translationMap[locale] ?? translationMap[defaultLocale]);
}

export function getFallbackLocale(locale: Locale): Locale {
  if (locale === 'en-UD') return 'en-US';
  if (locale.startsWith('zh-')) return 'zh-CN';
  return defaultLocale;
}

export function t(
  translations: Translations,
  key: string,
  params?: Record<string, string | number>
): string {
  let value = translations[key];
  if (value === undefined) {
    value = key;
  }
  if (!params) return value;
  return value.replace(/\$\{([^}]+)\}/g, (_, paramKey) => {
    const param = params[paramKey];
    return param !== undefined ? String(param) : `\${${paramKey}}`;
  });
}

export function interpolate(
  translations: Translations,
  key: string,
  params?: Record<string, string | number>
): string {
  return t(translations, key, params);
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (first && locales.includes(first as Locale)) {
    return first as Locale;
  }
  return defaultLocale;
}
