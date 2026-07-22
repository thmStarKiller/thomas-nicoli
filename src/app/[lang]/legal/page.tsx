import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/ui/reveal";

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

  return (
    <section className="bg-porcelain pb-28 pt-40 sm:pt-48">
      <div className="mx-auto max-w-[900px] px-5 sm:px-8">
        <TextReveal
          as="h1"
          text={l.title}
          className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold leading-[1.05] tracking-[-0.02em]"
        />
        <Reveal delay={0.15}>
          <p className="mt-8 text-[15.5px] leading-relaxed text-graphite/65">{l.intro}</p>
        </Reveal>
        <div className="mt-14 space-y-10">
          {l.sections.map((section, i) => (
            <Reveal key={section.heading} delay={i * 0.04}>
              <div className="border-t border-graphite/12 pt-8">
                <h2 className="font-display text-[1.5rem] font-semibold">
                  <span className="mr-4 font-mono text-[12px] tracking-[0.2em] text-cobalt">
                    0{i + 1}
                  </span>
                  {section.heading}
                </h2>
                <p className="mt-4 text-[14.5px] leading-relaxed text-graphite/65">
                  {section.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        {/* Owner note: template text — add autónomo registration details (NIF, fiscal
            address) and confirm with a legal advisor before public launch. */}
        <p className="mt-14 rounded-xl border border-graphite/12 bg-porcelain-deep/60 p-5 text-[13px] leading-relaxed text-graphite/50">
          {l.note}
        </p>
      </div>
    </section>
  );
}
