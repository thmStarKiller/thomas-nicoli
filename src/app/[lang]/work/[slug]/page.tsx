import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { getDictionary } from "@/i18n";
import { hasLocale, localePath, locales } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

const COVERS: Record<string, string> = {
  "aurea-studio": "/visuals/concept-aurea.svg",
  "casa-nomada": "/visuals/concept-casa.svg",
  "atelier-vela": "/visuals/concept-atelier.svg",
};

export function generateStaticParams() {
  // Slugs are shared across locales (fictional brand names).
  return locales.flatMap((lang) =>
    ["aurea-studio", "casa-nomada", "atelier-vela"].map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const study = dict.conceptStudies.find((s) => s.slug === slug);
  if (!study) return {};
  return pageMetadata({
    lang,
    path: `/work/${slug}`,
    title: `${study.name} — ${dict.common.conceptStudy}`,
    description: study.summary,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const study = dict.conceptStudies.find((s) => s.slug === slug);
  if (!study) notFound();

  const blocks = [
    { label: dict.workPage.contextLabel, text: study.brief },
    {
      label: dict.workPage.challengeLabel,
      text: `${study.audience} ${study.challenge}`,
    },
    { label: dict.workPage.roleLabel, text: study.role },
    {
      label: dict.workPage.processLabel,
      text: `${study.direction} ${study.process}`,
    },
    { label: dict.workPage.solutionLabel, text: study.solution },
    { label: dict.workPage.outcomeLabel, text: study.outcome },
  ];

  return (
    <>
      <section className="bg-graphite pb-20 pt-36 text-porcelain sm:pb-28 sm:pt-44">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <Link
              href={localePath(lang, "/work")}
              className="group mb-12 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-porcelain/50 hover:text-porcelain"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
              {dict.common.backToWork}
            </Link>
          </Reveal>
          <div className="flex flex-wrap items-center gap-4">
            <Badge tone="concept">{dict.common.conceptStudy}</Badge>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-porcelain/50">
              {study.sector}
            </span>
          </div>
          <TextReveal
            as="h1"
            text={study.name}
            className="mt-6 font-display text-[clamp(3rem,8vw,7.5rem)] font-semibold leading-[1.0] tracking-[-0.02em]"
          />
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-porcelain/60">
              {study.summary}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-graphite pb-24 text-porcelain">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="overflow-hidden rounded-2xl">
              <Image
                src={COVERS[study.slug]}
                alt={study.coverAlt}
                width={800}
                height={600}
                priority
                className="aspect-[21/10] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-porcelain py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="space-y-16">
            {blocks.map((block, i) => (
              <Reveal key={block.label} delay={i * 0.05}>
                <div className="grid gap-5 border-t border-graphite/12 pt-10 lg:grid-cols-[280px_1fr] lg:gap-16">
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt">
                    {block.label}
                  </h2>
                  <p className="max-w-2xl text-[15.5px] leading-relaxed text-graphite/70">
                    {block.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="rounded-2xl border border-graphite/12 bg-porcelain-deep/50 p-8">
                <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-graphite/50">
                  {dict.common.includes}
                </h2>
                <ul className="space-y-3">
                  {study.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-[14.5px] text-graphite/75">
                      <Check className="mt-0.5 size-4 shrink-0 text-cobalt" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="rounded-2xl bg-graphite p-8 text-porcelain">
                <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-porcelain/50">
                  {dict.common.demonstrates}
                </h2>
                <ul className="space-y-4">
                  {study.demonstrates.map((d) => (
                    <li
                      key={d}
                      className="border-l-2 border-cobalt-bright pl-4 text-[14.5px] leading-relaxed text-porcelain/75"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-20">
            <div className="flex flex-wrap items-center justify-between gap-6 border-t border-graphite/12 pt-10">
              <div>
                <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-graphite/50">
                  {dict.common.relatedServices}
                </h2>
                <ul className="flex flex-wrap gap-2.5">
                  {study.services.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-graphite/15 px-4 py-1.5 text-[13px] text-graphite/65"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={localePath(lang, "/contact")}
                className="group inline-flex items-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-[14.5px] font-medium text-porcelain transition-colors duration-300 hover:bg-cobalt"
              >
                {dict.nav.cta}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
