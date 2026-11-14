"use client";

import { useState } from "react";
import type { Faq } from "@/i18n/site";
import { cn } from "@/lib/cn";

/**
 * Objection-handling accordion. Answers stay in the DOM and open with a
 * grid-row transition, so search engines can read them and no motion
 * library is needed.
 */
export function FaqSection({
  eyebrow,
  title,
  items,
  aside,
  tone = "sand",
}: {
  eyebrow: string;
  title: string;
  items: readonly Faq[];
  /** Optional block under the title, used for the call to action. */
  aside?: React.ReactNode;
  tone?: "sand" | "sand-deep";
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={cn("py-24 sm:py-36", tone === "sand" ? "bg-sand" : "bg-sand-deep")}>
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <p className="eyebrow text-spice">{eyebrow}</p>
          <h2 className="mt-6 text-balance font-display text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.04]">
            {title}
          </h2>
          {aside && <div className="mt-9">{aside}</div>}
        </div>

        <div className="border-b border-night/25 lg:col-span-7 lg:col-start-6">
          {items.map((item, i) => {
            const open = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            return (
              <div key={item.question} className="border-t border-night/25">
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
                  >
                    <span
                      className={cn(
                        "font-display text-[1.45rem] leading-tight transition-colors duration-500 sm:text-[1.75rem]",
                        open ? "text-spice" : "text-night group-hover:text-spice",
                      )}
                    >
                      {item.question}
                    </span>
                    <span aria-hidden className="relative block size-5 shrink-0">
                      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                      <span
                        className={cn(
                          "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
                          open && "scale-y-0",
                        )}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden" inert={!open}>
                    <p className="max-w-[40rem] pb-8 text-[18px] leading-relaxed text-night/80">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
