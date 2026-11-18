import { editorial } from '@/data/editorial';
import { Endnote, PageLead, PhotoFrame } from '@/components/ui';
import { imagery } from '@/data/projects';
import { principles, site } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';

const { about } = editorial;
export const metadata = pageMetadata('/about', 'Обо мне', about.intro);

export default function AboutPage() {
  const { designer } = site;
  return <>
    <PageLead label={designer.name ? 'Обо мне' : undefined} title={designer.name || 'Обо мне'} text={about.intro} />
    <section className="shell about-story" aria-labelledby="about-title">
      <figure data-reveal>
        <PhotoFrame photo={designer.portrait ?? imagery.atelier} sizes="(max-width: 720px) 92vw, 46vw" priority />
        {!designer.portrait && <figcaption>{imagery.atelier.caption}</figcaption>}
      </figure>
      <div>
        <h2 id="about-title" data-copy-reveal>{about.heading[0]}<br/>{about.heading[1]}</h2>
        <p className="body-copy">{designer.bio || about.approach}</p>
        {designer.specialization && <p className="body-copy">{designer.specialization}</p>}
        {designer.experience && <p className="body-copy">{designer.experience}</p>}
      </div>
    </section>
    <section className="shell principle-section" aria-labelledby="principles-title">
      <h2 id="principles-title">Принципы работы</h2>
      <ol className="principle-list">
        {principles.map((item) => <li key={item.title}><h3>{item.title}</h3><p className="body-copy">{item.text}</p></li>)}
      </ol>
    </section>
    <Endnote />
  </>;
}
