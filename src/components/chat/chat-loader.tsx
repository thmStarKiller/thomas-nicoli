"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Locale } from "@/i18n/config";

const ChatAssistant = dynamic(() => import("./chat-assistant").then((module) => module.ChatAssistant), {
  ssr: false,
});

/**
 * Keeps the chat (and the animation library it needs) out of the first load.
 * The launcher appears once the browser is idle, or after two seconds.
 */
export function ChatLoader({ lang, enabled }: { lang: Locale; enabled: boolean }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const start = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 2000);
    return () => clearTimeout(id);
  }, [enabled]);

  if (!enabled || !ready) return null;
  return <ChatAssistant lang={lang} enabled />;
}
