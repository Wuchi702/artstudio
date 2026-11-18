import { editorial } from '@/data/editorial';
import { Endnote, PageLead, TextLink } from '@/components/ui';
import { services } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';

const title = 'Услуги';
export const metadata = pageMetadata('/services', 'Услуги', editorial.services.description);

export default function ServicesPage() {
  const offers = services.filter(({ available }) => available);
  return <>
    <PageLead title={title} text="Работаю по договору. Стоимость и сроки фиксирую до начала проектирования. Возможна поэтапная оплата." />
    <section className="shell services-list" aria-label="Форматы дизайн-работы">
      {offers.length === 0 && <p className="services-note">Список услуг будет дополнен после подтверждения форматов работы.</p>}
      {offers.map((service, index) => <details className="service-item" key={service.id} id={service.id} open={index === 0 ? true : undefined}>
        <summary>
          <span className="service-title">{service.title}</span>
          <span className="disclosure-mark" aria-hidden="true" />
        </summary>
        <div className="service-body">
          <div><p className="body-copy">{service.description}</p>
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
