import fs from 'node:fs';
import path from 'node:path';
import type MiniSearch from 'minisearch';

type Doc = {
  id: string;
  locale: 'en' | 'es';
  title: string;
  chunk: string;
  embedding?: number[];
};

type EmbeddingsIndex = {
  type: 'embeddings';
  model: string;
  locales: {en: Doc[]; es: Doc[]};
};
type BM25Index = {
  type: 'bm25';
  locales: {
    en: {serialized: unknown; docs: Doc[]};
    es: {serialized: unknown; docs: Doc[]};
  };
};

type Retriever = {
  retrieve: (query: string, locale: 'en' | 'es', k?: number) => Promise<DocWithScore[]>;
};

export type DocWithScore = Doc & {score: number};

let cached: EmbeddingsIndex | BM25Index | null = null;

function loadIndex() {
  if (cached) return cached;
  const file = path.join(process.cwd(), 'public', 'kb-index.json');
  const json = fs.readFileSync(file, 'utf8');
  cached = JSON.parse(json);
  return cached!;
}

function dot(a: number[], b: number[]) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}
function norm(a: number[]) {
  return Math.sqrt(a.reduce((s, x) => s + x * x, 0));
}

export async function getRetriever(): Promise<Retriever> {
  const index = loadIndex();
  if (index.type === 'embeddings' && process.env.OPENAI_API_KEY) {
    const {default: OpenAI} = await import('openai');
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    return {
      async retrieve(query, locale, k = 6) {
        const docs = index.locales[locale];
        const emb = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: query
        });
        const q = emb.data[0].embedding as unknown as number[];
        const qn = norm(q);
        const scored = docs.map((d) => ({
          ...d,
          score: d.embedding ? dot(q, d.embedding) / (qn * norm(d.embedding)) : 0
        }));
        return scored.sort((a, b) => b.score - a.score).slice(0, k);
      }
    };
  }

  // BM25 fallback using MiniSearch
  const {default: MiniSearch} = await import('minisearch');
  const minis: Record<'en' | 'es', MiniSearch<Doc>> = {
    en: MiniSearch.loadJSON((index as BM25Index).locales.en.serialized as string, {
      fields: ['chunk', 'title'],
      storeFields: ['id', 'locale', 'title', 'chunk']
    }),
    es: MiniSearch.loadJSON((index as BM25Index).locales.es.serialized as string, {
      fields: ['chunk', 'title'],
      storeFields: ['id', 'locale', 'title', 'chunk']
    })
  } as unknown as Record<'en' | 'es', MiniSearch<Doc>>;
  const docMap: Record<'en' | 'es', Doc[]> = {
    en: (index as BM25Index).locales.en.docs,
    es: (index as BM25Index).locales.es.docs
  };

  return {
    async retrieve(query, locale, k = 6) {
      const mini = minis[locale];
      const results = mini.search(query, {prefix: true, fuzzy: 0.2}) as unknown as Array<{
        id: string;
        score: number;
      }>;
      const docs = docMap[locale];
      return results.slice(0, k).map((r) => ({
        ...(docs.find((d) => d.id === r.id)!),
        score: r.score
      }));
    }
  };
}
