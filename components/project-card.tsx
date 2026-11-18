import Link from 'next/link';
import { type Project, projectPath, projectStatus, projectTitle } from '@/data/projects';
import { categoryLabels } from '@/lib/portfolio';
import { Arrow, PhotoFrame } from './ui';

export function ProjectCard({ project, index, heading: Heading = 'h3' }: { project: Project; index: number; heading?: 'h2' | 'h3' }) {
  const title = projectTitle(project);
  return <article className={`project-card project-card-${project.layout ?? 'landscape'}`} data-reveal>
    <Link href={projectPath(project)} className="project-card-link">
      {project.cover && <div className="project-visual"><PhotoFrame photo={project.cover} className="project-card-photo"
        sizes={Heading === 'h2' ? '(max-width: 720px) 92vw, (max-width: 1216px) 44vw, 500px' : '(max-width: 720px) 45vw, (max-width: 1216px) 18vw, 184px'} />
        <span className="project-hover" aria-hidden="true">Смотреть проект <Arrow /></span>
      </div>}
      <div className="project-card-caption">
        <span className="project-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <div>
          <Heading>{title}</Heading>
          <p>{[project.category ? categoryLabels[project.category] : null, projectStatus(project)].filter(Boolean).join(' / ')}</p>
        </div>
        <Arrow />
      </div>
    </Link>
  </article>;
}
