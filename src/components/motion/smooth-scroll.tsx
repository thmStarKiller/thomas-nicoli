"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scrolling, opted out for reduced-motion users.
 * autoRaf ties the scroll loop to requestAnimationFrame.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      wheelMultiplier: 0.95,
    });
    return () => lenis.destroy();
  }, []);
  return null;
}
