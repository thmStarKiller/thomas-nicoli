"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Study = Dictionary["conceptStudies"][number];

const COVERS: Record<string, string> = {
  "aurea-studio": "/visuals/concept-aurea.svg",
  "casa-nomada": "/visuals/concept-casa.svg",
  "atelier-vela": "/visuals/concept-atelier.svg",
};

function StudyCard({
  study,
  lang,
  dict,
  big,
}: {
  study: Study;
  lang: Locale;
  dict: Dictionary;
  big?: boolean;
}) {
  return (
    <Link
      href={localePath(lang, `/work/${study.slug}`)}
      className="group block"
      data-cursor="hover"
    >
      <div className="relative overflow-hidden rounded-2xl bg-graphite-soft">
        <Image
          src={COVERS[study.slug]}
          alt={study.coverAlt}
          width={800}
          height={600}
          className={`w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] ${
            big ? "aspect-[4/3]" : "aspect-[4/3]"
          }`}
        />
        <Badge tone="concept" className="absolute left-4 top-4">
          {dict.common.conceptStudy}
        </Badge>
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-semibold text-porcelain sm:text-3xl">
            {study.name}
          </h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-porcelain/45">
            {study.sector}
          </p>
        </div>
        <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-porcelain/20 text-porcelain/70 transition-all duration-500 group-hover:border-cobalt-bright group-hover:bg-cobalt group-hover:text-porcelain">
          <ArrowUpRight className="size-4.5 transition-transform duration-500 group-hover:rotate-45" />
        </span>
      </div>
      <p className="mt-3 max-w-md text-[14px] leading-relaxed text-porcelain/55">
        {study.summary}
      </p>
    </Link>
  );
}

/** Horizontal-scroll gallery on desktop, vertical stack on mobile / reduced motion. */
export function FeaturedWork({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const reduce = useReducedMotion();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-68%"]);
  const w = dict.workSection;

  const header = (
    <div className="max-w-xl">
      <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.24em] text-porcelain/50">
        {w.eyebrow}
      </p>
      <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-porcelain">
        {w.title}
      </h2>
      <p className="mt-6 text-[15px] leading-relaxed text-porcelain/55">{w.intro}</p>
    </div>
  );

  return (
    <section className="bg-graphite text-porcelain">
      {/* Desktop: pinned horizontal scroll */}
      {!reduce && (
        <div ref={targetRef} className="relative hidden h-[320vh] lg:block">
          <div className="sticky top-0 flex h-screen items-center overflow-hidden">
            <motion.div style={{ x }} className="flex items-center gap-14 pl-12 will-change-transform">
              <div className="w-[34vw] shrink-0">{header}</div>
              {dict.conceptStudies.map((study) => (
                <div key={study.slug} className="w-[44vw] shrink-0">
                  <StudyCard study={study} lang={lang} dict={dict} big />
                </div>
              ))}
              <div className="w-[10vw] shrink-0" />
            </motion.div>
          </div>
        </div>
      )}

      {/* Mobile / reduced motion: vertical stack */}
      <div className={`px-5 py-24 sm:px-8 ${reduce ? "" : "lg:hidden"}`}>
        <div className="mb-14">{header}</div>
        <div className="space-y-16">
          {dict.conceptStudies.map((study) => (
            <StudyCard key={study.slug} study={study} lang={lang} dict={dict} />
          ))}
        </div>
      </div>
    </section>
  );
}
