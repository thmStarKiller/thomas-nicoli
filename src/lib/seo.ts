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
  noindex = false,
}: {
  lang: Locale;
  path: string;
  title: string;
  description: string;
  /** For pages that only make sense inside a flow, such as form steps. */
  noindex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(localePath(lang, path));
  // A page that sets its own openGraph replaces the layout's share image,
  // so every page names the image for its language explicitly.
  const image = {
    url: absoluteUrl(`/${lang}/opengraph-image`),
    width: 1200,
    height: 630,
    type: "image/png",
    alt: siteConfig.identity.ownerName,
  };
  return {
    title,
    description,
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
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
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
