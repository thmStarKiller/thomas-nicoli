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
    email: "bonjour@thomas-nicoli.com",
    phone: "",
    whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "",
    calendarUrl: process.env.NEXT_PUBLIC_CALENDAR_URL ?? "",
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
    showPrices: false,
    showEmployerReference: false,
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    experimentalWebGPU: process.env.NEXT_PUBLIC_EXPERIMENTAL_WEBGPU === "true",
  },

  theme: {
    accent: "#1f3be0",
  },

  seo: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thomas-nicoli.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
