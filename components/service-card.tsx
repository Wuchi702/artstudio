'use client';

import { useRef, type ReactNode } from 'react';

export function ServiceCard({ id, title, preview, children }: {
  id: string;
  title: string;
  preview: ReactNode;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  return <>
    <button type="button" className="studio-service-card" data-service={id}
      aria-haspopup="dialog" aria-controls={`service-${id}`} onClick={() => dialog.current?.showModal()}>
      {preview}
    </button>
    <dialog ref={dialog} className="service-dialog" id={`service-${id}`}
      aria-labelledby={`service-title-${id}`} onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}>
      <div className="service-dialog-inner">
        <header className="service-dialog-header">
          <h2 id={`service-title-${id}`}>{title}</h2>
          <form method="dialog">
            <button type="submit" className="service-dialog-close" aria-label="Закрыть">×</button>
          </form>
        </header>
        {children}
      </div>
    </dialog>
  </>;
}
