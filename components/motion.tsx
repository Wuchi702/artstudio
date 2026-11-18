'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function Motion() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const curtain = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const changed = previous.current !== pathname;
    previous.current = pathname;
    const main = document.querySelector('main');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!main || reduced.matches) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const stop = () => cleanup?.();
    const wide = window.matchMedia('(min-width: 721px)').matches;
    const hero = main.querySelector('.home-hero');
    const reveals = wide ? Array.from(main.querySelectorAll('[data-reveal],[data-copy-reveal]')) : [];
    const plugin = reveals.length ? import('gsap/ScrollTrigger') : Promise.resolve(undefined);

    void Promise.all([import('gsap'), plugin]).then(([{ gsap }, scroll]) => {
      if (disposed || reduced.matches) return;
      if (scroll) gsap.registerPlugin(scroll.ScrollTrigger);

      const scope = gsap.context(() => {
        if (changed && curtain.current) {
          gsap.fromTo(curtain.current, { yPercent: 0, autoAlpha: 1 },
            { yPercent: -101, duration: 0.48, ease: 'power3.inOut', clearProps: 'transform,opacity,visibility' });
        }

        if (hero) {
          gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'transform,opacity,clipPath' } })
            .from(hero.querySelector('[data-hero-image]'), { clipPath: 'inset(8% 9% 7% 24%)', duration: wide ? 1 : 0.58 }, 0)
            .from(hero.querySelectorAll('[data-hero-line]'), { yPercent: 104, duration: 0.62, stagger: 0.075 }, 0.13)
            .from(document.querySelector('.header-inner'), { y: -12, opacity: 0.3, duration: 0.42 }, 0.28)
            .from(hero.querySelectorAll('[data-hero-meta]'), { y: 9, opacity: 0.45, stagger: 0.055, duration: 0.44 }, 0.36);
        }

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

  return <div ref={curtain} className="route-curtain" aria-hidden="true" />;
}
