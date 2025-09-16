import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import AboutContent from './about-content';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about');
  const seo = t.raw('seo') as { title: string; description: string };
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default function AboutPage() {
  return <AboutContent />;
}
