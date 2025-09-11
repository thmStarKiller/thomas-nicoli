"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Copy, Check, RotateCcw, Square } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';
import { ChatMessage } from './types';
import { NexusAvatar } from './NexusAvatar';
import { NexusSourceCard } from './NexusSourceCard';

// Extended ChatMessage with streaming state for compatibility
interface ChatMessageWithStreaming extends ChatMessage {
  isStreaming?: boolean;
}

interface NexusMessageProps {
  message: ChatMessageWithStreaming;
  index: number;
  onRegenerate?: () => void;
  canStop?: boolean;
  onStop?: () => void;
  onClick?: () => void;
  isSelected?: boolean;
}

export function NexusMessage({ 
  message, 
  index, 
  onRegenerate, 
  canStop,
  onStop,
  onClick,
  isSelected = false
}: NexusMessageProps) {
  const t = useTranslations('chat');
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const isAI = message.role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const messageVariants = {
    initial: { 
      opacity: 0, 
      x: isAI ? -20 : 20,
      y: 10
    },
    animate: { 
      opacity: 1, 
      x: 0,
      y: 0
    },
    exit: { 
      opacity: 0, 
      scale: 0.95
    }
  };

  const contentVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1
    }
  };

  return (
    <motion.div
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: 0.4,
        delay: index * 0.05
      }}
      className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'} group rtl:${isAI ? 'flex-row-reverse' : ''} ${
        onClick ? 'cursor-pointer' : ''
      } ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 rounded-xl p-3 -m-3 border' : ''}`}
      onClick={onClick}
    >
      {/* Avatar */}
      {isAI && <NexusAvatar isStreaming={message.isStreaming} />}
      
      {/* User Avatar */}
      {!isAI && (
        <motion.div
          className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.05 + 0.1 }}
        >
          U
        </motion.div>
      )}

      {/* Message Content */}
      <motion.div
        variants={contentVariants}
        className={`flex-1 max-w-full sm:max-w-[85%] ${isAI ? 'mr-8 rtl:ml-8 rtl:mr-0' : 'ml-8 rtl:mr-8 rtl:ml-0'}`}
      >
        {/* Message Bubble */}
        <motion.div
          className={`relative p-4 rounded-2xl ${
            isAI
              ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          } border shadow-sm dark:shadow-md dark:shadow-slate-950/30 backdrop-blur-sm group-hover:shadow-md dark:group-hover:shadow-lg transition-all duration-200`}
          whileHover={{ 
            scale: 1.01,
            transition: { type: "spring", stiffness: 400, damping: 25 }
          }}
          layout
        >
          {/* Content */}
          <div className={`prose prose-sm dark:prose-invert max-w-none ${
            isAI ? 'prose-blue' : ''
          }`}>
            {isAI ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={{
                  // Custom code block styling
                  code: ({ className, children, ...props }: React.ComponentProps<'code'>) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;
                    return !isInline ? (
                      <div className="relative group/code">
                        <pre className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
                          <code className={`${className} text-sm leading-relaxed`} {...props}>
                            {children}
                          </code>
                        </pre>
                        {/* Copy button for code blocks */}
                        <motion.button
                          onClick={() => {
                            navigator.clipboard.writeText(String(children));
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-1.5 rounded text-xs"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </motion.button>
                      </div>
                    ) : (
                      <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  // Custom link styling with proper routing
                  a: ({ href, children }) => {
                    // Check if it's an internal link
                    const isInternal = href && (
                      href.startsWith('/') || 
                      href.startsWith('#') || 
                      href.includes(window.location.hostname)
                    );
                    
                    if (isInternal) {
                      // Handle internal links with Next.js routing
                      const cleanHref = href?.startsWith('/') ? `/${locale}${href}` : href;
                      return (
                        <Link
                          href={cleanHref || '#'}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {children}
                        </Link>
                      );
                    }
                    
                    // External links open in new tab
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {message.content || (message.isStreaming ? '...' : '')}
              </ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            )}
          </div>

          {/* Streaming indicator */}
          {message.isStreaming && isAI && (
            <motion.div
              className="absolute bottom-2 right-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                    animate={{ 
                      opacity: [0.4, 1, 0.4],
                      scale: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Actions */}
        {message.content && (
          <motion.div
            className={`flex items-center gap-2 mt-2 ${
              isAI ? 'justify-start rtl:justify-end' : 'justify-end rtl:justify-start'
            } opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0, y: 0 }}
            whileHover={{ opacity: 1 }}
          >
            {/* Copy Button */}
            <motion.button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-blue-600" />
                  <span>{t('copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>{t('copy')}</span>
                </>
              )}
            </motion.button>

            {/* Stop Generation Button */}
            {canStop && (
              <motion.button
                onClick={onStop}
                className="flex items-center gap-1 px-2 py-1 text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-md transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Square className="w-3 h-3" />
                <span>Stop</span>
              </motion.button>
            )}

            {/* Regenerate Button */}
            {onRegenerate && !message.isStreaming && (
              <motion.button
                onClick={onRegenerate}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('regenerate')}</span>
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Sources */}
        {message.sources && message.sources.length > 0 && isAI && (
          <motion.div
            className="mt-3 space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2">
              {t('sources')}
            </div>
            <div className="grid gap-2">
              {message.sources.slice(0, 3).map((source, sourceIndex) => {
                // Convert SourceHit to DocWithScore format for NexusSourceCard
                const adaptedSource = {
                  id: `source-${sourceIndex}`,
                  locale: 'en' as const,
                  title: source.title,
                  chunk: source.snippet || source.title,
                  score: source.score
                };
                
                return (
                  <NexusSourceCard
                    key={source.url || sourceIndex}
                    source={adaptedSource}
                    index={sourceIndex + 1}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
