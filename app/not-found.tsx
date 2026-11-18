import { PageLead, TextLink } from '@/components/ui';

export default function NotFound() {
  return <>
    <PageLead label="404" title="Страница не найдена" />
    <div className="shell not-found-link"><TextLink href="/projects">Смотреть портфолио</TextLink></div>
  </>;
}
