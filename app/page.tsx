import Link from 'next/link';
import { Arrow, Endnote, PhotoFrame, TextLink } from '@/components/ui';
import { HeroImage } from '@/components/hero-image';
import { ProjectCard } from '@/components/project-card';
import { editorial } from '@/data/editorial';
import { imagery, projects } from '@/data/projects';
import { services, site } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('/', 'Дизайн интерьера', site.description, imagery.hero);

export default function Home() {
  const { home } = editorial;
  const selected = projects.filter((project) => project.featured);
  const activeServices = services.filter((service) => service.available);
  const servicePreview = (activeServices.length ? activeServices : services).slice(0, 3);
  return <>
    <section className="home-hero" aria-labelledby="hero-title">
      <HeroImage />
      <div className="shell hero-wrap">
        <div className="hero-content">
          <p className="eyebrow hero-kicker" data-enter>Авторский дизайн интерьера</p>
          <h1 id="hero-title" data-enter>{home.headline[0]}<br/><em>{home.headline[1]}</em></h1>
          <p className="hero-description" data-enter>{home.description}</p>
          <Link href="/projects" className="hero-cta" data-enter>Смотреть проекты<Arrow /></Link>
        </div>
        <div className="hero-caption">
          <Link href="#approach" className="down-link" aria-label="Перейти к авторскому подходу"><Arrow direction="down" /></Link>
          <div><span>Дом тихого света</span><span>Интерьерная визуализация</span></div>
        </div>
      </div>
    </section>

    <section className="shell intro" id="approach">
      <p className="eyebrow section-marker">Авторский подход</p>
      <div>
        <h2>{home.approachTitle[0]}<br className="desktop-break" /> {home.approachTitle[1]}</h2>
        <p className="body-copy">{home.approach}</p>
        <TextLink href="/about">О моём подходе</TextLink>
      </div>
    </section>

    {selected.length > 0 && <section className="shell selected" aria-labelledby="selected-title">
      <div className="section-heading">
        <h2 id="selected-title">Избранные проекты</h2>
        <TextLink href="/projects">Все проекты</TextLink>
      </div>
      <div className="project-grid">
        {selected.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
      </div>
    </section>}

    <section className="philosophy">
      <div className="shell philosophy-grid">
        <div className="philosophy-text">
          <p className="eyebrow">Материал и свет</p>
          <h2>{home.philosophyTitle[0]}<br/>{home.philosophyTitle[1]}</h2>
          <p className="body-copy">{home.philosophy}</p>
        </div>
        <figure data-reveal>
          <PhotoFrame photo={imagery.detail} sizes="(max-width: 720px) 92vw, 35vw" />
          <figcaption>Травертин и керамика / Визуализация</figcaption>
        </figure>
      </div>
    </section>

    <section className="shell working">
      <figure data-reveal>
        <PhotoFrame photo={imagery.atelier} sizes="(max-width: 720px) 92vw, 36vw" />
        <figcaption>{imagery.atelier.caption}</figcaption>
      </figure>
      <div className="working-copy">
        <h2>{home.workTitle[0]}<br className="desktop-break" /> {home.workTitle[1]}</h2>
        <div className="working-links">
          <TextLink href="/about">{site.designer.name || 'Обо мне'}</TextLink>
          <TextLink href="/services">{activeServices.length ? 'Услуги' : 'Форматы дизайн-работы'}</TextLink>
        </div>
        {servicePreview.length > 0 && <div className="working-services">
          <ul aria-label="Форматы дизайн-работы">{servicePreview.map(({ id, title }) =>
            <li key={id}><Link href={`/services#${id}`}>{title}</Link></li>
          )}</ul>
        </div>}
      </div>
    </section>
    <Endnote />
  </>;
}
