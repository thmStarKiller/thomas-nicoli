import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localePath, type Locale } from "@/i18n/config";
import type { CaseItem } from "@/i18n/site";
import { Rise } from "@/components/ui/rise";

/** Index of builds on night. Each row opens the case page. */
export function WorkRows({ lang, cases }: { lang: Locale; cases: readonly CaseItem[] }) {
  return (
    <ul className="border-b border-sand/20">
      {cases.map((item, i) => (
        <Rise as="li" key={item.slug} delay={Math.min(i, 4) * 80}>
          <Link
            href={localePath(lang, `/work/${item.slug}`)}
            className="row-fill group grid grid-cols-12 items-baseline gap-x-4 gap-y-2 border-t border-sand/20 py-7 sm:py-9"
          >
            <span className="eyebrow col-span-12 opacity-65 lg:col-span-1">{item.period}</span>
            <span className="row-shift col-span-12 font-display text-[clamp(2rem,4.6vw,4.4rem)] leading-[0.98] tracking-[-0.03em] lg:col-span-6">
              {item.title}
            </span>
            <span className="col-span-12 lg:col-span-3">
              <span className="block max-w-[32rem] text-[17px] leading-snug opacity-85">{item.summary}</span>
            </span>
            <span className="eyebrow col-span-10 opacity-65 lg:col-span-1">{item.status}</span>
            <span className="col-span-2 justify-self-end lg:col-span-1">
              <ArrowUpRight aria-hidden className="row-arrow size-7" strokeWidth={1.1} />
            </span>
          </Link>
        </Rise>
      ))}
    </ul>
  );
}
