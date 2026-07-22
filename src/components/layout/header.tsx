"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { siteConfig } from "@/content/site-config";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import { LanguageSwitcher } from "./language-switcher";

export function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const links = [
    { label: dict.nav.services, href: localePath(lang, "/services") },
    { label: dict.nav.work, href: localePath(lang, "/work") },
    { label: dict.nav.about, href: localePath(lang, "/about") },
    { label: dict.nav.contact, href: localePath(lang, "/contact") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close menu on navigation — adjust state during render (React-approved pattern).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Focus management + Escape + scroll lock while the overlay is open.
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
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-graphite/8 bg-porcelain/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href={localePath(lang, "/")}
          className="group flex items-baseline gap-1.5 font-display text-[19px] font-semibold tracking-tight text-graphite"
        >
          {siteConfig.identity.ownerName}
          <span className="inline-block size-[7px] rounded-full bg-cobalt transition-transform duration-500 group-hover:scale-150" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "link-underline text-[13.5px] font-medium tracking-wide transition-colors",
                isActive(link.href) ? "text-graphite" : "text-graphite/60 hover:text-graphite",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <LanguageSwitcher current={lang} />
          <Link
            href={localePath(lang, "/contact")}
            className="group inline-flex items-center gap-2 rounded-full bg-graphite px-5 py-2.5 text-[13px] font-medium text-porcelain transition-colors duration-300 hover:bg-cobalt"
          >
            {dict.nav.cta}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? dict.nav.close : dict.nav.menu}
          onClick={() => setOpen((v) => !v)}
          className="flex size-11 items-center justify-center rounded-full border border-graphite/15 text-graphite lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-0 z-[-1] flex min-h-svh flex-col justify-between bg-graphite px-6 pb-10 pt-28 lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-2">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between border-b border-porcelain/10 py-5 font-display text-4xl text-porcelain"
                  >
                    {link.label}
                    <ArrowUpRight className="size-7 text-cobalt-bright transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="flex items-center justify-between"
            >
              <LanguageSwitcher current={lang} tone="dark" />
              <Link
                href={localePath(lang, "/contact")}
                className="inline-flex items-center gap-2 rounded-full bg-cobalt px-6 py-3 text-sm font-medium text-porcelain"
              >
                {dict.nav.cta}
                <ArrowUpRight className="size-4" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
