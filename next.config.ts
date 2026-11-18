import type { NextConfig } from 'next';

const pages = process.env.GITHUB_PAGES === '1';

const config: NextConfig = {
  ...(pages ? {
    output: 'export',
    basePath: process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? '',
    trailingSlash: true
  } : { pageExtensions: ['server.ts', 'tsx', 'ts'] }),
  poweredByHeader: false,
  images: {
    unoptimized: pages,
    deviceSizes: [390, 640, 828, 1080, 1440, 1920],
    qualities: [75, 85]
  },
  ...(!pages && { async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'DENY' }
      ]
    }];
  } })
};

export default config;
