#!/usr/bin/env node
/* eslint-disable no-console */
/*
  Build a searchable KB index from /content/knowledge
  - If OPENAI_API_KEY set: create embeddings (text-embedding-3-small)
  - Else: build BM25 index via MiniSearch
  Outputs: public/kb-index.json
*/
import fs from 'node:fs';
import path from 'node:path';
import MiniSearch from 'minisearch';

type Doc = {
  id: string;
  locale: 'en' | 'es';
  title: string;
  chunk: string;
  embedding?: number[];
};

const KB_DIR = path.join(process.cwd(), 'content', 'knowledge');
const OUT_DIR = path.join(process.cwd(), 'public');
const OUT_FILE = path.join(OUT_DIR, 'kb-index.json');

function readFiles() {
  const files = fs.readdirSync(KB_DIR).filter((f) => f.endsWith('.md'));
  const docs: Doc[] = [];
  for (const file of files) {
    const full = fs.readFileSync(path.join(KB_DIR, file), 'utf8');
    const title = file.replace(/\.md$/, '').replace(/[-_]/g, ' ');
    // Split by locale sections
    const parts = full.split(/\n##\s+(EN|ES)\s*\n/);
    // parts like [before, 'EN', enText, 'ES', esText] depending on file
    const map: Record<string, string> = {};
    for (let i = 1; i < parts.length; i += 2) {
      map[parts[i]] = parts[i + 1];
    }
    const en = (map['EN'] || full).trim();
    const es = (map['ES'] || full).trim();
    const chunkSize = 800;
    function pushChunks(text: string, locale: 'en' | 'es') {
      const chunks: string[] = [];
      let start = 0;
      while (start < text.length) {
        let end = Math.min(start + chunkSize, text.length);
        // try to break at sentence
        const next = text.slice(start, end);
        const period = next.lastIndexOf('. ');
        if (period > 200) end = start + period + 1;
        chunks.push(text.slice(start, end).trim());
        start = end;
      }
      chunks
        .filter(Boolean)
        .forEach((chunk, idx) =>
          docs.push({
            id: `${file}-${locale}-${idx}`,
            locale,
            title,
            chunk
          })
        );
    }
    if (en) pushChunks(en, 'en');
    if (es) pushChunks(es, 'es');
  }
  return docs;
}

async function build() {
  try {
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, {recursive: true});
    const docs = readFiles();

    const hasKey = !!process.env.OPENAI_API_KEY;

    if (hasKey) {
      const {default: OpenAI} = await import('openai');
      const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
      console.log(`[kb] Building embeddings for ${docs.length} chunks...`);
      // Batch embeddings in groups of 128 to stay under token limits
      const batches: Doc[][] = [];
      const batchSize = 64;
      for (let i = 0; i < docs.length; i += batchSize) {
        batches.push(docs.slice(i, i + batchSize));
      }
      let idx = 0;
      for (const batch of batches) {
        idx++;
        const res = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: batch.map((d) => d.chunk)
        });
        res.data.forEach((e, i) => (batch[i].embedding = e.embedding as unknown as number[]));
        console.log(`[kb] Embedded batch ${idx}/${batches.length}`);
      }
      const payload = {
        type: 'embeddings' as const,
        model: 'text-embedding-3-small',
        locales: {
          en: docs.filter((d) => d.locale === 'en'),
          es: docs.filter((d) => d.locale === 'es')
        }
      };
      fs.writeFileSync(OUT_FILE, JSON.stringify(payload));
      console.log(`[kb] Wrote ${OUT_FILE}`);
      return;
    }

    console.log(`[kb] No OPENAI_API_KEY, building BM25 index with MiniSearch`);
    const enDocs = docs.filter((d) => d.locale === 'en');
    const esDocs = docs.filter((d) => d.locale === 'es');

    function buildMini(docs: Doc[]) {
      const mini = new MiniSearch<Doc>({
        fields: ['chunk', 'title'],
        storeFields: ['id', 'locale', 'title', 'chunk']
      });
      mini.addAll(docs);
      return {serialized: mini.toJSON(), docs};
    }

    const payload = {
      type: 'bm25' as const,
      locales: {
        en: buildMini(enDocs),
        es: buildMini(esDocs)
      }
    };
    fs.writeFileSync(OUT_FILE, JSON.stringify(payload));
    console.log(`[kb] Wrote ${OUT_FILE}`);
  } catch (error) {
    console.error('[kb] Build failed:', error);
    throw error;
  }
}

build().catch((error) => {
  console.error('[kb] Fatal error:', error);
  process.exit(1);
});
