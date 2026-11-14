import type { Accent } from "@/i18n/site";
import { Headline, Rule } from "@/components/ui/headline";
import { Rise } from "@/components/ui/rise";

/**
 * Opening band of every inner page: a label, a large headline, one paragraph
 * and an optional action, on night.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  meta,
  children,
}: {
  eyebrow: string;
  title: Accent | string;
  intro?: string;
  /** Short line shown at the right of the label row, e.g. a period. */
  meta?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-night pb-16 pt-32 text-sand sm:pb-24 sm:pt-44">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Rise className="flex items-baseline justify-between gap-6">
          <p className="eyebrow text-spice-bright">{eyebrow}</p>
          {meta && <p className="eyebrow text-sand/60">{meta}</p>}
        </Rise>
        <Rule className="mt-5 text-sand" />
        <Headline
          as="h1"
          parts={title}
          accentClassName="text-spice-bright"
          className="mt-10 max-w-[15ch] text-balance text-[length:var(--text-hero)] leading-[0.92] tracking-[-0.03em] sm:mt-14"
          start={120}
        />
        {(intro || children) && (
          <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-12">
            {intro && (
              <Rise delay={350} className="lg:col-span-6 lg:col-start-7">
                <p className="lead text-pretty text-sand/80">{intro}</p>
                {children && <div className="mt-9">{children}</div>}
              </Rise>
            )}
            {!intro && children && <Rise delay={350}>{children}</Rise>}
          </div>
        )}
      </div>
    </section>
  );
}
