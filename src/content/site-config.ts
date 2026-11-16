import type { SocialLinks } from "@/types";

/**
 * Single source of truth for identity, contact channels, feature flags and theme.
 * All display copy lives in `src/i18n/dictionaries/*.ts` — components read from
 * dictionaries + this file, never hardcode.
 */
export const siteConfig = {
  identity: {
    ownerName: "Thomas Nicoli",
    studioName: "Thomas Nicoli Consulting",
    city: "Madrid",
    countryCode: "ES",
  },

  contact: {
    // Dedicated public business email used by the simple non-JavaScript fallback.
    email: "thomas.nicoli@metamorphoses-consulting.co.uk",
    phone: "",
    whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "",
    // Google Calendar booking page: 30-minute intro calls, Monday to Wednesday, 19:00 to 21:00 Madrid time.
    calendarUrl:
      process.env.NEXT_PUBLIC_CALENDAR_URL ??
      "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3Xp13lZJN9s-SrYq0OnKqUnVFQGNxFAMycNhY_SfmPIcFL_0OHIaa6tub6esbGG04EEpqfK3RV",
    socials: {
      linkedin: "https://www.linkedin.com/in/thomasnicoli/",
      github: "https://github.com/thmStarKiller",
      malt: "https://www.malt.es/profile/thomasnicoli",
      instagram: "",
    } satisfies SocialLinks,
  },

  media: {
    // Swap this one value to change the portrait site-wide.
    // Fallback placeholder: "/images/profile-placeholder.svg"
    profileImage: "/images/profile.webp",
    // Source portrait is native 2:3; centred positioning preserves head and shoulders.
    profileImageFocus: "50% 50%",
  },

  features: {
    // Prices come from the offer catalogue (version 3). Set to false to hide them all.
    showPrices: true,
    showEmployerReference: false,
    // Shows dashed "Draft" blocks where content still needs confirming (prices,
    // client quotes). Off on the live site; turn on locally to see what is missing.
    showDraftPlaceholders: false,
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    experimentalWebGPU: process.env.NEXT_PUBLIC_EXPERIMENTAL_WEBGPU === "true",
  },

  theme: {
    accent: "#9c350c",
  },

  seo: {
    // The domain attached to the Pages project. Canonical URLs, hreflang, the
    // sitemap and share images are all built from this.
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://metamorphoses-consulting.co.uk",
  },
} as const;

export type SiteConfig = typeof siteConfig;
