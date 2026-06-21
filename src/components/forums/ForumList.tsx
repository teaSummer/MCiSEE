import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FaviconImg } from '@/lib/favicon';
import type { ForumCategory } from '@/types/data';

interface ForumListProps {
  categories: ForumCategory[];
}

export function ForumList({ categories }: ForumListProps) {
  const defaultOpenItems = useMemo(
    () => categories.filter((cat) => cat.keepOpen).map((cat) => cat.category),
    [categories]
  );
  const [openItems, setOpenItems] = useState<string[]>(defaultOpenItems);

  return (
    <Accordion
      type="multiple"
      value={openItems}
      onValueChange={setOpenItems}
      className="space-y-4"
    >
      {categories.map((category) => (
        <AccordionItem
          key={category.category}
          value={category.category}
          className="rounded-xl border border-border bg-card/80 px-4 shadow-sm backdrop-blur-sm"
        >
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            {category.category}
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 pb-2 sm:grid-cols-2 lg:grid-cols-3">
              {category.sites.map((site) => (
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
                      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
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
  );
}
