import type { Dictionary } from "@/i18n";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/ui/reveal";

export function WhyMe({ dict }: { dict: Dictionary }) {
  const w = dict.whyMe;
  return (
    <section className="bg-porcelain py-28 sm:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.35fr] lg:gap-24 lg:px-12">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.24em] text-graphite/50">
            {w.eyebrow}
          </p>
          <TextReveal
            as="h2"
            text={w.title}
            className="font-display text-[clamp(2rem,4.2vw,3.8rem)] font-semibold leading-[1.06] tracking-[-0.02em]"
          />
        </div>
        <div>
          {w.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.07}>
              <div className="grid gap-3 border-t border-graphite/12 py-8 last:border-b sm:grid-cols-[70px_1fr] sm:gap-8">
                <span className="font-mono text-[12px] tracking-[0.2em] text-cobalt">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.01em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-graphite/60">
                    {item.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
