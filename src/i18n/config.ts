export const locales = ["es", "en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
};

/** hreflang codes per locale */
export const hreflangMap: Record<Locale, string> = {
  es: "es",
  en: "en",
  fr: "fr",
};

export function hasLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

/** Prefix a path with a locale: localePath("fr", "/services") -> "/fr/services" */
export function localePath(lang: Locale, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${clean}`;
}

/** Pick the best locale from an Accept-Language header value. */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const prefs = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .filter((p) => p.tag)
    .sort((a, b) => b.q - a.q);
  for (const { tag } of prefs) {
    const base = tag.split("-")[0];
    if (hasLocale(base)) return base;
  }
  return defaultLocale;
}
