import { siteConfig } from "@/content/site-config";
import { localePath, type Locale } from "@/i18n/config";

/**
 * Where the main call to action ("Book a call") goes. With a booking link
 * configured (NEXT_PUBLIC_CALENDAR_URL) it opens the calendar. Until then it
 * opens the enquiry form with "an intro call" already selected, where the
 * visitor proposes times. Passing a service pre-selects that offer instead.
 */
export function primaryCta(lang: Locale, service?: string): { href: string; external: boolean } {
  const calendarUrl: string = siteConfig.contact.calendarUrl;
  if (calendarUrl && !service) return { href: calendarUrl, external: true };
  return { href: `${localePath(lang, "/contact")}?service=${service ?? "discovery"}`, external: false };
}
