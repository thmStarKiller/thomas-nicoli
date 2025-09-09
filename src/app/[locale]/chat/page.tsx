"use client";
import {useLocale, useTranslations} from 'next-intl';
import type {DocWithScore} from '@/lib/rag';
import {useEffect, useRef, useState} from 'react';

type Msg = {role: 'user' | 'assistant'; content: string};

export default function ChatPage() {
  const t = useTranslations('chat');
  const locale = useLocale() as 'en' | 'es';
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [sources, setSources] = useState<DocWithScore[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  async function ask(prompt: string) {
    const next = [...messages, {role: 'user', content: prompt} as Msg, {role: 'assistant', content: ''} as Msg];
    setMessages(next);
    setInput('');
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({messages: next.slice(0, -1), locale})
    });
    if (res.headers.get('Content-Type')?.includes('application/json')) {
      const json = await res.json();
      setMessages((m) => m.map((mm, i) => (i === m.length - 1 ? {...mm, content: json.answer} : mm)));
      setSources(json.sources || []);
      return;
    }
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, {stream: true});
      const idx = buffer.indexOf('\n\n<SOURCES>\n');
      if (idx !== -1) {
        const answer = buffer.slice(0, idx);
        const rest = buffer.slice(idx + '\n\n<SOURCES>\n'.length);
        setMessages((m) => m.map((mm, i) => (i === m.length - 1 ? {...mm, content: answer} : mm)));
        try { setSources(JSON.parse(rest) as DocWithScore[]); } catch {}
        buffer = answer; // for final set
      } else {
        setMessages((m) => m.map((mm, i) => (i === m.length - 1 ? {...mm, content: buffer} : mm)));
      }
    }
  }

  const chips: string[] = t.raw('chips');

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold mb-2">{t('title')}</h1>
      <p className="text-slate-600 mb-6">{t('disclaimer')}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {chips.map((c) => (
          <button key={c} onClick={() => ask(c)} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100">{c}</button>
        ))}
      </div>
      <div className="rounded-2xl bg-white border border-slate-200 p-4 min-h-64">
        {messages.length === 0 && (
          <p className="text-slate-500">{t('placeholder')}</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className="mb-3">
            <div className="text-xs text-slate-500 mb-1">{m.role === 'user' ? 'You' : 'Thomas'}</div>
            <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      {sources.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-slate-700">{t('sources')}</summary>
          <ul className="list-disc pl-5 text-sm text-slate-600 mt-2">
            {sources.map((s, i) => (
              <li key={s.id}>
                <strong>({i + 1}) {s.title}:</strong> <span className="opacity-80">{s.chunk.slice(0, 160)}…</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          ask(input.trim());
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('placeholder')}
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2"
        />
        <button className="rounded-xl bg-[#19C7C9] text-white px-4 py-2">Send</button>
      </form>
    </div>
  );
}
