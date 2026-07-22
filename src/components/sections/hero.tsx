import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { Hero3D } from "@/components/three/hero-3d";
import { TextReveal } from "@/components/motion/text-reveal";
import { Magnetic } from "@/components/motion/magnetic";

export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const h = dict.hero;
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-graphite text-porcelain">
      {/* Cobalt glow field */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[15%] top-1/2 size-[80vmin] -translate-y-1/2 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, rgba(47,75,255,0.28), rgba(47,75,255,0.08) 55%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[20%] -top-[30%] size-[60vmin] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(47,75,255,0.16), transparent 70%)",
        }}
      />

      {/* 3D sculpture — right side on desktop, behind content on mobile */}
      <div className="absolute inset-y-0 right-0 w-full opacity-45 sm:opacity-60 lg:left-auto lg:w-[52vw] lg:opacity-100">
        <Hero3D />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-5 pb-28 pt-36 sm:px-8 lg:px-12">
        <p className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-porcelain/55">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-pulse-dot rounded-full bg-cobalt-bright" />
          </span>
          {h.eyebrow}
          <span aria-hidden className="hidden h-px w-10 bg-porcelain/25 sm:inline-block" />
          <span className="hidden text-cobalt-bright/90 sm:inline">{dict.common.availability}</span>
        </p>

        <h1 className="font-display font-semibold leading-[0.98] tracking-[-0.02em]">
          <TextReveal
            as="span"
            text={h.line1}
            className="block text-[clamp(2.9rem,8.2vw,7.6rem)]"
            delay={0.05}
          />
          <TextReveal
            as="span"
            text={h.line2}
            className="block text-[clamp(2.9rem,8.2vw,7.6rem)] italic text-cobalt-bright"
            delay={0.22}
          />
          <TextReveal
            as="span"
            text={h.line3}
            className="block text-[clamp(2.9rem,8.2vw,7.6rem)]"
            delay={0.39}
          />
        </h1>

        <div className="mt-10 max-w-xl">
          <TextReveal
            as="p"
            text={h.supporting}
            className="text-[15.5px] leading-relaxed text-porcelain/65 sm:text-[17px]"
            delay={0.55}
            stagger={0.012}
          />
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-5">
          <Magnetic>
            <Link
              href={localePath(lang, "/contact")}
              className="group inline-flex items-center gap-2.5 rounded-full bg-cobalt px-8 py-4 text-[15px] font-medium text-porcelain shadow-[0_0_44px_rgba(47,75,255,0.35)] transition-colors duration-300 hover:bg-cobalt-bright"
            >
              {h.primaryCta}
              <ArrowUpRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Magnetic>
          <Link
            href={localePath(lang, "/work")}
            className="link-underline text-[15px] font-medium text-porcelain/80 hover:text-porcelain"
          >
            {h.secondaryCta}
          </Link>
        </div>

        <p className="mt-14 font-mono text-[11px] uppercase tracking-[0.22em] text-porcelain/40">
          {h.trustLine}
        </p>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-porcelain/40">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em]">
            {dict.common.scroll}
          </span>
          <ArrowDown className="size-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
