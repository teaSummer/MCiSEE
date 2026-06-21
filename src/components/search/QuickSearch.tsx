import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useI18n } from '@/components/i18n/I18nProvider';
import type { Searchable } from '@/types/data';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n/utils';

interface QuickSearchProps {
  searchables: Searchable[];
  translations: Translations;
  locale: Locale;
}

export function QuickSearch({ searchables, translations, locale }: QuickSearchProps) {
  const { t } = useI18n(translations);
  const [selected, setSelected] = useState<string>(searchables[0]?.abbr ?? searchables[0]?.title ?? '');
  const [keyword, setKeyword] = useState('');

  const current = useMemo(
    () => searchables.find((s) => (s.abbr ?? s.title) === selected),
    [searchables, selected]
  );

  const isInternalSearch = Boolean(current && !current.search && current.abbr === 'MCiSEE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;

    if (current.search) {
      const url = current.search.replace('<T>', encodeURIComponent(keyword));
      window.open(url, '_blank');
    } else if (isInternalSearch && keyword.trim()) {
      window.location.href = `/${locale}/websites?search=${encodeURIComponent(keyword.trim())}`;
    } else if (current.url) {
      window.open(current.url, '_blank');
    }
  };

  const canSubmit = Boolean(
    current && (current.search || (isInternalSearch && keyword.trim()) || current.url)
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-center text-xl font-semibold">{t('searchable')}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="sm:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {searchables.map((item) => (
                <SelectItem key={item.abbr ?? item.title} value={item.abbr ?? item.title}>
                  <div>
                    <div>{item.title}</div>
                    {item.note && (
                      <div className="text-xs text-muted-foreground">{item.note}</div>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('searchFrom').replace('${linkSearchFrom}', current?.title ?? '')}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={!canSubmit}>
            <Search className="mr-2 h-4 w-4" />
            {t('search')}
          </Button>
        </form>
      </div>
    </div>
  );
}
