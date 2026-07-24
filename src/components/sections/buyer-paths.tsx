import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getProjectClarityCopy } from "@/i18n/project-clarity";

export function BuyerPaths({ lang }: { lang: Locale }) {
  const paths = getProjectClarityCopy(lang).buyerPaths;
  return (
    <section aria-label={getProjectClarityCopy(lang).nav} className="border-b border-graphite/10 bg-porcelain">
      <div className="mx-auto grid max-w-[1440px] gap-px bg-graphite/10 sm:grid-cols-2">
        {paths.map((path) => (
          <Link
            key={path.id}
            href={`/${lang}/project-clarity/${path.id}`}
            className="group flex min-h-60 flex-col justify-between bg-porcelain px-6 py-10 transition-colors hover:bg-porcelain-deep sm:px-10 lg:px-12"
          >
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">{path.title}</h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-graphite/65 sm:text-base">{path.text}</p>
            </div>
            <span className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-cobalt">
              {path.cta}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
