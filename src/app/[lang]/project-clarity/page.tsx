import type { Metadata } from "next";
import { hasLocale, type Locale } from "@/i18n/config";
import { getProjectClarityCopy } from "@/i18n/project-clarity";
import { pageMetadata } from "@/lib/seo";
import { ProjectClarityPage } from "@/components/sections/project-clarity-page";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = hasLocale(lang) ? lang : "es";
  const copy = getProjectClarityCopy(locale).clarity;
  return pageMetadata({ lang: locale, path: "/project-clarity", title: `${copy.eyebrow} — ${copy.title}`, description: copy.intro });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale: Locale = hasLocale(lang) ? lang : "es";
  return <ProjectClarityPage lang={locale} route="unsure" />;
}
