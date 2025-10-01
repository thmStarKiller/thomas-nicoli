import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ServiceCard } from '@/components/ServiceCard';
import { BlurFade } from '@/components/magicui/blur-fade';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });
  const seo = t.raw('seo') as { title: string; description: string };
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'services' });
  const title = t('title');
  const description = t('description');
  const items = t.raw('items') as Array<{ title: string; desc: string }>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <BlurFade delay={0.1}>
        <h1 className="text-3xl font-semibold mb-3">{title}</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">{description}</p>
      </BlurFade>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <BlurFade key={item.title} delay={0.15 + i * 0.05}>
            <ServiceCard title={item.title} desc={item.desc} />
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
