# Project Clarity Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Add a secure trilingual Project Clarity diagnostic, a private asynchronous local Gemma worker and targeted website hardening, verify them on a Cloudflare preview, and stop production promotion at the legal-data gate.

**Architecture:** Next.js remains a static ES/EN/FR site on Cloudflare Pages. Public forms post to same-origin Pages Functions protected by bounded parsing, strict validation, Turnstile and D1-backed rate limits/idempotency; Project Clarity submissions are queued in D1 and optionally notify the owner through Resend. A separate local Node worker claims one labelled submission at a time through a bearer-protected endpoint, sanitizes it, calls only loopback Ollama with a professional prompt and strict JSON schema, writes an Obsidian-compatible note in a dedicated lead vault, generates an RFC 822 `.eml` draft, reopens and verifies it, and never sends it.

**Tech Stack:** Next.js 16.2.11 App Router/static export, React 19, TypeScript, Cloudflare Pages Functions, D1, Resend HTTP API, Cloudflare Turnstile, Zod, Vitest, Testing Library, Playwright Core/system Chrome, Ollama `gemma4-local`.

---

### Task 1: Preserve the baseline and create the feature branch

**Objective:** Make the verified pre-flight reproducible and isolate preview work from `main`.

**Files:**
- Create: `docs/evidence/project-clarity/2026-07-24-implementation-log.md`
- Create: `docs/plans/2026-07-24-project-clarity.md`

**Steps:**
1. Record repository, Cloudflare, route, header, contact and local-AI findings without secrets.
2. Create branch `feature/project-clarity` from clean `24e5b68`.
3. Run `git status --short --branch` and verify no unrelated changes.

### Task 2: Add focused test infrastructure and shared contracts

**Objective:** Establish RED-GREEN coverage for form bounds, security, schema, worker and browser behavior.

**Files:**
- Modify: `package.json`, `package-lock.json`
- Create: `vitest.config.mts`, `tests/setup.ts`
- Create: `src/lib/project-clarity/contracts.ts`
- Create: `functions/_lib/http.ts`, `functions/_lib/turnstile.ts`, `functions/_lib/rate-limit.ts`
- Test: `tests/functions/http.test.ts`, `tests/functions/turnstile.test.ts`

**Steps:**
1. Add Vitest, jsdom, Testing Library, user-event, tsx, Zod, Playwright Core and test scripts.
2. Write failing tests for bounded JSON/form parsing, origin rejection, escaping and Turnstile failure.
3. Implement minimal shared helpers.
4. Run `npm test` and verify green.

### Task 3: Harden the standard contact path

**Objective:** Keep a simple non-AI path while adding all requested validation and resilience controls.

**Files:**
- Modify: `functions/api/contact.ts`
- Modify: `src/components/forms/contact-form.tsx`
- Modify: `src/app/[lang]/contact/page.tsx`
- Modify: `src/content/site-config.ts`
- Modify: `src/i18n/dictionaries/es.ts`, `en.ts`, `fr.ts`
- Test: `tests/functions/contact.test.ts`, `tests/components/contact-form.test.tsx`

**Steps:**
1. Write failing tests for wrong origin, missing/invalid Turnstile, malformed/oversized body, unknown allowlist values, escaping, missing environment and email failure.
2. Add URL, timing and city/country fields with matching client/server limits.
3. Add `aria-invalid`, error associations, localized privacy link and a no-JS email fallback.
4. Enforce same-origin, no wildcard CORS, strict allowlists, Turnstile and D1 rate limit before Resend.
5. Verify no test sends a real email.

### Task 4: Add buyer paths and refine copy/proof/motion

**Objective:** Improve prioritization without redesigning the established graphite/cobalt/porcelain system.

**Files:**
- Create: `src/components/sections/buyer-paths.tsx`
- Modify: `src/app/[lang]/page.tsx`
- Modify: `src/app/[lang]/services/page.tsx`
- Modify: `src/app/[lang]/work/page.tsx`
- Modify: `src/components/three/hero-scene.tsx`
- Modify: `src/components/ui/reveal.tsx`, `src/components/motion/text-reveal.tsx`, `image-reveal.tsx`, `split-words.tsx`
- Modify: all three dictionaries
- Test: `tests/content/i18n.test.ts`, `tests/components/motion-resilience.test.tsx`

**Steps:**
1. Add two real route links directly below the hero.
2. Review and replace only contextual Spanish anglicisms requested by Thomas.
3. Order Work as verified build, sanitized tools, concepts, optional lab/archive, using only existing evidence.
4. Move 3D to an optional Studio Lab add-on.
5. Remove animation-gated initial hidden states and replace `state.clock.elapsedTime` with accumulated frame delta.

### Task 5: Build the trilingual Project Clarity experience

**Objective:** Implement six conceptual steps, deterministic confirmation and an accessible legal-gated final state.

**Files:**
- Create: `src/app/[lang]/project-clarity/page.tsx`
- Create: `src/app/[lang]/project-clarity/[route]/page.tsx`
- Create: `src/components/forms/project-clarity-form.tsx`
- Modify: `src/app/sitemap.ts`, `src/components/layout/header.tsx`, dictionaries
- Test: `tests/components/project-clarity-form.test.tsx`, `tests/content/routes.test.ts`

