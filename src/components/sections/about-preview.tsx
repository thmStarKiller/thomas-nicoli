import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/content/site-config";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { TextReveal } from "@/components/motion/text-reveal";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/ui/reveal";

export function AboutPreview({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const a = dict.about;
  const preview = dict.aboutPreview;
  return (
    <section className="overflow-hidden bg-porcelain-deep/60 py-28 sm:py-36">
      <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-12">
        <Parallax speed={0.12}>
          <ImageReveal className="relative">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl">
              <Image
                src={siteConfig.media.profileImage}
                alt={a.portraitAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
                style={{ objectPosition: siteConfig.media.profileImageFocus }}
              />
            </div>
            <div
              aria-hidden
              className="absolute -bottom-5 -right-5 -z-10 h-full w-full rounded-2xl border border-cobalt/40"
            />
          </ImageReveal>
        </Parallax>

        <div>
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.24em] text-graphite/50">
            {preview.eyebrow}
          </p>
          <TextReveal
            as="h2"
            text={preview.title}
            className="font-display text-[clamp(2rem,4.2vw,3.6rem)] font-semibold leading-[1.06] tracking-[-0.02em]"
          />
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-xl text-[15.5px] leading-relaxed text-graphite/65">
              {preview.text}
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {a.languages.slice(0, 3).map((l) => (
                <li
                  key={l}
                  className="rounded-full border border-graphite/15 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-graphite/60"
                >
                  {l}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.28}>
            <Link
              href={localePath(lang, "/about")}
              className="group mt-9 inline-flex items-center gap-2 text-[15px] font-medium text-cobalt"
            >
              <span className="link-underline">{preview.cta}</span>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
