Thomas Nicoli — AI Consulting for E‑commerce
================================================

Modern, fast, accessible, bilingual (ES/EN) marketing site with a RAG chatbot.

Tech stack
- Next.js 14/15 (App Router, `/app`) + TypeScript + React 18/19
- Tailwind CSS (v4) + small UI primitives (shadcn style)
- next-intl for i18n (`/es/*` and `/en/*`)
- Framer Motion for subtle animations
- RAG: Markdown in `/content/knowledge` → index built at dev/build time
- Optional: OpenAI (embeddings + chat streaming), Resend (lead emails)

Getting started
- Install: `npm i`
- Dev: `npm run dev` (prebuilds the KB index)
- Build: `npm run build`
- Typecheck: `npm run typecheck`

Environment
- Copy `.env.example` to `.env.local` and fill as needed:
  - `OPENAI_API_KEY` (optional) enables embeddings + streaming chat
  - `RESEND_API_KEY` and `RESEND_TO` (optional) to email leads
  - `SITE_URL` for sitemap/robots

RAG
- Seed markdown lives in `content/knowledge` (EN/ES sections per file)
- Build script: `scripts/build-kb.ts` outputs `public/kb-index.json`
- Without `OPENAI_API_KEY`, uses BM25 (MiniSearch). With key, builds embeddings.

API routes
- `POST /api/lead` — validates form; logs in dev; emails via Resend if configured
- `POST /api/chat` — retrieves top-k chunks; streams from OpenAI if key is set; else returns retrieval-only outline

Internationalization
- Locale prefix enforced by `middleware.ts` (`/es` default, also `/en`)
- Dictionaries in `src/i18n/*.json`

Deploy
- Deploy on Vercel without code changes. Ensure env vars are set in the dashboard.

Notes
- Image placeholders are lightweight SVGs in `public/images/placeholders/`
- Analytics (Umami/Plausible) can be added behind a consent toggle later
