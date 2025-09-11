"use client";
import {useTranslations} from 'next-intl';
import {ServiceCard} from '@/components/ServiceCard';
import {BlurFade} from '@/components/magicui/blur-fade';

export default function ServicesPage() {
  const t = useTranslations('services');
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <BlurFade delay={0.1}>
        <h1 className="text-3xl font-semibold mb-6">{t('title')}</h1>
      </BlurFade>
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({length: 6}).map((_, i) => (
          <BlurFade key={i} delay={0.15 + i * 0.05}>
            <ServiceCard title={t(`items.${i}.title`)} desc={t(`items.${i}.desc`)} />
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
