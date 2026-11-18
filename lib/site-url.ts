export function siteUrl(): URL | undefined {
  try {
    const value = new URL(process.env.SITE_URL ?? '');
    if (['http:', 'https:'].includes(value.protocol) && !value.username && !value.password) return new URL(value.origin);
  } catch {
    return;
  }
}

export function sitePageUrl(path: string, origin: URL): URL {
  const base = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? '';
  const suffix = process.env.GITHUB_PAGES === '1' && !path.endsWith('/') ? '/' : '';
  return new URL(`${base}${path}${suffix}`, origin);
}
