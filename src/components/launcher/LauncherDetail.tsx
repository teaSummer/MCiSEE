import { useEffect, useState } from 'react';
import { ExternalLink, Download } from 'lucide-react';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/components/i18n/I18nProvider';
import type { Launcher } from '@/types/data';
import type { Translations } from '@/i18n/utils';

interface LauncherDetailProps {
  launcher: Launcher | null;
  device: string;
  translations: Translations;
}

const GH_MIRROR = 'https://ghfast.top/<T>';

function mirrorUrl(url: string, enabled: boolean): string {
  if (!enabled) return url;
  if (url.startsWith('https://github.com/')) {
    return GH_MIRROR.replace('<T>', url);
  }
  return url;
}

function getFaviconUrl(url: string): string {
  try {
    const host = new URL(url).host;
    return `https://www.faviconextractor.com/favicon/${host}?larger=true`;
  } catch {
    return '';
  }
}

export function LauncherDetail({ launcher, device, translations }: LauncherDetailProps) {
  const { t } = useI18n(translations);
  const [proxyEnabled, setProxyEnabled] = useState(true);
  const [lastStable, setLastStable] = useState('');
  const [lastDev, setLastDev] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined' || !launcher) return;
    const abbr = launcher.abbr ?? launcher.title;
    setLastStable(localStorage.getItem(`last-${device}-${abbr}-stable-download`) ?? '');
    setLastDev(localStorage.getItem(`last-${device}-${abbr}-dev-download`) ?? '');
  }, [launcher, device]);

  if (!launcher) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          {t('unselected')}
        </CardContent>
      </Card>
    );
  }

  const abbr = launcher.abbr ?? launcher.title;
  const stableUrl = launcher.download ? mirrorUrl(launcher.download, proxyEnabled) : '';
  const devUrl = launcher.dev?.download
    ? mirrorUrl(launcher.dev.download, proxyEnabled)
    : '';

  const handleDownload = (version: string, type: 'stable' | 'dev') => {
    localStorage.setItem(`last-${device}-${abbr}-${type}-download`, version);
    if (type === 'stable') setLastStable(version);
    else setLastDev(version);
  };

  const hasUpdate = (current: string, last: string) => {
    return last && current && current !== 'latest' && current !== last;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">{launcher.title}</CardTitle>
            {launcher.abbr && (
              <Badge variant="secondary" className="mt-2">
                {launcher.abbr}
              </Badge>
            )}
          </div>
          {launcher.url && (
            <a
              href={launcher.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <img
                src={getFaviconUrl(launcher.url)}
                alt=""
                className="h-4 w-4"
                loading="lazy"
              />
              {t('goto')}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {launcher.version && (
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <div className="text-sm text-muted-foreground">{t('release')}</div>
              <div className="font-medium">{launcher.version}</div>
              {hasUpdate(launcher.version, lastStable) && (
                <div className="text-xs text-destructive">
                  {t('downloadedLauncherUpdate')} {lastStable} → {launcher.version}
                </div>
              )}
            </div>
            {stableUrl && (
              <Button asChild onClick={() => handleDownload(launcher.version!, 'stable')}>
                <a href={stableUrl} download>
                  <Download className="mr-2 h-4 w-4" />
                  {t('download')}
                </a>
              </Button>
            )}
          </div>
        )}

        {launcher.dev?.version && (
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <div className="text-sm text-muted-foreground">{t('preRelease')}</div>
              <div className="font-medium">{launcher.dev.version}</div>
              {hasUpdate(launcher.dev.version, lastDev) && (
                <div className="text-xs text-destructive">
                  {t('downloadedLauncherUpdate')} {lastDev} → {launcher.dev.version}
                </div>
              )}
            </div>
            {devUrl && (
              <Button
                variant="outline"
                asChild
                onClick={() => handleDownload(launcher.dev!.version, 'dev')}
              >
                <a href={devUrl} download>
                  <Download className="mr-2 h-4 w-4" />
                  {t('download')}
                </a>
              </Button>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          {launcher.github && (
            <Button variant="outline" asChild>
              <a href={launcher.github} target="_blank" rel="noopener noreferrer">
                <GitHubIcon className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 pt-4 text-sm">
          <input
            type="checkbox"
            id="github-proxy"
            checked={proxyEnabled}
            onChange={(e) => setProxyEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <label htmlFor="github-proxy" dangerouslySetInnerHTML={{ __html: t('GitHubProxy') }} />
        </div>
      </CardContent>
    </Card>
  );
}
