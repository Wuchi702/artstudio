export function assetPath(path: string) {
  const base = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? '';
  return path.startsWith('/') && !path.startsWith('//') ? `${base}${path}` : path;
}
