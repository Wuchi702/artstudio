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
          <span className="service-price">{service.price}</span>
          <span className="disclosure-mark" aria-hidden="true" />
        </summary>
        <div className="service-body service-details">
          <p className="body-copy">{service.description}</p>
          <div>
            <h2>Что входит в услугу</h2>
            <ol className="service-scope">
              {service.scope.map(({ title, items }) => <li key={title}>
                <h3>{title}</h3>
                <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
              </li>)}
            </ol>
          </div>
          <div className="service-payment">
            <h2>Порядок оплаты</h2>
            <ul>{service.payment.map((item) => <li key={item}>{item}</li>)}</ul>
            <TextLink href={`/contact?service=${service.id}`}>Обсудить услугу</TextLink>
          </div>
        </div>
      </details>)}
    </section>
    <Endnote title="Расскажите, что хотите изменить." />
  </>;
}
