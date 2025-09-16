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
    default: 'Thomas & Virginia - Strategy, Editorial, AI',
    template: '%s | Thomas & Virginia'
  },
  description:
    'Clarity-first strategy, bilingual editorial, and AI alignment for modern teams.'
};

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Thomas & Virginia',
              url: 'https://'+(process.env.SITE_URL?.replace(/^https?:\/\//,'') || 'example.com'),
              jobTitle: 'Strategy and AI Partners',
              knowsAbout: ['Strategy', 'Editorial', 'AI alignment', 'Bilingual content']
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
