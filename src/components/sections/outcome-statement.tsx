import type { Dictionary } from "@/i18n";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/ui/reveal";

export function OutcomeStatement({ dict }: { dict: Dictionary }) {
  const o = dict.outcome;
  return (
    <section className="relative overflow-hidden bg-porcelain py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <p className="mb-14 font-mono text-[11px] uppercase tracking-[0.24em] text-graphite/50">
          {o.eyebrow}
        </p>
        <div className="space-y-2 sm:space-y-4">
          {o.lines.map((line, i) => (
            <div key={line} className="flex items-baseline gap-5 sm:gap-10">
              <span className="font-mono text-[12px] tracking-[0.2em] text-cobalt">
                0{i + 1}
              </span>
              <TextReveal
                text={line}
                delay={i * 0.1}
                className="font-display text-[clamp(2.4rem,6.5vw,6rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-graphite"
              />
            </div>
          ))}
        </div>
        <Reveal className="mt-16 flex justify-end" delay={0.2}>
          <p className="max-w-md text-[15px] leading-relaxed text-graphite/55">{o.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
