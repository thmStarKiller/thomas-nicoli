import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk, Martian_Mono } from "next/font/google";
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
import { RouteCurtain } from "@/components/motion/route-curtain";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ChatLoader } from "@/components/chat/chat-loader";
import "../globals.css";

// Display: Bodoni Moda, a didone with optical sizes and a true italic.
// Text and labels: Hanken Grotesk.
// Chat readouts only: Martian Mono.
// All three are SIL Open Font Licence and are self-hosted by next/font at build time.
// Only the latin files are preloaded. The latin-ext files stay available and
// load on demand through their unicode ranges.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});
const martian = Martian_Mono({
  subsets: ["latin"],
  preload: false,
  variable: "--font-martian",
  display: "swap",
});

/**
 * Runs before paint. Marks the document as scripted so reveal styles apply,
 * then flags animated elements as they enter the viewport, including ones
 * added later by client-side navigation.
 */
const revealScript = `(function(){var d=document,r=d.documentElement;r.classList.add("js");if(!("IntersectionObserver" in window)){return r.classList.remove("js")}var S="[data-rise]:not([data-seen]),[data-lift]:not([data-seen]),[data-words]:not([data-seen]),[data-wipe]:not([data-seen]),[data-draw]:not([data-seen])";var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.setAttribute("data-seen","");io.unobserve(e.target)}})},{rootMargin:"0px 0px 90px 0px",threshold:0});function scan(n){if(!n.querySelectorAll)return;if(n.matches&&n.matches(S))io.observe(n);n.querySelectorAll(S).forEach(function(el){io.observe(el)})}function start(){scan(d.body);new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(scan)})}).observe(d.body,{childList:true,subtree:true})}if(d.body)start();else d.addEventListener("DOMContentLoaded",start)})();`;

/**
 * Decides, before first paint, whether to play the opening curtain: once per
 * browser session and never for visitors who prefer reduced motion.
 */
const introScript = `(function(){try{var r=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(sessionStorage.getItem("tn-intro"))return;sessionStorage.setItem("tn-intro","1");r.classList.add("intro-on");setTimeout(function(){r.classList.remove("intro-on")},2700)}catch(e){}})();`;

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
      template: `%s | ${siteConfig.identity.ownerName}`,
    },
    description: dict.meta.home.description,
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0b0a09" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a09" },
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
    <html lang={lang} className={`${bodoni.variable} ${hanken.variable} ${martian.variable}`}
      suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
        <div aria-hidden className="intro">
          <span className="intro-name font-display">
            <span>{siteConfig.identity.ownerName}</span>
          </span>
        </div>
        <RouteCurtain />
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
        <StickyCta lang={lang} label={getSite(lang).cta.call} />
        <ChatLoader lang={lang} enabled={process.env.NEXT_PUBLIC_CHATBOT_ENABLED === "true"} />
        <div aria-hidden className="grain-overlay" />
      </body>
    </html>
  );
}
