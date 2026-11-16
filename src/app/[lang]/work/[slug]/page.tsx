import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { hasLocale, localePath, locales } from "@/i18n/config";
import { getSite } from "@/i18n/site";
import { pageMetadata } from "@/lib/seo";
import { FinalCta } from "@/components/sections/final-cta";
import { Headline, Rule } from "@/components/ui/headline";
import { Rise } from "@/components/ui/rise";

export function generateStaticParams() {
  // Slugs are shared across locales.
  const slugs = getSite("en").work.cases.map((item) => item.slug);
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const item = getSite(lang).work.cases.find((entry) => entry.slug === slug);
  if (!item) return {};
  // Name plus what it is, in the page's language. Set as an absolute title:
  // with the site name appended it would run past 60 characters, and the bare
  // name alone is identical in every language.
  const title = `${item.title} | ${item.label}`;
  return {
    ...pageMetadata({
      lang,
      path: `/work/${slug}`,
      title,
      description: `${item.summary} ${item.label}. ${item.status}.`.slice(0, 160),
    }),
    title: { absolute: title },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const site = getSite(lang);
  const cases = site.work.cases;
  const index = cases.findIndex((entry) => entry.slug === slug);
  if (index < 0) notFound();
  const item = cases[index];
  const next = cases[(index + 1) % cases.length];
  const l = site.labels;

  return (
    <>
      <section className="bg-night pb-16 pt-28 text-sand sm:pb-24 sm:pt-36">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <Rise>
            <Link href={localePath(lang, "/work")} className="eyebrow group inline-flex min-h-11 items-center gap-3 text-sand/70 hover:text-sand">
              <ArrowLeft aria-hidden className="size-4 transition-transform duration-500 group-hover:-translate-x-1" />
              {l.back}
            </Link>
          </Rise>
          <Rise className="mt-8 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <p className="eyebrow text-spice-bright">{item.label}</p>
            <p className="eyebrow text-sand/60">
              {item.period} · {item.status}
            </p>
          </Rise>
          <Rule className="mt-5 text-sand" />
          <Headline
            as="h1"
            parts={item.title}
            className="mt-10 max-w-[14ch] text-balance text-[length:var(--text-hero)] leading-[0.92] tracking-[-0.03em] sm:mt-14"
            start={120}
          />
          <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-12">
            <Rise delay={300} className="lg:col-span-6 lg:col-start-7">
              <p className="lead text-pretty text-sand/85">{item.summary}</p>
              {item.href && (
                <Link href={localePath(lang, item.href)} className="cta cta-spice group mt-9 w-full sm:w-auto">
                  {l.tryIt}
                  <ArrowUpRight
                    aria-hidden
                    className="size-[1.25em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              )}
            </Rise>
          </div>
        </div>
      </section>

      <section className="bg-sand py-20 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12">
            <Rise className="lg:col-span-3">
              <h2 className="eyebrow text-spice">{l.context}</h2>
            </Rise>
            <Rise delay={100} className="lg:col-span-8">
              <p className="text-pretty font-display text-[clamp(1.6rem,2.8vw,2.5rem)] leading-[1.16] tracking-[-0.012em]">
                {item.context}
              </p>
            </Rise>
          </div>

          <div className="mt-20 grid gap-x-10 gap-y-6 sm:mt-28 lg:grid-cols-12">
            <Rise className="lg:col-span-3">
              <h2 className="eyebrow text-spice">{l.did}</h2>
            </Rise>
            <ol className="lg:col-span-8">
              {item.did.map((point, i) => (
                <li key={point}>
                  <Rule className="text-night" delay={i * 70} />
                  <Rise delay={i * 70} className="grid grid-cols-[3rem_1fr] items-baseline py-5 text-[18px] leading-snug sm:py-6">
                    <span className="font-display text-[1.05rem] italic text-spice">0{i + 1}</span>
                    <span>{point}</span>
                  </Rise>
                </li>
              ))}
              <li aria-hidden>
                <Rule className="text-night" />
              </li>
            </ol>
          </div>

          <div className="mt-20 grid gap-x-10 gap-y-6 sm:mt-28 lg:grid-cols-12">
            <Rise className="lg:col-span-3">
              <h2 className="eyebrow text-spice">{l.tags}</h2>
            </Rise>
            <Rise delay={100} className="lg:col-span-8">
              <ul className="flex flex-wrap gap-x-8 gap-y-2 font-display text-[clamp(1.3rem,2vw,1.8rem)] leading-tight">
                {item.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </Rise>
          </div>
        </div>
      </section>

      <section className="bg-sand-deep py-20 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-x-10 gap-y-6 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          <Rise className="lg:col-span-3">
            <h2 className="eyebrow text-spice">{l.shows}</h2>
          </Rise>
          <Headline
            as="p"
            parts={item.shows}
            className="text-pretty text-[clamp(1.9rem,3.8vw,3.5rem)] italic leading-[1.08] lg:col-span-9"
            step={30}
          />
        </div>
      </section>

      <section className="bg-night text-sand">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <Link
            href={localePath(lang, `/work/${next.slug}`)}
            className="row-fill group grid grid-cols-12 items-baseline gap-4 py-12 sm:py-16"
          >
            <span className="eyebrow col-span-12 opacity-65 lg:col-span-2">{l.next}</span>
            <span className="row-shift col-span-10 font-display text-[clamp(2.4rem,8vw,8.5rem)] leading-[0.9] tracking-[-0.03em] lg:col-span-9">
              {next.title}
            </span>
            <span className="col-span-2 justify-self-end lg:col-span-1">
              <ArrowUpRight aria-hidden className="row-arrow size-9" strokeWidth={1.1} />
            </span>
          </Link>
          <Rule className="text-sand" />
        </div>
      </section>

      <FinalCta lang={lang} />
    </>
  );
}
