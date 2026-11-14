import type { Locale } from "@/i18n/config";
import type { SiteCopy } from "@/i18n/site";
import { siteConfig } from "@/content/site-config";
import { CtaLink } from "@/components/ui/cta-link";
import { Headline } from "@/components/ui/headline";
import { Rise } from "@/components/ui/rise";

/**
 * The entry offer, with its real fixed price from the offer catalogue.
 * Set `features.showPrices` to false in site-config to hide every price.
 */
export function AuditFeature({
  lang,
  site,
  eyebrow,
}: {
  lang: Locale;
  site: SiteCopy;
  /** Overrides the default label, e.g. "Step I" on the business page. */
  eyebrow?: string;
}) {
  const a = site.home.audit;
  const showPrices = siteConfig.features.showPrices;
  return (
    <section id="audit" className="scroll-mt-20 bg-sand-deep py-24 sm:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <Rise>
            <p className="eyebrow text-spice">{eyebrow ?? a.eyebrow}</p>
          </Rise>
          <Headline
            parts={a.title}
            className="mt-6 text-balance text-[length:var(--text-h2)] leading-[1.02]"
          />
          <Rise delay={150}>
            <p className="lead mt-8 max-w-[30rem] text-pretty text-night/85">{a.text}</p>
          </Rise>
          <Rise delay={240} className="mt-10">
            <CtaLink lang={lang} tone="night" service="ai-opportunity-audit" className="w-full sm:w-auto">
              {site.cta.audit}
            </CtaLink>
          </Rise>
        </div>

        <Rise delay={120} className="lg:col-span-6 lg:col-start-7">
          <div className="border border-night bg-sand">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-night px-6 py-7 sm:px-9 sm:py-9">
              {showPrices ? (
                <p className="flex items-baseline gap-4">
                  <span className="font-display text-[clamp(3.6rem,8vw,6.5rem)] leading-[0.85]">{a.price}</span>
                  <span className="eyebrow max-w-[16ch] text-night-mute">{a.priceNote}</span>
                </p>
              ) : (
                <p className="font-display text-[2rem] leading-none">{site.labels.priceOnRequest}</p>
              )}
              <p className="eyebrow text-night">{a.timing}</p>
            </div>
            <p className="eyebrow px-6 pt-7 text-spice sm:px-9">{site.labels.included}</p>
            <ol className="px-6 pb-3 pt-2 sm:px-9">
              {a.items.map((item, i) => (
                <li
                  key={item}
                  className="grid grid-cols-[2.5rem_1fr] items-baseline gap-2 border-b border-night/15 py-4 text-[17px] leading-snug last:border-b-0"
                >
                  <span className="font-display text-[1.05rem] italic text-spice">0{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <p className="border-t border-night px-6 py-5 text-[15px] leading-snug text-night-mute sm:px-9">
              {a.excluded}
            </p>
          </div>
        </Rise>
      </div>
    </section>
  );
}
