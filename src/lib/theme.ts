export type Theme = 'light' | 'dark' | 'system' | 'classic';

const THEME_KEY = 'mcisee-theme';
export const THEME_CHANGE_EVENT = 'mcisee:theme-change';

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const value = localStorage.getItem(THEME_KEY) as Theme | null;
  if (value && ['light', 'dark', 'system', 'classic'].includes(value)) {
    return value;
  }
  return 'system';
}

export function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_KEY, theme);
}

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveEffectiveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') return getSystemTheme();
  if (theme === 'classic') return 'light';
  return theme;
}

export function getBackgroundImage(theme: Theme): string {
  if (theme === 'classic') return '/assets/image/classic.webp';
  const effective = resolveEffectiveTheme(theme);
  return effective === 'dark' ? '/assets/image/dark.webp' : '/assets/image/daylight.webp';
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const effective = resolveEffectiveTheme(theme);

  root.classList.remove('light', 'dark');
  root.classList.add(effective);
  root.dataset.theme = theme;

  if (theme === 'classic') {
    root.classList.add('theme-classic');
  } else {
    root.classList.remove('theme-classic');
  }

  root.style.setProperty('--background-image', `url('${getBackgroundImage(theme)}')`);
}

export function dispatchThemeChange(theme: Theme): void {
  if (typeof window === 'undefined') return;
  setStoredTheme(theme);
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme }));
}

export function listenThemeChange(callback: (theme: Theme) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    const theme = (e as CustomEvent).detail;
    if (theme && ['light', 'dark', 'system', 'classic'].includes(theme)) {
      callback(theme as Theme);
    }
  };
  window.addEventListener(THEME_CHANGE_EVENT, handler);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, handler);
}
