"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ExternalLink, ChevronDown, Copy, Link, FileText, Globe } from 'lucide-react';
import type { DocWithScore } from '@/lib/rag';

interface NexusSourceCardProps {
  source: DocWithScore;
  index: number;
}

export function NexusSourceCard({ source, index }: NexusSourceCardProps) {
  const t = useTranslations('chat');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Extract domain from URL if available
  const getDomainFromUrl = (text: string): string | null => {
    try {
      const urlRegex = /https?:\/\/([\w.-]+)/i;
      const match = text.match(urlRegex);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  // Get favicon URL for domain
  const getFaviconUrl = (domain: string): string => {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
  };

  // Convert score to 0-100 scale
  const getScorePercentage = (score: number): number => {
    return Math.round(Math.min(score * 100, 100));
  };

  // Get relevance color based on score
  const getRelevanceColor = (score: number) => {
    const percentage = getScorePercentage(score);
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  // Get relevance text color
  const getRelevanceTextColor = (score: number) => {
    const percentage = getScorePercentage(score);
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  // Copy to clipboard with fallback
  const copyToClipboard = useCallback(async (text: string, type: 'citation' | 'url') => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      const feedbackKey = type === 'citation' ? 'citationCopied' : 'urlCopied';
      setCopyFeedback(t(feedbackKey));
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, [t]);

  // Generate citation text
  const generateCitation = () => {
    const domain = getDomainFromUrl(source.chunk);
    const domainText = domain ? ` (${domain})` : '';
    return `"${source.title}"${domainText} - Relevance: ${getScorePercentage(source.score)}%`;
  };

  // Extract URL from chunk content
  const extractUrl = () => {
    const urlRegex = /https?:\/\/[^\s]+/i;
    const match = source.chunk.match(urlRegex);
    return match ? match[0] : null;
  };

  const domain = getDomainFromUrl(source.chunk);
  const url = extractUrl();
  const scorePercentage = getScorePercentage(source.score);

  return (
    <motion.div
      className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all duration-200 hover:shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      layout
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          {/* Domain Favicon */}
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted border border-border/50 flex items-center justify-center overflow-hidden">
            {domain ? (
              <img
                src={getFaviconUrl(domain)}
                alt={`${domain} favicon`}
                className="w-4 h-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <Globe className={`w-3 h-3 text-muted-foreground ${domain ? 'hidden' : ''}`} />
          </div>

          {/* Title and Relevance */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-medium text-sm text-foreground leading-tight pr-2">
                {source.title}
              </h4>
              
              {/* Relevance Badge */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">{t('relevance')}:</span>
                  <div className={`text-xs font-medium px-2 py-0.5 rounded-full bg-opacity-10 ${getRelevanceTextColor(source.score)}`}
                       style={{ backgroundColor: `${getRelevanceColor(source.score).replace('bg-', '')}20` }}>
                    {scorePercentage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-1.5 bg-muted rounded-full overflow-hidden mb-3">
              <motion.div
                className={`h-full ${getRelevanceColor(source.score)}`}
                initial={{ width: 0 }}
                animate={{ width: `${scorePercentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              />
            </div>

            {/* Snippet Preview */}
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {source.chunk.slice(0, 150)}
              {source.chunk.length > 150 && '...'}
            </p>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between">
          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Open URL */}
            {url && (
              <motion.button
                onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={t('open')}
              >
                <ExternalLink className="w-3 h-3" />
                <span className="hidden sm:inline">{t('open')}</span>
              </motion.button>
            )}

            {/* Copy Citation */}
            <motion.button
              onClick={() => copyToClipboard(generateCitation(), 'citation')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  copyToClipboard(generateCitation(), 'citation');
                }
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t('copyCitation')}
            >
              <FileText className="w-3 h-3" />
              <span className="hidden sm:inline">{t('copyCitation')}</span>
            </motion.button>

            {/* Copy URL */}
            {url && (
              <motion.button
                onClick={() => copyToClipboard(url, 'url')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    copyToClipboard(url, 'url');
                  }
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={t('copyUrl')}
              >
                <Link className="w-3 h-3" />
                <span className="hidden sm:inline">{t('copyUrl')}</span>
              </motion.button>
            )}
          </div>

          {/* Expand Toggle */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? t('collapse') : t('expand')}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-3 h-3" />
            </motion.div>
            <span className="hidden sm:inline">
              {isExpanded ? t('collapse') : t('expand')}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1]
            }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border/50 pt-4">
              <div className="space-y-3">
                <div>
                  <h5 className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Full Content
                  </h5>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {source.chunk}
                    </p>
                  </div>
                </div>
                
                {/* Metadata */}
                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>ID: {source.id}</span>
                    <span>•</span>
                    <span>Locale: {source.locale.toUpperCase()}</span>
                    {domain && (
                      <>
                        <span>•</span>
                        <span>Domain: {domain}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy Feedback Toast */}
      <AnimatePresence>
        {copyFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg z-10"
          >
            <div className="flex items-center gap-1">
              <Copy className="w-3 h-3" />
              {copyFeedback}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
        initial={false}
      />
    </motion.div>
  );
}
