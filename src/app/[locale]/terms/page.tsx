import {useTranslations} from 'next-intl';

export const dynamic = 'force-static';

export default function TermsPage() {
  const t = useTranslations('legal');
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-slate">
      <h1>{t('terms')}</h1>
      <p>{t('termsContent')}</p>
    </div>
  );
}

