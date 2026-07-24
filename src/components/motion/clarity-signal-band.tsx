"use client";

import { motion, useReducedMotion } from "motion/react";

export function ClaritySignalBand({ stages }: { stages: readonly string[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div data-testid="clarity-signal-band" className="relative overflow-hidden border-y border-cobalt-deep/50 bg-cobalt text-porcelain">
      <motion.div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] blur-xl"
        initial={false}
        animate={reduceMotion ? undefined : { x: ["-140%", "440%"] }}
        transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
      />
      <div className="relative mx-auto grid max-w-[1200px] grid-cols-2 gap-px bg-white/15 sm:grid-cols-4">
        {stages.map((stage, index) => (
          <div key={stage} className="relative flex min-h-20 items-center gap-3 bg-cobalt px-5 py-4 sm:min-h-24 sm:px-6">
            <span className="relative flex size-2 shrink-0">
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full bg-porcelain"
                animate={reduceMotion ? undefined : { scale: [1, 1.8, 1], opacity: [0.95, 0.18, 0.95] }}
                transition={{ duration: 2.8, delay: index * 0.45, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="relative size-2 rounded-full bg-porcelain" />
            </span>
            <div>
              <span className="block font-mono text-[9px] tracking-[0.22em] text-porcelain/55">0{index + 1}</span>
              <span className="mt-1 block text-[12px] font-medium uppercase tracking-[0.12em] sm:text-[13px]">{stage}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
