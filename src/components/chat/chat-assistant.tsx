"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, ArrowUpRight, Check, MailCheck, RotateCcw, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getChatCopy } from "@/i18n/chat";
import { CHAT_LIMITS } from "@/lib/chat/contracts";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** True until the reply has been written out on screen once. */
  fresh?: boolean;
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

interface PendingChat {
  interactionId: string;
  sessionId: string;
  sessionToken: string;
  turnIndex: number;
  message: string;
}

function parsePendingChat(raw: string | null): PendingChat | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<PendingChat>;
    if (
      typeof value.interactionId !== "string" || value.interactionId.length < 16 ||
      typeof value.sessionId !== "string" || value.sessionId.length < 16 ||
      typeof value.sessionToken !== "string" || value.sessionToken.length < 24 ||
      !Number.isInteger(value.turnIndex) || value.turnIndex! < 1 || value.turnIndex! > CHAT_LIMITS.sessionTurns ||
      typeof value.message !== "string" || value.message.length < 2 || value.message.length > CHAT_LIMITS.message
    ) return null;
    return value as PendingChat;
  } catch {
    return null;
  }
}

const EASE = [0.19, 1, 0.22, 1] as const;
const GLYPHS = "01<>/\\[]{}#%=+*";
const MODEL_LABEL = "Nemotron 3.5 Super VL";
/** Below Tailwind's `sm` breakpoint the panel takes the whole screen. */
const PHONE_QUERY = "(max-width: 639px)";

function scramble(length: number): string {
  let out = "";
  for (let index = 0; index < length; index += 1) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  return out;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Signal bars. Square blocks that rise and fall out of step with each other.
 * Static when motion is reduced.
 */
function SignalBars({
  count,
  active,
  reduced,
  className,
  testId,
}: {
  count: number;
  active: boolean;
  reduced: boolean | null;
  className?: string;
  testId?: string;
}) {
  return (
    <span aria-hidden className={`flex items-end gap-[3px] ${className ?? ""}`}>
      {Array.from({ length: count }, (_, index) => {
        const rest = 0.22 + ((index * 37) % 50) / 100;
        if (reduced) {
          return <span key={index} className="h-full flex-1 bg-current" style={{ transform: `scaleY(${rest})`, transformOrigin: "center bottom" }} />;
        }
        const style = {
          "--bar-delay": `${-((index * 173) % 1400)}ms`,
          "--bar-speed": `${(active ? 620 : 1500) + ((index * 97) % 520)}ms`,
          "--bar-peak": active ? 1 : rest,
        } as CSSProperties;
        return <span key={index} data-testid={index === 0 ? testId : undefined} className="chat-bar h-full flex-1 bg-current" style={style} />;
      })}
    </span>
  );
}

/** A label that settles out of noise whenever its text changes. */
function ScrambleLabel({ text, reduced }: { text: string; reduced: boolean | null }) {
  const [settled, setSettled] = useState(reduced ? text.length : 0);
  const [noise, setNoise] = useState("");

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    let started = 0;
    const duration = Math.min(700, 220 + text.length * 16);
    const step = (time: number) => {
      if (!started) started = time;
      const done = Math.min(text.length, Math.floor(((time - started) / duration) * text.length));
      setSettled(done);
      setNoise(scramble(text.length - done));
      if (done < text.length) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [reduced, text]);

  if (reduced || settled >= text.length) return <span>{text}</span>;
  return (
    <span>
      <span aria-hidden>{text.slice(0, settled)}<span className="text-spice-bright">{noise}</span></span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

/**
 * Writes a reply out once. The full text holds its place from the first frame,
 * so nothing below it moves, and assistive tech reads the whole reply at once.
 */
function RevealText({
  text,
  animate,
  onDone,
}: {
  text: string;
  animate: boolean;
  onDone: () => void;
}) {
  const [shown, setShown] = useState(animate ? 0 : text.length);
  const [head, setHead] = useState("");
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!animate) return;
    let frame = 0;
    let started = 0;
    const duration = Math.min(2600, Math.max(520, text.length * 13));
    const step = (time: number) => {
      if (!started) started = time;
      const count = Math.min(text.length, Math.floor(((time - started) / duration) * text.length));
      setShown(count);
      setHead(text.slice(count, count + 4).replace(/\S/g, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]));
      if (count < text.length) frame = requestAnimationFrame(step);
      else doneRef.current();
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [animate, text]);

  if (!animate || shown >= text.length) return <>{text}</>;
  return (
    <>
      <span aria-hidden>
        {text.slice(0, shown)}
        <span className="bg-spice-bright text-night">{head}</span>
        <span className="invisible">{text.slice(shown + head.length)}</span>
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}

/** Seconds since the model started working, as a readout. */
function Elapsed({ reduced }: { reduced: boolean | null }) {
  const [tenths, setTenths] = useState(0);
  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => setTenths(Math.floor((Date.now() - started) / 100)), reduced ? 1000 : 100);
    return () => window.clearInterval(timer);
  }, [reduced]);
  return <span className="tabular-nums">T+{pad(Math.floor(tenths / 10))}.{tenths % 10}s</span>;
}

