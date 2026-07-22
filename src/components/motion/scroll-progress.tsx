"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/** Thin cobalt scroll-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
