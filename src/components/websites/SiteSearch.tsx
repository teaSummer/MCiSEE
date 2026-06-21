import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/components/i18n/I18nProvider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FaviconImg } from '@/lib/favicon';
import type { SiteCategory } from '@/types/data';
import type { Translations } from '@/i18n/utils';

interface SiteSearchProps {
  categories: SiteCategory[];
  translations: Translations;
}

export function SiteSearch({ categories, translations }: SiteSearchProps) {
  const { t } = useI18n(translations);
  const [keyword, setKeyword] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    if (search) {
      setKeyword(search);
      history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const defaultOpenItems = useMemo(
    () => categories.filter((cat) => cat.keepOpen).map((cat) => cat.category),
    [categories]
  );

  const filtered = useMemo(() => {
    if (!keyword.trim()) return categories;
    const lower = keyword.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        sites: cat.sites.filter(
          (site) =>
            site.name.toLowerCase().includes(lower) ||
            (site.desc?.toLowerCase().includes(lower) ?? false) ||
            site.url.toLowerCase().includes(lower)
        ),
      }))
      .filter((cat) => cat.sites.length > 0 || cat.category.toLowerCase().includes(lower));
  }, [categories, keyword]);

  useEffect(() => {
    if (!keyword.trim()) {
      setOpenItems(defaultOpenItems);
      return;
    }
    const matched = filtered.map((cat) => cat.category);
    setOpenItems(matched);
  }, [keyword, filtered, defaultOpenItems]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="relative mx-auto max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('searchFrom').replace('${linkSearchFrom}', t('utilityWebsite'))}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">{t('unsupported')}</div>
      )}

      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={setOpenItems}
        className="mt-8 space-y-4"
      >
        {filtered.map((cat) => (
          <AccordionItem
            key={cat.category}
            value={cat.category}
            className="rounded-xl border border-border bg-card/80 px-4 shadow-sm backdrop-blur-sm"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              {cat.category}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-3 pb-2 sm:grid-cols-2 lg:grid-cols-3">
                {cat.sites.map((site) => (
                  <a
                    key={site.name}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 rounded-lg border border-border/50 bg-background/80 p-4 transition-colors hover:border-primary/50 hover:bg-accent"
                  >
                    <FaviconImg
                      url={site.url}
                      icon={site.icon}
                      className="mt-0.5 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 font-medium">
                        <span className="truncate">{site.name}</span>
                        <Search className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      {site.desc && (
                        <div className="mt-1 text-sm text-muted-foreground">{site.desc}</div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
