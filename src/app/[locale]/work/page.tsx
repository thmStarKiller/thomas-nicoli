"use client";
import {useTranslations} from 'next-intl';
import {BlurFade} from '@/components/magicui/blur-fade';

export default function WorkPage() {
  const t = useTranslations('work');
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <BlurFade delay={0.1}>
        <h1 className="text-3xl font-semibold mb-6">{t('title')}</h1>
      </BlurFade>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((n, i) => (
          <BlurFade key={n} delay={0.15 + i * 0.05}>
            <div className="rounded-2xl overflow-hidden border border-border bg-card">
              <img src={`/images/placeholders/case-${n}.svg`} alt="Case study placeholder" className="w-full" />
              <div className="p-4">
                <h3 className="font-medium text-foreground">{t(`tiles.${i}.title`)}</h3>
                <p className="text-sm text-muted-foreground">{t(`tiles.${i}.result`)}</p>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
