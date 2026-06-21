export function getFaviconUrl(url: string, icon?: string): string | null {
  if (icon) return icon;
  if (url.startsWith('#')) return null;
  try {
    const domain = url
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '');
    if (!domain) return null;
    return `https://www.faviconextractor.com/favicon/${domain}?larger=true`;
  } catch {
    return null;
  }
}

export function FaviconImg({
  url,
  icon,
  alt,
  className,
}: {
  url: string;
  icon?: string;
  alt?: string;
  className?: string;
}) {
  const src = getFaviconUrl(url, icon);
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      width={16}
      height={16}
      loading="lazy"
      onError={(e) => {
        const target = e.currentTarget;
        target.style.display = 'none';
      }}
    />
  );
}
