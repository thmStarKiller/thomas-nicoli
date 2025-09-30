# NEXUS AI - Animated RAG Chatbot

A beautifully animated, interactive AI chatbot interface built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

### 🎨 Beautiful Animations
- **Welcome Screen**: Animated logo with orbiting elements and smooth transitions
- **Message Bubbles**: Slide-in animations with stagger effects for natural conversation flow
- **Typing Indicators**: Pulsing dots with breathing avatar animation
- **Source Cards**: Interactive expandable cards with relevance scoring
- **Smooth Transitions**: All interactions have polished motion feedback

### 🤖 Intelligent Interface
- **NEXUS AI Branding**: Professional AI assistant persona with gradient branding
- **Real-time Streaming**: Supports OpenAI streaming responses with optimistic UI
- **Source Citations**: Interactive cards showing knowledge base sources with relevance scores
- **Voice Input**: Speech-to-text support (when available in browser)
- **Conversation Management**: Clear chat, regenerate responses, copy messages

### 🛠 Technical Features
- **TypeScript**: Fully typed components with proper interfaces
- **Accessibility**: Focus management, ARIA labels, keyboard navigation
- **Responsive**: Mobile-first design that works on all screen sizes
- **Performance**: Optimized animations and efficient rendering
- **Error Handling**: Graceful degradation and user-friendly error messages

## Components

### Core Components
- `NexusChat.tsx` - Main chat container with state management
- `NexusMessage.tsx` - Individual message rendering with markdown support
- `NexusWelcome.tsx` - Animated welcome screen with capabilities preview
- `NexusInput.tsx` - Smart input with voice support and auto-resize
- `NexusAvatar.tsx` - Animated AI avatar with status indicators
- `NexusTypingIndicator.tsx` - Loading animation during AI responses
- `NexusSourceCard.tsx` - Interactive source citation cards

### Dependencies
- `framer-motion` - Smooth animations and transitions
- `react-markdown` - Markdown rendering with syntax highlighting
- `remark-gfm` - GitHub Flavored Markdown support
- `rehype-highlight` - Code syntax highlighting
- `lucide-react` - Beautiful icons

## Usage

```tsx
import { NexusChat } from '@/components/nexus-ai';

export default function ChatPage() {
  return (
    <div className="min-h-screen p-4">
      <NexusChat />
    </div>
  );
}
```

## Integration with RAG System

The chatbot seamlessly integrates with the existing RAG system:
- Maintains compatibility with `/api/chat` endpoint
- Supports both streaming and JSON responses
- Handles BM25 and embeddings-based retrieval
- Preserves source citation functionality

## Customization

The component system is highly customizable:
- Modify animations in individual components
- Adjust colors via Tailwind classes
- Extend functionality with additional props
- Customize AI personality in `prompts.ts`

## Performance

- Optimized for smooth 60fps animations
- Efficient re-rendering with proper React patterns
- Lazy loading for heavy components
- Memory-efficient conversation management
