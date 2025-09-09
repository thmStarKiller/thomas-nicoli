import type {MetadataRoute} from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || 'http://localhost:3000';
  const routes = ['', '/services', '/work', '/about', '/contact', '/chat', '/privacy', '/terms'];
  const locales: ('en' | 'es')[] = ['en', 'es'];
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const r of routes) {
      entries.push({url: `${base}/${locale}${r}`, lastModified: new Date()});
    }
  }
  return entries;
}

