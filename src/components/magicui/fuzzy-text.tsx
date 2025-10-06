'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FuzzyTextProps {
  children: string;
  className?: string;
  duration?: number;
  intensity?: number;
}

export function FuzzyText({ 
  children, 
  className,
  duration = 0.05,
  intensity = 2
}: FuzzyTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(() =>
        children
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return children[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iteration += 1 / intensity;

      if (iteration >= children.length) {
        clearInterval(interval);
        setDisplayText(children);
      }
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [children, duration, intensity, chars]);

  return (
    <motion.span
      className={cn(
        'inline-block font-mono tracking-tight',
        'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600',
        'dark:from-purple-400 dark:via-pink-400 dark:to-purple-500',
        '[text-shadow:0_0_10px_rgba(168,85,247,0.5),0_0_20px_rgba(168,85,247,0.3)]',
        'dark:[text-shadow:0_0_15px_rgba(168,85,247,0.6),0_0_30px_rgba(168,85,247,0.4)]',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayText}
    </motion.span>
  );
}
