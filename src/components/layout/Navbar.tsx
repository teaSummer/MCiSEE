import { useState } from 'react';
import { Menu, Moon, Sun, Monitor, Palette } from 'lucide-react';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme, type Theme } from '@/components/theme/ThemeProvider';
import { useI18n } from '@/components/i18n/I18nProvider';
import type { Locale } from '@/i18n/config';
import { localeLabels, locales } from '@/i18n/config';
import type { Translations } from '@/i18n/utils';

const navItems = [
  { key: 'home', href: '/', labelKey: 'top' },
  { key: 'launcher', href: '/launcher', labelKey: 'launcher' },
  { key: 'websites', href: '/websites', labelKey: 'website' },
  { key: 'forums', href: '/forums', labelKey: 'forum' },
  { key: 'settings', href: '/settings', labelKey: 'config' },
];

function getLocalizedHref(href: string, locale: Locale) {
  return `/${locale}${href}`;
}

interface NavbarProps {
  locale: Locale;
  current?: string;
  translations: Translations;
}

export function Navbar({ locale, current = 'home', translations }: NavbarProps) {
  const { t } = useI18n(translations);
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    const path = window.location.pathname;
    const prefix = `/${locale}`;
    const rest = path.startsWith(prefix) ? path.slice(prefix.length) || '/' : '/';
    const nextHref = getLocalizedHref(rest, next);
    window.location.href = nextHref;
  };

  const themeOptions: { value: Theme; icon: React.ReactNode; labelKey: string }[] = [
    { value: 'system', icon: <Monitor className="h-4 w-4" />, labelKey: 'default' },
    { value: 'light', icon: <Sun className="h-4 w-4" />, labelKey: 'daytime' },
    { value: 'dark', icon: <Moon className="h-4 w-4" />, labelKey: 'nighttime' },
    { value: 'classic', icon: <Palette className="h-4 w-4" />, labelKey: 'classic' },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <a href={getLocalizedHref('/', locale)} className="flex items-center gap-2 font-semibold">
          <img src="/assets/icon/appiconRound.png" alt="MCiSEE" className="h-8 w-8 rounded-lg" />
          <span className="hidden text-lg sm:inline">MCiSEE</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={getLocalizedHref(item.href, locale)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                current === item.key ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
              }`}
            >
              {t(item.labelKey)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <a
            href="https://github.com/teaSummer/MCiSEE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-md px-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <GitHubIcon className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 px-2">
                {themeOptions.find((o) => o.value === theme)?.icon}
                <span className="sr-only">{t('device.tip')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {themeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className="gap-2"
                >
                  {option.icon}
                  {t(option.labelKey)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 px-2">
                <span>{localeLabels[locale]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
              {locales.map((loc) => (
                <DropdownMenuItem key={loc} onClick={() => switchLocale(loc)}>
                  {localeLabels[loc]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label={t('content')}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 pt-4">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={getLocalizedHref(item.href, locale)}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                      current === item.key
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {t(item.labelKey)}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
