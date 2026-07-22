import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/ui/reveal";

/** Editorial numbered service rows — hover reveals direction. */
export function ServicesOverview({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const s = dict.servicesSection;
  return (
    <section className="bg-porcelain pb-28 sm:pb-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-16 grid gap-8 border-t border-graphite/12 pt-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.24em] text-graphite/50">
              {s.eyebrow}
            </p>
            <TextReveal
              as="h2"
              text={s.title}
              className="max-w-3xl font-display text-[clamp(2rem,4.6vw,4rem)] font-semibold leading-[1.06] tracking-[-0.02em]"
            />
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-xs text-[14.5px] leading-relaxed text-graphite/55">{s.intro}</p>
          </Reveal>
        </div>

        <div>
          {dict.services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.05}>
              <Link
                href={`${localePath(lang, "/services")}#${service.slug}`}
                className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-5 border-t border-graphite/12 py-8 transition-colors duration-500 last:border-b hover:bg-porcelain-deep/60 sm:gap-10 sm:py-10 lg:grid-cols-[90px_1fr_1fr_auto]"
              >
                <span className="font-mono text-[12px] tracking-[0.2em] text-graphite/40 transition-colors duration-300 group-hover:text-cobalt">
                  0{i + 1}
                </span>
                <h3 className="font-display text-[clamp(1.5rem,3vw,2.6rem)] font-semibold leading-tight tracking-[-0.01em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
                  {service.title}
                </h3>
                <p className="col-span-2 -order-1 hidden max-w-sm text-[14.5px] leading-relaxed text-graphite/55 lg:order-none lg:col-span-1 lg:block">
                  {service.tagline}
                </p>
                <span className="flex size-11 items-center justify-center rounded-full border border-graphite/15 transition-all duration-500 group-hover:border-cobalt group-hover:bg-cobalt group-hover:text-porcelain">
                  <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12" delay={0.1}>
          <Link
            href={localePath(lang, "/services")}
            className="group inline-flex items-center gap-2 text-[15px] font-medium text-cobalt"
          >
            <span className="link-underline">{dict.common.allServices}</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
