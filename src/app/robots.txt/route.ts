import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const base = process.env.SITE_URL || 'https://thomas-nicoli.com';
  
  const robotsTxt = `# Thomas Nicoli Website - Robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /private/

# OpenAI GPTBot - Allow crawling but not training
User-agent: GPTBot
Disallow: /api/

# Common Crawl
User-agent: CCBot
Disallow: /api/

# Sitemap
Sitemap: ${base}/sitemap.xml
Host: ${base}
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
