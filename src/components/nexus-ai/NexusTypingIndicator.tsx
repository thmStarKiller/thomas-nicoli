"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { NexusAvatar } from './NexusAvatar';

export function NexusTypingIndicator() {
  const t = useTranslations('chat');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.4, 0.0, 0.2, 1]
      }}
      className="flex gap-3"
      role="status"
      aria-live="polite"
      aria-label={t('thinking')}
    >
      <NexusAvatar typing={true} size="sm" />
      
      <motion.div
        className="flex-1 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm shadow-sm"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          delay: 0.1,
          duration: 0.4,
          ease: [0.4, 0.0, 0.2, 1]
        }}
      >
        <div className="flex items-center gap-3">
          {/* Animated dots */}
          <div className="flex gap-1.5" role="presentation">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.12,
                  repeat: Infinity,
                  ease: [0.4, 0.0, 0.6, 1]
                }}
              />
            ))}
          </div>
          
          <motion.span 
            className="text-sm text-blue-700 dark:text-blue-200 font-medium"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            {t('thinking')}
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}
