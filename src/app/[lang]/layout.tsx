import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { siteConfig } from "@/content/site-config";
import { getDictionary, type Dictionary } from "@/i18n";
import { hasLocale, locales, type Locale } from "@/i18n/config";
import { getSite } from "@/i18n/site";
import { absoluteUrl } from "@/lib/seo";
import { buildStructuredData } from "@/lib/structured-data";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StickyCta } from "@/components/layout/sticky-cta";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ChatAssistant } from "@/components/chat/chat-assistant";
import "../globals.css";

// Display: Bodoni Moda, a didone with optical sizes and a true italic.
// Text and labels: Hanken Grotesk.
// Both are SIL Open Font Licence and are self-hosted by next/font at build time.
const bodoni = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});
const hanken = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-hanken",
  display: "swap",
});

/**
 * Runs before paint. Marks the document as scripted so reveal styles apply,
 * then flags animated elements as they enter the viewport, including ones
 * added later by client-side navigation.
 */
const revealScript = `(function(){var d=document,r=d.documentElement;r.classList.add("js");if(!("IntersectionObserver" in window)){return r.classList.remove("js")}var S="[data-rise]:not([data-seen]),[data-words]:not([data-seen]),[data-wipe]:not([data-seen]),[data-draw]:not([data-seen])";var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.setAttribute("data-seen","");io.unobserve(e.target)}})},{rootMargin:"0px 0px -8% 0px",threshold:0.05});function scan(n){if(!n.querySelectorAll)return;if(n.matches&&n.matches(S))io.observe(n);n.querySelectorAll(S).forEach(function(el){io.observe(el)})}function start(){scan(d.body);new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(scan)})}).observe(d.body,{childList:true,subtree:true})}if(d.body)start();else d.addEventListener("DOMContentLoaded",start)})();`;

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
      template: `%s | ${siteConfig.identity.studioName}`,
    },
    description: dict.meta.home.description,
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0d0a07" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0a07" },
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
    <html lang={lang} className={`${bodoni.variable} ${hanken.variable}`}
      suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:bg-spice focus:px-5 focus:py-2.5 focus:text-sm focus:text-sand"
        >
          {dict.common.skipToContent}
        </a>
        <SmoothScroll />
        <Header lang={lang} dict={dict} />
        <main id="main">{children}</main>
        <Footer lang={lang} dict={dict} />
        <StickyCta lang={lang} label={getSite(lang).cta.contact} />
        <ChatAssistant lang={lang} enabled={process.env.NEXT_PUBLIC_CHATBOT_ENABLED === "true"} />
        <div aria-hidden className="grain-overlay" />
      </body>
    </html>
  );
}
