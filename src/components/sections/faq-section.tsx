"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { cn } from "@/lib/cn";

type Faq = Dictionary["faq"]["items"][number];

export function FaqSection({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: readonly Faq[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-porcelain py-28 sm:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.5fr] lg:gap-24 lg:px-12">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.24em] text-graphite/50">
            {eyebrow}
          </p>
          <h2 className="font-display text-[clamp(2rem,4.2vw,3.6rem)] font-semibold leading-[1.06] tracking-[-0.02em]">
            {title}
          </h2>
        </div>

        <div>
          {items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.question} className="border-t border-graphite/12 last:border-b">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="group flex w-full items-center justify-between gap-6 py-7 text-left"
                >
                  <span
                    className={cn(
                      "font-display text-[1.25rem] font-semibold leading-snug transition-colors duration-300 sm:text-[1.45rem]",
                      open ? "text-cobalt" : "text-graphite group-hover:text-cobalt",
                    )}
                  >
                    {item.question}
                  </span>
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                      open
                        ? "rotate-45 border-cobalt bg-cobalt text-porcelain"
                        : "border-graphite/15 text-graphite group-hover:border-cobalt group-hover:text-cobalt",
                    )}
                  >
                    <Plus className="size-4.5" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 text-[15px] leading-relaxed text-graphite/65">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
