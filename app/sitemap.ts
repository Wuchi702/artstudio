import type { MetadataRoute } from 'next';
import { projects, projectPath } from '@/data/projects';
import { sitePageUrl, siteUrl } from '@/lib/site-url';

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteUrl();
  if (!url) return [];
  return ['/', '/projects', '/about', '/contact', ...projects.map(projectPath)]
    .map((path) => ({ url: sitePageUrl(path, url).href }));
}
