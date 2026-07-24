import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { siteConfig } from "@/content/site-config";
import { getDictionary, type Dictionary } from "@/i18n";
import { hasLocale, locales, type Locale } from "@/i18n/config";
import { absoluteUrl } from "@/lib/seo";
import { buildStructuredData } from "@/lib/structured-data";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Cursor } from "@/components/motion/cursor";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ChatAssistant } from "@/components/chat/chat-assistant";
import "../globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = hasLocale(lang) ? lang : "es";
  const dict: Dictionary = await getDictionary(locale);
  return {
    metadataBase: new URL(absoluteUrl("/")),
    title: {
      default: dict.meta.home.title,
      template: `%s — ${siteConfig.identity.studioName}`,
    },
    description: dict.meta.home.description,
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#121215" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const structuredData = buildStructuredData(lang, dict.meta.home.description, {
    jobTitle: dict.about.role,
    serviceArea: dict.common.serviceArea,
  });

  return (
    <html lang={lang} className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-cobalt focus:px-5 focus:py-2.5 focus:text-sm focus:text-porcelain"
        >
          {dict.common.skipToContent}
        </a>
        <SmoothScroll />
        <Cursor />
        <Header lang={lang} dict={dict} />
        <main id="main">{children}</main>
        <Footer lang={lang} dict={dict} />
        <ChatAssistant lang={lang} enabled={process.env.NEXT_PUBLIC_CHATBOT_ENABLED === "true"} />
        <div aria-hidden className="grain-overlay" />
      </body>
    </html>
  );
}
