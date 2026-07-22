import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

export function PackagesSection({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const p = dict.packages;
  return (
    <section className="bg-porcelain py-28 sm:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-16 max-w-3xl">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.24em] text-graphite/50">
            {p.eyebrow}
          </p>
          <TextReveal
            as="h2"
            text={p.title}
            className="font-display text-[clamp(2rem,4.2vw,3.8rem)] font-semibold leading-[1.06] tracking-[-0.02em]"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 text-[15px] leading-relaxed text-graphite/55">{p.note}</p>
          </Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {p.items.map((pkg, i) => {
            const highlighted = "highlighted" in pkg && pkg.highlighted;
            const badge = "badge" in pkg ? (pkg as { badge?: string }).badge : null;
            return (
            <Reveal key={pkg.name} delay={i * 0.08} className="h-full">
              <div
                className={cn(
                  "flex h-full flex-col rounded-2xl border p-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 sm:p-9",
                  highlighted
                    ? "border-graphite bg-graphite text-porcelain shadow-[0_28px_70px_-24px_rgba(18,18,21,0.5)]"
                    : "border-graphite/12 bg-porcelain",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-[1.7rem] font-semibold">{pkg.name}</h3>
                  {highlighted && badge && (
                    <span className="rounded-full bg-cobalt px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-porcelain">
                      {badge}
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-3 text-[14px] leading-relaxed",
                    highlighted ? "text-porcelain/60" : "text-graphite/55",
                  )}
                >
                  {pkg.audience}
                </p>
                <ul className="mt-7 flex-1 space-y-3">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[14.5px]">
                      <Check
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          highlighted ? "text-cobalt-bright" : "text-cobalt",
                        )}
                      />
                      <span className={highlighted ? "text-porcelain/85" : "text-graphite/75"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`${localePath(lang, "/contact")}?package=${encodeURIComponent(pkg.name)}`}
                  className={cn(
                    "group mt-9 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-medium transition-colors duration-300",
                    highlighted
                      ? "bg-cobalt text-porcelain hover:bg-cobalt-bright"
                      : "border border-graphite/20 text-graphite hover:border-graphite hover:bg-graphite hover:text-porcelain",
                  )}
                >
                  {dict.common.getQuote}
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
