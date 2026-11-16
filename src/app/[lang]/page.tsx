import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { hasLocale } from "@/i18n/config";
import { getSite } from "@/i18n/site";
import { pageMetadata } from "@/lib/seo";
import { HomeHero } from "@/components/home/hero";
import { Ticker } from "@/components/home/ticker";
import { Doors, Facts } from "@/components/home/doors";
import { HomeWork, Method } from "@/components/home/sections";
import { AuditFeature } from "@/components/sections/audit-feature";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { CtaLink } from "@/components/ui/cta-link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/",
    title: dict.meta.home.title,
    description: dict.meta.home.description,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const site = getSite(lang);
  const faq = site.home.faq;

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      {/* The hero is pinned inside this wrapper; the bands below slide over it */}
      <div className="relative">
        <HomeHero lang={lang} dict={dict} site={site} />
        <div className="relative z-10">
          <Ticker items={site.home.ticker} />
          <Facts site={site} />
        </div>
      </div>
      <Doors lang={lang} site={site} />
      <AuditFeature lang={lang} site={site} />
      <HomeWork lang={lang} site={site} />
      <Method lang={lang} site={site} />
      <FaqSection
        tone="sand-deep"
        eyebrow={faq.eyebrow}
        title={faq.title}
        items={faq.items}
        aside={
          <CtaLink lang={lang} tone="night" service="other">
            {site.cta.question}
          </CtaLink>
        }
      />
      <FinalCta lang={lang} />
    </>
  );
}
