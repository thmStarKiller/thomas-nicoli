import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getSite } from "@/i18n/site";
import { pageMetadata } from "@/lib/seo";
import { FinalCta } from "@/components/sections/final-cta";
import { WorkRows } from "@/components/sections/work-rows";
import { Draft } from "@/components/ui/draft";
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
  const { meta } = getSite(lang).work;
  return pageMetadata({ lang, path: "/work", title: meta.title, description: meta.description });
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const site = getSite(lang);
  const w = site.work;

  return (
    <>
      <PageHero eyebrow={w.hero.eyebrow} title={w.hero.title} intro={w.hero.intro} />

      {/* Experience */}
      <section id="experience" className="scroll-mt-20 bg-sand py-24 sm:py-36">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-12">
            <Rise className="lg:col-span-3">
              <p className="eyebrow text-spice">{w.experience.eyebrow}</p>
            </Rise>
            <div className="lg:col-span-9">
              <Headline parts={w.experience.title} className="text-balance text-[length:var(--text-h2)] leading-[1.02]" />
              <Rise delay={150}>
                <p className="mt-7 max-w-[38rem] text-[17px] leading-relaxed text-night-mute">{w.experience.note}</p>
              </Rise>
            </div>
          </div>

          <ol className="mt-14 sm:mt-20">
            {w.experience.items.map((entry, i) => (
              <li key={entry.title}>
                <Rule className="text-night" delay={i * 90} />
                <Rise delay={i * 90} className="grid gap-x-10 gap-y-3 py-9 sm:py-12 lg:grid-cols-12">
                  <p className="eyebrow pt-2 text-spice lg:col-span-2">{entry.period}</p>
                  <div className="lg:col-span-5">
                    <h3 className="text-balance font-display text-[clamp(1.7rem,3vw,2.7rem)] leading-[1.05]">
                      {entry.title}
                    </h3>
                    <p className="eyebrow mt-4 text-night-mute">{entry.label}</p>
                  </div>
                  <p className="max-w-[34rem] text-[18px] leading-relaxed text-night/85 lg:col-span-5">{entry.text}</p>
                </Rise>
              </li>
            ))}
            <li>
              <Rule className="text-night" />
              <Rise className="grid gap-x-10 gap-y-3 py-9 lg:grid-cols-12">
                <p className="eyebrow pt-1 text-spice lg:col-span-2">{w.education.label}</p>
                <p className="font-display text-[clamp(1.3rem,1.9vw,1.7rem)] leading-tight lg:col-span-10">
                  {w.education.text}
                </p>
              </Rise>
              <Rule className="text-night" />
            </li>
          </ol>

          <Rise className="mt-14 sm:mt-20">
            <p className="eyebrow text-night-mute">{w.agenciesLine.label}</p>
            <p className="mt-5 flex flex-wrap gap-x-10 gap-y-2 font-display text-[clamp(1.9rem,4.6vw,4.2rem)] leading-none">
              {w.agenciesLine.names.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </p>
          </Rise>

          <Draft className="mt-12" label="Draft">
            Client quotes go here. Send one or two short quotes with a name and role and they will replace this block.
          </Draft>
        </div>
      </section>

      {/* Builds */}
      <section id="builds" className="scroll-mt-20 bg-night py-24 text-sand sm:py-36">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-12">
            <Rise className="lg:col-span-3">
              <p className="eyebrow text-spice-bright">{w.builds.eyebrow}</p>
            </Rise>
            <div className="lg:col-span-9">
              <Headline parts={w.builds.title} className="text-balance text-[length:var(--text-h2)] leading-[1.02]" />
              <Rise delay={150}>
                <p className="mt-7 max-w-[38rem] text-[17px] leading-relaxed text-sand/70">{w.builds.note}</p>
              </Rise>
            </div>
          </div>
          <div className="mt-14 sm:mt-20">
            <WorkRows lang={lang} cases={w.cases} />
          </div>
        </div>
      </section>

      <FinalCta lang={lang} />
    </>
  );
}
