import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import WorkContent from './work-content';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('work');
  const seo = t.raw('seo') as { title: string; description: string };
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default function WorkPage() {
  return <WorkContent />;
}
