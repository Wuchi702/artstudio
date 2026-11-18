import { assetPath } from '@/lib/asset-path';
import type { Metadata } from 'next';
import '@fontsource-variable/onest';
import '@fontsource/ibm-plex-mono/cyrillic-500.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/cormorant-garamond/cyrillic-500.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import './globals.css';
import './stone.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Motion } from '@/components/motion';
import { site } from '@/data/site';
import { siteUrl } from '@/lib/site-url';

const origin = siteUrl();

export const metadata: Metadata = {
  metadataBase: origin,
  title: { default: `${site.name} — Дизайн интерьера`, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: { type: 'website', locale: 'ru_RU', siteName: site.name, ...(origin ? { images: [assetPath('/images/garden.webp')] } : {}) },
  robots: origin ? undefined : { index: false, follow: false }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ru">
    <body>
      <a className="skip-link" href="#main">К содержанию</a>
      <div className="studio-panel">
      <Header />
      <main id="main" tabIndex={-1}>{children}</main>
      <Footer />
      </div>
      <Motion />
      {origin && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: new URL(assetPath('/'), origin).href,
        name: site.name,
        inLanguage: 'ru'
      }).replace(/</g, '\\u003c') }} />}
    </body>
  </html>;
}
