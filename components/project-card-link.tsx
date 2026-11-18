'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export function ProjectCardLink({ href, children }: { href: string; children: ReactNode }) {
  const router = useRouter();
  const prefetch = () => router.prefetch(href);

  return <Link href={href} className="project-card-link" prefetch={false} onMouseEnter={prefetch} onFocus={prefetch}>
    {children}
  </Link>;
}
