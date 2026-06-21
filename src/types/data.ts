export interface DevRelease {
  download: string;
  version: string;
}

export interface Launcher {
  title: string;
  abbr?: string;
  download?: string;
  version?: string;
  github?: string;
  url?: string;
  dev?: DevRelease;
}

export interface Searchable {
  title: string;
  abbr?: string;
  url?: string;
  search?: string;
  note?: string;
}

export interface Site {
  name: string;
  url: string;
  desc?: string;
  icon?: string;
}

export interface SiteCategory {
  category: string;
  sites: Site[];
  keepOpen?: boolean;
}

export interface ForumCategory {
  category: string;
  sites: Site[];
  keepOpen?: boolean;
}

export type Device = 'Android' | 'iOS' | 'Windows' | 'macOS' | 'Linux';

export interface DeviceInfo {
  key: Device;
  label: string;
  tipKey: string;
}
