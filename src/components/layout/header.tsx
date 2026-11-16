"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/content/site-config";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { getSite } from "@/i18n/site";
import { primaryCta } from "@/lib/cta";
import { cn } from "@/lib/cn";
import { LanguageSwitcher } from "./language-switcher";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

export function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const site = getSite(lang);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastY = useRef(0);
  const cta = primaryCta(lang);

  const links = [
    { label: site.nav.business, href: localePath(lang, "/business") },
    { label: site.nav.professionals, href: localePath(lang, "/professionals") },
    { label: site.nav.work, href: localePath(lang, "/work") },
    { label: site.nav.about, href: localePath(lang, "/about") },
    { label: site.nav.contact, href: localePath(lang, "/contact") },
  ];

  // Solid once the page has moved; slides away going down, returns going up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 420 && y > lastY.current);
      lastY.current = y;
    };
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close menu on navigation: adjust state during render.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Focus management, Escape and scroll lock while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const firstLink = panelRef.current?.querySelector<HTMLElement>("a");
    firstLink?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (href !== `/${lang}` && pathname.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 text-sand transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
        hidden && !open ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div
        className={cn(
          "relative z-10 border-b transition-colors duration-500",
          scrolled || open ? "border-sand/15 bg-night" : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[72px] lg:px-12">
          <Link
            href={localePath(lang, "/")}
            className="font-display text-[1.4rem] leading-none text-sand lg:text-[1.55rem]"
          >
            {siteConfig.identity.ownerName}
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "eyebrow link-underline py-2 transition-colors duration-300",
                  isActive(link.href) ? "text-sand" : "text-sand/65 hover:text-sand",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-7 lg:flex">
            <LanguageSwitcher current={lang} tone="dark" />
            {cta.external ? (
              <a href={cta.href} target="_blank" rel="noopener noreferrer" className="cta cta-sm" data-cta="header">
                {site.cta.call}
              </a>
            ) : (
              <Link href={cta.href} className="cta cta-sm" data-cta="header">
                {site.cta.call}
              </Link>
            )}
          </div>

          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="eyebrow flex h-11 items-center gap-3 px-1 text-sand lg:hidden"
          >
            <span>{open ? dict.nav.close : dict.nav.menu}</span>
            <span aria-hidden className="relative block h-[9px] w-6">
              <span
                className={cn(
                  "absolute inset-x-0 top-0 h-px bg-current transition-transform duration-500",
                  open && "translate-y-1 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-500",
                  open && "-translate-y-1 -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Always in the page, uncovered with a clip when opened */}
      <div
        id="mobile-menu"
        ref={panelRef}
        inert={!open}
        className={cn(
          "fixed inset-0 flex min-h-svh flex-col justify-between overflow-y-auto bg-night px-5 pb-8 pt-24 transition-[clip-path,visibility] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] sm:px-8 lg:hidden",
          open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]",
        )}
      >
        <nav aria-label="Mobile">
          <p className="eyebrow mb-4 text-sand/65">{site.nav.index}</p>
          {links.map((link, i) => (
            <div
              key={link.href}
              className={cn(
                "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
              style={{ transitionDelay: open ? `${180 + i * 60}ms` : "0ms" }}
            >
              <Link href={link.href} className="group flex items-baseline gap-5 border-t border-sand/15 py-4 text-sand">
                <span className="w-8 font-display text-lg text-spice-bright">{NUMERALS[i]}</span>
                <span className="font-display text-[2.1rem] leading-tight">{link.label}</span>
              </Link>
            </div>
          ))}
          <Link
            href={localePath(lang, "/project-clarity")}
            className="eyebrow flex min-h-11 items-center border-t border-sand/15 pt-4 text-sand/65"
          >
            {site.nav.clarity}
          </Link>
        </nav>
        <div className="mt-10 flex flex-col gap-6">
          {cta.external ? (
            <a href={cta.href} target="_blank" rel="noopener noreferrer" className="cta cta-spice w-full">
              {site.cta.call}
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          ) : (
            <Link href={cta.href} className="cta cta-spice w-full">
              {site.cta.call}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          )}
          <LanguageSwitcher current={lang} tone="dark" />
        </div>
      </div>
    </header>
  );
}
