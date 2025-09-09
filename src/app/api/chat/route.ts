import {NextRequest} from 'next/server';
import {getRetriever} from '@/lib/rag';
import {systemPrompt} from '@/lib/prompts';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages = body?.messages ?? [];
  const locale: 'en' | 'es' = (body?.locale === 'en' ? 'en' : 'es');
  const userText: string = messages?.[messages.length - 1]?.content ?? '';

  const retriever = await getRetriever();
  const top = await retriever.retrieve(userText, locale, 6);

  const snippets = top
    .map((d, i) => `Source ${i + 1} [${d.title}]:\n${d.chunk}`)
    .join('\n\n');

  const hasKey = !!process.env.OPENAI_API_KEY;

  if (!hasKey) {
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

  const {default: OpenAI} = await import('openai');
  const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const sys = {role: 'system', content: systemPrompt(locale, snippets)} as const;
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          stream: true,
          messages: [sys, ...messages]
        });
        for await (const part of completion) {
          const delta = part.choices?.[0]?.delta?.content;
          if (typeof delta === 'string') {
            controller.enqueue(new TextEncoder().encode(delta));
          }
        }
        // Append sources JSON after a delimiter
        controller.enqueue(new TextEncoder().encode(`\n\n<SOURCES>\n${JSON.stringify(top)}`));
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}

