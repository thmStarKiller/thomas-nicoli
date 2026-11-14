import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import type { SiteCopy } from "@/i18n/site";
import { CtaLink } from "@/components/ui/cta-link";
import { Headline } from "@/components/ui/headline";
import { Rise } from "@/components/ui/rise";
import { Drift } from "@/components/motion/drift";

/**
 * Opening screen. The offer is set as large as the page allows and runs
 * across the portrait; everything else stays small and out of its way.
 * On tall desktop screens the hero is pinned so the next band slides over it.
 */
export function HomeHero({ lang, dict, site }: { lang: Locale; dict: Dictionary; site: SiteCopy }) {
  const h = site.home.hero;
  return (
    <section
      data-testid="home-black-hero"
      className="hero-pin relative isolate overflow-hidden bg-night text-sand"
    >
      {/* Portrait: top of the screen on a phone, right-hand side on desktop */}
      <div
        data-wipe=""
        suppressHydrationWarning
        className="portrait absolute inset-x-0 top-0 h-[76svh] overflow-hidden lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[46%]"
        style={{ "--d": "200ms" } as React.CSSProperties}
      >
        <Drift className="absolute inset-0" distance={90}>
          <Image
            src={siteConfig.media.profileImage}
            alt={dict.about.portraitAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="object-cover"
            style={{ objectPosition: "50% 24%" }}
          />
        </Drift>
      </div>
      {/* A flat veil so the type stays readable where it crosses the photo */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[76svh] bg-night/40 lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[46%] lg:bg-night/25" />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-[1440px] flex-col justify-end px-5 pb-8 pt-[44svh] sm:px-8 lg:h-full lg:px-12 lg:pb-10 lg:pt-28">
        <Rise className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <p className="eyebrow text-spice-bright">{h.label}</p>
          <span aria-hidden className="hidden h-px w-10 bg-sand/40 sm:block" />
          <p className="eyebrow flex items-center gap-2.5 text-sand/80">
            <span aria-hidden className="size-1.5 animate-pulse-dot bg-spice-bright" />
            {h.note}
          </p>
        </Rise>

        <Headline
          as="h1"
          parts={h.title}
          accentClassName="text-spice-bright"
          className="mt-5 text-[15.5vw] leading-[0.86] sm:text-[13vw] lg:mt-7 lg:max-w-[7.6em] lg:text-[length:var(--text-mega)]"
          start={120}
          step={85}
        />

        <div className="mt-8 grid items-end gap-8 lg:mt-10 lg:grid-cols-12">
          <Rise delay={600} className="lg:col-span-5">
            <p className="max-w-[32rem] text-pretty text-[18px] leading-relaxed text-sand/85 lg:text-[19px]">
              {h.text}
            </p>
          </Rise>
          <Rise
            delay={720}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8 lg:col-span-7 lg:justify-end"
          >
            <CtaLink lang={lang} tone="spice" service="ai-opportunity-audit" className="w-full sm:w-auto">
              {h.primary}
            </CtaLink>
            <Link href={localePath(lang, "/business")} className="link-line self-start text-sand sm:self-auto">
              {h.secondary}
            </Link>
          </Rise>
        </div>
      </div>
    </section>
  );
}
