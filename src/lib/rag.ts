import type MiniSearch from "minisearch";

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

type LoadedIndex = EmbeddingsIndex | BM25Index;

type Retriever = {
  retrieve: (query: string, locale: 'en' | 'es', k?: number) => Promise<DocWithScore[]>;
};

export type DocWithScore = Doc & {score: number};

const cachedIndexes = new Map<string, Promise<LoadedIndex>>();

function dot(a: number[], b: number[]) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function norm(a: number[]) {
  return Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
}

function resolveBase(origin?: string) {
  if (origin) return origin;
  if (typeof process !== 'undefined' && process.env.SITE_URL) {
    return process.env.SITE_URL;
  }
  return 'http://127.0.0.1:3000';
}

async function loadIndex(origin?: string): Promise<LoadedIndex> {
  const base = resolveBase(origin);
  let loader = cachedIndexes.get(base);
  if (!loader) {
    loader = (async () => {
      const url = new URL('/kb-index.json', base);
      const response = await fetch(url.toString(), {cache: 'no-store'});
      if (!response.ok) {
        throw new Error(`[rag] Failed to load KB index: ${response.status} ${response.statusText}`);
      }
      return (await response.json()) as LoadedIndex;
    })();
    cachedIndexes.set(base, loader);
  }
  return loader;
}

export async function getRetriever(origin?: string): Promise<Retriever> {
  const index = await loadIndex(origin);

  if (index.type === 'embeddings' && typeof process !== 'undefined' && process.env.OPENAI_API_KEY) {
    const {default: OpenAI} = await import('openai');
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

    return {
      async retrieve(query, locale, k = 6) {
        const docs = index.locales[locale];
        const result = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: query
        });
        const queryVector = result.data[0].embedding as unknown as number[];
        const queryNorm = norm(queryVector);
        const scored = docs.map((doc) => ({
          ...doc,
          score: doc.embedding ? dot(queryVector, doc.embedding) / (queryNorm * norm(doc.embedding)) : 0
        }));
        return scored.sort((a, b) => b.score - a.score).slice(0, k);
      }
    };
  }

  const {default: MiniSearchLib} = await import('minisearch');
  const minis: Record<'en' | 'es', MiniSearch<Doc>> = {
    en: MiniSearchLib.loadJSON((index as BM25Index).locales.en.serialized as string, {
      fields: ['chunk', 'title'],
      storeFields: ['id', 'locale', 'title', 'chunk']
    }),
    es: MiniSearchLib.loadJSON((index as BM25Index).locales.es.serialized as string, {
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
      return results.slice(0, k).map((entry) => ({
        ...(docs.find((doc) => doc.id === entry.id)!),
        score: entry.score
      }));
    }
  };
}
