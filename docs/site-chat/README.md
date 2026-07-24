# Site AI chat

## Runtime

- UI: `src/components/chat/chat-assistant.tsx`, rendered in every locale layout.
- Session endpoint: `POST /api/chat/session`.
- Message endpoint: `POST /api/chat`.
- Model: Cloudflare Workers AI, `@cf/meta/llama-3.1-8b-instruct`.
- Store/outbox: the environment-specific `PROJECT_CLARITY_DB` D1 binding.
- Owner summary delivery: Resend, synchronously attempted after every accepted turn.

The public browser never calls a model provider directly and receives no credential. Turnstile is required once per anonymous two-hour session. The opaque session token is stored only as a SHA-256 hash, is bound to a hashed source IP, and allows at most 12 sequential turns.

## Conversation loop

1. Visitor completes Turnstile and receives an opaque session token.
2. The browser sends the latest message plus at most 10 bounded recent messages.
3. Workers AI returns validated JSON: visitor reply, owner summary, intent, urgency and up to three suggested follow-ups.
4. The interaction is stored in D1 with a unique `(session_id, turn_index)` pair.
5. Resend sends Thomas one summary email for the interaction.
6. D1 records `delivered` or `failed`; a network retry with the same interaction ID returns the stored response and does not call AI or Resend twice.

Visitor content is untrusted data. It cannot select tools, reveal configuration or override the system prompt. The UI renders plain text only; email HTML is escaped.

## Retention

- Chat sessions expire after 2 hours.
- Interaction rows have a 30-day retention timestamp.
- The authenticated Project Clarity purge endpoint also deletes expired chat interactions and sessions.
- The local `Project Clarity Local Gemma Worker` cron invokes that purge every 10 minutes while Hermes is running.

## Feature flags and bindings

- Public build: `NEXT_PUBLIC_CHATBOT_ENABLED=true`.
- Functions runtime: `CHATBOT_ENABLED=true`.
- Workers AI binding: `AI` in Preview and Production.
- D1 migration: `migrations/0003_site_chat.sql`.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run pages:build
QA_BASE_URL=https://feature-project-clarity.thomas-nicoli.pages.dev npm run chat:qa-browser
```

A release is not promoted until a real Preview Turnstile session produces an AI reply, a D1 interaction row and a delivered owner email. Synthetic QA interactions must be deleted from D1 after verification.

## Rollback

Redeploy the previous known-good Pages deployment or previous `main` SHA. Set `NEXT_PUBLIC_CHATBOT_ENABLED=false` and `CHATBOT_ENABLED=false` for a full fail-closed disable; a public-variable change requires rebuild and redeploy. Existing Project Clarity intake remains independent.
