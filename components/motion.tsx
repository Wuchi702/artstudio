'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.querySelector('main');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!main || reduced.matches) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const stop = () => cleanup?.();
    const wide = window.matchMedia('(min-width: 721px)').matches;
    const reveals = wide ? Array.from(main.querySelectorAll('[data-reveal],[data-copy-reveal]')) : [];
    if (reveals.length === 0) {
      return;
    }
    const plugin = import('gsap/ScrollTrigger');

    void Promise.all([import('gsap'), plugin]).then(([{ gsap }, scroll]) => {
      if (disposed || reduced.matches) return;
      gsap.registerPlugin(scroll.ScrollTrigger);

      const scope = gsap.context(() => {
        for (const element of reveals) {
          const photo = element.querySelector('.photo-frame');
          const bounds = element.getBoundingClientRect();
          if (bounds.top < window.innerHeight) continue;
          const trigger = { trigger: element, start: 'top 94%', once: true };
          if (photo) {
            gsap.from(photo, { clipPath: 'inset(0 0 15% 0)', y: 14, duration: 0.78, ease: 'power3.out',
              immediateRender: false, clearProps: 'clipPath,transform', scrollTrigger: trigger });
          }
          const copy = element.querySelector('.project-card-caption') ?? (!photo ? element : null);
          if (copy) {
            gsap.from(copy, { y: 21, opacity: 0.46, duration: 0.6, ease: 'power2.out',
              immediateRender: false, clearProps: 'transform,opacity', scrollTrigger: trigger });
          }
        }
      }, main);

      cleanup = () => scope.revert();
    }).catch(() => {});

    reduced.addEventListener('change', stop);
    return () => {
      disposed = true;
      reduced.removeEventListener('change', stop);
      stop();
    };
  }, [pathname]);

  return null;
}
