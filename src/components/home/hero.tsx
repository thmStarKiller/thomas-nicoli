import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { siteConfig } from "@/content/site-config";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import type { SiteCopy } from "@/i18n/site";
import { CtaLink } from "@/components/ui/cta-link";
import { Headline } from "@/components/ui/headline";
import { Rise } from "@/components/ui/rise";
import { Drift } from "@/components/motion/drift";

/**
 * Opening screen: the offer in one sentence on the left, Thomas on the right.
 * Flat night, one hairline, no decoration.
 */
export function HomeHero({ lang, dict, site }: { lang: Locale; dict: Dictionary; site: SiteCopy }) {
  const h = site.home.hero;
  return (
    <section data-testid="home-black-hero" className="relative bg-night text-sand">
      <div className="mx-auto grid max-w-[1440px] lg:min-h-svh lg:grid-cols-12">
        <div className="flex flex-col justify-end px-5 pb-12 pt-32 sm:px-8 sm:pt-40 lg:col-span-7 lg:px-12 lg:pb-16">
          <Rise className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="eyebrow text-spice-bright">{h.label}</p>
            <span aria-hidden className="hidden h-px w-10 bg-sand/30 sm:block" />
            <p className="eyebrow flex items-center gap-2.5 text-sand/65">
              <span aria-hidden className="size-1.5 animate-pulse-dot bg-spice-bright" />
              {h.note}
            </p>
          </Rise>

          <Headline
            as="h1"
            parts={h.title}
            accentClassName="text-spice-bright"
            className="mt-8 text-balance text-[length:var(--text-hero)] leading-[0.97] sm:mt-10"
            start={150}
            step={70}
          />

          <Rise delay={650}>
            <p className="lead mt-8 max-w-[34rem] text-pretty text-sand/80 sm:mt-10">{h.text}</p>
          </Rise>

          <Rise delay={780} className="mt-9 flex flex-col gap-4 sm:mt-11 sm:flex-row sm:items-center sm:gap-8">
            <CtaLink lang={lang} service="ai-opportunity-audit" className="w-full sm:w-auto">
              {h.primary}
            </CtaLink>
            <Link href={localePath(lang, "/business")} className="link-line self-start text-sand sm:self-auto">
              {h.secondary}
            </Link>
          </Rise>
        </div>

        <div className="relative lg:col-span-5">
          <div
            data-wipe=""
            suppressHydrationWarning
            className="portrait relative aspect-[4/5] overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto"
            style={{ "--d": "250ms" } as React.CSSProperties}
          >
            <Drift className="absolute inset-0" distance={60}>
              <Image
                src={siteConfig.media.profileImage}
                alt={dict.about.portraitAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
                style={{ objectPosition: "50% 26%" }}
              />
            </Drift>
          </div>
          <p className="eyebrow absolute bottom-5 left-5 text-sand/85 sm:left-8">{h.caption}</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-6 py-5">
          <p className="eyebrow text-sand/65">{site.cta.reply}</p>
          <p className="eyebrow hidden items-center gap-2 text-sand/65 sm:flex">
            {site.labels.scroll}
            <ArrowDown aria-hidden className="size-3.5" />
          </p>
        </div>
      </div>
    </section>
  );
}
