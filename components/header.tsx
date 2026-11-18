'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { site } from '@/data/site';
import { Arrow, Wordmark } from './ui';

export function Header() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const toggle = useRef<HTMLElement>(null);
  const close = () => {
    if (menu.current) menu.current.open = false;
  };
  const closeAndRestore = () => {
    close();
    toggle.current?.focus();
  };
  const navigation = [...site.navigation, { label: 'Контакты', href: '/contact' }];
  const current = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return <header className="site-header">
    <div className="header-inner shell">
      <Wordmark />
      <nav aria-label="Основная навигация" className="desktop-nav">
        {navigation.map(({ label, href }) => <Link key={href} href={href} aria-current={current(href) ? 'page' : undefined}>{label}</Link>)}
      </nav>
      <details ref={menu} className="mobile-menu" onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) close();
      }} onKeyDown={(event) => {
        if (event.key === 'Escape' && menu.current?.open) {
          closeAndRestore();
        }
      }}>
        <summary ref={toggle}><span className="label-open">Меню</span><span className="label-close">Закрыть</span><span className="menu-mark" aria-hidden="true" /></summary>
        <nav aria-label="Развёрнутая навигация" className="mobile-panel">
          <Link onClick={closeAndRestore} href="/" aria-current={pathname === '/' ? 'page' : undefined}>Главная</Link>
          {navigation.map(({ label, href }) =>
            <Link key={href} onClick={closeAndRestore} href={href} aria-current={current(href) ? 'page' : undefined}>{label}<Arrow /></Link>
          )}
        </nav>
      </details>
    </div>
  </header>;
}
