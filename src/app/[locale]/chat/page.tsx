import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { ChatPageContent } from "@/components/nexus-ai/ChatPageContent";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('chat');
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function ChatPage() {
  return <ChatPageContent />;
}
