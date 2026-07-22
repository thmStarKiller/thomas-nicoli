import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { getDictionary } from "@/i18n";
import { hasLocale, localePath } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/ui/reveal";
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
    path: "/services",
    title: dict.meta.services.title,
    description: dict.meta.services.description,
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const sp = dict.servicesPage;

  return (
    <>
      <section className="bg-graphite pb-24 pt-40 text-porcelain sm:pb-32 sm:pt-48">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.24em] text-porcelain/50">
            {sp.eyebrow}
          </p>
          <TextReveal
            as="h1"
            text={sp.title}
            className="max-w-4xl font-display text-[clamp(2.4rem,5.5vw,5rem)] font-semibold leading-[1.04] tracking-[-0.02em]"
          />
          <Reveal delay={0.25}>
            <p className="mt-8 max-w-xl text-[15.5px] leading-relaxed text-porcelain/60">
              {sp.intro}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-porcelain py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] space-y-24 px-5 sm:px-8 lg:px-12">
          {dict.services.map((service, i) => (
            <Reveal key={service.slug}>
              <article
                id={service.slug}
                className="grid scroll-mt-28 gap-10 border-t border-graphite/12 pt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20"
              >
                <div>
                  <div className="flex items-baseline gap-5">
                    <span className="font-mono text-[12px] tracking-[0.2em] text-cobalt">
                      0{i + 1}
                    </span>
                    <h2 className="font-display text-[clamp(1.9rem,3.6vw,3.2rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
                      {service.title}
                    </h2>
                  </div>
                  <p className="mt-5 font-display text-xl italic text-graphite/70">
                    {service.tagline}
                  </p>
                  <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-graphite/65">
                    {service.summary}
                  </p>

                  <div className="mt-10 space-y-8">
                    <div>
                      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt">
                        {sp.whoForLabel}
                      </h3>
                      <p className="text-[14.5px] leading-relaxed text-graphite/65">
                        {service.whoFor}
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt">
                        {sp.problemLabel}
                      </h3>
                      <p className="text-[14.5px] leading-relaxed text-graphite/65">
                        {service.problem}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 lg:pt-16">
                  <div className="rounded-2xl border border-graphite/12 bg-porcelain-deep/50 p-7 sm:p-8">
                    <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-graphite/50">
                      {sp.deliverablesLabel}
                    </h3>
                    <ul className="space-y-3">
                      {service.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-3 text-[14.5px] text-graphite/75">
                          <Check className="mt-0.5 size-4 shrink-0 text-cobalt" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-graphite/50">
                      {sp.engagementLabel}
                    </h3>
                    <p className="text-[14.5px] leading-relaxed text-graphite/65">
                      {service.engagement}
                    </p>
                  </div>
                  <Link
                    href={`${localePath(lang, "/contact")}?service=${encodeURIComponent(service.title)}`}
                    className="group inline-flex items-center gap-2 rounded-full bg-graphite px-6 py-3 text-[14px] font-medium text-porcelain transition-colors duration-300 hover:bg-cobalt"
                  >
                    {dict.common.getQuote}
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal>
            <div className="rounded-2xl bg-graphite p-10 text-porcelain sm:p-14">
              <h2 className="font-display text-[clamp(1.7rem,3vw,2.6rem)] font-semibold">
                {sp.ctaTitle}
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-porcelain/60">
                {sp.ctaText}
              </p>
              <Link
                href={localePath(lang, "/contact")}
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-cobalt px-7 py-3.5 text-[14.5px] font-medium text-porcelain transition-colors duration-300 hover:bg-cobalt-bright"
              >
                {sp.ctaButton}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCta lang={lang} dict={dict} />
    </>
  );
}
