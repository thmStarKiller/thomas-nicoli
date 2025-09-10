"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Plus, 
  Download, 
  GitBranch, 
  RotateCcw, 
  FileText, 
  FileOutput,
  MessageSquare
} from 'lucide-react';
import { ChatSession } from './sessionUtils';
import { ConfirmModal } from './ConfirmModal';
import { ExportUtils } from './exportUtils';

interface NexusToolbarProps {
  currentSession: ChatSession | null;
  onNewChat: () => void;
  onBranchFromMessage: (messageIndex: number) => void;
  onRegenerateLast: () => void;
  hasMessages: boolean;
  isGenerating: boolean;
  selectedMessageIndex?: number;
}

export function NexusToolbar({
  currentSession,
  onNewChat,
  onBranchFromMessage,
  onRegenerateLast,
  hasMessages,
  isGenerating,
  selectedMessageIndex
}: NexusToolbarProps) {
  const t = useTranslations('chat');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleNewChat = () => {
    if (hasMessages) {
      setShowNewChatModal(true);
    } else {
      onNewChat();
    }
  };

  const confirmNewChat = () => {
    onNewChat();
    setShowNewChatModal(false);
  };

  const handleExportMarkdown = async () => {
    if (!currentSession) return;
    
    try {
      setIsExporting(true);
      await ExportUtils.exportAsMarkdown(currentSession);
      setShowExportMenu(false);
    } catch (error) {
      console.error('Export failed:', error);
      // Could add toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!currentSession) return;
    
    try {
      setIsExporting(true);
      await ExportUtils.exportAsPDF(currentSession);
      setShowExportMenu(false);
    } catch (error) {
      console.error('Export failed:', error);
      // Could add toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  const handleBranchFromHere = () => {
    if (selectedMessageIndex !== undefined) {
      onBranchFromMessage(selectedMessageIndex);
    }
  };

  const canRegenerateLast = hasMessages && !isGenerating && currentSession && 
    currentSession.messages.length >= 2 && 
    currentSession.messages[currentSession.messages.length - 1].role === 'assistant';

  const canBranchFromHere = selectedMessageIndex !== undefined && selectedMessageIndex >= 0;

  return (
    <>
      <motion.div
        className="flex items-center justify-between p-3 border-b border-border bg-card/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Left side - Session info */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-foreground truncate">
            {currentSession?.title || t('toolbar.newChat')}
          </span>
          {hasMessages && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {currentSession?.messages.length || 0}
            </span>
          )}
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-1">
          {/* New Chat */}
          <motion.button
            onClick={handleNewChat}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={t('toolbar.newChat')}
          >
            <Plus className="w-4 h-4" />
          </motion.button>

          {/* Export */}
          {hasMessages && (
            <div className="relative">
              <motion.button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={t('toolbar.export')}
              >
                <Download className="w-4 h-4" />
              </motion.button>

              {/* Export Menu */}
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 bg-card rounded-xl shadow-lg border border-border py-2 min-w-[180px] z-10"
                >
                  <button
                    onClick={handleExportMarkdown}
                    disabled={isExporting}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-3 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    <FileText className="w-4 h-4" />
                    {t('toolbar.exportMarkdown')}
                  </button>
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-3 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    <FileOutput className="w-4 h-4" />
                    {t('toolbar.exportPDF')}
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* Branch from here */}
          {canBranchFromHere && (
            <motion.button
              onClick={handleBranchFromHere}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t('toolbar.branchFromHere')}
            >
              <GitBranch className="w-4 h-4" />
            </motion.button>
          )}

          {/* Regenerate last */}
          {canRegenerateLast && (
            <motion.button
              onClick={onRegenerateLast}
              disabled={isGenerating}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t('toolbar.regenerateLast')}
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Export menu backdrop */}
      {showExportMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowExportMenu(false)}
        />
      )}

      {/* New Chat Confirmation Modal */}
      <ConfirmModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onConfirm={confirmNewChat}
        title={t('toolbar.confirmNewChatTitle')}
        message={t('toolbar.confirmNewChatMessage')}
        confirmText={t('toolbar.startNewChat')}
        type="warning"
      />
    </>
  );
}
