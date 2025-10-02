"use client";

import { Sparkles } from "lucide-react";
import { NexusChat } from "@/components/nexus-ai/NexusChat";
import { NexusErrorBoundary } from "@/components/nexus-ai/NexusErrorBoundary";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { useTranslations } from 'next-intl';

export function ChatPageContent() {
  const t = useTranslations('chat');

  return (
    <div className="nexus-min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black nexus-text-black">
      {/* Header section - more compact */}
      <header className="hidden sm:block flex-shrink-0 py-3 sm:py-4 md:py-6 text-center" role="banner" aria-label="NEXUS AI Chat">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-2" role="banner">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 flex items-center justify-center shadow-lg dark:shadow-2xl dark:shadow-blue-500/25"
              aria-hidden="true"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 !text-white !stroke-white animate-pulse" style={{ color: 'white !important', stroke: 'white !important' }} strokeWidth={2} />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            <SparklesText 
              className="inline-block"
              colors={{
                first: "#FFFFFF",
                second: "#FFFFFF",
              }}
              sparklesCount={8}
            >
              {t('title')}
            </SparklesText>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mt-1 sm:mt-2 max-w-2xl mx-auto leading-relaxed text-balance whitespace-normal break-words">
            {t('subtitle')}
          </p>
        </div>
      </header>

      {/* Main chat container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 pb-3 sm:pb-4 md:pb-6" role="main" aria-label="Chat interface">
        <div className="max-w-7xl mx-auto h-full">
          <NexusErrorBoundary>
            <NexusChat />
          </NexusErrorBoundary>
        </div>
      </main>
    </div>
  );
}
