import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/content/site-config";
import { getDictionary } from "@/i18n";
import { hasLocale, localePath } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { TextReveal } from "@/components/motion/text-reveal";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Reveal } from "@/components/ui/reveal";

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
  const a = dict.about;

  return (
    <>
      <section className="bg-graphite pb-24 pt-40 text-porcelain sm:pb-32 sm:pt-48">
        <div className="mx-auto grid max-w-[1440px] items-end gap-14 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24 lg:px-12">
          <div>
            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.24em] text-porcelain/50">
              {a.eyebrow}
            </p>
            <TextReveal
              as="h1"
              text={a.title}
              className="font-display text-[clamp(3rem,7.5vw,7rem)] font-semibold leading-[1.0] tracking-[-0.02em]"
            />
            <Reveal delay={0.2}>
              <p className="mt-6 font-display text-xl italic text-cobalt-bright sm:text-2xl">
                {a.role}
              </p>
            </Reveal>
          </div>
          <ImageReveal className="relative hidden lg:block">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl">
              <Image
                src={siteConfig.media.profileImage}
                alt={a.portraitAlt}
                fill
                priority
                sizes="36vw"
                className="object-cover"
                style={{ objectPosition: siteConfig.media.profileImageFocus }}
              />
            </div>
          </ImageReveal>
        </div>
      </section>

      {/* Mobile portrait */}
      <section className="bg-porcelain pt-16 lg:hidden">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <ImageReveal>
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl">
              <Image
                src={siteConfig.media.profileImage}
                alt={a.portraitAlt}
                fill
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: siteConfig.media.profileImageFocus }}
              />
            </div>
          </ImageReveal>
        </div>
      </section>

      <section className="bg-porcelain py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-14 lg:grid-cols-[280px_1fr] lg:gap-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt">
              {a.locationExperience}
            </p>
            <div className="max-w-3xl space-y-7">
              <Reveal>
                <p className="font-display text-[clamp(1.25rem,2vw,1.6rem)] leading-relaxed text-graphite/85">
                  {a.intro}
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="text-[15.5px] leading-relaxed text-graphite/65">{a.background}</p>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="text-[15.5px] leading-relaxed text-graphite/65">{a.perspective}</p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[15.5px] leading-relaxed text-graphite/65">{a.next}</p>
              </Reveal>
            </div>
          </div>

          {/* Values */}
          <div className="mt-28">
            <h2 className="mb-12 font-mono text-[11px] uppercase tracking-[0.22em] text-graphite/50">
              {a.valuesTitle}
            </h2>
            <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {a.values.map((value, i) => (
                <Reveal key={value.name} delay={i * 0.07}>
                  <div className="border-t-2 border-graphite/15 pt-6 transition-colors duration-500 hover:border-cobalt">
                    <span className="font-mono text-[12px] tracking-[0.2em] text-graphite/40">
                      0{i + 1}
                    </span>
                    <h3 className="mt-3 font-display text-[1.5rem] font-semibold">{value.name}</h3>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-graphite/60">
                      {value.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Capabilities + working style */}
          <div className="mt-28 grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="mb-8 font-mono text-[11px] uppercase tracking-[0.22em] text-graphite/50">
                {a.capabilitiesTitle}
              </h2>
              <ul className="space-y-0">
                {a.capabilities.map((cap) => (
                  <li
                    key={cap}
                    className="border-t border-graphite/12 py-4 text-[15px] text-graphite/75 last:border-b"
                  >
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-12">
              <div>
                <h2 className="mb-8 font-mono text-[11px] uppercase tracking-[0.22em] text-graphite/50">
                  {a.workingTitle}
                </h2>
                <ul className="space-y-4">
                  {a.workingStyle.map((item) => (
                    <li
                      key={item}
                      className="border-l-2 border-cobalt pl-4 text-[14.5px] leading-relaxed text-graphite/70"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-graphite/50">
                  {a.languagesTitle}
                </h2>
                <ul className="flex flex-wrap gap-2.5">
                  {a.languages.map((l) => (
                    <li
                      key={l}
                      className="rounded-full border border-graphite/15 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-graphite/60"
                    >
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <Reveal className="mt-24">
            <div className="flex flex-wrap gap-3">
              <Link
                href={localePath(lang, "/work")}
                className="group inline-flex items-center gap-3 rounded-full border border-graphite/20 px-8 py-4 text-[15px] font-medium text-graphite transition-colors duration-300 hover:border-cobalt hover:text-cobalt"
              >
                {a.workCta}
                <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href={localePath(lang, "/contact")}
                className="group inline-flex items-center gap-3 rounded-full bg-graphite px-9 py-4 text-[15px] font-medium text-porcelain transition-colors duration-300 hover:bg-cobalt"
              >
                {a.cta}
                <ArrowUpRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
