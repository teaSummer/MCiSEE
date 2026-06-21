import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/components/i18n/I18nProvider';
import { LauncherDetail } from './LauncherDetail';
import type { Device, DeviceInfo, Launcher } from '@/types/data';
import type { Translations } from '@/i18n/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LauncherPageClientProps {
  devices: DeviceInfo[];
  launchersByDevice: Record<Device, Launcher[]>;
  initialDevice?: Device | null;
  translations: Translations;
}

function detectDevice(): Device | null {
  if (typeof navigator === 'undefined') return null;
  const ua = navigator.userAgent;
  const platform = navigator.platform?.toLowerCase() ?? '';

  if (/Android|HarmonyOS/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Macintosh|MacIntel/i.test(platform) || /macOS/i.test(ua)) return 'macOS';
  if (/Win32|Win64|Windows/i.test(platform) || /Windows NT/i.test(ua)) return 'Windows';
  if (/Linux|X11/i.test(platform) || /Linux/i.test(ua)) return 'Linux';
  return null;
}

export function LauncherPageClient({
  devices,
  launchersByDevice,
  translations,
  initialDevice,
}: LauncherPageClientProps) {
  const { t } = useI18n(translations);
  const [device, setDevice] = useState<Device>(() => {
    const detected = detectDevice();
    if (detected && devices.some((d) => d.key === detected)) return detected;
    return initialDevice ?? 'Windows';
  });
  const [selected, setSelected] = useState<Launcher | null>(null);

  const launchers = useMemo(() => launchersByDevice[device] ?? [], [launchersByDevice, device]);

  useEffect(() => {
    if (launchers.length && !selected) {
      setSelected(launchers[0]);
    }
  }, [device, launchers, selected]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <label className="mb-2 block text-sm font-medium text-muted-foreground">
          {t('device.tip')}
        </label>
        <Select value={device} onValueChange={(v) => setDevice(v as Device)}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {devices.map((d) => (
              <SelectItem key={d.key} value={d.key}>
                <div>
                  <div>{d.label}</div>
                  <div className="text-xs text-muted-foreground">{t(d.tipKey)}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-1">
          {launchers.map((launcher) => (
            <Card
              key={launcher.title}
              className={cn(
                'cursor-pointer transition-colors hover:border-primary/50',
                selected?.title === launcher.title && 'border-primary bg-primary/5'
              )}
              onClick={() => setSelected(launcher)}
            >
              <CardContent className="p-4">
                <div className="font-medium">{launcher.abbr ?? launcher.title}</div>
                {launcher.abbr && launcher.abbr !== launcher.title && (
                  <div className="text-sm text-muted-foreground">{launcher.title}</div>
                )}
                {launcher.version && (
                  <div className="mt-1 text-xs text-muted-foreground">{launcher.version}</div>
                )}
              </CardContent>
            </Card>
          ))}
          {launchers.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                {t('unsupported')}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <LauncherDetail launcher={selected} device={device} translations={translations} />
        </div>
      </div>
    </div>
  );
}
