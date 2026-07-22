import { siteConfig } from "@/content/site-config";
import { localePath, type Locale } from "@/i18n/config";
import { absoluteUrl } from "./seo";

/**
 * JSON-LD structured data — built ONLY from real, confirmed config values.
 * No ratings, no fake addresses, no invented prices.
 */
export function buildStructuredData(
  lang: Locale,
  description: string,
  labels: { jobTitle: string; serviceArea: string },
) {
  const { identity, contact } = siteConfig;
  const url = absoluteUrl(localePath(lang, "/"));

  const sameAs = [
    contact.socials.linkedin,
    contact.socials.malt,
    contact.socials.github,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${absoluteUrl("/")}#studio`,
        name: identity.studioName,
        description,
        url,
        founder: { "@id": `${absoluteUrl("/")}#person` },
        areaServed: { "@type": "Place", name: labels.serviceArea },
        address: {
          "@type": "PostalAddress",
          addressLocality: identity.city,
          addressCountry: identity.countryCode,
        },
        sameAs,
      },
      {
        "@type": "Person",
        "@id": `${absoluteUrl("/")}#person`,
        name: identity.ownerName,
        jobTitle: labels.jobTitle,
        url,
        image: absoluteUrl(siteConfig.media.profileImage),
        worksFor: { "@id": `${absoluteUrl("/")}#studio` },
        address: {
          "@type": "PostalAddress",
          addressLocality: identity.city,
          addressCountry: identity.countryCode,
        },
        sameAs,
        knowsLanguage: ["fr", "en", "es"],
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        url: absoluteUrl("/"),
        name: identity.studioName,
        inLanguage: ["es", "en", "fr"],
        publisher: { "@id": `${absoluteUrl("/")}#person` },
      },
    ],
  };
}
