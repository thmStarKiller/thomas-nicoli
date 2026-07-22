"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Awwwards-style custom cursor: precise dot + lagging ring.
 * Ring enlarges over any element with data-cursor="hover".
 * mix-blend-difference keeps it legible on porcelain and graphite.
 * Only rendered for fine pointers (CSS hides it otherwise).
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setHovering(Boolean(t?.closest?.("[data-cursor='hover'], a, button")));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    // Deferred enable — keeps the effect body free of synchronous setState.
    const raf = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="custom-cursor"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      >
        <div className="size-1.5 rounded-full bg-white" />
      </motion.div>
      <motion.div
        aria-hidden
        className="custom-cursor"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="rounded-full border border-white/80"
          animate={{
            width: hovering ? 52 : 32,
            height: hovering ? 52 : 32,
            opacity: hovering ? 0.9 : 0.5,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
        />
      </motion.div>
    </>
  );
}
