import {useTranslations} from 'next-intl';

export const dynamic = 'force-static';

export default function PrivacyPage() {
  const t = useTranslations('legal');
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-slate">
      <h1>{t('privacy')}</h1>
      <p>{t('privacyContent')}</p>
    </div>
  );
}

