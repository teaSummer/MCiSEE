import type {
  Device,
  DeviceInfo,
  ForumCategory,
  Launcher,
  Searchable,
  SiteCategory,
} from '@/types/data';

import launcherJson from '@/data/launcher.json';
import searchableJson from '@/data/searchable.json';
import utilityWebsiteJson from '@/data/utilityWebsite.json';
import forumJson from '@/data/forum.json';

export const supportedDevices: DeviceInfo[] = [
  { key: 'Android', label: 'Android/HarmonyOS', tipKey: 'Android.tip' },
  { key: 'iOS', label: 'iOS/iPad', tipKey: 'iOS.tip' },
  { key: 'Windows', label: 'Windows', tipKey: 'Windows.tip' },
  { key: 'macOS', label: 'macOS', tipKey: 'macOS.tip' },
  { key: 'Linux', label: 'Linux', tipKey: 'Linux.tip' },
];

const launcherData = launcherJson as Record<string, Launcher[]>;

export function getLaunchersByDevice(device: Device): Launcher[] {
  return launcherData[`${device}Launcher`] ?? [];
}

export function getAllLaunchers(): Record<Device, Launcher[]> {
  return supportedDevices.reduce((acc, { key }) => {
    acc[key] = getLaunchersByDevice(key);
    return acc;
  }, {} as Record<Device, Launcher[]>);
}

export function getSearchables(): Searchable[] {
  return searchableJson as Searchable[];
}

export function getUtilityWebsites(): SiteCategory[] {
  return utilityWebsiteJson as SiteCategory[];
}

export function getForums(): ForumCategory[] {
  return forumJson as ForumCategory[];
}
