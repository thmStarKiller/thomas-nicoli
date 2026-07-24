# Site AI chat — local Ollama runtime

## Runtime

- UI: `src/components/chat/chat-assistant.tsx`, rendered in every locale layout.
- Session endpoint: `POST /api/chat/session`.
- Queue endpoint: `POST /api/chat`.
- Browser polling endpoint: `POST /api/chat/status`.
- Private worker endpoints: `POST /api/chat/claim` and `POST /api/chat/complete`.
- Model: open-source `gemma4-local`, only through Ollama at `http://127.0.0.1:11434`.
- Store/outbox: the environment-specific `PROJECT_CLARITY_DB` D1 binding.
- Owner summary delivery: Resend, attempted only after validated local-model completion.
- There is **no Workers AI binding and no paid model API**.

The public browser never calls Ollama or any model provider directly and receives no worker credential. Turnstile is required once per anonymous two-hour session. The opaque session token is stored only as a SHA-256 hash, is bound to a hashed source IP, and allows at most 12 sequential turns.

## Conversation loop

1. The visitor completes Turnstile and receives an opaque session token.
2. The browser sends the latest message plus at most 10 bounded recent messages.
3. Cloudflare stores a bounded job in `site_chat_jobs` and returns HTTP 202.
4. The local daemon claims the job with a two-minute lease and sends the payload to loopback Ollama.
5. Ollama must return JSON matching the strict reply/summary/intent/urgency/suggestions schema.
6. The daemon posts the validated result through the private worker endpoint.
7. D1 publishes the reply and Resend sends Thomas one summary email.
8. The browser polls its authenticated interaction and renders the reply as plain text.
9. While a job is pending, the browser keeps the interaction/session reference in same-origin `sessionStorage`; reopening or reloading resumes polling and removes the record after completion.

If Thomas's computer is offline, the message remains queued in D1. The visitor sees an honest queued state rather than a fabricated answer. Processing resumes when the local daemon is online. The browser can recover the answer while its two-hour anonymous session remains valid; Thomas still receives the owner summary after local completion if the visitor has left.

Visitor content is untrusted data. It cannot select tools, reveal configuration or override the system prompt. Ollama is allowlisted to `gemma4-local` and loopback `127.0.0.1:11434`. The UI renders plain text only; email HTML is escaped.

## Local commands

```bash
node --env-file=.env.project-clarity.local --import tsx tools/site-chat-worker/cli.ts once
node --env-file=.env.project-clarity.local --import tsx tools/site-chat-worker/cli.ts daemon
```

Required local variables already shared with the Project Clarity worker:

- `PROJECT_CLARITY_QUEUE_URL`
- `PROJECT_CLARITY_WORKER_TOKEN`
- `OLLAMA_URL=http://127.0.0.1:11434`
- `OLLAMA_MODEL=gemma4-local`

The daemon polls every two seconds while idle. It logs only interaction IDs and delivery status, never visitor text or credentials.

## Retention

- Chat sessions expire after 2 hours.
- Job rows have a 30-day retention timestamp.
- The authenticated Project Clarity purge endpoint deletes expired legacy interactions, local-chat jobs and sessions.
- The local Project Clarity worker also invokes the purge while Hermes is running.

## Feature flags and bindings

- Public build: `NEXT_PUBLIC_CHATBOT_ENABLED=true`.
- Functions runtime: `CHATBOT_ENABLED=true`.
- D1 migrations: `migrations/0003_site_chat.sql` and `migrations/0004_local_chat_jobs.sql`.
- Private worker auth: encrypted `PROJECT_CLARITY_WORKER_TOKEN`.
- No `AI` binding is configured.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run pages:build
npx wrangler pages functions build
QA_BASE_URL=https://feature-project-clarity.thomas-nicoli.pages.dev npm run chat:qa-browser
```

A release is not promoted until a real Preview Turnstile session is queued, claimed by local Ollama, completed with valid JSON, rendered in the browser, stored in D1 and followed by a delivered owner email. Synthetic QA jobs and sessions are deleted after verification.

## Rollback

Redeploy the previous known-good Pages deployment or previous `main` SHA. Set `NEXT_PUBLIC_CHATBOT_ENABLED=false` and `CHATBOT_ENABLED=false` for a full fail-closed disable; a public-variable change requires rebuild and redeploy. Existing Project Clarity intake remains independent and queued chat jobs remain retained until processing or purge.
