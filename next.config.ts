import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Integrate next-intl (App Router)
// Points to the request config that loads messages per-locale
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for micromark module resolution issue
    config.resolve.alias = {
      ...config.resolve.alias,
      'micromark/dev': 'micromark/lib',
    };
    
    return config;
  },
};

export default withNextIntl(nextConfig);
