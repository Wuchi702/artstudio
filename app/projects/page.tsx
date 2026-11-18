import { editorial } from '@/data/editorial';
import { Endnote, PageLead } from '@/components/ui';
import { ProjectCard } from '@/components/project-card';
import { projects } from '@/data/projects';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('/projects', 'Проекты', editorial.projects.description);

export default function ProjectsPage() {
  return <>
    <PageLead title="Проекты" text={'Интерьерные визуализации из портфолио автора.'} />
    <section className="shell archive" aria-label="Портфолио">
      <div className="project-grid archive-grid">
        {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} heading="h2" />)}
      </div>
    </section>
    <Endnote />
  </>;
}
