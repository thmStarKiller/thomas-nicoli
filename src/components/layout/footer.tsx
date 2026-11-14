import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/content/site-config";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { getSite } from "@/i18n/site";
import { LanguageSwitcher } from "./language-switcher";
import { MadridClock } from "./madrid-clock";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { contact, identity } = siteConfig;
  const site = getSite(lang);
  const year = new Date().getFullYear();

  const navLinks = [
    { label: site.nav.business, href: localePath(lang, "/business") },
    { label: site.nav.professionals, href: localePath(lang, "/professionals") },
    { label: site.nav.work, href: localePath(lang, "/work") },
    { label: site.nav.about, href: localePath(lang, "/about") },
    { label: site.nav.contact, href: localePath(lang, "/contact") },
    { label: site.nav.clarity, href: localePath(lang, "/project-clarity") },
  ];

  const socials = [
    contact.socials.linkedin && { label: "LinkedIn", href: contact.socials.linkedin },
    contact.socials.malt && { label: "Malt", href: contact.socials.malt },
    contact.socials.github && { label: "GitHub", href: contact.socials.github },
  ].filter(Boolean) as { label: string; href: string }[];

  const heading = "eyebrow mb-5 text-sand/65";
  const link = "link-underline text-[16px] text-sand/85 hover:text-sand";

  return (
    <footer className="bg-night text-sand">
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 border-t border-sand/15 pt-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <p className="max-w-sm text-[16px] leading-relaxed text-sand/70">{dict.footer.tagline}</p>
            <MadridClock label={dict.footer.localTime} />
          </div>

          <div>
            <h2 className={heading}>{dict.footer.navigateTitle}</h2>
            <ul className="space-y-2.5">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={heading}>{dict.footer.connectTitle}</h2>
            <ul className="space-y-2.5">
              {socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-[16px] text-sand/85 hover:text-sand"
                  >
                    <span className="link-underline">{s.label}</span>
                    <ArrowUpRight className="size-3.5 text-spice-bright transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={heading}>{dict.footer.legalTitle}</h2>
            <ul className="space-y-2.5">
              <li>
                <Link href={localePath(lang, "/privacy")} className={link}>
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href={localePath(lang, "/legal")} className={link}>
                  {dict.footer.legalNotice}
                </Link>
              </li>
            </ul>
            <div className="mt-8">
              <LanguageSwitcher current={lang} tone="dark" />
            </div>
          </div>
        </div>

        {/* Wordmark set as wide as the page allows */}
        <p
          aria-hidden
          className="mt-16 select-none whitespace-nowrap font-display text-[clamp(3rem,13.4vw,13rem)] leading-[0.82] text-sand/[0.09]"
        >
          {identity.ownerName}
        </p>

        <div className="mt-8 flex flex-col gap-2 border-t border-sand/15 pt-5 text-[13.5px] text-sand/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {identity.studioName}. {dict.footer.rights}
          </p>
          <p className="eyebrow">{dict.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
