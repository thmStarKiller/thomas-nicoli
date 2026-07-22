import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/i18n";
import { hasLocale, localePath } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

const COVERS: Record<string, string> = {
  "aurea-studio": "/visuals/concept-aurea.svg",
  "casa-nomada": "/visuals/concept-casa.svg",
  "atelier-vela": "/visuals/concept-atelier.svg",
};

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
    path: "/work",
    title: dict.meta.work.title,
    description: dict.meta.work.description,
  });
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <section className="bg-graphite pb-24 pt-40 text-porcelain sm:pb-32 sm:pt-48">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.24em] text-porcelain/50">
            {dict.workPage.eyebrow}
          </p>
          <TextReveal
            as="h1"
            text={dict.workPage.title}
            className="max-w-4xl font-display text-[clamp(2.4rem,5.5vw,5rem)] font-semibold leading-[1.04] tracking-[-0.02em]"
          />
          <Reveal delay={0.25}>
            <p className="mt-8 max-w-2xl text-[15.5px] leading-relaxed text-porcelain/60">
              {dict.workPage.intro}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Self-initiated builds lead with evidence of execution. */}
      <section className="border-t border-porcelain/10 bg-graphite py-24 text-porcelain sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mb-14">
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.24em] text-porcelain/50">
              {dict.workSection.labTitle}
            </p>
            <h2 className="font-display text-[clamp(2rem,4.2vw,3.6rem)] font-semibold leading-[1.06] tracking-[-0.02em]">
              {dict.common.realWork}
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-porcelain/55">
              {dict.workSection.labNote}
            </p>
          </div>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {dict.labProjects.map((project, i) => (
              <Reveal key={project.name} delay={i * 0.06}>
                <div className="group border-t border-porcelain/15 pt-7 transition-colors duration-500 hover:border-cobalt-bright">
                  <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-cobalt-bright/75">
                    {project.type}
                  </p>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-2xl font-semibold">{project.name}</h3>
                    {"url" in project && project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={project.name}
                        className="flex size-10 shrink-0 items-center justify-center rounded-full border border-porcelain/20 transition-all duration-300 hover:border-cobalt-bright hover:bg-cobalt"
                      >
                        <ArrowUpRight className="size-4" />
                      </a>
                    )}
                  </div>
                  <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-porcelain/55">
                    {project.description}
                  </p>
                  <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-porcelain/65">
                    <span className="font-medium text-porcelain/85">
                      {dict.workPage.contributionLabel}:{" "}
                    </span>
                    {project.contribution}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-porcelain/15 px-3.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-porcelain/50"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fictional studies follow, clearly labelled as explorations. */}
      <section className="bg-porcelain py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] space-y-24 px-5 sm:px-8 lg:px-12">
          <div className="grid gap-5 border-t border-graphite/15 pt-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <h2 className="font-display text-[clamp(1.9rem,3.6vw,3.2rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
              {dict.workPage.conceptsTitle}
            </h2>
            <p className="max-w-2xl text-[15px] leading-relaxed text-graphite/65">
              {dict.workPage.conceptsNote}
            </p>
          </div>
          {dict.conceptStudies.map((study, i) => (
            <Reveal key={study.slug}>
              <Link
                href={localePath(lang, `/work/${study.slug}`)}
                className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
              >
                <div
                  className={`relative overflow-hidden rounded-2xl ${
                    i % 2 === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <Image
                    src={COVERS[study.slug]}
                    alt={study.coverAlt}
                    width={800}
                    height={600}
                    loading="eager"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <Badge tone="concept" className="absolute left-4 top-4">
                    {dict.common.conceptStudy}
                  </Badge>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt">
                    {study.sector}
                  </p>
                  <h2 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,3.2rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
                    {study.name}
                  </h2>
                  <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-graphite/65">
                    {study.summary}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-cobalt">
                    <span className="link-underline">{dict.common.viewCase}</span>
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
