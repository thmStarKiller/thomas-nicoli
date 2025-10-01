import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'es',
  localePrefix: 'always'
});

export const config = {
  matcher: ['/', '/(en|es)/:path*']
};

// Specify edge runtime for Cloudflare compatibility
export const runtime = 'edge';

