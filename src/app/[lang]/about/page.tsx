import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/content/site-config";
import { getDictionary } from "@/i18n";
import { hasLocale, localePath } from "@/i18n/config";
import { getSite } from "@/i18n/site";
import { pageMetadata } from "@/lib/seo";
import { Drift } from "@/components/motion/drift";
import { FinalCta } from "@/components/sections/final-cta";
import { CtaLink } from "@/components/ui/cta-link";
import { Headline, Rule } from "@/components/ui/headline";
import { Rise } from "@/components/ui/rise";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII"];

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
    path: "/about",
    title: dict.meta.about.title,
    description: dict.meta.about.description,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const site = getSite(lang);
  const a = dict.about;
  const w = site.work;

  return (
    <>
      {/* Name and portrait */}
      <section className="bg-night text-sand">
        <div className="mx-auto grid max-w-[1440px] lg:min-h-[92svh] lg:grid-cols-12">
          <div className="flex flex-col justify-end px-5 pb-12 pt-32 sm:px-8 sm:pt-40 lg:col-span-7 lg:px-12 lg:pb-16">
            <Rise>
              <p className="eyebrow text-spice-bright">{a.eyebrow}</p>
            </Rise>
            <Headline
              as="h1"
              parts={site.about.title}
              accentClassName="text-spice-bright"
              className="mt-8 text-[clamp(3.6rem,11vw,11.5rem)] leading-[0.86]"
              start={150}
              step={120}
            />
            <Rise delay={500}>
              <p className="eyebrow mt-9 text-sand/70">{a.role}</p>
              <p className="lead mt-6 max-w-[34rem] text-pretty text-sand/85">{a.microBio}</p>
            </Rise>
          </div>
          <div className="relative lg:col-span-5">
            <div
              data-wipe=""
              suppressHydrationWarning
              className="portrait relative aspect-[4/5] overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto"
              style={{ "--d": "250ms" } as React.CSSProperties}
            >
              <Drift className="absolute inset-0" distance={60}>
                <Image
                  src={siteConfig.media.profileImage}
                  alt={a.portraitAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 26%" }}
                />
              </Drift>
            </div>
            <p className="eyebrow absolute bottom-5 left-5 text-sand/85 sm:left-8">{a.locationExperience}</p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-sand py-24 sm:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-x-10 gap-y-10 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          <Rise className="lg:col-span-8">
            <p className="text-pretty font-display text-[clamp(1.7rem,3.1vw,2.8rem)] leading-[1.14] tracking-[-0.012em]">
              {a.intro}
            </p>
          </Rise>
          <div className="space-y-7 text-[18px] leading-relaxed text-night/85 lg:col-span-6 lg:col-start-7">
            <Rise>
              <p>{a.background}</p>
            </Rise>
            <Rise>
              <p>{a.perspective}</p>
            </Rise>
            <Rise>
              <p>{a.next}</p>
            </Rise>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-sand-deep py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-12">
            <Rise className="lg:col-span-3">
              <p className="eyebrow text-spice">{w.experience.eyebrow}</p>
            </Rise>
            <Headline
              parts={w.experience.title}
              className="text-balance text-[length:var(--text-h2)] leading-[1.02] lg:col-span-9"
            />
          </div>
          <ol className="mt-14 sm:mt-20">
            {w.experience.items.map((entry, i) => (
              <li key={entry.title}>
                <Rule className="text-night" delay={i * 90} />
                <Rise delay={i * 90} className="grid gap-x-10 gap-y-3 py-8 sm:py-10 lg:grid-cols-12">
                  <p className="eyebrow pt-2 text-spice lg:col-span-2">{entry.period}</p>
                  <div className="lg:col-span-5">
                    <h3 className="text-balance font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.06]">
                      {entry.title}
                    </h3>
                    <p className="eyebrow mt-3 text-night-mute">{entry.label}</p>
                  </div>
                  <p className="max-w-[34rem] text-[17px] leading-relaxed text-night/85 lg:col-span-5">{entry.text}</p>
                </Rise>
              </li>
            ))}
            <li>
              <Rule className="text-night" />
              <Rise className="grid gap-x-10 gap-y-3 py-8 lg:grid-cols-12">
                <p className="eyebrow pt-1 text-spice lg:col-span-2">{w.education.label}</p>
                <p className="font-display text-[clamp(1.3rem,1.9vw,1.7rem)] leading-tight lg:col-span-10">
                  {w.education.text}
                </p>
              </Rise>
              <Rule className="text-night" />
            </li>
          </ol>
          <Rise className="mt-10">
            <Link href={localePath(lang, "/work")} className="link-line text-night">
              {a.workCta}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Rise>
        </div>
      </section>

      {/* Values */}
      <section className="bg-night py-24 text-sand sm:py-36">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <Rise>
            <p className="eyebrow text-spice-bright">{a.valuesTitle}</p>
          </Rise>
          <ol className="mt-10 grid gap-x-10 md:grid-cols-2">
            {a.values.map((value, i) => (
              <li key={value.name}>
                <Rule className="text-sand" delay={(i % 2) * 100} />
                <Rise delay={(i % 2) * 100} className="py-9 sm:py-11">
                  <p className="font-display text-[1.2rem] text-spice-bright">{NUMERALS[i]}</p>
                  <h3 className="mt-4 font-display text-[clamp(1.9rem,3.2vw,2.9rem)] leading-none">{value.name}</h3>
                  <p className="mt-5 max-w-[30rem] text-[17px] leading-relaxed text-sand/75">{value.text}</p>
                </Rise>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Expertise, rules, languages */}
      <section className="bg-sand py-24 sm:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-x-10 gap-y-16 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          <Rise className="lg:col-span-5">
            <h2 className="eyebrow text-spice">{a.capabilitiesTitle}</h2>
            <ul className="mt-6">
              {a.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="border-t border-night/20 py-4 font-display text-[clamp(1.2rem,1.7vw,1.5rem)] leading-tight last:border-b"
                >
                  {capability}
                </li>
              ))}
            </ul>
          </Rise>

          <div className="space-y-16 lg:col-span-6 lg:col-start-7">
            <Rise>
              <h2 className="eyebrow text-spice">{site.about.rulesTitle}</h2>
              <ol className="mt-6">
                {site.home.method.rules.map((rule, i) => (
                  <li
                    key={rule}
                    className="grid grid-cols-[2.75rem_1fr] items-baseline border-t border-night/20 py-4 text-[17px] leading-snug last:border-b"
                  >
                    <span className="font-display text-[1.05rem] text-spice">{NUMERALS[i]}</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ol>
            </Rise>
            <Rise>
              <h2 className="eyebrow text-spice">{a.languagesTitle}</h2>
              <ul className="mt-6 grid grid-cols-2 gap-x-8">
                {a.languages.map((language) => (
                  <li key={language} className="border-t border-night/20 py-4 text-[17px]">
                    {language}
                  </li>
                ))}
              </ul>
            </Rise>
            <Rise>
              <CtaLink lang={lang} tone="night" className="w-full sm:w-auto">
                {a.cta}
              </CtaLink>
            </Rise>
          </div>
        </div>
      </section>

      <FinalCta lang={lang} />
    </>
  );
}
