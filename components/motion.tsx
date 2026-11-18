'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.querySelector('main');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!main || reduced.matches) return;
    const hero = main.querySelector('.home-hero');
    const wide = window.matchMedia('(min-width: 721px)').matches;
    const reveals = wide ? [...main.querySelectorAll('[data-reveal]')] : [];
    if (!hero && reveals.length === 0) return;

    let disposed = false;
    let revert: (() => void) | undefined;
    const stop = () => revert?.();

    const scroll = reveals.length ? import('gsap/ScrollTrigger') : Promise.resolve(undefined);
    void Promise.all([import('gsap'), scroll]).then(([{ gsap }, plugin]) => {
      if (disposed || reduced.matches) return;
      if (plugin) gsap.registerPlugin(plugin.ScrollTrigger);
      const scope = gsap.context(() => {
        if (hero) {
          const title = hero.querySelectorAll('.hero-content [data-enter]');
          gsap.timeline({ defaults: { ease: 'power2.out' } })
            .from(hero.querySelector('.hero-image img'), { scale: wide ? 1.045 : 1.025, duration: wide ? 1.25 : 0.72, clearProps: 'transform' }, 0)
            .from(title, { y: 12, opacity: 0.55, stagger: 0.075, duration: 0.6, clearProps: 'transform,opacity' }, 0);
        }
        reveals.forEach((element) => {
          gsap.from(element, {
            y: 14, duration: 0.65, ease: 'power2.out', immediateRender: false,
            clearProps: 'transform',
            scrollTrigger: { trigger: element, start: 'top 92%', once: true }
          });
        });
      }, main);
      revert = () => scope.revert();
    }).catch(() => {
      // The static composition stays readable without the motion bundle.
    });
    reduced.addEventListener('change', stop);
    return () => {
      disposed = true;
      reduced.removeEventListener('change', stop);
      stop();
    };
  }, [pathname]);

  return null;
}
