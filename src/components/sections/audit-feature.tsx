import type { Locale } from "@/i18n/config";
import type { SiteCopy } from "@/i18n/site";
import { siteConfig } from "@/content/site-config";
import { CountUp } from "@/components/motion/drift";
import { CtaLink } from "@/components/ui/cta-link";
import { Headline, Rule } from "@/components/ui/headline";
import { Rise } from "@/components/ui/rise";

/**
 * The entry offer on a full block of spice, with its fixed price set as the
 * largest thing on the page. The price comes from the offer catalogue; set
 * `features.showPrices` to false in site-config to hide every price.
 */
export function AuditFeature({
  lang,
  site,
  eyebrow,
}: {
  lang: Locale;
  site: SiteCopy;
  /** Overrides the default label, e.g. "I. Audit" on the business page. */
  eyebrow?: string;
}) {
  const a = site.home.audit;
  const showPrices = siteConfig.features.showPrices;
  return (
    <section id="audit" className="scroll-mt-16 overflow-hidden bg-spice-bright py-20 text-night sm:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Rise className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <p className="eyebrow">{eyebrow ?? a.eyebrow}</p>
          <p className="eyebrow">{a.timing}</p>
        </Rise>
        <Rule className="mt-5 !opacity-100" />

        {showPrices && (
          <Rise className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-2 sm:mt-8">
            <CountUp
              value={a.price}
              className="block whitespace-nowrap font-display text-[clamp(6.5rem,29vw,30rem)] leading-[0.78] tracking-[-0.04em]"
            />
            <span className="eyebrow max-w-[16ch] pb-[1.2vw]">{a.priceNote}</span>
          </Rise>
        )}

        <div className="mt-12 grid gap-x-10 gap-y-12 sm:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Headline
              parts={a.title}
              accentClassName=""
              className="text-balance text-[length:var(--text-h2)] leading-[0.98]"
            />
            <Rise delay={150}>
              <p className="mt-7 max-w-[32rem] text-pretty text-[19px] leading-relaxed sm:text-[21px]">{a.text}</p>
            </Rise>
            <Rise delay={240} className="mt-9">
              <CtaLink lang={lang} tone="night" service="ai-opportunity-audit" className="w-full sm:w-auto">
                {site.cta.audit}
              </CtaLink>
            </Rise>
          </div>

          <div className="lg:col-span-6">
            <Rise>
              <p className="eyebrow">{site.labels.included}</p>
            </Rise>
            <ol className="mt-3">
              {a.items.map((item, i) => (
                <li key={item}>
                  <Rule className="!opacity-100" delay={i * 70} />
                  <Rise
                    delay={i * 70}
                    className="grid grid-cols-[2.75rem_1fr] items-baseline gap-2 py-4 text-[18px] leading-snug"
                  >
                    <span className="font-display text-[1.15rem] italic">0{i + 1}</span>
                    <span>{item}</span>
                  </Rise>
                </li>
              ))}
              <li aria-hidden>
                <Rule className="!opacity-100" />
              </li>
            </ol>
            <Rise>
              <p className="mt-5 text-[15.5px] leading-snug">{a.excluded}</p>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}
