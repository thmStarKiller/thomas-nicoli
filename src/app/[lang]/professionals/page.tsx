import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getSite } from "@/i18n/site";
import { pageMetadata } from "@/lib/seo";
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
  const { meta } = getSite(lang).professionals;
  return pageMetadata({ lang, path: "/professionals", title: meta.title, description: meta.description });
}

export default async function ProfessionalsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const site = getSite(lang);
  const p = site.professionals;

  return (
    <>
      <PageHero eyebrow={p.hero.eyebrow} title={p.hero.title} intro={p.hero.intro}>
        <CtaLink lang={lang} service="ai-training" className="w-full sm:w-auto">
          {site.cta.question}
        </CtaLink>
      </PageHero>

      {/* Modules */}
      <section className="bg-sand py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          {p.modules.map((module) => (
            <article key={module.numeral}>
              <Rule className="text-night" />
              <div className="grid gap-x-10 gap-y-8 py-14 sm:py-20 lg:grid-cols-12">
                <Rise className="lg:col-span-5">
                  <p className="font-display text-[clamp(3.5rem,7vw,6.5rem)] italic leading-[0.8] text-spice">
                    {module.numeral}
                  </p>
                  <h2 className="mt-8 text-balance font-display text-[clamp(1.9rem,3.2vw,3rem)] leading-[1.04]">
                    {module.title}
                  </h2>
                  <p className="eyebrow mt-5 text-night">{module.duration}</p>
                </Rise>
                <Rise delay={120} className="lg:col-span-6 lg:col-start-7">
                  <p className="lead text-pretty text-night/90">{module.objective}</p>
                  <ol className="mt-8">
                    {module.contents.map((item, i) => (
                      <li
                        key={item}
                        className="grid grid-cols-[2.5rem_1fr] items-baseline gap-2 border-t border-night/15 py-4 text-[17px] leading-snug"
                      >
                        <span className="font-display text-[1.05rem] italic text-spice">0{i + 1}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="border-t border-night/15 pt-5 text-[16px] leading-relaxed text-night-mute">
                    {module.note}
                  </p>
                </Rise>
              </div>
            </article>
          ))}
          <Rule className="text-night" />
        </div>
      </section>

      {/* Practical details */}
      <section className="bg-sand-deep py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
          <div className="lg:col-span-4">
            <Rise>
              <p className="eyebrow text-spice">{p.practical.eyebrow}</p>
              <h2 className="mt-6 text-balance font-display text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.04]">
                {p.practical.title}
              </h2>
            </Rise>
            <Rise delay={150} className="mt-9">
              <CtaLink lang={lang} tone="night" service="ai-training" className="w-full sm:w-auto">
                {site.cta.question}
              </CtaLink>
            </Rise>
          </div>
          <dl className="lg:col-span-7 lg:col-start-6">
            {p.practical.items.map((item, i) => (
              <Rise key={item.label} delay={i * 60}>
                <div className="grid gap-2 border-t border-night/25 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <dt className="eyebrow pt-1 text-spice">{item.label}</dt>
                  <dd className="text-[18px] leading-snug">{item.value}</dd>
                </div>
              </Rise>
            ))}
          </dl>
        </div>
      </section>

      {/* Agencies */}
      <section id="agencies" className="scroll-mt-16 bg-night py-24 text-sand sm:py-36">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <Rise>
            <p className="eyebrow text-spice-bright">{p.agencies.eyebrow}</p>
          </Rise>
          <Rule className="mt-5 text-sand" />
          <Headline
            parts={p.agencies.title}
            accentClassName="text-spice-bright"
            className="mt-10 max-w-[20ch] text-balance text-[length:var(--text-h2)] leading-[1.02]"
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <Rise delay={150} className="lg:col-span-6 lg:col-start-7">
              <p className="lead text-pretty text-sand/80">{p.agencies.intro}</p>
            </Rise>
          </div>

          <ol className="mt-16 sm:mt-24">
            {p.agencies.services.map((service, i) => (
              <li key={service.name}>
                <Rule className="text-sand" delay={i * 60} />
                <Rise delay={i * 60} className="grid gap-x-10 gap-y-3 py-7 sm:py-9 lg:grid-cols-12">
                  <span className="font-display text-[1.05rem] italic text-spice-bright lg:col-span-1">0{i + 1}</span>
                  <h3 className="font-display text-[clamp(1.5rem,2.3vw,2.1rem)] leading-tight lg:col-span-5">
                    {service.name}
                  </h3>
                  <p className="max-w-[36rem] text-[17px] leading-relaxed text-sand/75 lg:col-span-6">
                    {service.text}
                  </p>
                </Rise>
              </li>
            ))}
            <li aria-hidden>
              <Rule className="text-sand" />
            </li>
          </ol>

          <div className="mt-16 grid gap-12 sm:mt-20 md:grid-cols-2 lg:gap-20">
            <Rise>
              <h3 className="eyebrow text-spice-bright">{p.agencies.howTitle}</h3>
              <ul className="mt-5">
                {p.agencies.how.map((item) => (
                  <li key={item} className="border-t border-sand/20 py-4 text-[17px] leading-snug text-sand/90">
                    {item}
                  </li>
                ))}
              </ul>
            </Rise>
            <Rise delay={120}>
              <h3 className="eyebrow text-spice-bright">{p.agencies.notTitle}</h3>
              <ul className="mt-5">
                {p.agencies.not.map((item) => (
                  <li key={item} className="border-t border-sand/20 py-4 text-[17px] leading-snug text-sand/90">
                    {item}
                  </li>
                ))}
              </ul>
            </Rise>
          </div>

          <Rise className="mt-14">
            <CtaLink lang={lang} tone="spice" service="agency-content" className="w-full sm:w-auto">
              {p.agencies.cta}
            </CtaLink>
          </Rise>
        </div>
      </section>

      <FaqSection
        eyebrow={p.faq.eyebrow}
        title={p.faq.title}
        items={p.faq.items}
        aside={
          <CtaLink lang={lang} tone="night" service="ai-training">
            {site.cta.question}
          </CtaLink>
        }
      />
      <FinalCta lang={lang} />
    </>
  );
}
