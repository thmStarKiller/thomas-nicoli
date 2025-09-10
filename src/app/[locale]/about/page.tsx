import {useTranslations} from 'next-intl';

export const dynamic = 'force-static';

export default function AboutPage() {
  const t = useTranslations('about');
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-8 items-start">
      <div>
        <h1 className="text-3xl font-semibold mb-4">{t('title')}</h1>
        <p className="text-slate-700 dark:text-white leading-relaxed">{t('bio')}</p>
      </div>
      <div>
        <img src="/images/placeholders/about-portrait.svg" alt="Portrait placeholder" className="w-full h-auto" />
      </div>
    </div>
  );
}

