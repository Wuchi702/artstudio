import Link from 'next/link';
import { Arrow, PhotoFrame, TextLink } from '@/components/ui';
import { InquiryForm } from '@/components/inquiry-form';
import { ProjectCard } from '@/components/project-card';
import { imagery, projects } from '@/data/projects';
import { services, site } from '@/data/site';
import { connection } from 'next/server';
import { webhookTarget } from '@/lib/inquiry';
import { siteUrl } from '@/lib/site-url';
import { pageMetadata } from '@/lib/metadata';

const cover = imagery.light;
export const metadata = pageMetadata('/', 'Дизайн интерьера', site.description, cover);

const homeServices = services.filter(({ id, available }) => available && ['design', 'planning', 'home-staging'].includes(id));
const homeProjects = projects.filter(({ featured }) => featured);
const icons: Record<string, string> = {
  design: 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6',
  planning: 'M4 4h16v16H4zM10 4v9h10M4 15h6v5',
  'home-staging': 'M5 12V8a2 2 0 012-2h10a2 2 0 012 2v4M5 17h14M5 19v-2m14 2v-2M5 17H3v-5h4v2h10v-2h4v5h-2'
};

function ServiceIcon({ name }: { name: string }) {
  return <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".8">
    <path d={icons[name]} />
  </svg>;
}

export default async function Home() {
  const isStatic = process.env.GITHUB_PAGES === '1';
  if (!isStatic) await connection();
  const available = !isStatic && !!siteUrl() && !!webhookTarget(process.env.CONTACT_WEBHOOK_URL);
  return <>
    <section className="studio-hero home-hero" aria-labelledby="hero-title">
      <h1 id="hero-title">{site.name}</h1>
      <p>Дизайн интерьера: от планировки до реализации</p>
      <figure>
        <PhotoFrame photo={cover} sizes="(max-width: 720px) 94vw, (max-width: 1216px) 84vw, 1012px" priority />
        <figcaption>Концепция · интерьерная визуализация</figcaption>
      </figure>
    </section>
    <section className="studio-services" aria-labelledby="services-title">
      <div className="studio-services-heading">
        <h2 id="services-title">Услуги</h2>
        <TextLink href="/services">Все услуги</TextLink>
      </div>
      <div className="studio-service-grid">
        {homeServices.map(({ id, title, description }) => {
          const isDesign = id === 'design';
          return <Link href={`/services#${id}`} key={id} className="studio-service-card" data-service={id}>
            <div className="studio-service-heading">
              <ServiceIcon name={id} />
              <h3>{isDesign ? 'Дизайн интерьера' : title}</h3>
            </div>
            <p>{isDesign ? 'Планировка, визуализация и рабочие чертежи для ремонта.' : description}</p>
            <span className="studio-service-more">Подробнее <Arrow /></span>
          </Link>;
        })}
      </div>
    </section>
    <section className="studio-projects" id="work" aria-labelledby="projects-title">
      <h2 id="projects-title">Портфолио</h2>
      <div className="studio-project-grid">
        {homeProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
      </div>
    </section>
    <div className="studio-bottom">
      <section className="studio-about" aria-labelledby="about-title">
        <h2 id="about-title">Обо мне</h2>
        <PhotoFrame photo={site.designer.portrait ?? imagery.atelier} sizes="(max-width: 720px) 90vw, 35vw" />
        <h3>{site.designer.name || 'Дизайнер интерьера'}</h3>
        <p>{site.designer.bio || 'Начинаю проект с планировки и привычек жильцов. Затем подбираю материалы и свет, которые поддерживают сценарии жизни дома.'}</p>
        <TextLink href="/about">Подробнее обо мне</TextLink>
      </section>
      <section className="studio-contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Обсудим проект</h2>
        <p>Расскажите о пространстве, которое хотите изменить.</p>
        {!available && <p id="form-unavailable">Приём заявок через сайт пока недоступен.</p>}
        <InquiryForm available={available} />
        <Link href="/contact" className="text-link">Контакты <Arrow /></Link>
      </section>
    </div>
  </>;
}
