import { assetPath } from '@/lib/asset-path';
import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site-url';

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const url = siteUrl();
  return url
    ? { rules: { userAgent: '*', allow: '/', disallow: '/api/' }, sitemap: new URL(assetPath('/sitemap.xml'), url).href }
    : { rules: { userAgent: '*', disallow: '/' } };
}
