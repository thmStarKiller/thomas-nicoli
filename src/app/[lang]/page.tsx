import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/hero";
import { BuyerPaths } from "@/components/sections/buyer-paths";
import { Marquee } from "@/components/motion/marquee";
import { OutcomeStatement } from "@/components/sections/outcome-statement";
import { ServicesOverview } from "@/components/sections/services-overview";
import { FeaturedWork } from "@/components/sections/featured-work";
import { WhyMe } from "@/components/sections/why-me";
import { ProcessSection } from "@/components/sections/process-section";
import { PackagesSection } from "@/components/sections/packages-section";
import { AboutPreview } from "@/components/sections/about-preview";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";

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

  return (
    <>
      <Hero lang={lang} dict={dict} />
      <div data-testid="home-blue-banderole">
        <Marquee
          items={[...dict.hero.marquee]}
          className="border-y border-cobalt-deep/40 bg-cobalt py-4 text-porcelain"
          itemClassName="font-mono text-[12px] uppercase tracking-[0.22em]"
          duration={30}
        />
      </div>
      <BuyerPaths lang={lang} />
      <OutcomeStatement dict={dict} />
      <ServicesOverview lang={lang} dict={dict} />
      <FeaturedWork lang={lang} dict={dict} />
      <WhyMe dict={dict} />
      <ProcessSection dict={dict} />
      <PackagesSection lang={lang} dict={dict} />
      <AboutPreview lang={lang} dict={dict} />
      <FaqSection
        eyebrow={dict.faq.eyebrow}
        title={dict.faq.title}
        items={dict.faq.items}
      />
      <FinalCta lang={lang} dict={dict} />
    </>
  );
}
