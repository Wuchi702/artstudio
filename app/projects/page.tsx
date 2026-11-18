import { editorial } from '@/data/editorial';
import { Suspense } from 'react';
import { Endnote, PageLead } from '@/components/ui';
import { ProjectGrid, ProjectIndex } from '@/components/project-index';
import { projects } from '@/data/projects';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('/projects', 'Проекты', editorial.projects.description);

export default function ProjectsPage() {
  return <>
    <PageLead title="Проекты" text={'Интерьерные визуализации из портфолио автора.'} />
    <section className="shell archive" aria-label="Портфолио">
      <Suspense fallback={<ProjectGrid projects={projects} />}>
        <ProjectIndex projects={projects} />
      </Suspense>
    </section>
    <Endnote />
  </>;
}
