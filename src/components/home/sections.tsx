import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { SiteCopy } from "@/i18n/site";
import { WorkRows } from "@/components/sections/work-rows";
import { Headline, Rule } from "@/components/ui/headline";
import { Rise } from "@/components/ui/rise";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII"];

/** A short selection of builds on night, leading to the full work index. */
export function HomeWork({ lang, site }: { lang: Locale; site: SiteCopy }) {
  const w = site.home.work;
  const selection = site.work.cases.slice(0, 4);
  return (
    <section className="bg-night py-24 text-sand sm:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-12">
          <Rise className="lg:col-span-3">
            <p className="eyebrow text-spice-bright">{w.eyebrow}</p>
          </Rise>
          <div className="lg:col-span-9">
            <Headline
              parts={w.title}
              accentClassName="text-spice-bright"
              className="text-balance text-[length:var(--text-h2)] leading-[1.02]"
            />
            <Rise delay={150}>
              <p className="lead mt-8 max-w-[38rem] text-pretty text-sand/75">{w.intro}</p>
            </Rise>
          </div>
        </div>

        <div className="mt-14 sm:mt-20">
          <WorkRows lang={lang} cases={selection} />
        </div>

        <Rise className="mt-10">
          <Link href={localePath(lang, "/work")} className="link-line text-sand">
            {w.cta}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Rise>
      </div>
    </section>
  );
}

/** Who Thomas is and the rules he works by, as a numbered list. */
export function Method({ lang, site }: { lang: Locale; site: SiteCopy }) {
  const m = site.home.method;
  return (
    <section className="bg-sand py-24 sm:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <Rise>
            <p className="eyebrow text-spice">{m.eyebrow}</p>
          </Rise>
          <Headline parts={m.title} className="mt-6 text-balance text-[clamp(2.1rem,4.2vw,4rem)] leading-[1.03]" />
          <Rise delay={150}>
            <p className="mt-8 max-w-[30rem] text-[18px] leading-relaxed text-night/80">{m.text}</p>
          </Rise>
          <Rise delay={220} className="mt-8">
            <Link href={localePath(lang, "/about")} className="link-line text-night">
              {m.cta}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Rise>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {m.rules.map((rule, i) => (
            <li key={rule}>
              <Rule className="text-night" delay={i * 90} />
              <Rise delay={i * 90} className="grid grid-cols-[3.25rem_1fr] items-baseline py-6 sm:py-7">
                <span className="font-display text-[1.3rem] text-spice">{NUMERALS[i]}</span>
                <span className="font-display text-[clamp(1.3rem,1.9vw,1.7rem)] leading-[1.22] tracking-[-0.01em]">
                  {rule}
                </span>
              </Rise>
            </li>
          ))}
          <li aria-hidden>
            <Rule className="text-night" delay={m.rules.length * 90} />
          </li>
        </ol>
      </div>
    </section>
  );
}
