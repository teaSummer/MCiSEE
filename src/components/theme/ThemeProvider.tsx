import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  applyTheme,
  dispatchThemeChange,
  getStoredTheme,
  getSystemTheme,
  listenThemeChange,
  type Theme,
} from '@/lib/theme';

interface ThemeContextValue {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Components rendered in a separate Astro island do not receive the
    // ThemeProvider Context. Fall back to local state synced via CustomEvent
    // + localStorage so theme still works across islands.
    const [theme, setThemeState] = useState<Theme>(() =>
      typeof window === 'undefined' ? 'system' : getStoredTheme()
    );

    useEffect(() => {
      return listenThemeChange((next) => {
        setThemeState(next);
      });
    }, []);

    const effectiveTheme: 'light' | 'dark' =
      theme === 'system' ? getSystemTheme() : theme === 'classic' ? 'light' : theme;

    const setTheme = (next: Theme) => {
      dispatchThemeChange(next);
      setThemeState(next);
    };

    return { theme, effectiveTheme, setTheme };
  }
  return ctx;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = getStoredTheme();
    setThemeState(stored);
    applyTheme(stored);
    setEffectiveTheme(
      stored === 'system' ? getSystemTheme() : stored === 'classic' ? 'light' : stored
    );

    const listener = (e: MediaQueryListEvent) => {
      const current = getStoredTheme();
      if (current === 'system') {
        setEffectiveTheme(e.matches ? 'dark' : 'light');
        applyTheme('system');
      }
    };

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener('change', listener);

    const removeThemeListener = listenThemeChange((next) => {
      setThemeState(next);
      setEffectiveTheme(
        next === 'system' ? getSystemTheme() : next === 'classic' ? 'light' : next
      );
    });

    return () => {
      mql.removeEventListener('change', listener);
      removeThemeListener();
    };
  }, []);

  const setTheme = (next: Theme) => {
    dispatchThemeChange(next);
    setThemeState(next);
    setEffectiveTheme(
      next === 'system' ? getSystemTheme() : next === 'classic' ? 'light' : next
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
