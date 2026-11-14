"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { primaryCta } from "@/lib/cta";
import { cn } from "@/lib/cn";

const chatEnabled = process.env.NEXT_PUBLIC_CHATBOT_ENABLED === "true";

/**
 * Phone-only action bar. The header button covers larger screens; on a phone
 * the menu hides it, so this keeps the call to action one tap away once the
 * visitor has scrolled past the first screen.
 */
export function StickyCta({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname() ?? "";
  const [visible, setVisible] = useState(false);
  const cta = primaryCta(lang);

  // The form pages are the destination, so the bar would only get in the way.
  const suppressed = /\/(contact|project-clarity)(\/|$)/.test(pathname);

  useEffect(() => {
    if (suppressed) return;
    const onScroll = () => {
      const nearEnd =
        window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 320;
      setVisible(window.scrollY > window.innerHeight * 0.7 && !nearEnd);
    };
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [suppressed, pathname]);

  if (suppressed) return null;

  // Sand with a night edge reads on all three section colours.
  const className = "cta w-full border border-night";
  const inner = (
    <>
      {label}
      <ArrowUpRight className="size-[1.1em]" aria-hidden />
    </>
  );

  return (
    <div
      data-testid="sticky-cta"
      aria-hidden={!visible}
      className={cn(
        "fixed bottom-4 left-4 z-[80] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
        chatEnabled ? "right-[88px]" : "right-4",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      {cta.external ? (
        <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className} tabIndex={visible ? 0 : -1} data-cta="sticky">
          {inner}
        </a>
      ) : (
        <Link href={cta.href} className={className} tabIndex={visible ? 0 : -1} data-cta="sticky">
          {inner}
        </Link>
      )}
    </div>
  );
}
