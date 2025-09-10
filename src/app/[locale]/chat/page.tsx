import { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { NexusChat } from "@/components/nexus-ai/NexusChat";
import { SparklesText } from "@/components/magicui/sparkles-text";

export const metadata: Metadata = {
  title: "NEXUS AI Chat",
  description: "Intelligent legal assistant powered by AI technology",
};

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex flex-col">
      {/* Hero Section */}
      <header className="container mx-auto px-4 pt-8 pb-4 flex-shrink-0">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4" role="banner">
            <div 
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 flex items-center justify-center shadow-lg dark:shadow-2xl dark:shadow-blue-500/25"
              aria-hidden="true"
            >
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            <SparklesText 
              className="inline-block"
              colors={{
                first: "#60A5FA",
                second: "#A78BFA",
              }}
              sparklesCount={8}
            >
              NEXUS AI Chat
            </SparklesText>
          </h1>
          
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Your intelligent legal assistant powered by advanced AI technology. 
            Get instant answers, research assistance, and professional guidance.
          </p>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="flex-1 px-4 pb-4 overflow-hidden" role="main" aria-label="Chat interface">
        <div className="max-w-4xl mx-auto h-full">
          <NexusChat />
        </div>
      </main>
    </div>
  );
}
