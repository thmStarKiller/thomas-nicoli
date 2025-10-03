import type {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.SITE_URL || 'https://thomas-nicoli.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      {
        userAgent: 'GPTBot', // OpenAI crawler
        disallow: '/api/',
      },
      {
        userAgent: 'CCBot', // Common Crawl
        disallow: '/api/',
      }
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

