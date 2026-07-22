import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/content/site-config";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { LanguageSwitcher } from "./language-switcher";
import { MadridClock } from "./madrid-clock";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { contact, identity } = siteConfig;
  const year = new Date().getFullYear();

  const navLinks = [
    { label: dict.nav.services, href: localePath(lang, "/services") },
    { label: dict.nav.work, href: localePath(lang, "/work") },
    { label: dict.nav.about, href: localePath(lang, "/about") },
    { label: dict.nav.contact, href: localePath(lang, "/contact") },
  ];

  const socials = [
    contact.socials.linkedin && { label: "LinkedIn", href: contact.socials.linkedin },
    contact.socials.malt && { label: "Malt", href: contact.socials.malt },
    contact.socials.github && { label: "GitHub", href: contact.socials.github },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="relative overflow-hidden bg-graphite text-porcelain">
      {/* Giant studio signature */}
      <div aria-hidden className="pointer-events-none select-none px-5 pt-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-display text-[clamp(3.2rem,11.5vw,11rem)] font-semibold leading-[0.95] tracking-tight text-porcelain/[0.07]">
            {identity.ownerName}
          </p>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 pb-10 pt-14 sm:px-8 lg:px-12">
        <div className="grid gap-12 border-t border-porcelain/10 pt-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <p className="max-w-sm text-[15px] leading-relaxed text-porcelain/60">
              {dict.footer.tagline}
            </p>
            <MadridClock label={dict.footer.localTime} />
          </div>

          <div>
            <h2 className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-porcelain/40">
              {dict.footer.navigateTitle}
            </h2>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-[15px] text-porcelain/80 hover:text-porcelain"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-porcelain/40">
              {dict.footer.connectTitle}
            </h2>
            <ul className="space-y-3">
              {socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-[15px] text-porcelain/80 hover:text-porcelain"
                  >
                    <span className="link-underline">{s.label}</span>
                    <ArrowUpRight className="size-3.5 text-cobalt-bright transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-porcelain/40">
              {dict.footer.legalTitle}
            </h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href={localePath(lang, "/privacy")}
                  className="link-underline text-[15px] text-porcelain/80 hover:text-porcelain"
                >
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath(lang, "/legal")}
                  className="link-underline text-[15px] text-porcelain/80 hover:text-porcelain"
                >
                  {dict.footer.legalNotice}
                </Link>
              </li>
            </ul>
            <div className="mt-8">
              <LanguageSwitcher current={lang} tone="dark" />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-porcelain/10 pt-6 text-[13px] text-porcelain/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {identity.studioName}. {dict.footer.rights}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em]">
            {dict.footer.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
}
