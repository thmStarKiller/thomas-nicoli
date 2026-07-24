"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

interface SplitWordsProps {
  text: string;
  className?: string;
  /** Words rendered in italic Fraunces + cobalt. */
  accentWords?: string[];
  /** Stagger between words (s). */
  stagger?: number;
  /** Delay before the first word (s). */
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

/**
 * Avant-garde word reveal: each word slides up from behind an overflow mask
 * with a soft spring. Words are split server-side (deterministic) so there is
 * no layout shift; the animation only enhances.
 */
export function SplitWords({
  text,
  className,
  accentWords = [],
  stagger = 0.045,
  delay = 0,
  as: Tag = "span",
}: SplitWordsProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const accents = new Set(accentWords.map((w) => w.toLowerCase()));

  if (reduce) {
    return (
      <Tag className={className}>
        {words.map((w, i) => (
          <span key={i}>
            <span className={accents.has(w.replace(/[.,;:!?]/g, "").toLowerCase()) ? "font-display italic text-accent" : undefined}>
              {w}
            </span>{" "}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={cn("inline-block", className)} aria-label={text}>
      {words.map((word, i) => {
        const isAccent = accents.has(word.replace(/[.,;:!?]/g, "").toLowerCase());
        return (
          <span
            key={i}
            aria-hidden
            className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom"
          >
            <motion.span
              className={cn(
                "inline-block will-change-transform",
                isAccent && "font-display italic text-accent",
              )}
              initial={false}
              whileInView={{ y: "0%", rotate: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{
                type: "spring",
                stiffness: 130,
                damping: 22,
                delay: delay + i * stagger,
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </span>
        );
      })}
    </Tag>
  );
}
