import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { hasLocale } from "@/i18n/config";
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
    path: "/legal",
    title: dict.meta.legal.title,
    description: dict.meta.legal.description,
  });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const l = dict.legal;

  return <DocPage title={l.title} intro={l.intro} sections={l.sections} note={l.note} />;
}
