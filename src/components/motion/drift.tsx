"use client";

import { useEffect, useRef } from "react";

/**
 * Slow vertical drift tied to scroll position, for images inside a clipped
 * frame. The child is oversized by `distance` so its edges never show.
 * Does nothing for visitors who prefer reduced motion.
 */
export function Drift({
  children,
  className,
  distance = 48,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const vh = window.innerHeight;
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      // -1 when the frame is below the viewport, +1 when it has left the top
      const progress = (vh / 2 - (rect.top + rect.height / 2)) / (vh / 2 + rect.height / 2);
      el.style.transform = `translate3d(0, ${(progress * distance) / 2}px, 0)`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [distance]);

  return (
    <div className={className} style={{ top: -distance / 2, bottom: -distance / 2 }}>
      <div ref={ref} className="relative size-full will-change-transform">
        {children}
      </div>
    </div>
  );
}

/**
 * Counts a figure up from zero when it scrolls into view. Any prefix or
 * suffix around the number (a currency sign, a plus) is kept as written.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const match = value.match(/^(\D*)(\d[\d.,\s]*)(.*)$/);
    if (!match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/[^\d]/g, ""));
    if (!Number.isFinite(target) || target === 0) return;
    const format = (n: number) => String(n);

    let frame = 0;
    const run = () => {
      const start = performance.now();
      const duration = 1400;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = `${prefix}${format(Math.round(target * eased))}${suffix}`;
        if (t < 1) frame = requestAnimationFrame(tick);
        else el.textContent = value;
      };
      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        run();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
