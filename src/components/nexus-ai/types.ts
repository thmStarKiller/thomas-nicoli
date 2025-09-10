export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
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
