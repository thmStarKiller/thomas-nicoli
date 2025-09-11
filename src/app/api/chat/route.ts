import {NextRequest} from 'next/server';
import {getRetriever} from '@/lib/rag';
import type { DocWithScore } from '@/lib/rag';
import {systemPrompt} from '@/lib/prompts';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages = body?.messages ?? [];
  const locale: 'en' | 'es' = (body?.locale === 'en' ? 'en' : 'es');
  const userText: string = messages?.[messages.length - 1]?.content ?? '';

  let top: DocWithScore[] = [] as unknown as DocWithScore[];
  try {
    const retriever = await getRetriever();
    top = await retriever.retrieve(userText, locale, 6);
  } catch (e) {
    top = [] as unknown as DocWithScore[];
  }

  const typedTop = top as unknown as DocWithScore[];
  const snippets = typedTop
    .map((d, i) => `Source ${i + 1} [${d.title}]:\n${d.chunk}`)
    .join('\n\n');

  const hasGemini = !!process.env.GOOGLE_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  if (!hasGemini && !hasOpenAI) {
    const outline =
      locale === 'es'
        ? `Sin clave de OpenAI configurada. Basado en recuperación BM25, esto es lo que parece relevante:`
        : `No OpenAI key configured. Based on BM25 retrieval, here is what seems relevant:`;
    const answer = `${outline}\n\n` +
      top.map((d, i) => `• (${i + 1}) ${d.title}`).join('\n') +
      `\n\n` +
      (locale === 'es'
        ? `Siguiente paso: agenda una llamada para validar detalles.`
        : `Next step: book an intro call to validate details.`);
    return new Response(JSON.stringify({answer, sources: top}), {
      headers: {'Content-Type': 'application/json'}
    });
  }

  // Prefer Gemini when configured, else fall back to OpenAI (streaming)
  if (hasGemini) {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-2.5-pro',
        systemInstruction: systemPrompt(locale, snippets),
      });

      // Map messages to Gemini format
      const contents = (messages || []).map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const result = await model.generateContent({ contents });
      const text = (result as any)?.response?.text?.() || '';
      return new Response(
        JSON.stringify({ answer: text, sources: top }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    } catch (e: any) {
      const msg = e?.message || 'Gemini request failed';
      const answer =
        (locale === 'es'
          ? `No se pudo completar la solicitud a Gemini: ${msg}. Aquí tienes el contenido relevante:`
          : `Gemini request failed: ${msg}. Here is the relevant content:`) +
        `\n\n` + top.map((d, i) => `• (${i + 1}) ${d.title}`).join('\n');
      return new Response(JSON.stringify({ answer, sources: top }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const encoder = new TextEncoder();
        const sys = systemPrompt(locale, snippets);

        // Fallback: OpenAI streaming
        const { default: OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          stream: true,
          messages: [{ role: 'system', content: sys } as const, ...messages],
        });
        for await (const part of completion) {
          const delta = part.choices?.[0]?.delta?.content;
          if (typeof delta === 'string') controller.enqueue(encoder.encode(delta));
        }
        controller.enqueue(encoder.encode(`\n\n<SOURCES>\n${JSON.stringify(top)}`));
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
