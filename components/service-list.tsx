'use client';

import { gsap } from 'gsap';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function ServiceList({ children }: { children: ReactNode }) {
  const list = useRef<HTMLElement>(null);
  const animations = useRef(new Map<HTMLDetailsElement, gsap.core.Tween>());

  const setExpanded = useCallback((details: HTMLDetailsElement, expanded: boolean) => {
    const panel = details.querySelector<HTMLElement>('.service-panel');
    const content = panel?.firstElementChild;
    if (!panel || !content) {
      details.open = expanded;
      return;
    }

    const previous = animations.current.get(details);
    const height = details.open ? panel.getBoundingClientRect().height : 0;
    const opacity = details.open ? Number(getComputedStyle(panel).opacity) : 0;
    previous?.kill();

    const settle = () => {
      details.open = expanded;
      details.removeAttribute('data-closing');
      panel.inert = false;
      panel.style.removeProperty('height');
      panel.style.removeProperty('opacity');
      animations.current.delete(details);
    };

    if (prefersReducedMotion()) {
      settle();
      return;
    }

    details.open = true;
    details.toggleAttribute('data-closing', !expanded);
    panel.inert = !expanded;
    const animation = gsap.fromTo(panel, { height, opacity }, {
      height: expanded ? content.getBoundingClientRect().height : 0,
      opacity: expanded ? 1 : 0,
      duration: expanded ? .48 : .32,
      ease: 'power2.inOut',
      onComplete: settle
    });
    animations.current.set(details, animation);
  }, []);

  useEffect(() => {
    let disposed = false;

    async function openLinkedService() {
      const id = window.location.hash.slice(1);
      if (!id) return;

      // Heading heights can change when the display font replaces its fallback.
      await document.fonts.ready;
      if (disposed || window.location.hash !== `#${id}`) return;
      const target = document.getElementById(`service-${id}`);
      const summary = target?.querySelector('summary');
      if (!(target instanceof HTMLDetailsElement) || !list.current?.contains(target) || !summary) return;

      setExpanded(target, true);
      summary.focus({ preventScroll: true });
      const margin = parseFloat(getComputedStyle(summary).scrollMarginTop) || 0;
      const top = window.scrollY + summary.getBoundingClientRect().top - margin;
      window.scrollTo({ top, behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
    }

    const active = animations.current;
    void openLinkedService();
    window.addEventListener('hashchange', openLinkedService);
    return () => {
      disposed = true;
      window.removeEventListener('hashchange', openLinkedService);
      for (const animation of active.values()) animation.progress(1);
      active.clear();
    };
  }, [setExpanded]);

  return <section ref={list} className="shell services-list" aria-label="Форматы дизайн-работы" onClick={(event) => {
    if (!(event.target instanceof Element)) return;
    const summary = event.target.closest('summary');
    const details = summary?.parentElement;
    if (!(details instanceof HTMLDetailsElement) || !event.currentTarget.contains(details)) return;

    event.preventDefault();
    setExpanded(details, !details.open || details.hasAttribute('data-closing'));
  }}>
    {children}
  </section>;
}
