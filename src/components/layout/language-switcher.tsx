"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

/** ES / EN / FR switcher — preserves the current path across locales. */
export function LanguageSwitcher({
  current,
  tone = "light",
  className,
}: {
  current: Locale;
  tone?: "light" | "dark";
  className?: string;
}) {
  const pathname = usePathname() ?? `/${current}`;

  const targetPath = (locale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  };

  return (
    <nav aria-label="Language" className={cn("flex items-center gap-1", className)}>
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && (
            <span
              aria-hidden
              className={cn(
                "mx-1.5 h-3 w-px",
                tone === "dark" ? "bg-porcelain/25" : "bg-graphite/20",
              )}
            />
          )}
          <Link
            href={targetPath(locale)}
            hrefLang={locale}
            aria-current={locale === current ? "true" : undefined}
            title={localeNames[locale]}
            className={cn(
              "font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300",
              locale === current
                ? tone === "dark"
                  ? "text-porcelain"
                  : "text-graphite"
                : tone === "dark"
                  ? "text-porcelain/45 hover:text-porcelain"
                  : "text-graphite/45 hover:text-graphite",
            )}
          >
            {locale}
          </Link>
        </span>
      ))}
    </nav>
  );
}
