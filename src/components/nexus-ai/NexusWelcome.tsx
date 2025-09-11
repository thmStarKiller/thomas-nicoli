"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { NexusSuggestions } from './NexusSuggestions';
import { useEffect, useState } from 'react';

interface NexusWelcomeProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function NexusWelcome({ onSuggestionClick }: NexusWelcomeProps) {
  const t = useTranslations('chat');
  const [showTagline, setShowTagline] = useState(false);

  // Trigger tagline animation after title animation
  useEffect(() => {
    const timer = setTimeout(() => setShowTagline(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 pt-16 sm:pt-20 md:pt-24 text-center min-h-[calc(var(--nexus-vh)-120px)] relative will-change-[opacity,transform]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated Logo/Title */}
      <motion.div
        className="mb-4 sm:mb-6 md:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8,
          ease: [0.4, 0.0, 0.2, 1]
        }}
      >
        {/* Logo Container */}
        <motion.div
          className="relative inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.6,
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
        >
          {/* Animated Icon */}
          <motion.div
            className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0.4)",
                "0 0 0 12px rgba(59, 130, 246, 0)",
                "0 0 0 0 rgba(59, 130, 246, 0)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.div>
          </motion.div>

          {/* Title with Gradient Shimmer */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 relative">
              {t('title')}
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{
                  duration: 2,
                  delay: 0.8,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "easeInOut"
                }}
              />
            </h1>
          </motion.div>
        </motion.div>

        {/* Typewriter Tagline */}
        <motion.div
          className="h-8 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: showTagline ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          {showTagline && (
            <motion.p
              className="text-lg md:text-xl text-gray-900 dark:text-gray-100 font-medium"
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ 
                duration: 1.5,
                ease: "easeInOut"
              }}
              style={{ 
                overflow: "hidden", 
                whiteSpace: "nowrap",
                borderRight: "2px solid currentColor"
              }}
            >
              <motion.span
                animate={{
                  borderRightColor: ["currentColor", "transparent"]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1.5
                }}
              >
                {t('welcomeTagline')}
              </motion.span>
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* Welcome Message */}
      <motion.div
        className="mb-4 sm:mb-6 md:mb-8 max-w-2xl px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 2.2,
          duration: 0.6,
          ease: [0.4, 0.0, 0.2, 1]
        }}
      >
        <p className="text-sm sm:text-base md:text-lg text-gray-900 dark:text-gray-100 leading-relaxed">
          {t('welcome')}
        </p>
        <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mt-1 sm:mt-2">
          {t('welcomeDesc')}
        </p>
      </motion.div>

      {/* Suggestions */}
      <motion.div
        className="w-full max-w-3xl px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 2.8,
          duration: 0.8,
          ease: [0.4, 0.0, 0.2, 1]
        }}
      >
        <NexusSuggestions onSuggestionClick={handleSuggestionClick} />
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        className="mt-4 sm:mt-6 md:mt-8 max-w-xl px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          delay: 3.4,
          duration: 0.6
        }}
      >
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t('disclaimer')}
        </p>
      </motion.div>
    </motion.div>
  );
}
