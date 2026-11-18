import Link from 'next/link';
import { site } from '@/data/site';
import { Wordmark } from './ui';

export function Footer() {
  return <footer className="site-footer">
    <div className="shell footer-inner">
      <Wordmark />
      <nav aria-label="Навигация в подвале">
        {site.navigation.map(({ label, href }) => <Link href={href} key={href}>{label}</Link>)}
        <Link href="/contact">Контакты</Link>
      </nav>
      <span className="footer-caption">Авторское портфолио</span>
    </div>
  </footer>;
}
