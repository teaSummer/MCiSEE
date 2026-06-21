import { Monitor, Sun, Moon, Palette } from 'lucide-react';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useTheme, type Theme } from '@/components/theme/ThemeProvider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { Translations } from '@/i18n/utils';

interface ThemeSettingsProps {
  translations: Translations;
}

export function ThemeSettings({ translations }: ThemeSettingsProps) {
  const { t } = useI18n(translations);
  const { theme, setTheme } = useTheme();

  const options: { value: Theme; icon: React.ReactNode; labelKey: string }[] = [
    { value: 'system', icon: <Monitor className="h-4 w-4" />, labelKey: 'default' },
    { value: 'light', icon: <Sun className="h-4 w-4" />, labelKey: 'daytime' },
    { value: 'dark', icon: <Moon className="h-4 w-4" />, labelKey: 'nighttime' },
    { value: 'classic', icon: <Palette className="h-4 w-4" />, labelKey: 'classic' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">{t('config')}</h3>
      <ToggleGroup
        type="single"
        value={theme}
        onValueChange={(v) => v && setTheme(v as Theme)}
        className="flex-wrap justify-start"
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={t(option.labelKey)}
            className="gap-2"
          >
            {option.icon}
            {t(option.labelKey)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
