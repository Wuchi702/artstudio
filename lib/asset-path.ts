export function assetPath(path: string) {
  const base = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? '';
  return path.startsWith('/') && !path.startsWith('//') ? `${base}${path}` : path;
}

export function imageSourceSet(src: string, widths?: readonly number[]) {
  return widths?.map((width, index) => {
    const file = index === widths.length - 1 ? src : src.replace(/\.webp$/, `-${width}.webp`);
    return `${file} ${width}w`;
  }).join(', ');
}
