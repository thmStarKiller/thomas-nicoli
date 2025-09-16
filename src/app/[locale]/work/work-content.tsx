'use client';

import { useLocale, useTranslations } from 'next-intl';

import { BlurFade } from '@/components/magicui/blur-fade';

export default function WorkContent() {
  const locale = useLocale();
  const t = useTranslations('work');
  const items = t.raw('tiles') as Array<{ title: string; result?: string; summary?: string }>;

  return (
    <div key={locale} className="mx-auto max-w-6xl px-4 py-12">
      <BlurFade delay={0.1}>
        <h1 className="text-3xl font-semibold mb-3">{t('title')}</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">{t('description')}</p>
      </BlurFade>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((tile, index) => (
          <BlurFade key={tile.title} delay={0.15 + index * 0.05}>
            <div className="rounded-2xl overflow-hidden border border-border bg-card">
              <img
                src={`/images/placeholders/case-${index + 1}.svg`}
                alt={tile.title}
                className="w-full"
              />
              <div className="p-4">
                <h3 className="font-medium text-foreground">{tile.title}</h3>
                <p className="text-sm text-muted-foreground">{tile.summary ?? tile.result}</p>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
