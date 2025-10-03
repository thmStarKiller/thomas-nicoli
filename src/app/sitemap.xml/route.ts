import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const base = process.env.SITE_URL || 'https://thomas-nicoli.com';
  const locales = ['en', 'es'];
  const now = new Date().toISOString();
  
  const routes = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/services', priority: '0.9', changefreq: 'weekly' },
    { path: '/work', priority: '0.8', changefreq: 'weekly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/contact', priority: '0.9', changefreq: 'monthly' },
    { path: '/chat', priority: '0.6', changefreq: 'monthly' },
    { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { path: '/terms', priority: '0.3', changefreq: 'yearly' }
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const locale of locales) {
    for (const route of routes) {
      const url = `${base}/${locale}${route.path}`;
      
      xml += '  <url>\n';
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      
      // Add hreflang alternates
      xml += `    <xhtml:link rel="alternate" hreflang="en" href="${base}/en${route.path}"/>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="es" href="${base}/es${route.path}"/>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${base}/en${route.path}"/>\n`;
      
      xml += '  </url>\n';
    }
  }

  xml += '</urlset>';

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
