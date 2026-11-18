'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { Photo } from '@/data/projects';
import { assetPath } from '@/lib/asset-path';
import { wrapIndex } from '@/lib/portfolio';
import { Arrow, PhotoFrame } from './ui';

export function Gallery({ photos, title }: { photos: Photo[]; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const openingButton = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [index, setIndex] = useState(0);
  const [opened, setOpened] = useState(false);
  const change = (direction: number) => setIndex((current) => wrapIndex(current + direction, photos.length));
  const photo = photos[index];

  function open(at: number, button: HTMLButtonElement) {
    openingButton.current = button;
    setIndex(at);
    setOpened(true);
    dialog.current?.showModal();
    closeButton.current?.focus();
  }

  return <>
    <div className="gallery-grid">
      {photos.map((item, at) => <figure key={`${item.src}-${at}`}>
        <button type="button" className="gallery-trigger" onClick={(event) => open(at, event.currentTarget)}
          aria-label={`Открыть изображение ${at + 1}: ${item.alt}`}>
          <PhotoFrame photo={item} sizes={at === 0 ? '(max-width: 720px) 92vw, 88vw' : '(max-width: 720px) 92vw, 44vw'} />
          <span className="gallery-expand"><Arrow /></span>
        </button>
        {item.caption && <figcaption>{item.caption}</figcaption>}
      </figure>)}
    </div>
    <dialog ref={dialog} className="lightbox" aria-label={`Галерея проекта «${title}»`} onClose={() => {
      setOpened(false);
      openingButton.current?.focus();
    }} onKeyDown={(event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        change(event.key === 'ArrowRight' ? 1 : -1);
      }
    }}>
      <div className="lightbox-head">
        <span>{title}</span>
        <button ref={closeButton} type="button" onClick={() => dialog.current?.close()}>Закрыть <span aria-hidden="true">×</span></button>
      </div>
      <div className="lightbox-image"
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
        }}
        onTouchCancel={() => { touchStart.current = null; }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          const touch = event.changedTouches[0];
          if (start && touch) {
            const horizontal = touch.clientX - start.x;
            const vertical = touch.clientY - start.y;
            if (Math.abs(horizontal) > Math.max(45, Math.abs(vertical))) change(horizontal < 0 ? 1 : -1);
          }
          touchStart.current = null;
        }}>
        {opened && photo && <Image key={index} src={assetPath(photo.src)} alt={photo.alt} fill sizes="94vw" />}
      </div>
      <div className="lightbox-footer">
        <button type="button" disabled={photos.length < 2} aria-label="Предыдущее изображение" onClick={() => change(-1)}><Arrow direction="left" /></button>
        <span aria-live="polite">{index + 1} / {photos.length}{photo?.caption && <span className="lightbox-caption">{photo.caption}</span>}</span>
        <button type="button" disabled={photos.length < 2} aria-label="Следующее изображение" onClick={() => change(1)}><Arrow direction="right" /></button>
      </div>
    </dialog>
  </>;
}
