import { editorial } from '@/data/editorial';
import { InquiryForm } from '@/components/inquiry-form';
import { services, site } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';
import { webhookTarget } from '@/lib/inquiry';
import { siteUrl } from '@/lib/site-url';
import { connection } from 'next/server';

export const metadata = pageMetadata('/contact', 'Контакты', editorial.contact.description);

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const isStatic = process.env.GITHUB_PAGES === '1';
  if (!isStatic) await connection();
  const query = isStatic ? {} : await searchParams;
  const service = services.find((item) => item.available && item.id === query.service);
  const available = !isStatic && !!siteUrl() && !!webhookTarget(process.env.CONTACT_WEBHOOK_URL);
  const { email, phone, telegram, whatsapp, socials } = site.contacts;

  return <section className="shell contact-layout">
    <div className="contact-copy">
      <p className="eyebrow page-kicker">Контакты</p>
      <h1>{editorial.contact.heading[0]}<br/>{editorial.contact.heading[1]}</h1>
      <p className="body-copy">{editorial.contact.intro}</p>
      {!available && <p className="contact-notice" id="form-unavailable">Приём заявок через сайт пока недоступен.</p>}
      {(email || phone || telegram || whatsapp || socials.length > 0) && <address>
        {email && <a href={`mailto:${email}`}>{email}</a>}
        {phone && <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a>}
        {telegram && <a href={telegram}>Telegram</a>}
        {whatsapp && <a href={whatsapp}>WhatsApp</a>}
        {socials.map(({ label, href }) => <a key={href} href={href}>{label}</a>)}
      </address>}
    </div>
    <InquiryForm key={service?.id ?? 'inquiry'} available={available} service={service?.title} />
  </section>;
}
