import type { Locale } from "../config";
import { site as en } from "./en";
import { site as es } from "./es";
import { site as fr } from "./fr";
import type { SiteCopy } from "./types";

const copy: Record<Locale, SiteCopy> = { en, es, fr };

/** Copy for the audience-led pages: home, business, professionals and work. */
export function getSite(lang: Locale): SiteCopy {
  return copy[lang];
}

/** Options for the "what are you interested in" field of the enquiry form. */
export function getContactOptions(lang: Locale): { value: string; label: string }[] {
  const site = copy[lang];
  return [
    { value: "discovery", label: site.cta.callOption },
    { value: "ai-opportunity-audit", label: site.home.audit.title.join("").replace(/\.$/, "") },
    ...site.business.build.offers.map((offer) => ({ value: offer.slug, label: offer.name })),
    { value: "monthly-support", label: site.business.support.title.replace(/\.$/, "") },
    { value: "ai-training", label: site.professionals.modules[0].title },
    { value: "agency-content", label: site.professionals.agencies.eyebrow },
  ];
}

export type { Accent, CaseItem, Door, Faq, Offer, SiteCopy, TimelineEntry } from "./types";
