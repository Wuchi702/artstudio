import Link from 'next/link';
import { Arrow, Endnote, PhotoFrame, TextLink } from '@/components/ui';
import { HeroImage } from '@/components/hero-image';
import { ProjectCard } from '@/components/project-card';
import { imagery, projects } from '@/data/projects';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('/', `${site.name} — Дизайнер интерьера`, site.description, site.designer.portrait ?? imagery.garden);

export default function Home() {
  const selected = projects.filter((project) => project.featured);
  return <>
    <section className={site.designer.portrait ? "home-hero home-hero-portrait" : "home-hero"} aria-labelledby="hero-title">
      <HeroImage />
      <div className="shell hero-wrap">
        <div className="hero-content">
          <p className="eyebrow hero-kicker" data-hero-meta><i aria-hidden="true" />{site.designer.name ? `${site.designer.name} / ` : ''}Дизайнер интерьера</p>
          <h1 id="hero-title">
            <span className="hero-line"><span data-hero-line>Интерьеры</span></span>
            <span className="hero-line"><span data-hero-line>с характером<span className="hero-dot">.</span></span></span>
          </h1>
          <p className="hero-description" data-hero-meta>Планировка, материалы и свет для повседневной жизни.</p>
          <Link href="#work" className="hero-cta" data-hero-meta>Смотреть работы<Arrow direction="down" /></Link>
        </div>
        <div className="hero-caption" data-hero-meta>
          <a href="#work" className="down-link" aria-label="Перейти к проектам"><Arrow direction="down" /></a>
          {site.designer.portrait
            ? <Link href="/about"><span>{site.designer.name || 'Об авторе'}</span><span>Познакомиться <Arrow /></span></Link>
            : <Link href="/projects/v-storonu-sada"><span>В сторону сада</span><span>Интерьерная концепция <Arrow /></span></Link>}
        </div>
      </div>
    </section>

    {selected.length > 0 && <section className="shell selected" id="work" aria-labelledby="selected-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow"><i aria-hidden="true" /> Портфолио</p>
          <h2 id="selected-title" data-copy-reveal>Избранное<span className="punctuation">.</span></h2>
        </div>
        <TextLink href="/projects">Все проекты</TextLink>
      </div>
      <div className="project-grid">
        {selected.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
      </div>
    </section>}

    <section className="about-band">
      <div className="shell about-story">
        <figure data-reveal>
          <PhotoFrame photo={site.designer.portrait ?? imagery.atelier} sizes="(max-width: 720px) 92vw, 42vw" />
          {!site.designer.portrait && <figcaption>{imagery.atelier.caption}</figcaption>}
        </figure>
        <div>
          <p className="eyebrow"><i aria-hidden="true" /> Обо мне</p>
          <h2 id="approach" data-copy-reveal>{site.designer.name || 'Мой подход'}<span className="punctuation">.</span></h2>
          <p className="body-copy">Планировку начинаю с привычек жильцов. Затем ищу материалы, которые по-разному читаются вблизи и издалека, и проверяю, как меняет их дневной свет.</p>
          <TextLink href="/about">Познакомиться</TextLink>
        </div>
      </div>
    </section>
    <Endnote title="Начнём с вашего пространства." />
  </>;
}
