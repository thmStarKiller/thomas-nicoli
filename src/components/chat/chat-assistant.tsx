"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Bot, Check, MailCheck, MessageCircle, RotateCcw, Send, Sparkles, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getChatCopy } from "@/i18n/chat";
import { CHAT_LIMITS } from "@/lib/chat/contracts";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  ok?: boolean;
  error?: string;
  queued?: boolean;
  status?: "queued" | "processing" | "completed" | "failed";
  interactionId?: string;
  sessionToken?: string;
  reply?: string;
  suggestions?: string[];
  emailed?: boolean;
  maxTurns?: number;
}

function LoopRail({ labels, reduced }: { labels: readonly string[]; reduced: boolean | null }) {
  return (
    <div data-testid="site-chat-loop" aria-hidden className="relative mt-4 grid grid-cols-4 gap-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-3">
      {!reduced && (
        <motion.span
          className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-cobalt/25 to-transparent"
          animate={{ x: ["-100%", "400%"] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
        />
      )}
      {labels.map((label, index) => (
        <div key={label} className="relative flex min-w-0 flex-col items-center gap-1.5 text-center">
          <span className="flex size-5 items-center justify-center rounded-full border border-cobalt-bright/45 bg-graphite text-[9px] font-semibold text-cobalt-bright">{index + 1}</span>
          <span className="w-full truncate font-mono text-[8px] uppercase tracking-[0.08em] text-porcelain/55">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function ChatAssistant({ lang, enabled }: { lang: Locale; enabled: boolean }) {
  const copy = getChatCopy(lang);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileCycle, setTurnstileCycle] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [turn, setTurn] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([...copy.quickPrompts]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [emailed, setEmailed] = useState(false);
  const [activity, setActivity] = useState<string>(copy.sending);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);

  const resetConversation = () => {
    setSessionId(crypto.randomUUID());
    setSessionToken("");
    setTurnstileToken("");
    setTurnstileCycle((value) => value + 1);
    setMessages([{ id: "greeting", role: "assistant", content: copy.greeting }]);
    setInput("");
    setTurn(0);
    setSuggestions([...copy.quickPrompts]);
    setError("");
    setEmailed(false);
    setActivity(copy.sending);
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setSessionId(crypto.randomUUID());
      setMessages([{ id: "greeting", role: "assistant", content: copy.greeting }]);
      setSuggestions([...copy.quickPrompts]);
    });
    return () => cancelAnimationFrame(raf);
  }, [copy.greeting, copy.quickPrompts]);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => textareaRef.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "end" });
  }, [busy, messages, open, reduced]);

  const handleTurnstile = (token: string) => {
    setTurnstileToken(token);
    if (token) setError("");
  };
  const handleTurnstileError = () => setError(copy.verifyError);

  const createSession = async (): Promise<string> => {
    if (sessionToken) return sessionToken;
    if (!turnstileToken || !sessionId) throw new Error("verification_required");
    const response = await fetch("/api/chat/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, locale: lang, turnstileToken, company: "" }),
    });
    const payload = (await response.json()) as ChatResponse;
    if (!response.ok || !payload.sessionToken) throw new Error(payload.error || "session_failed");
    setSessionToken(payload.sessionToken);
    setTurnstileToken("");
    return payload.sessionToken;
  };

  const waitForLocalReply = async (token: string, interactionId: string): Promise<ChatResponse> => {
    setActivity(copy.waiting);
    for (let attempt = 0; attempt < 45; attempt += 1) {
      if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 2_000));
      const response = await fetch("/api/chat/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, sessionToken: token, interactionId }),
      });
      const payload = (await response.json()) as ChatResponse;
      if (response.ok && payload.status === "completed" && payload.reply) return payload;
      if (response.status === 202 && payload.queued) continue;
      throw new Error(payload.error || "chat_status_failed");
    }
    throw new Error("local_ai_timeout");
  };

  const sendMessage = async (proposed?: string) => {
    const message = (proposed ?? input).trim().slice(0, CHAT_LIMITS.message);
    if (sendingRef.current || busy || message.length < 2 || turn >= CHAT_LIMITS.sessionTurns) return;
    if (!sessionToken && !turnstileToken) {
      setError(copy.verify);
      return;
    }

    const prior = messages.slice(-CHAT_LIMITS.historyItems);
    const nextTurn = turn + 1;
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: message };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setSuggestions([]);
    setError("");
    setEmailed(false);
    setActivity(copy.sending);
    setBusy(true);
    sendingRef.current = true;
    let accepted = false;

    try {
      const token = await createSession();
      const interactionId = crypto.randomUUID();
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionId,
          sessionToken: token,
          interactionId,
          turnIndex: nextTurn,
          locale: lang,
          pagePath: pathname,
          message,
          history: prior.map(({ role, content }) => ({ role, content })),
          company: "",
        }),
      });
      let payload = (await response.json()) as ChatResponse;
      if (!response.ok) throw new Error(payload.error || "chat_failed");
      accepted = true;
      const queuedInteractionId = payload.interactionId ?? interactionId;
      if (!payload.reply) payload = await waitForLocalReply(token, queuedInteractionId);
      if (!payload.reply) throw new Error("local_ai_empty_reply");
      setMessages((current) => [...current, { id: queuedInteractionId, role: "assistant", content: payload.reply! }]);
      setTurn(nextTurn);
      setSuggestions((payload.suggestions ?? []).slice(0, CHAT_LIMITS.suggestions));
      setEmailed(Boolean(payload.emailed));
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : "chat_failed";
      if (accepted && code === "local_ai_timeout") {
        setTurn(nextTurn);
        setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: copy.queued }]);
      } else if (accepted) {
        setTurn(nextTurn);
        setError(copy.error);
      } else if (code.includes("turnstile") || code.includes("verification")) {
        setSessionToken("");
        setTurnstileToken("");
        setTurnstileCycle((value) => value + 1);
        setError(copy.verifyError);
      } else if (code.includes("session")) {
        setSessionToken("");
        setTurnstileToken("");
        setTurnstileCycle((value) => value + 1);
        setError(copy.verify);
      } else {
        setError(copy.error);
      }
    } finally {
      sendingRef.current = false;
      setBusy(false);
    }
  };

  if (!enabled) return null;
  const atLimit = turn >= CHAT_LIMITS.sessionTurns;

  return (
    <div className="fixed bottom-4 right-4 z-[90] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.section
            data-testid="site-chat-panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby="chat-title"
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: reduced ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[76px] right-0 flex h-[min(720px,calc(100svh-112px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-graphite text-porcelain shadow-[0_28px_100px_rgba(18,18,21,0.42)]"
          >
            <header className="border-b border-white/10 px-5 pb-4 pt-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-cobalt text-porcelain"><Bot className="size-5" /></div>
                  <div>
                    <h2 id="chat-title" className="font-display text-xl font-semibold">{copy.title}</h2>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-porcelain/55"><span className="size-1.5 rounded-full bg-emerald-400" />{copy.status}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button type="button" disabled={busy} aria-label={copy.restart} onClick={resetConversation} className="flex size-9 items-center justify-center rounded-full border border-white/10 text-porcelain/70 transition hover:bg-white/10 hover:text-white disabled:opacity-35"><RotateCcw className="size-4" /></button>
                  <button type="button" aria-label={copy.closeLabel} onClick={() => { setOpen(false); launcherRef.current?.focus(); }} className="flex size-9 items-center justify-center rounded-full border border-white/10 text-porcelain/70 transition hover:bg-white/10 hover:text-white"><X className="size-4" /></button>
                </div>
              </div>
              <LoopRail labels={copy.loopLabels} reduced={reduced} />
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite" aria-busy={busy}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={message.role === "user" ? "ml-8 rounded-2xl rounded-br-md bg-cobalt px-4 py-3 text-sm leading-relaxed" : "mr-8 rounded-2xl rounded-bl-md bg-white/[0.08] px-4 py-3 text-sm leading-relaxed text-porcelain/85"}
                >
                  {message.content}
                </motion.div>
              ))}
              {busy && (
                <div className="mr-16 flex items-center gap-2 rounded-2xl rounded-bl-md bg-white/[0.08] px-4 py-3 text-xs text-porcelain/55">
                  <Sparkles className="size-3.5 text-cobalt-bright" />{activity}
                  <span className="flex gap-1">{[0, 1, 2].map((item) => <motion.span key={item} className="size-1 rounded-full bg-cobalt-bright" animate={reduced ? undefined : { opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.1, repeat: Infinity, delay: item * 0.16 }} />)}</span>
                </div>
              )}
              {emailed && !busy && <p className="flex items-center justify-end gap-1.5 pr-1 text-[10px] text-emerald-300/75"><MailCheck className="size-3" />{copy.emailed}</p>}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-white/10 bg-black/10 px-4 pb-4 pt-3">
              {atLimit ? (
                <div className="rounded-2xl border border-cobalt/30 bg-cobalt/10 p-3 text-xs leading-relaxed text-porcelain/75">
                  <p>{copy.limit}</p>
                  <button type="button" onClick={resetConversation} className="mt-3 inline-flex items-center gap-2 rounded-full bg-cobalt px-4 py-2 font-medium text-white"><RotateCcw className="size-3.5" />{copy.restart}</button>
                </div>
              ) : (
                <>
                  {suggestions.length > 0 && (
                    <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                      {suggestions.map((suggestion) => <button key={suggestion} type="button" disabled={busy} onClick={() => void sendMessage(suggestion)} className="shrink-0 rounded-full border border-white/12 px-3 py-1.5 text-[10px] text-porcelain/65 transition hover:border-cobalt hover:text-white disabled:opacity-40">{suggestion}</button>)}
                    </div>
                  )}
                  {!sessionToken && (
                    <div className="mb-2 rounded-xl bg-white/[0.04] p-2">
                      <p className="mb-1.5 text-[10px] leading-relaxed text-porcelain/45">{copy.verify}</p>
                      <TurnstileWidget key={turnstileCycle} action="site_chat" onToken={handleTurnstile} onError={handleTurnstileError} />
                      {turnstileToken && <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-300"><Check className="size-3" />OK</p>}
                    </div>
                  )}
                  <div className="flex items-end gap-2 rounded-2xl border border-white/12 bg-white/[0.05] p-2 focus-within:border-cobalt/70">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(event) => setInput(event.target.value.slice(0, CHAT_LIMITS.message))}
                      onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }}
                      rows={2}
                      maxLength={CHAT_LIMITS.message}
                      placeholder={copy.placeholder}
                      className="max-h-28 min-h-12 flex-1 resize-none bg-transparent px-2 py-1 text-sm text-white outline-none placeholder:text-porcelain/35"
                    />
                    <button type="button" aria-label={copy.send} disabled={busy || input.trim().length < 2} onClick={() => void sendMessage()} className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cobalt text-white transition hover:bg-cobalt-bright disabled:cursor-not-allowed disabled:opacity-35"><Send className="size-4" /></button>
                  </div>
                  {error && <p role="alert" className="mt-2 text-xs text-red-300">{error}</p>}
                  <p className="mt-2 text-[9px] leading-relaxed text-porcelain/35">{copy.privacy}</p>
                </>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        ref={launcherRef}
        data-testid="site-chat-launcher"
        type="button"
        aria-expanded={open}
        aria-label={open ? copy.closeLabel : copy.openLabel}
        onClick={() => setOpen((value) => !value)}
        className="group relative flex h-14 items-center gap-2 overflow-visible rounded-full bg-graphite px-4 text-sm font-medium text-porcelain shadow-[0_16px_50px_rgba(18,18,21,0.3)]"
      >
        <span className="relative flex size-8 items-center justify-center">
          {!reduced && <motion.span data-testid="site-chat-orbit" aria-hidden className="absolute -inset-1.5 rounded-full border border-cobalt/70 border-r-transparent" animate={{ rotate: 360, scale: [1, 1.08, 1] }} transition={{ rotate: { duration: 4.5, repeat: Infinity, ease: "linear" }, scale: { duration: 2.8, repeat: Infinity, ease: "easeInOut" } }} />}
          <span className="relative flex size-8 items-center justify-center rounded-full bg-cobalt"><MessageCircle className="size-4" /></span>
        </span>
        <span className="relative hidden pr-1 sm:block">{copy.launcher}</span>
      </button>
    </div>
  );
}
