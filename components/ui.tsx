import Image from 'next/image';
import Link from 'next/link';
import { preload } from 'react-dom';
import type { Photo } from '@/data/projects';
import { assetPath, imageSourceSet } from '@/lib/asset-path';
import { site } from '@/data/site';

export function Arrow({ direction = 'diagonal' }: { direction?: 'right' | 'left' | 'down' | 'diagonal' }) {
  return <svg aria-hidden="true" className={`arrow arrow-${direction}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
    {direction === 'diagonal' ? <path d="M6 18 18 6M7 6h11v11" /> : <path d="M3 12h17m-7-7 7 7-7 7" />}
  </svg>;
}

export function Wordmark() {
  return <Link href="/" className="wordmark" aria-label={`${site.name} — главная`}>
    <span>{site.wordmark[0]}</span>
    <span>{site.wordmark[1]}</span>
  </Link>;
}

export function PhotoFrame({ photo, className = '', sizes, priority = false, eager = false }: {
  photo: Photo; className?: string; sizes: string; priority?: boolean; eager?: boolean;
}) {
  const src = assetPath(photo.src);
  const srcSet = imageSourceSet(src, photo.widths);

  if (priority && srcSet) {
    preload(src, { as: 'image', imageSrcSet: srcSet, imageSizes: sizes, fetchPriority: 'high' });
  }

  const image = <Image src={src} alt={photo.alt} fill sizes={sizes} quality={priority ? 85 : 75}
    unoptimized={srcSet ? true : undefined} preload={priority && !srcSet}
    loading={eager || (priority && srcSet) ? 'eager' : undefined} fetchPriority={eager ? 'high' : undefined}
    style={{ objectPosition: photo.position }} />;

  return <span className={`photo-frame ${className}`}>
    {srcSet ? <picture><source srcSet={srcSet} sizes={sizes} />{image}</picture> : image}
  </span>;
}

export function TextLink({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) {
  return <Link href={href} className={`text-link ${className}`}>{children}<Arrow /></Link>;
}

export function PageLead({ label, title, text }: { label?: string; title: string; text?: string }) {
  return <div className="shell page-lead">
    {label && <p className="eyebrow page-kicker">{label}</p>}
    <h1>{title}</h1>
    {text && <p className="body-copy">{text}</p>}
  </div>;
}

export function Endnote({ title = 'С чего начнётся ваш интерьер?' }: { title?: string }) {
  return <section className="endnote">
    <div className="shell endnote-inner">
      <h2>{title}</h2>
      <TextLink href="/contact">{site.cta}</TextLink>
    </div>
  </section>;
}
