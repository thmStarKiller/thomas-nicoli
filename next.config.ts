import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Integrate next-intl (App Router)
// Points to the request config that loads messages per-locale
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // You can add more Next.js config here
};

export default withNextIntl(nextConfig);
