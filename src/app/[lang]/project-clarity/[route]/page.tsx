import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, locales, type Locale } from "@/i18n/config";
import { getProjectClarityCopy } from "@/i18n/project-clarity";
import { CLARITY_ROUTE_IDS, type ClarityRouteId } from "@/lib/project-clarity/contracts";
import { pageMetadata } from "@/lib/seo";
import { ProjectClarityPage } from "@/components/sections/project-clarity-page";

export function generateStaticParams() {
  return locales.flatMap((lang) => CLARITY_ROUTE_IDS.map((route) => ({ lang, route })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; route: string }> }): Promise<Metadata> {
  const { lang, route } = await params;
  const locale: Locale = hasLocale(lang) ? lang : "es";
  if (!CLARITY_ROUTE_IDS.includes(route as ClarityRouteId)) return {};
  const copy = getProjectClarityCopy(locale).clarity;
  return pageMetadata({ lang: locale, path: `/project-clarity/${route}`, title: `${copy.eyebrow} — ${copy.title}`, description: copy.intro });
}

export default async function Page({ params }: { params: Promise<{ lang: string; route: string }> }) {
  const { lang, route } = await params;
  if (!hasLocale(lang) || !CLARITY_ROUTE_IDS.includes(route as ClarityRouteId)) notFound();
  return <ProjectClarityPage lang={lang} route={route as ClarityRouteId} />;
}
