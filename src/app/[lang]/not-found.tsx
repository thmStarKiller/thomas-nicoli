import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDictionary } from "@/i18n";
import { defaultLocale, localePath, locales, type Locale } from "@/i18n/config";

/** [lang] 404: shown for unknown pages inside a valid locale. */
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
    // params unavailable in some 404 contexts; the default locale is fine.
  }
  const dict = await getDictionary(lang);

  return (
    <section className="flex min-h-svh flex-col justify-end bg-night px-5 pb-16 pt-32 text-sand sm:px-8 lg:px-12">
      <p className="font-display text-[clamp(6rem,24vw,22rem)] italic leading-[0.8] text-spice-bright">404</p>
      <h1 className="mt-10 max-w-[18ch] font-display text-[clamp(2rem,4.4vw,4rem)] leading-[1.02]">
        {dict.notFound.title}
      </h1>
      <p className="mt-6 max-w-md text-[17px] leading-relaxed text-sand/75">{dict.notFound.text}</p>
      <Link href={localePath(lang, "/")} className="cta group mt-10 self-start">
        <ArrowLeft aria-hidden className="size-4 transition-transform duration-500 group-hover:-translate-x-1" />
        {dict.notFound.cta}
      </Link>
    </section>
  );
}
