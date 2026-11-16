"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * One band of oversized words that never stops. It speeds up and leans with
 * the scroll, and reverses when the page is scrolled the other way.
 * Decorative: the same information is in the page as text.
 */
function Band({
  items,
  direction,
  className,
  squareClassName,
  alternateClassName,
}: {
  items: readonly string[];
  direction: 1 | -1;
  className?: string;
  squareClassName: string;
  /** Colour of every second word. */
  alternateClassName: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let x = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let boost = 0;
    let lean = 0;
    let heading = 1;
    let running = false;

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(64, now - lastT);
      lastT = now;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (dy !== 0) heading = dy > 0 ? 1 : -1;
      // ease the scroll energy in and let it decay
      boost += (Math.min(60, Math.abs(dy)) * 0.9 - boost) * 0.12;
      lean += (Math.max(-9, Math.min(9, dy * 0.22)) - lean) * 0.1;
      const half = track.scrollWidth / 2;
      x -= direction * heading * (0.055 * dt + boost * 0.9);
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0) skewX(${(-direction * lean).toFixed(2)}deg)`;
      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        lastT = performance.now();
        lastY = window.scrollY;
        frame = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });
    io.observe(track.parentElement ?? track);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, [direction]);

  const row = (
    <span className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={item} className="flex items-center">
          <span
            className={cn(
              "px-[0.22em] font-display text-[clamp(3.4rem,11.5vw,12rem)] italic leading-[0.95]",
              i % 2 === 1 && alternateClassName,
            )}
          >
            {item}
          </span>
          <span className={cn("size-[clamp(0.6rem,1.4vw,1.4rem)] shrink-0", squareClassName)} />
        </span>
      ))}
    </span>
  );

  return (
    <div className={cn("overflow-hidden py-[clamp(0.8rem,2vw,2rem)]", className)}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        {row}
        {row}
      </div>
    </div>
  );
}

/** Two bands crossing in opposite directions, on night and on spice. */
export function Ticker({ items }: { items: readonly string[] }) {
  const reversed = [...items].reverse();
  return (
    <div aria-hidden className="relative select-none">
      <Band items={items} direction={1} className="bg-night text-sand" squareClassName="bg-spice-bright" alternateClassName="text-spice-bright" />
      <Band items={reversed} direction={-1} className="bg-spice-bright text-night" squareClassName="bg-night" alternateClassName="not-italic" />
    </div>
  );
}
