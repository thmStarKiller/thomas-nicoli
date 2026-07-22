import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDictionary } from "@/i18n";
import { defaultLocale, localePath, locales, type Locale } from "@/i18n/config";

/** [lang] 404 — shown for unknown pages inside a valid locale. */
export default async function NotFound({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  let lang: Locale = defaultLocale;
  try {
    const awaited = await params;
    if ((locales as readonly string[]).includes(awaited?.lang)) {
      lang = awaited.lang as Locale;
    }
  } catch {
    // params unavailable in some 404 contexts — default locale is fine.
  }
  const dict = await getDictionary(lang);

  return (
    <section className="flex min-h-[75svh] flex-col items-center justify-center bg-porcelain px-6 pt-24 text-center">
      <p className="font-display text-[clamp(5rem,16vw,12rem)] font-semibold leading-none text-graphite/10">
        404
      </p>
      <h1 className="mt-2 font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-[-0.02em]">
        {dict.notFound.title}
      </h1>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-graphite/60">
        {dict.notFound.text}
      </p>
      <Link
        href={localePath(lang, "/")}
        className="group mt-10 inline-flex items-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-[14.5px] font-medium text-porcelain transition-colors duration-300 hover:bg-cobalt"
      >
        <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
        {dict.notFound.cta}
      </Link>
    </section>
  );
}
