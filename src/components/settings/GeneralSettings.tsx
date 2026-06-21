import { useEffect, useState } from 'react';
import { useI18n } from '@/components/i18n/I18nProvider';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import type { Translations } from '@/i18n/utils';

interface GeneralSettingsProps {
  translations: Translations;
}

export function GeneralSettings({ translations }: GeneralSettingsProps) {
  const { t } = useI18n(translations);

  const [githubProxy, setGithubProxy] = useState(true);
  const [checkUpdate, setCheckUpdate] = useState(true);
  const [searchableDirect, setSearchableDirect] = useState(true);
  const [cleanUrl, setCleanUrl] = useState(true);
  const [letItSnow, setLetItSnow] = useState(true);
  const [promptLength, setPromptLength] = useState(10);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setGithubProxy(localStorage.getItem('github-proxy') !== 'false');
    setCheckUpdate(localStorage.getItem('check-update') !== 'false');
    setSearchableDirect(localStorage.getItem('searchable-direct') !== 'false');
    setCleanUrl(localStorage.getItem('clean-url') !== 'false');
    setLetItSnow(localStorage.getItem('let-it-snow') !== 'false');
    const stored = localStorage.getItem('searchable-prompt-length');
    setPromptLength(stored ? Number(stored) : 10);
  }, []);

  const update = (key: string, value: string | boolean) => {
    localStorage.setItem(key, String(value));
    if (key === 'let-it-snow') {
      window.dispatchEvent(new CustomEvent('mcisee:let-it-snow', { detail: value === true || value === 'true' }));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{t('config')}</h3>

      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <Label htmlFor="github-proxy" dangerouslySetInnerHTML={{ __html: t('GitHubProxy') }} />
        <Switch
          id="github-proxy"
          checked={githubProxy}
          onCheckedChange={(v) => {
            setGithubProxy(v);
            update('github-proxy', v);
          }}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <Label htmlFor="check-update">{t('checkUpdate')}</Label>
        <Switch
          id="check-update"
          checked={checkUpdate}
          onCheckedChange={(v) => {
            setCheckUpdate(v);
            update('check-update', v);
          }}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <Label htmlFor="searchable-direct">{t('searchableDirect')}</Label>
        <Switch
          id="searchable-direct"
          checked={searchableDirect}
          onCheckedChange={(v) => {
            setSearchableDirect(v);
            update('searchable-direct', v);
          }}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <Label htmlFor="clean-url">{t('cleanUrl')}</Label>
        <Switch
          id="clean-url"
          checked={cleanUrl}
          onCheckedChange={(v) => {
            setCleanUrl(v);
            update('clean-url', v);
          }}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <Label htmlFor="let-it-snow">{t('LetItSnow')}</Label>
        <Switch
          id="let-it-snow"
          checked={letItSnow}
          onCheckedChange={(v) => {
            setLetItSnow(v);
            update('let-it-snow', v);
          }}
        />
      </div>

      <div className="rounded-lg border border-border p-4">
        <Label htmlFor="prompt-length">{t('searchablePromptLength')}</Label>
        <div className="mt-4 flex items-center gap-4">
          <Slider
            id="prompt-length"
            value={[promptLength]}
            onValueChange={(v) => {
              setPromptLength(v[0]);
              update('searchable-prompt-length', v[0]);
            }}
            min={0}
            max={30}
            step={1}
            className="flex-1"
          />
          <span className="w-8 text-right font-medium">{promptLength}</span>
        </div>
      </div>
    </div>
  );
}
