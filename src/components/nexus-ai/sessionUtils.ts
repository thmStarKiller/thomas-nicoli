export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface SessionManager {
  sessions: Record<string, ChatSession>;
  currentSessionId: string | null;
  lastSessionId: string | null;
}

// Extended ChatMessage types for session management
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: SourceHit[];
  createdAt: number;
  parentId?: string; // For branching conversations
  siblingIds?: string[]; // For regenerated responses
}

export interface SourceHit {
  title: string;
  url: string;
  score: number;
  snippet?: string;
  meta?: Record<string, unknown>;
  id?: string;
}

// Session utilities
export class SessionUtils {
  private static readonly STORAGE_KEY = 'nexus-sessions';
  private static readonly CURRENT_SESSION_KEY = 'nexus-current-session';
  
  static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static generateSessionTitle(messages: ChatMessage[]): string {
    // Use first user message as title, truncated
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.length > 50 
        ? firstUserMessage.content.substring(0, 50) + '...'
        : firstUserMessage.content;
    }
    return `Chat ${new Date().toLocaleDateString()}`;
  }

  static loadSessionManager(): SessionManager {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const currentSessionId = localStorage.getItem(this.CURRENT_SESSION_KEY);
      
      if (stored) {
        const sessions = JSON.parse(stored);
        return {
          sessions,
          currentSessionId,
          lastSessionId: currentSessionId
        };
      }
    } catch (error) {
      console.warn('Failed to load session manager:', error);
    }

    return {
      sessions: {},
      currentSessionId: null,
      lastSessionId: null
    };
  }

  static saveSessionManager(manager: SessionManager): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(manager.sessions));
      if (manager.currentSessionId) {
        localStorage.setItem(this.CURRENT_SESSION_KEY, manager.currentSessionId);
      } else {
        localStorage.removeItem(this.CURRENT_SESSION_KEY);
      }
    } catch (error) {
      console.warn('Failed to save session manager:', error);
    }
  }

  static createNewSession(title?: string): ChatSession {
    const now = Date.now();
    return {
      id: this.generateSessionId(),
      title: title || `New Chat ${new Date().toLocaleDateString()}`,
      messages: [],
      createdAt: now,
      updatedAt: now
    };
  }

  static updateSessionTitle(session: ChatSession): ChatSession {
    if (session.messages.length > 0) {
      return {
        ...session,
        title: this.generateSessionTitle(session.messages),
        updatedAt: Date.now()
      };
    }
    return session;
  }

  static addMessageToSession(session: ChatSession, message: ChatMessage): ChatSession {
    const updatedSession = {
      ...session,
      messages: [...session.messages, message],
      updatedAt: Date.now()
    };
    
    // Auto-update title if this is the first user message
    if (session.messages.length === 0 && message.role === 'user') {
      updatedSession.title = this.generateSessionTitle([message]);
    }
    
    return updatedSession;
  }

  static branchFromMessage(session: ChatSession, messageIndex: number): ChatSession {
    if (messageIndex < 0 || messageIndex >= session.messages.length) {
      throw new Error('Invalid message index for branching');
    }

    const branchedMessages = session.messages.slice(0, messageIndex + 1);
    const newSession = this.createNewSession();
    
    return {
      ...newSession,
      title: `${session.title} (Branch)`,
      messages: branchedMessages.map(msg => ({ ...msg, id: this.generateMessageId() }))
    };
  }

  static getCurrentSessionIdFromURL(): string | null {
    if (typeof window === 'undefined') return null;
    
    const hash = window.location.hash.substring(1);
    if (hash.startsWith('session=')) {
      return hash.replace('session=', '');
    }
    return null;
  }

  static setCurrentSessionInURL(sessionId: string | null): void {
    if (typeof window === 'undefined') return;
    
    if (sessionId) {
      window.location.hash = `session=${sessionId}`;
    } else {
      window.location.hash = '';
    }
  }

  static exportSessionAsMarkdown(session: ChatSession): string {
    const header = `# ${session.title}\n\n`;
    const metadata = `**Created:** ${new Date(session.createdAt).toLocaleString()}\n`;
    const updated = `**Updated:** ${new Date(session.updatedAt).toLocaleString()}\n\n`;
    
    const content = session.messages.map(message => {
      const role = message.role === 'user' ? '👤 **You**' : '🤖 **NEXUS AI**';
      const timestamp = new Date(message.createdAt).toLocaleString();
      let messageContent = `## ${role}\n*${timestamp}*\n\n${message.content}\n\n`;
      
      if (message.sources && message.sources.length > 0) {
        messageContent += '### Sources\n\n';
        message.sources.forEach((source, index) => {
          messageContent += `${index + 1}. [${source.title}](${source.url}) (Relevance: ${Math.round(source.score * 100)}%)\n`;
          if (source.snippet) {
            messageContent += `   > ${source.snippet}\n`;
          }
        });
        messageContent += '\n';
      }
      
      return messageContent;
    }).join('---\n\n');
    
    return header + metadata + updated + content;
  }
}
