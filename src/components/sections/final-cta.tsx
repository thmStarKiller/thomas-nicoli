import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import { localePath, type Locale } from "@/i18n/config";
import { getSite } from "@/i18n/site";
import { CtaLink } from "@/components/ui/cta-link";
import { Headline, Rule } from "@/components/ui/headline";
import { Rise } from "@/components/ui/rise";

/** Closing section on every page: one question and one button. */
export function FinalCta({ lang }: { lang: Locale }) {
  const site = getSite(lang);
  const c = site.home.final;
  return (
    <section className="bg-night pb-10 pt-28 text-sand sm:pt-44">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Headline
          parts={c.title}
          accentClassName="text-spice-bright"
          className="text-balance text-[15.5vw] leading-[0.86] tracking-[-0.035em] lg:max-w-[8em] lg:text-[length:var(--text-mega)]"
          step={90}
        />
        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-12">
          <Rise delay={200} className="lg:col-span-5 lg:col-start-7">
            <p className="lead text-pretty text-sand/80">{c.text}</p>
            <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
              <CtaLink lang={lang} tone="spice" className="w-full sm:w-auto">
                {site.cta.call}
              </CtaLink>
              <a
                href={siteConfig.contact.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line self-start text-sand sm:self-auto"
              >
                {c.linkedin}
              </a>
            </div>
          </Rise>
        </div>
        <Rule className="mt-20 text-sand sm:mt-28" />
        <Rise className="pt-5">
          <Link
            href={localePath(lang, "/project-clarity")}
            className="link-underline inline-flex min-h-11 items-center text-[16px] text-sand/75 hover:text-sand"
          >
            {c.clarity}
          </Link>
        </Rise>
      </div>
    </section>
  );
}
