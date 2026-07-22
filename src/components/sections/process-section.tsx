import type { Dictionary } from "@/i18n";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/ui/reveal";

export function ProcessSection({ dict }: { dict: Dictionary }) {
  const p = dict.process;
  return (
    <section className="bg-porcelain-deep/60 py-28 sm:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-16 grid gap-8 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-24">
          <div>
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.24em] text-graphite/50">
              {p.eyebrow}
            </p>
            <TextReveal
              as="h2"
              text={p.title}
              className="font-display text-[clamp(2rem,4.2vw,3.8rem)] font-semibold leading-[1.06] tracking-[-0.02em]"
            />
          </div>
        </div>

        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {p.steps.map((step, i) => (
            <Reveal key={step.name} delay={i * 0.09}>
              <div className="group border-t-2 border-graphite/15 pt-7 transition-colors duration-500 hover:border-cobalt">
                <span className="font-mono text-[12px] tracking-[0.2em] text-graphite/40 transition-colors duration-300 group-hover:text-cobalt">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-display text-[1.55rem] font-semibold tracking-[-0.01em]">
                  {step.name}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-graphite/60">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
