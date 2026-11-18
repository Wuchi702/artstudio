import type { Metadata } from 'next';
import type { Photo } from '@/data/projects';
import { site } from '@/data/site';
import { assetPath } from '@/lib/asset-path';
import { sitePageUrl, siteUrl } from '@/lib/site-url';

export function pageMetadata(path: string, title: string, description: string, photo?: Photo): Metadata {
  const origin = siteUrl();
  const url = origin ? sitePageUrl(path, origin).href : undefined;
  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: 'ru_RU',
      title,
      description,
      url,
      images: origin ? [photo ? { url: assetPath(photo.src), alt: photo.alt } : assetPath('/images/hero.webp')] : undefined
    }
  };
}
