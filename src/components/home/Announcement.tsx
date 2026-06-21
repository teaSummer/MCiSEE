import { useEffect, useState } from 'react';
import { useI18n } from '@/components/i18n/I18nProvider';
import { AlertCircle } from 'lucide-react';
import type { Translations } from '@/i18n/utils';

interface AnnouncementItem {
  id: string;
  html: string;
}

interface AnnouncementProps {
  translations: Translations;
}

export function Announcement({ translations }: AnnouncementProps) {
  const { t } = useI18n(translations);
  const [items, setItems] = useState<AnnouncementItem[]>([
    { id: 'qq', html: t('announcement.1') },
    { id: 'donate', html: t('announcement.2') },
    { id: 'star', html: t('introduction.2') },
  ]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await fetch(
          'https://zh.minecraft.wiki/index.php?title=Template:Version&action=raw'
        );
        const text = await response.text();
        const raw = text.split('-->')[1]?.split('}}\n}}')[0]?.trim() ?? '';

        const getVersion = (type: string) => {
          const marker = `| ${type} = `;
          const pos = raw.indexOf(marker);
          if (pos === -1) return '';
          return raw.slice(pos + marker.length).split('\n')[0].replace(/^ *= */, '');
        };

        const java = getVersion('java');
        const javaSnap = getVersion('java-snap');
        const bedrock = getVersion('bedrock');
        const bedrockBeta = getVersion('bedrock-beta');

        if (!java && !bedrock) return;

        const javaHtml = `${t('news.java')}${t('news.release')} ${java}${javaSnap ? ` &nbsp;&nbsp;${t('news.development')} ${javaSnap}` : ''}`;
        const bedrockHtml = `${t('news.bedrock')}${t('news.release')} ${bedrock}${bedrockBeta ? ` &nbsp;&nbsp;${t('news.beta')} ${bedrockBeta}` : ''}`;

        setItems((prev) => [
          ...prev.slice(0, 1),
          { id: 'java', html: javaHtml },
          { id: 'bedrock', html: bedrockHtml },
          ...prev.slice(1),
        ]);
      } catch {
        // ignore
      }
    };

    fetchVersions();
  }, [t]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-8">
      <div className="relative overflow-hidden rounded-lg border border-border bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`text-sm transition-opacity duration-500 ${
                  i === index ? 'block opacity-100' : 'hidden opacity-0'
                }`}
                dangerouslySetInnerHTML={{ __html: item.html }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
