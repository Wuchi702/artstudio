'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export function ProjectCardLink({ href, children }: { href: string; children: ReactNode }) {
  const router = useRouter();
  const timeout = useRef<number | undefined>(undefined);
  const [opening, setOpening] = useState(false);

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  return <Link
    href={href}
    className="project-card-link"
    data-opening={opening || undefined}
    onNavigate={(event) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      event.preventDefault();
      if (timeout.current !== undefined) return;
      setOpening(true);

      timeout.current = window.setTimeout(() => {
        timeout.current = undefined;
        router.push(href);
        setOpening(false);
      }, 180);
    }}
  >{children}</Link>;
}
