"use client";

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NexusAvatarProps {
  isStreaming?: boolean;
  typing?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function NexusAvatar({ 
  isStreaming = false, 
  typing = false,
  size = 'md' 
}: NexusAvatarProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-6 h-6', icon: 'w-3 h-3', ring: 'w-10 h-10' },
    md: { container: 'w-8 h-8', icon: 'w-4 h-4', ring: 'w-12 h-12' },
    lg: { container: 'w-12 h-12', icon: 'w-6 h-6', ring: 'w-16 h-16' }
  };

  const config = sizeConfig[size];

  // Animation variants respecting motion preferences
  const breathingVariants = {
    idle: {
      scale: prefersReducedMotion ? 1 : [1, 1.02, 1],
      transition: {
        duration: prefersReducedMotion ? 0 : 4,
        repeat: prefersReducedMotion ? 0 : Infinity,
        ease: "easeInOut" as const
      }
    },
    active: {
      scale: prefersReducedMotion ? 1 : [1, 1.05, 1],
      transition: {
        duration: prefersReducedMotion ? 0 : 2.5,
        repeat: prefersReducedMotion ? 0 : Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const ringVariants = {
    idle: {
      scale: prefersReducedMotion ? 1 : [1, 1.1, 1],
      opacity: prefersReducedMotion ? 0.3 : [0.3, 0.6, 0.3],
      rotate: prefersReducedMotion ? 0 : 360,
      transition: {
        scale: {
          duration: prefersReducedMotion ? 0 : 6,
          repeat: prefersReducedMotion ? 0 : Infinity,
          ease: "easeInOut" as const
        },
        opacity: {
          duration: prefersReducedMotion ? 0 : 3,
          repeat: prefersReducedMotion ? 0 : Infinity,
          ease: "easeInOut" as const
        },
        rotate: {
          duration: prefersReducedMotion ? 0 : 20,
          repeat: prefersReducedMotion ? 0 : Infinity,
          ease: "linear" as const
        }
      }
    },
    typing: {
      scale: prefersReducedMotion ? 1 : [1, 1.2, 1],
      opacity: prefersReducedMotion ? 0.6 : [0.4, 0.8, 0.4],
      rotate: prefersReducedMotion ? 0 : 360,
      transition: {
        scale: {
          duration: prefersReducedMotion ? 0 : 1.5,
          repeat: prefersReducedMotion ? 0 : Infinity,
          ease: "easeInOut" as const
        },
        opacity: {
          duration: prefersReducedMotion ? 0 : 1,
          repeat: prefersReducedMotion ? 0 : Infinity,
          ease: "easeInOut" as const
        },
        rotate: {
          duration: prefersReducedMotion ? 0 : 8,
          repeat: prefersReducedMotion ? 0 : Infinity,
          ease: "linear" as const
        }
      }
    }
  };

  const iconVariants = {
    idle: {
      rotate: prefersReducedMotion ? 0 : 360,
      scale: prefersReducedMotion ? 1 : [1, 1.1, 1],
      transition: {
        rotate: {
          duration: prefersReducedMotion ? 0 : 12,
          repeat: prefersReducedMotion ? 0 : Infinity,
          ease: "linear" as const
        },
        scale: {
          duration: prefersReducedMotion ? 0 : 4,
          repeat: prefersReducedMotion ? 0 : Infinity,
          ease: "easeInOut" as const
        }
      }
    },
    active: {
      rotate: prefersReducedMotion ? 0 : 360,
      scale: prefersReducedMotion ? 1 : [1, 1.2, 1],
      transition: {
        rotate: {
          duration: prefersReducedMotion ? 0 : 3,
          repeat: prefersReducedMotion ? 0 : Infinity,
          ease: "linear" as const
        },
        scale: {
          duration: prefersReducedMotion ? 0 : 2,
          repeat: prefersReducedMotion ? 0 : Infinity,
          ease: "easeInOut" as const
        }
      }
    }
  };

  const glowVariants = {
    idle: {
      scale: prefersReducedMotion ? 1 : [1, 1.1, 1],
      opacity: prefersReducedMotion ? 0.15 : [0.15, 0.25, 0.15],
      transition: {
        duration: prefersReducedMotion ? 0 : 5,
        repeat: prefersReducedMotion ? 0 : Infinity,
        ease: "easeInOut" as const
      }
    },
    typing: {
      scale: prefersReducedMotion ? 1 : [1, 1.3, 1],
      opacity: prefersReducedMotion ? 0.4 : [0.2, 0.6, 0.2],
      transition: {
        duration: prefersReducedMotion ? 0 : 1.2,
        repeat: prefersReducedMotion ? 0 : Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const isActive = isStreaming || typing;
  const animationState = isActive ? (typing ? 'typing' : 'active') : 'idle';

  return (
    <motion.div
      className={`relative ${config.container} flex-shrink-0`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 15,
        duration: 0.6
      }}
    >
      {/* Outer Gradient Ring */}
      <motion.div
        className={`absolute inset-0 ${config.ring} -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2`}
        variants={ringVariants}
        animate={animationState}
        style={{
          background: typing 
            ? 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)'
            : 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #3b82f6)',
          borderRadius: '50%',
          padding: '2px',
          willChange: 'transform, opacity'
        }}
      >
        <div 
          className="w-full h-full rounded-full bg-background"
          style={{ willChange: 'transform' }}
        />
      </motion.div>

      {/* Main Avatar Container with Breathing */}
      <motion.div
        className={`relative ${config.container} z-10`}
        variants={breathingVariants}
        animate={animationState}
        style={{ willChange: 'transform' }}
      >
        {/* Avatar Core */}
        <motion.div
          className={`${config.container} rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 flex items-center justify-center shadow-lg relative overflow-hidden`}
          style={{ willChange: 'transform' }}
        >
          {/* Inner Glow Pulse */}
          <motion.div
            className="absolute inset-0 rounded-full"
            variants={glowVariants}
            animate={animationState}
            style={{
              background: typing 
                ? 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(139, 92, 246, 0.6) 50%, transparent 70%)'
                : 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(139, 92, 246, 0.4) 50%, transparent 70%)',
              willChange: 'transform, opacity'
            }}
          />

          {/* Icon */}
          <motion.div
            variants={iconVariants}
            animate={animationState}
            style={{ willChange: 'transform' }}
            className="relative z-10"
          >
            <Sparkles className={`${config.icon} !text-white !stroke-white drop-shadow-sm`} style={{ color: 'white !important', stroke: 'white !important' }} strokeWidth={2} />
          </motion.div>

          {/* Shimmer Effect */}
          {!prefersReducedMotion && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ x: '-100%' }}
              animate={{ 
                x: typing ? ['100%', '-100%'] : '100%',
              }}
              transition={{
                duration: typing ? 2 : 3,
                repeat: typing ? Infinity : 0,
                ease: "easeInOut" as const,
                repeatDelay: typing ? 0.5 : 2
              }}
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                willChange: 'transform'
              }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Ambient Background Glow */}
      <motion.div
        className={`absolute inset-0 ${config.container} rounded-full blur-md -z-10`}
        animate={{
          scale: prefersReducedMotion ? 1 : (typing ? [1, 1.6, 1] : [1, 1.3, 1]),
          opacity: prefersReducedMotion ? 0.1 : (typing ? [0.1, 0.3, 0.1] : [0.1, 0.2, 0.1])
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : (typing ? 1.5 : 4),
          repeat: prefersReducedMotion ? 0 : Infinity,
          ease: "easeInOut" as const
        }}
        style={{
          background: typing 
            ? 'radial-gradient(circle, #3b82f6, #8b5cf6)'
            : 'radial-gradient(circle, #3b82f6, #1e40af)',
          willChange: 'transform, opacity'
        }}
      />

      {/* Focus Ring for Accessibility */}
      <motion.div
        className={`absolute inset-0 ${config.container} rounded-full border-2 border-transparent focus-within:border-blue-400 focus-within:shadow-lg`}
        style={{ willChange: 'border-color, box-shadow' }}
      />
    </motion.div>
  );
}
