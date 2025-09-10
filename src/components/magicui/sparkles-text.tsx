"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface SparkleProps {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

function Sparkle({ id, x, y, color, delay, scale, lifespan }: SparkleProps) {
  return (
    <motion.svg
      key={id}
              className={cn(
          "absolute inset-0 pointer-events-none select-none",
          "mix-blend-multiply dark:mix-blend-screen"
        )}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, scale, 0],
        rotate: [75, 120, 150],
      }}
      transition={{ duration: lifespan, delay, ease: "easeInOut" }}
      width="21"
      height="21"
      viewBox="0 0 21 21"
      style={{ left: x, top: y }}
    >
      <path
        d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59943 18.2797 9.13822L20.1561 9.82534C20.7848 10.0553 20.7848 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4006 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7848 10.0553 20.7848 9.82531 20.1562L9.13819 18.2798C8.59941 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4006 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59943 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59941 4.19229 9.13819 2.72026L9.82531 0.843845Z"
        fill={color}
      />
    </motion.svg>
  );
}

interface SparklesTextProps {
  /**
   * @default <span />
   * @type React.ReactElement
   * @description
   * The component to be rendered as the text
   * */
  as?: React.ReactElement;
  /**
   * @default ""
   * @type string
   * @description
   * The className of the text
   */
  className?: string;

  /**
   * @default ""
   * @type React.ReactNode
   * @description
   * The children of the text
   * */
  children?: React.ReactNode;

  /**
   * @default 10
   * @type number
   * @description
   * The number of sparkles
   * */
  sparklesCount?: number;

  /**
   * @default ["#FFC700", "#FF0069", "#FF006E"]
   * @type string[]
   * @description
   * The colors of the sparkles
   * */
  colors?: {
    first: string;
    second: string;
  };

  [key: string]: unknown;
}

export function SparklesText({
  children,
  className,
  sparklesCount = 10,
  colors = {
    first: "#9E7AFF",
    second: "#FE8BBB",
  },
  ...props
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<SparkleProps[]>([]);

  useEffect(() => {
    const generateSparks = () => {
      const newSparkles = Array.from({ length: sparklesCount }, (_, i) => ({
        id: `sparkle-${i}-${Math.random()}`,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        color: Math.random() > 0.5 ? colors.first : colors.second,
        delay: Math.random() * 2,
        scale: Math.random() * 1 + 0.3,
        lifespan: Math.random() * 10 + 5,
      }));
      setSparkles(newSparkles);
    };

    generateSparks();
    const interval = setInterval(generateSparks, 8000);

    return () => clearInterval(interval);
  }, [colors.first, colors.second, sparklesCount]);

  return (
    <span
      className={cn("relative inline-block", className)}
      {...props}
    >
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} {...sparkle} />
      ))}
      <strong>{children}</strong>
    </span>
  );
}
