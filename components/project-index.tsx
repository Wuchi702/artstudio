'use client';

import { useSearchParams } from 'next/navigation';
import type { Project } from '@/data/projects';
import { categoryLabels, filterProjects, type ProjectFilter } from '@/lib/portfolio';
import { ProjectCard } from './project-card';

const categories: [ProjectFilter, string][] = [
  ...Object.entries(categoryLabels) as [ProjectFilter, string][],
  ['concept', 'Концепции']
];

export function ProjectGrid({ projects }: { projects: readonly Project[] }) {
  return <div className="project-grid archive-grid">
    {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} heading="h2" />)}
  </div>;
}

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const available = categories.filter(([key]) => filterProjects(projects, key).length > 0);
  const parameter = useSearchParams().get('category');
  const category = available.find(([key]) => key === parameter)?.[0] ?? 'all';
  const filtered = filterProjects(projects, category);

  function select(next: ProjectFilter) {
    const url = new URL(window.location.href);
    if (next === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', next);
    window.history.pushState(null, '', url);
  }

  return <>
    <div className="filter-bar">
      <div className="filter-options" role="group" aria-label="Категории проектов">
        <button type="button" aria-pressed={category === 'all'} onClick={() => select('all')}>Все проекты</button>
        {available.map(([key, label]) => <button key={key} type="button" aria-pressed={category === key} onClick={() => select(key)}>{label}</button>)}
      </div>
      <span className="filter-count" aria-live="polite">Проектов: {filtered.length}</span>
    </div>
    {filtered.length > 0
      ? <div key={category} className="filtered-enter"><ProjectGrid projects={filtered} /></div>
      : <p className="portfolio-empty">Проекты скоро появятся.</p>}
  </>;
}
