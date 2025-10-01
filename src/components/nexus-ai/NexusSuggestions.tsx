"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Sparkles, FileText, Search, Lightbulb, TrendingUp, Settings } from 'lucide-react';

interface NexusSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const SUGGESTION_ICONS = [
  FileText,    // Audit my PDP for VTO readiness
  Lightbulb,   // Draft a RAG knowledge build plan
  Search,      // Improve my SFCC search relevance
  TrendingUp,  // Plan an AI-powered product recommendation system
  Settings,    // Optimize my checkout flow for conversions
  Sparkles     // Design a personalization strategy
];

export function NexusSuggestions({ onSuggestionClick }: NexusSuggestionsProps) {
  const t = useTranslations('chat');
  const suggestions = t.raw('suggestions') as string[];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const chipVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        duration: 0.6
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
  };

  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Section Title */}
      <motion.div
        className="mb-6 text-center mx-auto max-w-screen-sm px-4 sm:px-0 whitespace-normal break-words"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t('getStarted')}
        </h3>
        <p className="text-base leading-normal text-gray-600 dark:text-gray-400 whitespace-normal break-words">
          {t('suggestionsSubtitle')}
        </p>
      </motion.div>

      {/* Suggestion Chips Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-w-4xl mx-auto"
        variants={containerVariants}
      >
        {suggestions.map((suggestion, index) => {
          const IconComponent = SUGGESTION_ICONS[index] || Sparkles;
          
          return (
            <motion.button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="group relative w-full p-3 sm:p-4 text-left bg-white dark:bg-white hover:bg-gray-50 dark:hover:bg-gray-50 border border-gray-200 dark:border-gray-200 hover:border-blue-300 dark:hover:border-blue-300 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              variants={chipVariants}
              whileHover={{ 
                scale: 1.02,
                y: -2,
                transition: { 
                  type: "spring", 
                  stiffness: 400,
                  damping: 10
                }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
            >
              {/* Gradient Background on Hover */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                layoutId={`suggestion-bg-${index}`}
              />
              
              {/* Content */}
              <div className="relative flex items-start gap-3">
                {/* Icon */}
                <motion.div
                  className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm"
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1
                  }}
                  transition={{ 
                    duration: 0.3,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </motion.div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-black dark:text-black group-hover:text-blue-600 dark:group-hover:text-blue-600 transition-colors duration-200 leading-tight whitespace-normal break-words">
                    {suggestion}
                  </p>
                </div>

                {/* Arrow Indicator */}
                <motion.div
                  className="flex-shrink-0 w-5 h-5 rounded-full bg-white dark:bg-white group-hover:bg-blue-100 dark:group-hover:bg-blue-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <svg 
                    className="w-3 h-3 text-black dark:text-black group-hover:text-blue-600 dark:group-hover:text-blue-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </motion.div>
              </div>

              {/* Ripple Effect */}
              <motion.div
                className="absolute inset-0 rounded-lg sm:rounded-xl"
                initial={{ scale: 0, opacity: 0.5 }}
                whileTap={{ 
                  scale: 1.5, 
                  opacity: 0,
                  transition: { duration: 0.3 }
                }}
                style={{
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
                }}
              />
            </motion.button>
          );
        })}
      </motion.div>

      {/* Additional CTA */}
      <motion.div
        className="mt-8 text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <p className="text-sm text-muted-foreground/70 leading-normal max-w-screen-sm mx-auto whitespace-normal break-words">
          {t('suggestionsCta')}
        </p>
      </motion.div>
    </motion.div>
  );
}
