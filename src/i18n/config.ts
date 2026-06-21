export const defaultLocale = 'zh-CN';

export const locales = [
  'zh-CN',
  'zh-TW',
  'zh-HK',
  'en-US',
  'en-UD',
  'it-IT',
  'pt-BR',
  'lzh',
] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文（台灣）',
  'zh-HK': '繁體中文（香港）',
  'en-US': 'English',
  'en-UD': 'uʍop-ǝpᴉsd∩',
  'it-IT': 'Italiano',
  'pt-BR': 'Português (Brasil)',
  'lzh': '文言',
};

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
