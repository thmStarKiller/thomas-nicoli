import type { Metadata } from "next";
import { siteConfig } from "@/content/site-config";
import { locales, localePath, type Locale } from "@/i18n/config";

export function absoluteUrl(path = ""): string {
  const base = siteConfig.seo.siteUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function languagesFor(path: string) {
  const entries = Object.fromEntries(
    locales.map((l) => [l, absoluteUrl(localePath(l, path))]),
  ) as Record<Locale, string>;
  return { ...entries, "x-default": entries.es };
}

/** Locale-aware page metadata: canonical per locale + hreflang cluster. */
export function pageMetadata({
  lang,
  path,
  title,
  description,
}: {
  lang: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const canonical = absoluteUrl(localePath(lang, path));
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: languagesFor(path),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.identity.studioName,
      locale: lang === "fr" ? "fr_FR" : lang === "en" ? "en_GB" : "es_ES",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
