import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { SiteCopy } from "@/i18n/site";
import { CountUp } from "@/components/motion/drift";
import { Headline } from "@/components/ui/headline";
import { Rise } from "@/components/ui/rise";

/** Four checkable facts, set large. */
export function Facts({ site }: { site: SiteCopy }) {
  return (
    <section className="bg-sand pb-4 pt-16 sm:pt-24">
      <dl className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-12 px-5 sm:px-8 lg:grid-cols-4 lg:gap-x-10 lg:px-12">
        {site.home.facts.map((fact, i) => (
          <Rise key={fact.label} delay={i * 90} className="border-t border-night/25 pt-5">
            <dt className="sr-only">{fact.label}</dt>
            <dd>
              <CountUp
                value={fact.value}
                className="block whitespace-nowrap font-display text-[clamp(3.2rem,7.4vw,8rem)] leading-[0.85]"
              />
              <span className="mt-5 block max-w-[20ch] text-[17px] leading-snug text-night-mute">
                {fact.label}
              </span>
            </dd>
          </Rise>
        ))}
      </dl>
    </section>
  );
}

/**
 * The structure of the site in three rows: who it is for, what they get,
 * where it leads. Each row is a link to that audience's page.
 */
export function Doors({ lang, site }: { lang: Locale; site: SiteCopy }) {
  const d = site.home.doors;
  return (
    <section className="bg-sand py-24 sm:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-12">
          <Rise className="lg:col-span-3">
            <p className="eyebrow text-spice">{d.eyebrow}</p>
          </Rise>
          <Headline
            parts={d.title}
            className="text-balance text-[length:var(--text-h2)] leading-[1.02] lg:col-span-9"
          />
        </div>

        <ul className="mt-14 border-b border-night/25 sm:mt-20">
          {d.items.map((door, i) => {
            const [path, hash] = door.href.split("#");
            const href = `${localePath(lang, path)}${hash ? `#${hash}` : ""}`;
            return (
              <Rise as="li" key={door.href} delay={i * 110}>
                <Link
                  href={href}
                  className="row-fill group grid grid-cols-12 items-baseline gap-x-4 gap-y-3 border-t border-night/25 py-9 sm:py-14"
                >
                  <span className="col-span-2 font-display text-[clamp(1.6rem,2.4vw,2.4rem)] text-spice transition-colors duration-500 group-hover:text-night lg:col-span-1">
                    {door.numeral}
                  </span>
                  <span className="row-shift col-span-10 font-display text-[clamp(2.2rem,6.4vw,6.6rem)] leading-[0.95] tracking-[-0.03em] lg:col-span-7">
                    {door.title}
                  </span>
                  <span className="col-span-10 col-start-3 lg:col-span-3 lg:col-start-auto">
                    <span className="block max-w-[32rem] text-[17px] leading-snug opacity-85">{door.text}</span>
                    <span className="eyebrow mt-3 block opacity-70">{door.meta}</span>
                  </span>
                  <span className="col-span-12 hidden justify-self-end lg:col-span-1 lg:block">
                    <ArrowUpRight aria-hidden className="row-arrow size-8" strokeWidth={1.1} />
                  </span>
                </Link>
              </Rise>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
