import type { MetadataRoute } from "next";
import { locales, localePath } from "@/i18n/config";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const STATIC_PATHS = ["/", "/services", "/work", "/about", "/contact", "/privacy", "/legal"];
const STUDY_SLUGS = ["aurea-studio", "casa-nomada", "atelier-vela"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...STATIC_PATHS, ...STUDY_SLUGS.map((s) => `/work/${s}`)];
  const now = new Date();

  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: absoluteUrl(localePath(lang, path)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((l) => [l, absoluteUrl(localePath(l, path))]),
          ["x-default", absoluteUrl(localePath("es", path))],
        ]),
      },
    })),
  );
}
