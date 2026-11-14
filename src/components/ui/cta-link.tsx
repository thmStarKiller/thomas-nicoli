import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { primaryCta } from "@/lib/cta";
import { cn } from "@/lib/cn";

/**
 * The primary action of the site. By default it leads to the enquiry form;
 * pass `service` to pre-select an offer there. With a booking link configured
 * and no service given, it opens the calendar instead.
 */
export function CtaLink({
  lang,
  children,
  tone = "sand",
  size = "md",
  service,
  className,
}: {
  lang: Locale;
  children: React.ReactNode;
  /** sand: for night backgrounds. night: for sand backgrounds. spice: accent. */
  tone?: "sand" | "night" | "spice";
  size?: "md" | "sm";
  service?: string;
  className?: string;
}) {
  const target = primaryCta(lang, service);
  const classes = cn(
    "cta group",
    tone === "night" && "cta-on-sand",
    tone === "spice" && "cta-spice",
    size === "sm" && "cta-sm",
    className,
  );
  const icon = (
    <ArrowUpRight
      aria-hidden
      className="size-[1.25em] shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
    />
  );
  if (target.external) {
    return (
      <a href={target.href} target="_blank" rel="noopener noreferrer" className={classes} data-cta="primary">
        {children}
        {icon}
      </a>
    );
  }
  return (
    <Link href={target.href} className={classes} data-cta="primary">
      {children}
      {icon}
    </Link>
  );
}
