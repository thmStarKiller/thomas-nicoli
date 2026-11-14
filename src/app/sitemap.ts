import type { MetadataRoute } from "next";
import { locales, localePath } from "@/i18n/config";
import { getSite } from "@/i18n/site";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const STATIC_PATHS = [
  "/",
  "/business",
  "/professionals",
  "/work",
  "/about",
  "/contact",
  "/project-clarity",
  "/privacy",
  "/legal",
];
const CASE_SLUGS = getSite("en").work.cases.map((item) => item.slug);

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...STATIC_PATHS, ...CASE_SLUGS.map((s) => `/work/${s}`)];
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
