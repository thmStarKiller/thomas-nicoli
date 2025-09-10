"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Send, Trash2, Mic, MicOff } from 'lucide-react';

// Type declaration for SpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface NexusInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: string) => void;
  isGenerating: boolean;
  onClear: () => void;
  hasMessages: boolean;
  allowQueueing?: boolean; // Allow input while streaming
}

export const NexusInput = forwardRef<HTMLTextAreaElement, NexusInputProps>(({ 
  value, 
  onChange, 
  onSubmit, 
  isGenerating, 
  onClear, 
  hasMessages,
  allowQueueing = true 
}, ref) => {
  const t = useTranslations('chat');
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState('auto');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const minHeight = 44; // Minimum height in pixels
  const maxHeight = 200; // Maximum height in pixels

  // Check if speech recognition is supported
  const isSpeechRecognitionSupported = 
    ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);

  // Expose focus method to parent via ref
  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    blur: () => textareaRef.current?.blur(),
    select: () => textareaRef.current?.select(),
    setSelectionRange: (start: number, end: number) => textareaRef.current?.setSelectionRange(start, end),
    value: textareaRef.current?.value || '',
    scrollTop: textareaRef.current?.scrollTop || 0,
    scrollLeft: textareaRef.current?.scrollLeft || 0,
    offsetHeight: textareaRef.current?.offsetHeight || 0,
    offsetWidth: textareaRef.current?.offsetWidth || 0,
    clientHeight: textareaRef.current?.clientHeight || 0,
    clientWidth: textareaRef.current?.clientWidth || 0,
    scrollHeight: textareaRef.current?.scrollHeight || 0,
    scrollWidth: textareaRef.current?.scrollWidth || 0
  } as HTMLTextAreaElement), []);

  // Auto-resize textarea based on content
  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      
      // Reset height to auto to get accurate scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new height within bounds
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.max(minHeight, Math.min(maxHeight, scrollHeight));
      
      // Apply the new height
      textarea.style.height = `${newHeight}px`;
      setTextareaHeight(`${newHeight}px`);
      
      // Enable/disable scrolling based on content overflow
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [minHeight, maxHeight]);

  // Adjust height when value changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [value, adjustTextareaHeight]);

  // Clear error state when user starts typing
  useEffect(() => {
    if (value.trim() && hasError) {
      setHasError(false);
    }
  }, [value, hasError]);

  // Auto-stop voice recognition on blur or unmount
  useEffect(() => {
    const stopVoiceRecognition = () => {
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore errors when stopping
        }
        setIsListening(false);
        recognitionRef.current = null;
      }
    };

    // Stop on component unmount
    return () => {
      stopVoiceRecognition();
    };
  }, [isListening]);

  // Enhanced voice input with better error handling
  const toggleVoiceInput = useCallback(() => {
    // Clear any previous voice errors
    setVoiceError(null);

    if (!isSpeechRecognitionSupported) {
      setVoiceError('Speech recognition not supported in this browser');
      return;
    }

    // If currently listening, stop
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.warn('Error stopping speech recognition:', error);
        }
      }
      setIsListening(false);
      recognitionRef.current = null;
      return;
    }

    try {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionRef.current = recognition;
      
      // Configuration for better accuracy
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      // Event handlers
      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        recognitionRef.current = null;
        
        // Handle different error types gracefully
        switch (event.error) {
          case 'no-speech':
            setVoiceError('No speech detected. Please try again.');
            break;
          case 'audio-capture':
            setVoiceError('Microphone not available or blocked.');
            break;
          case 'not-allowed':
            setVoiceError('Microphone permission denied.');
            break;
          case 'network':
            setVoiceError('Network error occurred.');
            break;
          default:
            setVoiceError('Voice recognition error. Please try again.');
        }
        
        // Clear error after 3 seconds
        setTimeout(() => setVoiceError(null), 3000);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript.trim();
          if (transcript) {
            const newValue = value ? `${value} ${transcript}` : transcript;
            onChange(newValue);
          }
        }
      };

      // Start recognition
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setVoiceError('Failed to start voice recognition');
      setIsListening(false);
      recognitionRef.current = null;
      // Clear error after 3 seconds
      setTimeout(() => setVoiceError(null), 3000);
    }
  }, [isListening, value, onChange, isSpeechRecognitionSupported]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if input is empty
    if (!value.trim()) {
      setHasError(true);
      // Clear error after animation
      setTimeout(() => setHasError(false), 600);
      return;
    }
    
    // Check if we should allow submission during streaming
    if (isGenerating && !allowQueueing) {
      return;
    }
    
    onSubmit(value.trim());
  }, [value, isGenerating, allowQueueing, onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter: Allow newline (default behavior)
        return;
      } else {
        // Enter: Submit
        e.preventDefault();
        handleSubmit(e);
      }
    }
  }, [handleSubmit]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    adjustTextareaHeight();
  }, [adjustTextareaHeight]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // Auto-stop voice recognition on blur
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore errors when stopping
      }
    }
  }, [isListening]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  // Determine if input should be disabled
  const isInputDisabled = isGenerating && !allowQueueing;
  const canSubmit = value.trim() && (!isGenerating || allowQueueing);

  return (
    <div className="relative w-full">
      {/* Input Container */}
      <motion.div
        className={`
          relative overflow-hidden bg-card backdrop-blur-sm
          border border-border rounded-2xl
          transition-all duration-300 ease-out
          shadow-sm dark:shadow-md dark:shadow-slate-950/30
          ${isFocused ? 'ring-2 ring-primary/20 border-primary/50' : ''}
          ${hasError ? 'ring-2 ring-destructive/30 border-destructive/50' : ''}
        `}
        animate={hasError ? {
          x: [-2, 2, -2, 2, 0],
          transition: { duration: 0.5, ease: "easeInOut" }
        } : {}}
      >
        <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3">
          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={isInputDisabled}
              placeholder={isGenerating && !allowQueueing ? 
                t('input.generating') : 
                t('input.placeholder')
              }
              className={`
                w-full resize-none bg-transparent border-0 outline-none
                text-foreground placeholder-muted-foreground
                text-base leading-6 min-h-[44px] max-h-[200px]
                px-4 py-2 pr-2
                transition-all duration-200 ease-out
                ${isInputDisabled ? 'opacity-60 cursor-not-allowed' : ''}
                scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
                scrollbar-track-transparent
              `}
              style={{
                height: textareaHeight
              }}
              rows={1}
            />
            
            {/* Voice Indicator */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-2 right-2 flex items-center gap-1"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground">
                    {t('input.listening')}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 pb-1">
            {/* Voice Input Button */}
            <motion.button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isInputDisabled || !isSpeechRecognitionSupported}
              className={`
                p-2 rounded-xl transition-all duration-200
                ${!isSpeechRecognitionSupported 
                  ? 'opacity-40 cursor-not-allowed text-muted-foreground' 
                  : isListening 
                    ? 'bg-destructive/10 dark:bg-destructive/20 text-destructive' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50'
                }
                ${isInputDisabled ? 'opacity-50 cursor-not-allowed' : 
                  isSpeechRecognitionSupported ? 'hover:scale-105 active:scale-95' : ''
                }
              `}
              whileTap={isSpeechRecognitionSupported && !isInputDisabled ? { scale: 0.9 } : {}}
              title={
                !isSpeechRecognitionSupported 
                  ? 'Voice input not supported in this browser'
                  : voiceError 
                    ? voiceError
                    : isListening 
                      ? t('input.stopListening') 
                      : t('input.startListening')
              }
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </motion.button>

            {/* Clear Button */}
            {hasMessages && (
              <motion.button
                type="button"
                onClick={onClear}
                disabled={isInputDisabled}
                className={`
                  p-2 rounded-xl transition-all duration-200
                  hover:bg-red-50 dark:hover:bg-red-900/20 
                  text-muted-foreground hover:text-destructive
                  ${isInputDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
                `}
                whileTap={{ scale: 0.9 }}
                title={t('input.clear')}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            )}

            {/* Send Button */}
            <motion.button
              type="submit"
              disabled={!canSubmit}
              className={`
                p-2 rounded-xl transition-all duration-200
                ${canSubmit
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }
              `}
              whileTap={canSubmit ? { scale: 0.9 } : {}}
              title={t('input.send')}
            >
              <AnimatePresence mode="wait">
                {isGenerating && !allowQueueing ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 1, rotate: 360 }}
                    exit={{ opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  <motion.div
                    key="send"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </form>

        {/* Error Message */}
        <AnimatePresence>
          {hasError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="px-4 pb-3"
            >
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <span className="w-1 h-1 bg-red-500 rounded-full" />
                {t('input.emptyError')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Error Message */}
        <AnimatePresence>
          {voiceError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="px-4 pb-3"
            >
              <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <Mic className="w-3 h-3" />
                {voiceError}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Helper Text */}
      <AnimatePresence>
        {isFocused && !hasError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="mt-2 px-1"
          >
            <p className="text-xs text-muted-foreground text-center">
              {t('input.helperText')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Set display name for debugging
NexusInput.displayName = 'NexusInput';
