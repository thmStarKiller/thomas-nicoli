import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal');
  const seo = t.raw('termsSeo') as { title: string; description: string };
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default async function TermsPage() {
  const t = await getTranslations('legal');
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-slate">
      <h1>{t('terms')}</h1>
      <p>{t('termsContent')}</p>
    </div>
  );
}
