import type {MetadataRoute} from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || 'https://thomas-nicoli.com';
  const locales: ('en' | 'es')[] = ['en', 'es'];
  const now = new Date();
  
  // Define routes with their SEO priorities and change frequencies
  const routes = [
    { path: '', priority: 1.0, changefreq: 'daily' as const }, // Homepage - highest priority
    { path: '/services', priority: 0.9, changefreq: 'weekly' as const }, // Important service page
    { path: '/work', priority: 0.8, changefreq: 'weekly' as const }, // Portfolio
    { path: '/about', priority: 0.7, changefreq: 'monthly' as const }, // About page
    { path: '/contact', priority: 0.9, changefreq: 'monthly' as const }, // Contact - important for conversions
    { path: '/chat', priority: 0.6, changefreq: 'monthly' as const }, // AI chat tool
    { path: '/privacy', priority: 0.3, changefreq: 'yearly' as const }, // Legal pages - low priority
    { path: '/terms', priority: 0.3, changefreq: 'yearly' as const }
  ];
  
  const entries: MetadataRoute.Sitemap = [];
  
  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${base}/${locale}${route.path}`,
        lastModified: now,
        changeFrequency: route.changefreq,
        priority: route.priority,
        alternates: {
          languages: {
            en: `${base}/en${route.path}`,
            es: `${base}/es${route.path}`,
          }
        }
      });
    }
  }
  
  return entries;
}

