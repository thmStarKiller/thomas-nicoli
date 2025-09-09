import {useTranslations} from 'next-intl';
import {ServiceCard} from '@/components/ServiceCard';

export const dynamic = 'force-static';

export default function ServicesPage() {
  const t = useTranslations('services');
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">{t('title')}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({length: 6}).map((_, i) => (
          <ServiceCard key={i} title={t(`items.${i}.title`)} desc={t(`items.${i}.desc`)} />
        ))}
      </div>
    </div>
  );
}
