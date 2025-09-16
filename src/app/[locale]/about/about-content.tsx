'use client';

import { useLocale, useTranslations } from 'next-intl';

import { BlurFade } from '@/components/magicui/blur-fade';
import { MagicCard } from '@/components/magicui/magic-card';

export default function AboutContent() {
  const locale = useLocale();
  const t = useTranslations('about');

  return (
    <div key={locale} className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-8 items-start">
      <BlurFade delay={0.1}>
        <div>
          <h1 className="text-3xl font-semibold mb-4">{t('title')}</h1>
          <MagicCard className="p-6 bg-card border border-border">
            <p className="text-muted-foreground leading-relaxed">{t('bio')}</p>
          </MagicCard>
        </div>
      </BlurFade>
      <BlurFade delay={0.2}>
        <div>
          <img
            src="/images/placeholders/thomas-card-portrait.jpg"
            alt="Portrait placeholder"
            className="w-full h-auto rounded-xl border border-border"
          />
        </div>
      </BlurFade>
    </div>
  );
}
