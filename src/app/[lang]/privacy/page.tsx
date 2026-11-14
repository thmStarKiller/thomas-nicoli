import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { hasLocale } from "@/i18n/config";
import { getProjectClarityPrivacy } from "@/i18n/privacy-additions";
import { pageMetadata } from "@/lib/seo";
import { DocPage } from "@/components/ui/doc-sections";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/privacy",
    title: dict.meta.privacy.title,
    description: dict.meta.privacy.description,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const p = dict.privacy;
  const claritySections = getProjectClarityPrivacy(lang);

  return <DocPage title={p.title} intro={p.intro} sections={[...p.sections, ...claritySections]} note={p.note} />;
}
