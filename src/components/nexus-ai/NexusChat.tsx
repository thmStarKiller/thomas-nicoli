"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { DocWithScore } from '@/lib/rag';
import { ChatMessage } from './types';
import { ChatSession, SessionUtils, SessionManager } from './sessionUtils';
import { NexusMessage } from './NexusMessage';
import { NexusTypingIndicator } from './NexusTypingIndicator';
import { NexusWelcome } from './NexusWelcome';
import { NexusInput } from './NexusInput';
import { NexusSourceCard } from './NexusSourceCard';
import { NexusToolbar } from './NexusToolbar';

// Extended ChatMessage with streaming state
interface ChatMessageWithStreaming extends ChatMessage {
  isStreaming?: boolean;
}

export function NexusChat() {
  const t = useTranslations('chat');
  const locale = useLocale() as 'en' | 'es';
  
  // Session management state
  const [sessionManager, setSessionManager] = useState<SessionManager>(() => SessionUtils.loadSessionManager());
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessageWithStreaming[]>([]);
  const [input, setInput] = useState('');
  const [sources, setSources] = useState<DocWithScore[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | undefined>();
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortController = useRef<AbortController | null>(null);
  const announcementRef = useRef<HTMLDivElement>(null);

  // Initialize session from URL hash or create new one
  useEffect(() => {
    const urlSessionId = SessionUtils.getCurrentSessionIdFromURL();
    let targetSession: ChatSession | null = null;

    if (urlSessionId && sessionManager.sessions[urlSessionId]) {
      // Load session from URL
      targetSession = sessionManager.sessions[urlSessionId];
    } else if (sessionManager.currentSessionId && sessionManager.sessions[sessionManager.currentSessionId]) {
      // Load current session
      targetSession = sessionManager.sessions[sessionManager.currentSessionId];
    } else {
      // Create new session
      targetSession = SessionUtils.createNewSession();
      const newManager = {
        ...sessionManager,
        sessions: { ...sessionManager.sessions, [targetSession.id]: targetSession },
        currentSessionId: targetSession.id
      };
      setSessionManager(newManager);
      SessionUtils.saveSessionManager(newManager);
      SessionUtils.setCurrentSessionInURL(targetSession.id);
    }

    setCurrentSession(targetSession);
    setMessages(targetSession.messages);
  }, [sessionManager]);

  // Save session when messages change
  useEffect(() => {
    if (currentSession && messages !== currentSession.messages) {
      const updatedSession = {
        ...currentSession,
        messages: messages.map(msg => ({ ...msg, isStreaming: undefined })),
        updatedAt: Date.now()
      };
      
      const updatedManager = {
        ...sessionManager,
        sessions: { ...sessionManager.sessions, [currentSession.id]: updatedSession }
      };
      
      setCurrentSession(updatedSession);
      setSessionManager(updatedManager);
      SessionUtils.saveSessionManager(updatedManager);
    }
  }, [messages, currentSession, sessionManager]);

  // Smooth scroll to bottom with optimized performance
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  }, []);

  // Auto-scroll on new messages with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, scrollToBottom]);

  // Focus input after submission
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Announce assistant typing status for screen readers
  const announceTyping = useCallback((isTyping: boolean) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = isTyping 
        ? t('assistant-typing') || 'Assistant is typing...'
        : '';
    }
  }, [t]);

  // Update announcements when typing state changes
  useEffect(() => {
    announceTyping(isTyping);
  }, [isTyping, announceTyping]);

  const handleStop = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
    setIsTyping(false);
    setIsGenerating(false);
    focusInput();
  }, [focusInput]);

  // Handle suggestion click - insert into input and focus
  const handleSuggestionClick = useCallback((suggestion: string) => {
    // Set onboarded flag in localStorage
    try {
      localStorage.setItem('nexus-onboarded', 'true');
    } catch (error) {
      console.warn('Failed to set onboarded flag:', error);
    }
    
    // Set input value and focus
    setInput(suggestion);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        // Move cursor to end of text
        const length = suggestion.length;
        inputRef.current.setSelectionRange(length, length);
      }
    }, 100);
  }, []);

  const askNexus = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isGenerating) return;

    // Create abort controller for this request
    abortController.current = new AbortController();
    
    const userMessage: ChatMessageWithStreaming = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt.trim(),
      createdAt: Date.now()
    };

    const assistantMessage: ChatMessageWithStreaming = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
      isStreaming: true
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsTyping(true);
    setIsGenerating(true);

    // Focus input after sending message
    setTimeout(focusInput, 100);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          locale
        }),
        signal: abortController.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Handle JSON response (no OpenAI key)
      if (response.headers.get('Content-Type')?.includes('application/json')) {
        const json = await response.json();
        setMessages(prev => prev.map((msg, i) => 
          i === prev.length - 1 
            ? { ...msg, content: json.answer, isStreaming: false }
            : msg
        ));
        setSources(json.sources || []);
        setIsTyping(false);
        setIsGenerating(false);
        return;
      }

      // Handle streaming response
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Check for sources delimiter
        const sourcesIndex = buffer.indexOf('\n\n<SOURCES>\n');
        if (sourcesIndex !== -1) {
          const content = buffer.slice(0, sourcesIndex);
          const sourcesData = buffer.slice(sourcesIndex + '\n\n<SOURCES>\n'.length);
          
          setMessages(prev => prev.map((msg, i) => 
            i === prev.length - 1 
              ? { ...msg, content, isStreaming: false }
              : msg
          ));

          try {
            setSources(JSON.parse(sourcesData) as DocWithScore[]);
          } catch (e) {
            console.warn('Failed to parse sources:', e);
          }
          
          buffer = content;
        } else {
          setMessages(prev => prev.map((msg, i) => 
            i === prev.length - 1 
              ? { ...msg, content: buffer }
              : msg
          ));
        }
      }

      setMessages(prev => prev.map((msg, i) => 
        i === prev.length - 1 
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }

      console.error('Chat error:', error);
      setMessages(prev => prev.map((msg, i) => 
        i === prev.length - 1 
          ? { 
              ...msg, 
              content: locale === 'es' 
                ? 'Lo siento, ocurrió un error. Por favor intenta de nuevo.' 
                : 'Sorry, an error occurred. Please try again.',
              isStreaming: false
            }
          : msg
      ));
    } finally {
      setIsTyping(false);
      setIsGenerating(false);
      abortController.current = null;
    }
  }, [messages, locale, isGenerating, focusInput]);

  // Create new chat session
  const handleNewChat = useCallback(() => {
    const newSession = SessionUtils.createNewSession();
    const updatedManager = {
      ...sessionManager,
      sessions: { ...sessionManager.sessions, [newSession.id]: newSession },
      currentSessionId: newSession.id
    };
    
    setCurrentSession(newSession);
    setMessages([]);
    setSources([]);
    setInput('');
    setSessionManager(updatedManager);
    SessionUtils.saveSessionManager(updatedManager);
    SessionUtils.setCurrentSessionInURL(newSession.id);
    handleStop();
  }, [sessionManager, handleStop]);

  // Branch conversation from specific message
  const handleBranchFromMessage = useCallback((messageIndex: number) => {
    if (!currentSession) return;
    
    try {
      const branchedSession = SessionUtils.branchFromMessage(currentSession, messageIndex);
      const updatedManager = {
        ...sessionManager,
        sessions: { ...sessionManager.sessions, [branchedSession.id]: branchedSession },
        currentSessionId: branchedSession.id
      };
      
      setCurrentSession(branchedSession);
      setMessages(branchedSession.messages);
      setSources([]);
      setSessionManager(updatedManager);
      SessionUtils.saveSessionManager(updatedManager);
      SessionUtils.setCurrentSessionInURL(branchedSession.id);
    } catch (error) {
      console.error('Failed to branch conversation:', error);
    }
  }, [currentSession, sessionManager]);

  // Handle message selection for branching
  const handleMessageClick = useCallback((messageIndex: number) => {
    setSelectedMessageIndex(messageIndex === selectedMessageIndex ? undefined : messageIndex);
  }, [selectedMessageIndex]);

  const handleClearChat = useCallback(() => {
    handleNewChat();
  }, [handleNewChat]);

  const handleRegenerateLastResponse = useCallback(() => {
    if (!currentSession || messages.length < 2) return;
    
    const lastAssistantMessage = messages[messages.length - 1];
    const lastUserMessage = messages[messages.length - 2];
    
    if (lastAssistantMessage.role === 'assistant' && lastUserMessage.role === 'user') {
      // Remove last assistant message and regenerate
      setMessages(prev => prev.slice(0, -1));
      setSources([]);
      askNexus(lastUserMessage.content);
    }
  }, [currentSession, messages, askNexus]);

  return (
    <motion.div
      className="flex flex-col h-[calc(100vh-12rem)] sm:h-[calc(100vh-10rem)] max-w-4xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl dark:shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {messages.length === 0 ? (
        <NexusWelcome onSuggestionClick={handleSuggestionClick} />
      ) : (
        <>
          {/* Toolbar */}
          <NexusToolbar
            currentSession={currentSession}
            onNewChat={handleNewChat}
            onBranchFromMessage={handleBranchFromMessage}
            onRegenerateLast={handleRegenerateLastResponse}
            hasMessages={messages.length > 0}
            isGenerating={isGenerating}
            selectedMessageIndex={selectedMessageIndex}
          />
          
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <NexusMessage
                  key={`${message.id}-${index}`}
                  message={message}
                  index={index}
                  onRegenerate={index === messages.length - 1 && message.role === 'assistant' ? handleRegenerateLastResponse : undefined}
                  canStop={index === messages.length - 1 && message.isStreaming}
                  onStop={handleStop}
                  onClick={() => handleMessageClick(index)}
                  isSelected={selectedMessageIndex === index}
                />
              ))}
              {isTyping && !messages[messages.length - 1]?.content && (
                <NexusTypingIndicator />
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Sources */}
          {sources.length > 0 && (
            <motion.div
              className="px-4 pb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('sources')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {sources.slice(0, 4).map((source, index) => (
                    <NexusSourceCard
                      key={source.id}
                      source={source}
                      index={index + 1}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Accessibility announcements for screen readers */}
      <div 
        ref={announcementRef}
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      />

      {/* Input */}
      <NexusInput
        ref={inputRef}
        value={input}
        onChange={setInput}
        onSubmit={askNexus}
        isGenerating={isGenerating}
        onClear={handleClearChat}
        hasMessages={messages.length > 0}
      />
    </motion.div>
  );
}