/** The four real steps of a turn; the block marks where this turn is. */
function LoopRail({ labels, stage, reduced }: { labels: readonly string[]; stage: number; reduced: boolean | null }) {
  return (
    <div data-testid="site-chat-loop" aria-hidden className="relative mt-3 grid grid-cols-4 border-t border-sand/15 sm:mt-4">
      <motion.span
        className="absolute left-0 top-[-1px] h-px w-1/4 bg-spice-bright"
        initial={false}
        animate={{ x: `${stage * 100}%` }}
        transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
      />
      {labels.map((label, index) => (
        <div key={label} className={`flex min-w-0 items-baseline gap-1.5 pt-2 font-hud text-[8px] uppercase tracking-[0.14em] transition-colors duration-500 ${index === stage ? "text-sand" : "text-sand/40"}`}>
          <span className={index === stage ? "text-spice-bright" : undefined}>{pad(index + 1)}</span>
          <span className="truncate">{label}</span>
        </div>
      ))}
    </div>
  );
}

/** Square brackets at the four corners of the panel. */
function CornerTicks() {
  const base = "pointer-events-none absolute z-10 size-2.5 border-spice-bright";
  return (
    <span aria-hidden>
      <span className={`${base} left-0 top-0 border-l border-t`} />
      <span className={`${base} right-0 top-0 border-r border-t`} />
      <span className={`${base} bottom-0 left-0 border-b border-l`} />
      <span className={`${base} bottom-0 right-0 border-b border-r`} />
    </span>
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
  const [pending, setPending] = useState<PendingChat | null>(null);
  const [resumeVersion, setResumeVersion] = useState(0);
  const [phase, setPhase] = useState(0);
  const pendingStorageKey = `site-chat-pending:${lang}`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  const resumingRef = useRef(false);

  const rememberPending = useCallback((record: PendingChat) => {
    setPending(record);
    sessionStorage.setItem(pendingStorageKey, JSON.stringify(record));
  }, [pendingStorageKey]);

  const forgetPending = useCallback(() => {
    setPending(null);
    sessionStorage.removeItem(pendingStorageKey);
  }, [pendingStorageKey]);

  const applyCompletedReply = useCallback((payload: ChatResponse, record: PendingChat) => {
    if (!payload.reply) return;
    setMessages((current) => [
      ...current.filter((message) => message.id !== `pending-${record.interactionId}` && message.id !== record.interactionId),
      { id: record.interactionId, role: "assistant", content: payload.reply!, fresh: true },
    ]);
    setTurn((current) => Math.max(current, record.turnIndex));
    setSuggestions((payload.suggestions ?? []).slice(0, CHAT_LIMITS.suggestions));
    setEmailed(Boolean(payload.emailed));
    setError("");
    forgetPending();
  }, [forgetPending, setEmailed, setError, setMessages, setSuggestions, setTurn]);

  const resetConversation = () => {
    setSessionId(crypto.randomUUID());
    setSessionToken("");
    setTurnstileToken("");
    setTurnstileCycle((value) => value + 1);
    setMessages([{ id: "greeting", role: "assistant", content: copy.greeting, fresh: true }]);
    setInput("");
    setTurn(0);
    setSuggestions([...copy.quickPrompts]);
    setError("");
    setEmailed(false);
    setActivity(copy.sending);
    forgetPending();
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const restored = parsePendingChat(sessionStorage.getItem(pendingStorageKey));
      if (restored) {
        setSessionId(restored.sessionId);
        setSessionToken(restored.sessionToken);
        setTurn(restored.turnIndex);
        setMessages([
          { id: "greeting", role: "assistant", content: copy.greeting },
          { id: `restored-user-${restored.interactionId}`, role: "user", content: restored.message },
          { id: `pending-${restored.interactionId}`, role: "assistant", content: copy.queued },
        ]);
        setSuggestions([]);
        setPending(restored);
      } else {
        sessionStorage.removeItem(pendingStorageKey);
        setSessionId(crypto.randomUUID());
        setMessages([{ id: "greeting", role: "assistant", content: copy.greeting, fresh: true }]);
        setSuggestions([...copy.quickPrompts]);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [copy.greeting, copy.queued, copy.quickPrompts, pendingStorageKey]);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => {
      if (!window.matchMedia(PHONE_QUERY).matches) textareaRef.current?.focus();
    });
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

  // On phones the panel is the whole visible screen. It tracks the visual
  // viewport, so the input stays above the on-screen keyboard, and the page
  // behind it does not scroll.
  useEffect(() => {
    if (!open) return;
    const phone = window.matchMedia(PHONE_QUERY);
    const viewport = window.visualViewport;
    const style = document.documentElement.style;
    const release = () => {
      style.removeProperty("--chat-height");
      style.removeProperty("--chat-top");
      style.removeProperty("overflow");
    };
    const apply = () => {
      if (!phone.matches) return release();
      style.setProperty("--chat-height", `${Math.round(viewport?.height ?? window.innerHeight)}px`);
      style.setProperty("--chat-top", `${Math.round(viewport?.offsetTop ?? 0)}px`);
      style.setProperty("overflow", "hidden");
      messagesEndRef.current?.scrollIntoView({ block: "end" });
    };
    apply();
    viewport?.addEventListener("resize", apply);
    viewport?.addEventListener("scroll", apply);
    phone.addEventListener("change", apply);
    return () => {
      viewport?.removeEventListener("resize", apply);
      viewport?.removeEventListener("scroll", apply);
      phone.removeEventListener("change", apply);
      release();
    };
  }, [open]);

  useEffect(() => {
    if (!busy) return;
    const reset = requestAnimationFrame(() => setPhase(0));
    const timer = window.setInterval(() => setPhase((value) => Math.min(value + 1, copy.phases.length - 1)), 1_700);
    return () => {
      cancelAnimationFrame(reset);
      window.clearInterval(timer);
    };
  }, [busy, copy.phases.length]);

  const settleMessage = useCallback((id: string) => {
    setMessages((current) => current.map((message) => (message.id === id && message.fresh ? { ...message, fresh: false } : message)));
  }, [setMessages]);

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

  const waitForLocalReply = useCallback(async (
    token: string,
    interactionId: string,
    statusSessionId: string = sessionId,
  ): Promise<ChatResponse> => {
    setActivity(copy.waiting);
    for (let attempt = 0; attempt < 45; attempt += 1) {
      if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 2_000));
      const response = await fetch("/api/chat/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: statusSessionId, sessionToken: token, interactionId }),
      });
      const payload = (await response.json()) as ChatResponse;
      if (response.ok && payload.status === "completed" && payload.reply) return payload;
      if (response.status === 202 && payload.queued) continue;
      throw new Error(payload.error || "chat_status_failed");
    }
    throw new Error("local_ai_timeout");
  }, [copy.waiting, sessionId]);

  useEffect(() => {
    if (!open || !pending || sendingRef.current || resumingRef.current) return;
    let cancelled = false;
    resumingRef.current = true;
    setBusy(true);
    setError("");

    void waitForLocalReply(pending.sessionToken, pending.interactionId, pending.sessionId)
      .then((payload) => {
        if (!cancelled) applyCompletedReply(payload, pending);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        const code = cause instanceof Error ? cause.message : "chat_status_failed";
        if (code === "local_ai_timeout") {
          setResumeVersion((value) => value + 1);
        } else if (code.includes("unauthorized") || code.includes("expired")) {
          forgetPending();
          setSessionToken("");
          setError(copy.verify);
        } else if (code.includes("local_ai_failed")) {
          forgetPending();
          setError(copy.error);
        } else {
          setError(copy.error);
        }
      })
      .finally(() => {
        resumingRef.current = false;
        setBusy(false);
        if (cancelled) setResumeVersion((value) => value + 1);
      });

    return () => { cancelled = true; };
  }, [applyCompletedReply, copy.error, copy.verify, forgetPending, open, pending, resumeVersion, waitForLocalReply]);

  const sendMessage = async (proposed?: string) => {
    const message = (proposed ?? input).trim().slice(0, CHAT_LIMITS.message);
    if (sendingRef.current || busy || pending || message.length < 2 || turn >= CHAT_LIMITS.sessionTurns) return;
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
    let pendingRecord: PendingChat | null = null;

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
      pendingRecord = {
        interactionId: queuedInteractionId,
        sessionId,
        sessionToken: token,
        turnIndex: nextTurn,
        message,
      };
      rememberPending(pendingRecord);
      if (!payload.reply) payload = await waitForLocalReply(token, queuedInteractionId, sessionId);
      if (!payload.reply) throw new Error("local_ai_empty_reply");
      applyCompletedReply(payload, pendingRecord);
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : "chat_failed";
      if (accepted && code === "local_ai_timeout") {
        setTurn(nextTurn);
        if (pendingRecord) {
          setMessages((current) => current.some((message) => message.id === `pending-${pendingRecord!.interactionId}`)
            ? current
            : [...current, { id: `pending-${pendingRecord!.interactionId}`, role: "assistant", content: copy.queued }]);
        }
        setResumeVersion((value) => value + 1);
      } else if (accepted) {
        setTurn(nextTurn);
        if (code.includes("local_ai_failed") || code.includes("unauthorized") || code.includes("expired")) forgetPending();
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
  const lastMessage = messages[messages.length - 1];
  const answered = !busy && lastMessage?.role === "assistant" && lastMessage.id !== "greeting" && !lastMessage.id.startsWith("pending-");
  const stage = busy ? 1 : answered ? (emailed ? 3 : 2) : 0;
  const waitingForBackup = activity === copy.waiting;
  const [titleHead, ...titleRest] = copy.title.split(",");
  const titleTail = titleRest.join(",").trim();

  return (
    <div className="fixed bottom-4 right-4 z-[90] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.section
            data-testid="site-chat-panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby="chat-title"
            initial={reduced ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }}
            transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
            data-lenis-prevent
            className="fixed inset-x-0 top-[var(--chat-top,0px)] flex h-[var(--chat-height,100dvh)] flex-col overflow-hidden border-sand/20 bg-night text-sand sm:absolute sm:inset-x-auto sm:bottom-[72px] sm:right-0 sm:top-auto sm:h-[min(760px,calc(100svh-104px))] sm:w-[440px] sm:border"
          >
            <CornerTicks />
            {!reduced && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20 origin-top bg-spice-bright"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.18 }}
              />
            )}

            <header className="relative border-b border-sand/15 px-4 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="hidden min-w-0 items-center gap-2 font-hud text-[8px] uppercase leading-snug tracking-[0.14em] text-sand/60 sm:flex">
                  <span className={`size-1.5 shrink-0 bg-spice-bright ${reduced ? "" : "chat-blink"}`} />
                  <span>{copy.status}</span>
                </p>
                <p aria-hidden className="flex min-w-0 items-center gap-2.5 font-display text-[clamp(1rem,5vw,1.3rem)] leading-none sm:hidden">
                  <span className={`size-1.5 shrink-0 bg-spice-bright ${reduced ? "" : "chat-blink"}`} />
                  <span className="truncate pb-0.5">{titleHead}{titleTail ? ", " : ""}{titleTail && <em className="text-spice-bright">{titleTail}</em>}</span>
                </p>
                <div className="flex shrink-0 items-center">
                  <button type="button" disabled={busy} aria-label={copy.restart} onClick={resetConversation} className="chat-chip flex size-10 items-center justify-center border border-sand/20 text-sand/70 disabled:opacity-35 sm:size-9"><RotateCcw className="size-4" /></button>
                  <button type="button" aria-label={copy.closeLabel} onClick={() => { setOpen(false); launcherRef.current?.focus(); }} className="chat-chip -ml-px flex size-10 items-center justify-center border border-sand/20 text-sand/70 sm:size-9"><X className="size-4" /></button>
                </div>
              </div>
              <div className="mt-3 hidden items-end justify-between gap-4 sm:flex">
                <h2 id="chat-title" className="font-display text-[2.1rem] leading-[0.95]">
                  <span className="block overflow-hidden">
                    <motion.span className="block" initial={reduced ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: reduced ? 0 : 0.5 }}>{titleHead}{titleTail ? "," : ""}</motion.span>
                  </span>
                  {titleTail && (
                    <span className="block overflow-hidden">
                      <motion.em className="block text-spice-bright" initial={reduced ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: reduced ? 0 : 0.6 }}>{titleTail}</motion.em>
                    </span>
                  )}
                </h2>
                <div className="shrink-0 text-right font-hud text-[9px] uppercase tracking-[0.14em] text-sand/50">
                  <SignalBars count={14} active={busy} reduced={reduced} className={`ml-auto h-7 w-24 ${busy ? "text-spice-bright" : "text-sand/45"}`} />
                  <p className="mt-1.5 tabular-nums">{copy.turnLabel} {pad(Math.min(turn + (busy ? 1 : 0), CHAT_LIMITS.sessionTurns))}/{CHAT_LIMITS.sessionTurns}</p>
                </div>
              </div>
              <LoopRail labels={copy.loopLabels} stage={stage} reduced={reduced} />
            </header>

            <div className="chat-scroll relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-5 sm:px-5" aria-live="polite" aria-busy={busy}>
              <div className="space-y-6">
                {messages.map((message, index) => {
                  const fromUser = message.role === "user";
                  return (
                    <motion.div
                      key={message.id}
                      data-message-role={message.role}
                      initial={reduced ? false : fromUser ? { clipPath: "inset(0% 0% 0% 100%)" } : { opacity: 0, y: 8 }}
                      animate={fromUser ? { clipPath: "inset(0% 0% 0% 0%)" } : { opacity: 1, y: 0 }}
                      transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
                      className={fromUser ? "ml-10" : "mr-4"}
                    >
                      <p aria-hidden className={`flex items-center gap-2 font-hud text-[8px] uppercase tracking-[0.18em] ${fromUser ? "flex-row-reverse text-sand/55" : "text-sand/55"}`}>
                        <span className={fromUser ? "text-sand" : "text-spice-bright"}>{fromUser ? copy.youLabel : "TomBot"}</span>
                        <motion.span
                          className={`h-px flex-1 bg-sand/20 ${fromUser ? "origin-right" : "origin-left"}`}
                          initial={reduced ? false : { scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: reduced ? 0 : 0.7, ease: EASE, delay: reduced ? 0 : 0.1 }}
                        />
                        <span className="tabular-nums">{pad(index + 1)}</span>
                      </p>
                      <div className={fromUser ? "mt-2 whitespace-pre-line bg-spice px-4 py-3 text-[0.9375rem] leading-relaxed text-sand" : "mt-2 whitespace-pre-line text-[0.9375rem] leading-relaxed text-sand/90"}>
                        {fromUser
                          ? message.content
                          : <RevealText text={message.content} animate={Boolean(message.fresh) && !reduced} onDone={() => settleMessage(message.id)} />}
                      </div>
                    </motion.div>
                  );
                })}
                {busy && (
                  <div className="relative overflow-hidden border border-sand/20 px-4 py-3">
                    <p className="flex items-center justify-between gap-3 font-hud text-[9px] uppercase tracking-[0.14em] text-sand/70">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className={`size-1.5 shrink-0 bg-spice-bright ${reduced ? "" : "chat-blink"}`} />
                        <span className="truncate">{waitingForBackup ? copy.loopLabels[1] : <ScrambleLabel key={phase} text={copy.phases[phase]} reduced={reduced} />}</span>
                      </span>
                      <span className="shrink-0 text-spice-bright"><Elapsed reduced={reduced} /></span>
                    </p>
                    <div className="relative mt-3">
                      <SignalBars count={36} active reduced={reduced} className="h-8 text-spice-bright" />
                      {!reduced && <span aria-hidden className="chat-scan pointer-events-none absolute inset-y-0 w-px bg-sand" />}
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-sand/65">{activity}</p>
                  </div>
                )}
                {emailed && !busy && <p className="flex items-center justify-end gap-1.5 font-hud text-[8px] uppercase tracking-[0.14em] text-sand/60"><MailCheck className="size-3 text-spice-bright" />{copy.emailed}</p>}
              </div>
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-sand/15 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-5 sm:pb-4">
              {atLimit ? (
                <div className="border border-spice-bright/50 p-4 text-sm leading-relaxed text-sand/80">
                  <p>{copy.limit}</p>
                  <button type="button" onClick={resetConversation} className="cta cta-spice cta-sm mt-4"><RotateCcw className="size-3.5" />{copy.restart}</button>
                </div>
              ) : (
                <>
                  {suggestions.length > 0 && (
                    <ul className="chat-chips -mx-4 mb-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:block sm:border-t sm:border-sand/15 sm:px-0">
                      {suggestions.map((suggestion, index) => (
                        <motion.li
                          key={suggestion}
                          className="shrink-0 sm:shrink"
                          initial={reduced ? false : { opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: reduced ? 0 : 0.5, ease: EASE, delay: reduced ? 0 : 0.08 * index }}
                        >
                          <button type="button" disabled={busy} onClick={() => void sendMessage(suggestion)} className="chat-chip flex items-center gap-2 whitespace-nowrap border border-sand/20 px-3 py-2.5 text-left text-[0.8125rem] leading-snug text-sand/80 disabled:opacity-40 sm:w-full sm:gap-3 sm:whitespace-normal sm:border-x-0 sm:border-t-0 sm:border-sand/15 sm:px-2">
                            <span className="font-hud text-[8px] tabular-nums tracking-[0.14em] opacity-60">{pad(index + 1)}</span>
                            <span className="min-w-0 flex-1">{suggestion}</span>
                            <ArrowUpRight className="hidden size-3.5 shrink-0 sm:block" />
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                  {!sessionToken && (
                    <div className="mb-3 border border-sand/15 p-2.5">
                      <p className="mb-2 flex items-center justify-between gap-2 text-[0.6875rem] leading-relaxed text-sand/70">
                        <span>{copy.verify}</span>
                        {turnstileToken && <span className="flex shrink-0 items-center gap-1 font-hud text-[8px] uppercase tracking-[0.14em] text-spice-bright"><Check className="size-3" />OK</span>}
                      </p>
                      <TurnstileWidget key={turnstileCycle} action="site_chat" onToken={handleTurnstile} onError={handleTurnstileError} />
                    </div>
                  )}
                  <div className="flex items-stretch border border-sand/25 transition-colors duration-300 focus-within:border-spice-bright">
                    <span aria-hidden className="flex w-8 shrink-0 items-start justify-center pt-3 font-hud text-sm text-spice-bright">&gt;</span>
                    <textarea
                      ref={textareaRef}
                      disabled={busy || Boolean(pending)}
                      value={input}
                      onChange={(event) => setInput(event.target.value.slice(0, CHAT_LIMITS.message))}
                      onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }}
                      rows={2}
                      maxLength={CHAT_LIMITS.message}
                      placeholder={copy.placeholder}
                      aria-label={copy.placeholder}
                      className="max-h-28 min-h-14 flex-1 resize-none bg-transparent py-2.5 pr-2 text-base leading-snug text-sand outline-none placeholder:text-sand/45 focus-visible:outline-none sm:text-[0.9375rem] sm:leading-relaxed"
                    />
                    <button type="button" aria-label={copy.send} disabled={busy || Boolean(pending) || input.trim().length < 2} onClick={() => void sendMessage()} className="group flex w-14 shrink-0 items-center justify-center bg-spice-bright text-night transition-colors duration-300 hover:bg-sand disabled:cursor-not-allowed disabled:bg-sand/15 disabled:text-sand/40">
                      <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-disabled:translate-y-0" />
                    </button>
                  </div>
                  <div className="mt-1.5 hidden items-center justify-between font-hud text-[8px] uppercase tracking-[0.14em] text-sand/45 sm:flex">
                    <span>{MODEL_LABEL}</span>
                    <span className="tabular-nums">{String(input.length).padStart(3, "0")}/{CHAT_LIMITS.message}</span>
                  </div>
                  {error && <p role="alert" className="mt-2 border-l-2 border-spice-bright pl-2 text-xs leading-relaxed text-sand">{error}</p>}
                  <p className={`mt-2 text-[0.625rem] leading-snug text-sand/55 sm:leading-relaxed ${turn > 0 ? "hidden sm:block" : ""}`}>{copy.privacy}</p>
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
        className={`group relative h-14 items-stretch overflow-hidden border border-sand/25 bg-night text-sand ${open ? "hidden sm:flex" : "flex"}`}
      >
        <span className="flex w-14 shrink-0 items-center justify-center bg-spice-bright text-night transition-colors duration-300 group-hover:bg-sand">
          {open
            ? <X className="size-5" />
            : <SignalBars count={5} active={false} reduced={reduced} className="h-5 w-6" testId="site-chat-orbit" />}
        </span>
        <span className="relative hidden flex-col justify-center px-4 text-left sm:flex">
          <span className="font-hud text-[8px] uppercase tracking-[0.2em] text-sand/55">{copy.kicker} · TomBot</span>
          <span className="mt-0.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em]">{copy.launcher}</span>
        </span>
        {!reduced && <span aria-hidden className="chat-sweep pointer-events-none absolute bottom-0 left-0 h-px w-1/4 bg-spice-bright" />}
      </button>
    </div>
  );
}
