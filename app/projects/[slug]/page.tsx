import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Gallery } from '@/components/gallery';
import { Arrow, PhotoFrame, TextLink } from '@/components/ui';
import { projectPath, projects, projectStatus, projectTitle } from '@/data/projects';
import { pageMetadata } from '@/lib/metadata';
import { categoryLabels } from '@/lib/portfolio';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (project) return pageMetadata(projectPath(project), projectTitle(project), project.description ?? projectTitle(project), project.cover);
}

const copyLabels = { challenge: 'Задача', concept: 'Концепция', solution: 'Решение' } as const;

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  const project = projects[index];
  if (!project) notFound();

  const title = projectTitle(project);
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : undefined;
  const status = projectStatus(project);
  const facts = [
    { key: 'Категория', value: project.category && categoryLabels[project.category] },
    { key: 'Статус', value: status },
    { key: 'Год', value: project.year },
    { key: 'Место', value: project.location },
    { key: 'Площадь', value: project.area ? `${project.area} м²` : undefined }
  ].filter(({ value }) => value !== undefined);
  const sections = project.sections ?? ['challenge', 'concept', 'solution', 'gallery', 'materials', 'floorplan'];

  return <article className={`case-page case-${project.layout ?? 'wide'}`}>
    <div className="shell case-lead">
      <TextLink href="/projects" className="back-link">Все проекты</TextLink>
      <div className="case-heading">
        <h1>{title}</h1>
        {project.description && <p className="body-copy">{project.description}</p>}
      </div>
      {facts.length > 0 && <dl className="case-facts">{facts.map(({ key, value }) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>}
      {project.cover && <figure className="case-cover">
        <PhotoFrame photo={project.cover} sizes="(max-width: 720px) 94vw, 88vw" priority />
        {status === 'Концепция' && <figcaption>Интерьерная визуализация</figcaption>}
      </figure>}
    </div>
    <div className="shell case-content">
      {sections.map((section) => {
        if (section === 'gallery') return project.gallery?.length ? <section className="case-gallery" key={section}>
          <h2>Галерея</h2>
          <Gallery photos={project.gallery} title={title} />
        </section> : null;
        if (section === 'floorplan') return project.floorplan ? <section className="case-plan" key={section}>
          <h2>Планировка</h2>
          <PhotoFrame photo={project.floorplan} sizes="(max-width: 720px) 92vw, 65vw" />
        </section> : null;
        if (section === 'materials') return project.materials?.length || project.palette?.length ? <section className="case-materials" key={section}>
          <h2>Материалы и оттенки</h2>
          <div>
            {!!project.materials?.length && <ul className="materials-list">{project.materials.map((material) => <li key={material}>{material}</li>)}</ul>}
            {!!project.palette?.length && <ul className="palette" aria-label="Палитра проекта">{project.palette.map((color) => <li key={color} style={{ backgroundColor: color }} aria-label={color} />)}</ul>}
          </div>
        </section> : null;
        return project[section] ? <section className="case-copy" key={section}>
          <h2>{copyLabels[section]}</h2>
          <p className="body-copy">{project[section]}</p>
        </section> : null;
      })}
      {!!project.tags?.length && <ul className="case-tags" aria-label="Темы проекта">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
    </div>
    {next && <section className="next-project">
      <Link href={projectPath(next)} className="shell next-project-inner">
        <div><p className="eyebrow">Следующий проект</p><h2>{projectTitle(next)} <Arrow /></h2></div>
        {next.cover && <PhotoFrame photo={next.cover} sizes="(max-width: 720px) 92vw, 32vw" />}
      </Link>
    </section>}
  </article>;
}
