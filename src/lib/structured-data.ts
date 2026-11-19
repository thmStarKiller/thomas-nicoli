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
  labels: { jobTitle: string; serviceArea: string; knowsAbout?: readonly string[] },
) {
  const { identity, contact } = siteConfig;
  const url = absoluteUrl(localePath(lang, "/"));
  const contactPoint = {
    "@type": "ContactPoint",
    contactType: "sales",
    email: contact.email,
    url: absoluteUrl(localePath(lang, "/contact")),
    availableLanguage: ["es", "en", "fr"],
  };

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
        email: contact.email,
        image: absoluteUrl(`/${lang}/opengraph-image`),
        contactPoint,
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
        email: contact.email,
        ...(labels.knowsAbout?.length ? { knowsAbout: [...labels.knowsAbout] } : {}),
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
        description,
        inLanguage: ["es", "en", "fr"],
        publisher: { "@id": `${absoluteUrl("/")}#person` },
      },
    ],
  };
}

/** FAQ markup for a page that shows these questions and answers. */
export function buildFaqData(items: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * Services shown on the business page. Only the audit carries a price,
 * because it is the one offer with a single fixed fee; the sprints are
 * quoted, so they are listed without one.
 */
export function buildServiceData(
  lang: Locale,
  audit: { name: string; description: string; price: string },
  services: readonly { slug: string; name: string; description: string }[],
) {
  const page = absoluteUrl(localePath(lang, "/business"));
  const provider = { "@id": `${absoluteUrl("/")}#studio` };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: audit.name,
        description: audit.description,
        provider,
        url: `${page}#audit`,
        offers: {
          "@type": "Offer",
          price: audit.price.replace(/[^0-9]/g, ""),
          priceCurrency: "EUR",
          url: `${page}#audit`,
        },
      },
      ...services.map((service) => ({
        "@type": "Service",
        name: service.name,
        description: service.description,
        provider,
        url: `${page}#${service.slug}`,
      })),
    ],
  };
}
