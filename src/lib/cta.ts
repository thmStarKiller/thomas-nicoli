import { siteConfig } from "@/content/site-config";
import { localePath, type Locale } from "@/i18n/config";

/**
 * Where the main call to action goes. It leads to the enquiry form, with the
 * requested offer pre-selected when one is given. If a booking link is
 * configured (NEXT_PUBLIC_CALENDAR_URL) and no offer is named, it opens the
 * calendar instead.
 */
export function primaryCta(lang: Locale, service?: string): { href: string; external: boolean } {
  const calendarUrl: string = siteConfig.contact.calendarUrl;
  if (calendarUrl && !service) return { href: calendarUrl, external: true };
  const base = localePath(lang, "/contact");
  return { href: service ? `${base}?service=${service}` : base, external: false };
}
