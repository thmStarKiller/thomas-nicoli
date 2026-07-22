import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/content/site-config";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { TextReveal } from "@/components/motion/text-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/ui/reveal";

export function FinalCta({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const c = dict.finalCta;
  return (
    <section className="relative overflow-hidden bg-graphite py-32 text-porcelain sm:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, rgba(47,75,255,0.22), rgba(47,75,255,0.05) 55%, transparent 75%)",
        }}
      />
      <div className="relative mx-auto max-w-[1440px] px-5 text-center sm:px-8 lg:px-12">
        <h2 className="font-display font-semibold leading-[1.02] tracking-[-0.02em]">
          <TextReveal
            as="span"
            text={c.title1}
            className="block text-[clamp(2.6rem,7vw,6.4rem)]"
          />
          <TextReveal
            as="span"
            text={c.title2}
            className="block text-[clamp(2.6rem,7vw,6.4rem)] italic text-cobalt-bright"
            delay={0.18}
          />
        </h2>
        <Reveal delay={0.3}>
          <p className="mx-auto mt-8 max-w-xl text-[15.5px] leading-relaxed text-porcelain/60">
            {c.text}
          </p>
        </Reveal>
        <Reveal delay={0.4}>
          <div className="mt-12 flex flex-col items-center gap-6">
            <Magnetic>
              <Link
                href={localePath(lang, "/contact")}
                className="group inline-flex items-center gap-3 rounded-full bg-cobalt px-10 py-5 text-[16px] font-medium text-porcelain shadow-[0_0_54px_rgba(47,75,255,0.4)] transition-colors duration-300 hover:bg-cobalt-bright"
              >
                {c.button}
                <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
            <a
              href={siteConfig.contact.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-[14px] text-porcelain/55 hover:text-porcelain"
            >
              {c.alt}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
