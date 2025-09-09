import {useTranslations} from 'next-intl';

export const dynamic = 'force-static';

export default function PrivacyPage() {
  const t = useTranslations('legal');
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-slate">
      <h1>{t('privacy')}</h1>
      <p>This website collects minimal personal data. Contact submissions are used solely to respond to your inquiry.</p>
      <p>No tracking runs without consent. You can request deletion at any time.</p>
    </div>
  );
}

