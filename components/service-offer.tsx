import { TextLink } from '@/components/ui';
import type { Service } from '@/data/site';

export function ServiceOffer({ service, showTitle }: { service: Service; showTitle: boolean }) {
  return <section className="service-offer">
    {showTitle && <h3>{service.title}</h3>}
    <p className="service-offer-price">{service.price}</p>
    <p>{service.description}</p>
    <details className="service-offer-details">
      <summary>Что входит и как оплатить</summary>
      <ol className="service-scope">
        {service.scope.map(({ title, items }) => <li key={title}>
          <strong>{title}</strong>
          <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
        </li>)}
      </ol>
      <h4>Порядок оплаты</h4>
      <ul>{service.payment.map((item) => <li key={item}>{item}</li>)}</ul>
    </details>
    <TextLink href={`/contact?service=${service.id}`}>Обсудить услугу</TextLink>
  </section>;
}