**Steps:**
1. Write failing tests for exactly six conceptual questions, progressive disclosure, keyboard operation, progress announcements, preselection, consent separation, errors and duplicate click suppression.
2. Implement independent, digital-team and unsure static routes.
3. Add bounded fields and administrative contact details after the six questions.
4. Render a deterministic structured summary/reference response and accurate asynchronous/local-worker explanation.
5. Keep a standard contact/no-JS alternative and block public submit when the legal flag is false.

### Task 6: Implement the protected D1 queue

**Objective:** Queue validated submissions while the laptop is offline and expose only a minimal authenticated worker surface.

**Files:**
- Create: `migrations/0001_project_clarity.sql`
- Create: `functions/api/project-clarity/index.ts`
- Create: `functions/api/project-clarity/claim.ts`
- Create: `functions/api/project-clarity/state.ts`
- Create: `functions/_lib/project-clarity.ts`
- Modify: `wrangler.toml`, `.env.example`
- Test: `tests/functions/project-clarity.test.ts`, `tests/functions/queue.test.ts`

**Steps:**
1. Write failing tests for legal flag, same origin, Turnstile, body/value bounds, durable rate limit, idempotency and worker authentication.
2. Add D1 tables with unique idempotency key and bounded statuses.
3. Queue before optional Resend notification; never claim instant AI analysis.
4. Claim one item with lease semantics and update only allowed states.
5. Ensure no local ports, vault paths or worker credentials appear in public responses/source.

### Task 7: Implement the private local worker and vault

**Objective:** Produce validated professional reports and unsent drafts without touching personal memory.

**Files:**
- Create: `tools/project-clarity-worker/*.ts`
- Create: `tools/project-clarity-worker/analysis-schema.json`
- Create: `tools/project-clarity-worker/professional-system-prompt.txt`
- Create: `tools/project-clarity-worker/README.md`
- Create: `tools/project-clarity-worker/fixtures/synthetic-lead.json`
- Test: `tests/worker/*.test.ts`

**Steps:**
1. Write failing tests for path equality refusal, sanitization, total bounds, prompt injection as data, invalid JSON fail-closed, one retry maximum, idempotency, cross-lead isolation and persona-fixture isolation.
2. Implement direct `127.0.0.1` Ollama calls with model allowlist, one generation, temperature 0, short context and strict root-required schema.
3. Validate JSON again in application code before any draft.
4. Write flat Obsidian YAML + Markdown body, redact obvious auth/payment data, and return a correctly encoded Obsidian URI.
5. Generate `.eml`, reopen it, verify recipient/subject/language/submission ID/body and leave it unsent.
6. Implement retention preview and recoverable `.trash`; require explicit confirmation for permanent deletion.

### Task 8: Add platform headers and deployment controls

**Objective:** Ship a tested security policy compatible with Next static assets, Three.js and Turnstile.

**Files:**
- Create: `public/_headers`
- Modify: `.env.example`, `README.md`, `docs/BUILD_PLAN.md`
- Create: `docs/PROJECT_CLARITY_OPERATIONS.md`
- Test: `tests/config/headers.test.ts`, `tests/config/public-boundary.test.ts`

**Steps:**
1. Add CSP, HSTS, Permissions Policy, frame protection, nosniff and strict referrer policy.
2. Test headers statically and in Wrangler/Cloudflare preview.
3. Document secretless environment template, D1 migration, worker start/stop, legal flag, rollback and production gate.

### Task 9: Execute local security and UX matrices

**Objective:** Produce evidence for every required gate without real email sends.

**Files:**
- Create: `scripts/project-clarity-qa.mjs`
- Create: `docs/evidence/project-clarity/*`

**Steps:**
1. Run lint, typecheck, tests, Next build, Pages build and audit.
2. Run Wrangler local tests for origin, Turnstile, body bounds, injection, duplicate, worker offline and email failure.
3. Process one synthetic fixture through live local Ollama into a temporary dedicated lead vault; reopen the `.eml`; verify nothing was sent.
4. Run retention preview and prove it is non-destructive.
5. Run browser matrix at 375/768/1280 for ES/EN/FR, keyboard, reduced motion, no-JS/slow-JS, preselection, errors and overflow.

### Task 10: Deploy and verify an isolated Cloudflare preview

**Objective:** Verify the exact commit without promoting it to the custom domain.

**Steps:**
1. Create preview-only D1/Turnstile bindings and encrypted secrets without logging values.
2. Push `feature/project-clarity`; capture commit SHA and deployment URL.
3. Apply D1 migration to preview only.
4. Verify all ES/EN/FR home/services/work/contact/privacy/legal/Project Clarity routes, headers, console and screenshots.
5. Keep `PROJECT_CLARITY_SUBMISSIONS_ENABLED=false` until legal approval.
6. Test rollback by documenting and dry-running selection of the prior deployment; do not alter production.

### Task 11: Legal-data escalation gate

**Objective:** Ask Thomas for exact missing data and stop before production.

Required from Thomas:

- approved public legal owner/controller identity
- NIF or confirmation of the legally correct identifier to publish
- fiscal/postal address or the legally approved public alternative
- controller/contact details for data-rights requests
- approved Project Clarity retention period and deletion wording
- approved consent wording/version in ES, EN and FR
- confirmation whether Resend notification metadata and D1 queue storage are acceptable

After approval only: insert data, rerun the complete matrix, deploy the already verified commit to `main`, verify the custom domain and repeat contact/header smoke tests.
