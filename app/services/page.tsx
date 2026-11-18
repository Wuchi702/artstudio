import { editorial } from '@/data/editorial';
import { Endnote, TextLink } from '@/components/ui';
import { ServiceList } from '@/components/service-list';
import { services } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';

const title = 'Услуги';
export const metadata = pageMetadata('/services', 'Услуги', editorial.services.description);

export default function ServicesPage() {
  const offers = services.filter(({ available }) => available);
  return <div className="services-page">
    <header className="shell services-intro">
      <h1>{title}</h1>
      <p className="body-copy">Работаю по договору. Стоимость и сроки фиксирую до начала проектирования. Возможна поэтапная оплата.</p>
    </header>
    <ServiceList>
      {offers.length === 0 && <p className="services-note">Список услуг будет дополнен после подтверждения форматов работы.</p>}
      {offers.map((service) => <details className="service-item" id={`service-${service.id}`} key={service.id}>
        <summary>
          <span className="service-overview">
            <span className="service-title">{service.title}</span>
            <span className="service-description">{service.description}</span>
          </span>
          <span className="service-toggle">
            <span className="service-toggle-closed">Состав и оплата</span>
            <span className="service-toggle-open">Свернуть</span>
            <span className="service-toggle-chevron" aria-hidden="true" />
          </span>
        </summary>
        <div className="service-panel">
          <div className="service-body service-details">
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
              <p className="service-cost">Стоимость <strong className="service-price">{service.price}</strong></p>
              <h2>Порядок оплаты</h2>
              <ul>{service.payment.map((item) => <li key={item}>{item}</li>)}</ul>
              <TextLink href={`/contact?service=${service.id}`}>Обсудить услугу</TextLink>
            </div>
          </div>
        </div>
      </details>)}
    </ServiceList>
    <Endnote title="Расскажите, что хотите изменить." />
  </div>;
}
