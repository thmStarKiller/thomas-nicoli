import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/content/site-config";
import { hasLocale, type Locale } from "@/i18n/config";
import { getSite, type Offer, type SiteCopy } from "@/i18n/site";
import { pageMetadata } from "@/lib/seo";
import { buildFaqData, buildServiceData } from "@/lib/structured-data";
import { AuditFeature } from "@/components/sections/audit-feature";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { CtaLink } from "@/components/ui/cta-link";
import { Headline, Rule } from "@/components/ui/headline";
import { PageHero } from "@/components/ui/page-hero";
import { Rise } from "@/components/ui/rise";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getSite(lang).business;
  return pageMetadata({ lang, path: "/business", title: meta.title, description: meta.description });
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const site = getSite(lang);
  const b = site.business;
  const a = b.assistants;
  const showPrices = siteConfig.features.showPrices;

  const audit = site.home.audit;
  const serviceData = buildServiceData(
    lang,
    { name: audit.title.join("").replace(/\.$/, ""), description: audit.text, price: audit.price },
    [...b.build.offers, ...b.websites.offers].map((offer) => ({ slug: offer.slug, name: offer.name, description: offer.line })),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqData(b.faq.items)) }}
      />
      <PageHero eyebrow={b.hero.eyebrow} title={b.hero.title} intro={b.hero.intro}>
        <CtaLink lang={lang} service="ai-opportunity-audit" className="w-full sm:w-auto">
          {site.home.hero.secondary}
        </CtaLink>
      </PageHero>

      {/* The three steps, as a band that closes the hero */}
      <section className="bg-night pb-20 text-sand sm:pb-28">
        <ol className="mx-auto grid max-w-[1440px] gap-x-10 px-5 sm:px-8 md:grid-cols-3 lg:px-12">
          {b.steps.map((step, i) => (
            <li key={step.name}>
              <Rule className="text-sand" delay={i * 120} />
              <Rise delay={i * 120} className="py-7">
                <p className="font-display text-[1.3rem] text-spice-bright">{step.numeral}</p>
                <h2 className="mt-3 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-tight">{step.name}</h2>
                <p className="mt-3 max-w-[26rem] text-[17px] leading-relaxed text-sand/75">{step.text}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>

      {/* Lead service: AI Office Assistants */}
      <section id="assistants" className="scroll-mt-20 bg-sand py-24 sm:py-36">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-12">
            <Rise className="lg:col-span-3">
              <p className="eyebrow text-spice">{a.eyebrow}</p>
              <p className="mt-4 max-w-[16rem] font-display text-[1.3rem] italic leading-snug text-night/80">{a.tagline}</p>
            </Rise>
            <div className="lg:col-span-9">
              <Headline parts={a.title} className="text-balance text-[length:var(--text-h2)] leading-[1.02]" />
              <Rise delay={150}>
                <div className="mt-8 max-w-[40rem] space-y-5">
                  {a.paragraphs.map((paragraph, i) => (
                    <p key={i} className={i === 0 ? "lead text-pretty text-night/90" : "text-pretty text-[18px] leading-relaxed text-night/85"}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Rise>
            </div>
          </div>

          <div className="mt-20 sm:mt-28">
            <Rise>
              <p className="eyebrow text-spice">{a.howTitle}</p>
            </Rise>
            <ol className="mt-6 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
              {a.how.map((step, i) => (
                <li key={step.name} className="border-t border-night/20 py-6">
                  <p className="font-display text-[1.05rem] italic text-spice">0{i + 1}</p>
                  <h3 className="mt-2 font-display text-[1.6rem] leading-tight">{step.name}</h3>
                  <p className="mt-3 text-[16.5px] leading-relaxed text-night/85">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Rise>
              <p className="eyebrow text-spice">{a.problemsTitle}</p>
              <ul className="mt-4">
                {a.problems.map((item) => (
                  <li key={item} className="border-b border-night/15 py-3 text-[17px] leading-snug last:border-b-0">
                    {item}
                  </li>
                ))}
              </ul>
            </Rise>
            <Rise delay={120}>
              <p className="eyebrow text-spice">{a.benefitsTitle}</p>
              <ul className="mt-4">
                {a.benefits.map((item) => (
                  <li key={item} className="border-b border-night/15 py-3 text-[17px] leading-snug last:border-b-0">
                    {item}
                  </li>
                ))}
              </ul>
            </Rise>
          </div>

          <div className="mt-16 grid gap-10 border-t border-night/20 pt-10 lg:grid-cols-12">
            <Rise className="lg:col-span-7">
              <p className="text-pretty font-display text-[clamp(1.5rem,2.4vw,2.1rem)] leading-snug">{a.compare}</p>
            </Rise>
            <Rise delay={120} className="lg:col-span-4 lg:col-start-9">
              {showPrices && <p className="text-[17px] font-medium leading-relaxed text-night">{a.price}</p>}
              <p className="mt-4 text-[16px] leading-relaxed text-night/80">{a.cta}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <CtaLink lang={lang} tone="spice" className="w-full sm:w-auto">
                  {a.ctaButton}
                </CtaLink>
                <CtaLink lang={lang} tone="night" size="sm" service="administrative-automation-sprint" className="w-full sm:w-auto">
                  {site.cta.question}
                </CtaLink>
              </div>
            </Rise>
          </div>
        </div>
      </section>

      {/* Signals */}
      <section className="bg-sand py-24 sm:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
          <div className="lg:col-span-4">
            <Rise>
              <p className="eyebrow text-spice">{b.signals.eyebrow}</p>
            </Rise>
            <Headline
              parts={b.signals.title}
              className="mt-6 text-balance text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.04]"
            />
          </div>
          <ul className="lg:col-span-7 lg:col-start-6">
            {b.signals.items.map((signal, i) => (
              <li key={signal}>
                <Rule className="text-night" delay={i * 70} />
                <Rise delay={i * 70} className="grid grid-cols-[3.25rem_1fr] items-baseline py-5 sm:py-6">
                  <span className="font-display text-[1.05rem] italic text-spice">0{i + 1}</span>
                  <span className="font-display text-[clamp(1.25rem,1.8vw,1.6rem)] leading-[1.25] tracking-[-0.01em]">
                    {signal}
                  </span>
                </Rise>
              </li>
            ))}
            <li aria-hidden>
              <Rule className="text-night" />
            </li>
          </ul>
        </div>
      </section>

      <AuditFeature lang={lang} site={site} eyebrow={`${b.steps[0].numeral}. ${b.steps[0].name}`} />

      {/* Build offers */}
      <section id="build" className="scroll-mt-20 bg-sand py-24 sm:py-36">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-12">
            <Rise className="lg:col-span-3">
              <p className="eyebrow text-spice">{b.build.eyebrow}</p>
            </Rise>
            <div className="lg:col-span-9">
              <Headline parts={b.build.title} className="text-balance text-[length:var(--text-h2)] leading-[1.02]" />
              <Rise delay={150}>
                <p className="lead mt-8 max-w-[38rem] text-pretty text-night/85">{b.build.intro}</p>
              </Rise>
            </div>
          </div>

          <OfferList lang={lang} site={site} offers={b.build.offers} examplesLabel={site.labels.examples} />
        </div>
      </section>

      {/* Websites */}
      <section id="websites" className="scroll-mt-20 bg-sand pb-24 sm:pb-36">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-12">
            <Rise className="lg:col-span-3">
              <p className="eyebrow text-spice">{b.websites.eyebrow}</p>
            </Rise>
            <div className="lg:col-span-9">
              <Headline parts={b.websites.title} className="text-balance text-[length:var(--text-h2)] leading-[1.02]" />
              <Rise delay={150}>
                <p className="lead mt-8 max-w-[38rem] text-pretty text-night/85">{b.websites.intro}</p>
              </Rise>
            </div>
          </div>
          <OfferList lang={lang} site={site} offers={b.websites.offers} examplesLabel={b.websites.examplesLabel} />
        </div>
      </section>

      {/* Monthly support */}
      <section id="support" className="scroll-mt-20 bg-sand-deep py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-7">
            <Rise>
              <p className="eyebrow text-spice">{b.support.eyebrow}</p>
              <h2 className="mt-6 text-balance font-display text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.04]">
                {b.support.title}
              </h2>
              <p className="lead mt-6 max-w-[34rem] text-night/85">{b.support.text}</p>
            </Rise>
          </div>
          <Rise delay={120} className="lg:col-span-4 lg:col-start-9 lg:text-right">
            {showPrices && (
              <p className="flex items-baseline gap-3 lg:justify-end">
                <span className="font-display text-[clamp(3rem,5.4vw,4.8rem)] leading-none">{b.support.price}</span>
                <span className="eyebrow text-night-mute">{b.support.priceNote}</span>
              </p>
            )}
            <CtaLink lang={lang} tone="night" size="sm" service="monthly-support" className="mt-7 w-full sm:w-auto">
              {site.cta.question}
            </CtaLink>
          </Rise>
          <Rise className="lg:col-span-12">
            <p className="border-t border-night/25 pt-6 text-[17px] text-night/85">{b.support.custom}</p>
          </Rise>
        </div>
      </section>

      {/* Smaller budgets */}
      <section id="small" className="scroll-mt-20 bg-sand py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-12">
            <Rise className="lg:col-span-3">
              <p className="eyebrow text-spice">{b.small.eyebrow}</p>
            </Rise>
            <Rise delay={100} className="lg:col-span-9">
              <h2 className="text-balance font-display text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.04]">{b.small.title}</h2>
              <p className="lead mt-6 max-w-[38rem] text-pretty text-night/85">{b.small.intro}</p>
            </Rise>
          </div>
          <ul className="mt-12 grid gap-x-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
            {b.small.items.map((item) => (
              <li key={item.slug} id={item.slug} className="flex scroll-mt-24 flex-col border-t border-night/20 py-7">
                <h3 className="text-balance font-display text-[1.65rem] leading-[1.1]">{item.name}</h3>
                {showPrices && (
                  <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-display text-[2.4rem] leading-none">{item.price}</span>
                    <span className="eyebrow text-night-mute">{item.priceNote}</span>
                  </p>
                )}
                <p className="mt-4 flex-1 text-[16px] leading-relaxed text-night/85">{item.text}</p>
                <CtaLink lang={lang} tone="night" size="sm" service={item.slug} className="mt-6 w-full sm:w-auto sm:self-start">
                  {site.cta.question}
                </CtaLink>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[44rem] border-t border-night/20 pt-6 text-[15.5px] leading-relaxed text-night-mute">{b.small.hourly}</p>
        </div>
      </section>

      {/* Limits */}
      <section className="bg-night py-24 text-sand sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
          <div className="lg:col-span-4">
            <Rise>
              <p className="eyebrow text-spice-bright">{b.limits.eyebrow}</p>
            </Rise>
            <Headline
              parts={b.limits.title}
              className="mt-6 text-balance text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.04]"
            />
          </div>
          <ul className="lg:col-span-7 lg:col-start-6">
            {b.limits.items.map((item, i) => (
              <li key={item}>
                <Rule className="text-sand" delay={i * 70} />
                <Rise delay={i * 70} className="py-5 font-display text-[clamp(1.3rem,1.9vw,1.7rem)] leading-tight tracking-[-0.01em] sm:py-6">
                  {item}
                </Rise>
              </li>
            ))}
            <li aria-hidden>
              <Rule className="text-sand" />
            </li>
          </ul>
        </div>
      </section>

      <FaqSection
        eyebrow={b.faq.eyebrow}
        title={b.faq.title}
        items={b.faq.items}
        aside={
          <CtaLink lang={lang} tone="night" service="ai-opportunity-audit">
            {site.cta.audit}
          </CtaLink>
        }
      />
      <FinalCta lang={lang} />
    </>
  );
}

/** One numbered list of fixed-price offers, shared by the build and website sections. */
function OfferList({
  lang,
  site,
  offers,
  examplesLabel,
}: {
  lang: Locale;
  site: SiteCopy;
  offers: readonly Offer[];
  examplesLabel: string;
}) {
  const showPrices = siteConfig.features.showPrices;
  return (
    <div className="mt-16 sm:mt-24">
      {offers.map((offer, i) => (
        <article key={offer.slug} id={offer.slug} className="scroll-mt-24">
          <Rule className="text-night" />
          <Rise className="grid gap-x-10 gap-y-8 py-12 sm:py-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-display text-[1.05rem] italic text-spice">0{i + 1}</p>
              <h3 className="mt-3 text-balance font-display text-[clamp(1.9rem,3.2vw,3rem)] leading-[1.04]">
                {offer.name}
              </h3>
              <p className="mt-5 max-w-[30rem] text-[18px] leading-relaxed text-night/85">{offer.line}</p>
            </div>

            <div className="lg:col-span-4">
              <p className="eyebrow text-spice">{site.labels.included}</p>
              <ul className="mt-4">
                {offer.deliverables.map((item) => (
                  <li
                    key={item}
                    className="border-b border-night/15 py-3 text-[17px] leading-snug last:border-b-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              {offer.examples && (
                <p className="mt-5 text-[15.5px] leading-relaxed text-night-mute">
                  <span className="font-semibold text-night">{examplesLabel}: </span>
                  {offer.examples}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-6 lg:col-span-3 lg:items-end lg:text-right">
              <div>
                {showPrices && (
                  <>
                    <p className="font-display text-[clamp(2.6rem,4.4vw,4rem)] leading-none">{offer.price}</p>
                    <p className="eyebrow mt-3 text-night-mute">{offer.priceNote}</p>
                  </>
                )}
                <p className="eyebrow mt-3 text-night">{offer.turnaround}</p>
              </div>
              <CtaLink lang={lang} tone="night" size="sm" service={offer.slug} className="w-full sm:w-auto">
                {site.cta.question}
              </CtaLink>
            </div>
          </Rise>
        </article>
      ))}
      <Rule className="text-night" />
    </div>
  );
}
