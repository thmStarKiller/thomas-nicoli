import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Inter, Space_Grotesk} from 'next/font/google';
import {ReactNode} from 'react';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {Analytics} from '@/components/Analytics';

const inter = Inter({subsets: ['latin'], variable: '--font-inter'});
const space = Space_Grotesk({subsets: ['latin'], variable: '--font-space'});

const siteUrl = process.env.SITE_URL || 'https://thomas-nicoli.com';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'metadata'});
  
  const localeMap: Record<string, string> = {
    en: 'en_US',
    es: 'es_ES'
  };
  
  return {
    title: {
      default: t('title'),
      template: `%s | ${t('siteName')}`
    },
    description: t('description'),
    openGraph: {
      locale: localeMap[locale] || 'en_US',
      alternateLocale: locale === 'en' ? ['es_ES'] : ['en_US'],
      url: `${siteUrl}/${locale}`,
      title: t('title'),
      description: t('description'),
      siteName: t('siteName'),
      type: 'website',
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        'en': `${siteUrl}/en`,
        'es': `${siteUrl}/es`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  let messages;
  try {
    messages = (await import(`@/i18n/${locale}.json`)).default;
  } catch {
    notFound();
  }
  return (
    <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
      <div className={`${inter.variable} ${space.variable} min-h-screen flex flex-col`} suppressHydrationWarning>
        {/* Enhanced JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${siteUrl}/#organization`,
                  name: 'Thomas Nicoli',
                  url: siteUrl,
                  logo: {
                    '@type': 'ImageObject',
                    url: `${siteUrl}/images/placeholders/og-default.svg`
                  },
                  description: 'AI consulting and web development for commerce that actually ships.',
                  founder: [
                    {
                      '@type': 'Person',
                      name: 'Thomas Nicoli',
                      jobTitle: 'AI Consultant & Web Developer'
                    },
                    {
                      '@type': 'Person',
                      name: 'Virginia Nicoli',
                      jobTitle: 'Strategy & Editorial Partner'
                    }
                  ],
                  knowsAbout: ['AI Consulting', 'Web Development', 'Digital Transformation', 'Machine Learning', 'eCommerce Solutions'],
                  areaServed: 'Worldwide',
                  serviceType: ['AI Consulting', 'Web Development', 'Digital Strategy']
                },
                {
                  '@type': 'WebSite',
                  '@id': `${siteUrl}/#website`,
                  url: siteUrl,
                  name: 'Thomas Nicoli',
                  description: 'AI consulting and web development for commerce that actually ships.',
                  publisher: {
                    '@id': `${siteUrl}/#organization`
                  },
                  inLanguage: [locale === 'en' ? 'en-US' : 'es-ES'],
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: `${siteUrl}/${locale}/chat?q={search_term_string}`
                    },
                    'query-input': 'required name=search_term_string'
                  }
                }
              ]
            })
          }}
        />
        <Analytics />
        <Header />
        <main id="content" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}

// Ensure both locales are statically generated so client switches re-render correctly
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}
