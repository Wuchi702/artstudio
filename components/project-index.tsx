'use client';

import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { categoryLabels, filterProjects, type Category } from '@/lib/portfolio';
import { ProjectCard } from './project-card';

const categories = Object.entries(categoryLabels) as [Category, string][];

export function ProjectGrid({ projects }: { projects: readonly Project[] }) {
  return <div className="project-grid archive-grid">
    {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} heading="h2" />)}
  </div>;
}

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const allButton = useRef<HTMLButtonElement>(null);
  const parameter = useSearchParams().get('category');
  const category = categories.find(([key]) => key === parameter)?.[0] ?? 'all';
  const filtered = filterProjects(projects, category);

  function select(next: Category | 'all') {
    const url = new URL(window.location.href);
    if (next === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', next);
    window.history.replaceState(null, '', url);
  }

  return <>
    <div className="filter-bar">
      <div className="filter-options" role="group" aria-label="Категории проектов">
        <button ref={allButton} type="button" aria-pressed={category === 'all'} onClick={() => select('all')}>Все проекты</button>
        {categories.map(([key, label]) => <button key={key} type="button" aria-pressed={category === key} onClick={() => select(key)}>{label}</button>)}
      </div>
      <span className="filter-count" aria-live="polite">Проектов: {filtered.length}</span>
    </div>
    {filtered.length > 0
      ? <div key={category} className="filtered-enter"><ProjectGrid projects={filtered} /></div>
      : <div className="portfolio-empty">
          <h2>Проекты этой категории появятся позже.</h2>
          <button className="text-link" type="button" onClick={() => {
            select('all');
            allButton.current?.focus();
          }}>Показать все проекты</button>
        </div>}
  </>;
}
