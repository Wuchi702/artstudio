import { editorial } from '@/data/editorial';
import { Endnote, PageLead, TextLink } from '@/components/ui';
import { services } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';

const title = 'Форматы работы';
export const metadata = pageMetadata('/services', 'Услуги', editorial.services.description);

export default function ServicesPage() {
  const hasOffers = services.some(({ available }) => available);
  return <>
    <PageLead title={title} text={editorial.services.intro} />
    <section className="shell services-list" aria-label="Форматы дизайн-работы">
      {!hasOffers && <p className="services-note">Справочник по форматам дизайн-работы. Доступность услуг пока не подтверждена.</p>}
      {services.map((service, index) => <details className="service-item" key={service.id} id={service.id} open={index === 0}>
        <summary>
          <span className="service-title">{service.title}</span>
          <span className="disclosure-mark" aria-hidden="true" />
        </summary>
        <div className="service-body">
          <div><p className="body-copy">{service.description}</p>
            {hasOffers && !service.available && <p className="service-availability">Доступность уточняется.</p>}
          </div>
          <div><h2>Что входит</h2><ul>{service.scope.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h2>Результат</h2><p>{service.outcome}</p>
            <TextLink href={service.available ? `/contact?service=${service.id}` : '/contact'}>
              {service.available ? 'Обсудить услугу' : 'Узнать о доступности'}
            </TextLink>
          </div>
        </div>
      </details>)}
    </section>
    <Endnote title="Расскажите, что хотите изменить." />
  </>;
}
