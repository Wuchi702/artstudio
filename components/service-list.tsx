'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function ServiceList({ children }: { children: ReactNode }) {
  const list = useRef<HTMLElement>(null);

  useEffect(() => {
    function openLinkedService() {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target instanceof HTMLDetailsElement && list.current?.contains(target)) {
        target.open = true;
      }
    }

    openLinkedService();
    window.addEventListener('hashchange', openLinkedService);
    return () => window.removeEventListener('hashchange', openLinkedService);
  }, []);

  return <section ref={list} className="shell services-list" aria-label="Форматы дизайн-работы">
    {children}
  </section>;
}
