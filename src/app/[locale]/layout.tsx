import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Inter, Space_Grotesk} from 'next/font/google';
import {ReactNode} from 'react';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {Analytics} from '@/components/Analytics';

const inter = Inter({subsets: ['latin'], variable: '--font-inter'});
const space = Space_Grotesk({subsets: ['latin'], variable: '--font-space'});

export const metadata: Metadata = {
  title: {
    default: 'Thomas Nicoli — AI Consulting for E-commerce',
    template: '%s · Thomas Nicoli'
  },
  description:
    'AI consulting for commerce that actually ships. SFCC/SFMC · RAG assistants · audits · automation.'
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  let messages;
  try {
    messages = (await import(`@/i18n/${locale}.json`)).default;
  } catch {
    notFound();
  }
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className={`${inter.variable} ${space.variable} min-h-screen flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Thomas Nicoli',
              url: 'https://'+(process.env.SITE_URL?.replace(/^https?:\/\//,'') || 'example.com'),
              jobTitle: 'AI Consultant',
              knowsAbout: ['SFCC', 'SFMC', 'RAG', 'E-commerce']
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
