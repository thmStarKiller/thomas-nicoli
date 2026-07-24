# Project Clarity — implementation and evidence log

All timestamps are UTC. Secret values are intentionally omitted.

## 2026-07-24T00:20:29Z — pre-flight gate

### Repository identity

Commands:

```bash
pwd
git status --short --branch
git branch --show-current
git remote -v
git log -1 --oneline
gh auth status
```

Actual result:

- checkout: `[AUTHORITATIVE_CHECKOUT]`
- branch: `main`
- worktree: clean, tracking `origin/main`
- origin fetch/push: `https://github.com/thmStarKiller/thomas-nicoli.git`
- HEAD: `24e5b68 fix: enable node compatibility for Pages function`
- GitHub CLI account: `thmStarKiller`, authenticated
- stale checkout under `03_Code_Projects/Freelance_Web` was not opened or edited

Gate: **PASS**.

### Cloudflare Pages identity and environment

The local Wrangler OAuth token was expired, so `npx wrangler whoami` failed without changing configuration. The authenticated local Cloudflare dashboard was used as the live source of truth.

Verified in the project target only:

- Pages project: `thomas-nicoli`
- Git repository: `thmStarKiller/thomas-nicoli`
- production branch: `main`
- build command: `npm run pages:build`
- build output: `.vercel/output/static`
- production domains: `thomas-nicoli.com`, `thomas-nicoli.pages.dev`
- current deployment: `24e5b68`, preview host `11d15775.thomas-nicoli.pages.dev`
- encrypted variable names present: `RESEND_API_KEY`, `RESEND_TO`
- compatibility date: `2026-07-22`
- compatibility flag: `nodejs_compat`

No secret value was read or logged.

Gate: **PASS**.

### Live route baseline

Execution: Python `urllib` GET requests against the custom domain.

All 18 routes returned HTTP 200:

- `/es`, `/es/services`, `/es/work`, `/es/contact`, `/es/privacy`, `/es/legal`
- `/en`, `/en/services`, `/en/work`, `/en/contact`, `/en/privacy`, `/en/legal`
- `/fr`, `/fr/services`, `/fr/work`, `/fr/contact`, `/fr/privacy`, `/fr/legal`

Header baseline on every route:

- `Referrer-Policy: strict-origin-when-cross-origin`
- no CSP
- no HSTS
- no Permissions Policy
- no X-Frame-Options

### Contact Function baseline

File inspected: `functions/api/contact.ts`.

Existing protections:

- JSON parsing with invalid JSON rejection
- field length checks
- email format check
- HTML escaping in the Resend HTML body
- honeypot and minimum-fill timing trap
- no-store JSON responses
- fail-closed 503 when `RESEND_API_KEY` or `RESEND_TO` is absent
- fail-closed 502 when Resend rejects or cannot be reached

Missing controls at baseline:

- same-origin enforcement
- bounded request-body reader / 413 response
- strict service and budget allowlists
- Turnstile server validation
- durable rate limiting
- explicit anti-CORS policy tests
- client/server matching `maxLength`
- `aria-invalid`
- localized privacy link
- current URL, desired timing and city/country fields
- non-JavaScript contact alternative

## 2026-07-24T00:26:14Z — baseline release matrix

Evidence source: `[LOCAL_TEMP]/project-clarity-baseline-2026-07-24.log`.

| Command | Expected | Actual |
| --- | --- | --- |
| `npm ci` | exit 0, lockfile unchanged | exit 0; 449 packages; 0 vulnerabilities |
| `npm run lint` | exit 0 | exit 0 |
| `npm run typecheck` | exit 0 | exit 0 |
| `npm test --if-present` | document current test state | exit 0; no test script existed |
| `npm run build` | exit 0 | exit 0; 40 static pages generated |
| `npm run pages:build` | exit 0; Pages output created | exit 0; `.vercel/output/static` prepared |
| `npm audit --audit-level=moderate` | no vulnerabilities | `found 0 vulnerabilities` |
| `git status --short --branch` | clean | `## main...origin/main` |

Gate: **PASS**.

## 2026-07-24 — local AI boundary baseline

Commands/probes:

- `GET http://127.0.0.1:11434/api/version`
- `GET http://127.0.0.1:11434/api/tags`
- `GET http://127.0.0.1:11435/api/health`
- `netstat -ano` filtered to ports 11434/11435

Actual:

- Ollama `0.32.3`
- installed models: `gemma4-local:latest`, `gemma4:e2b-it-qat`, `gemma3:4b`
- Gemma Local Studio health: `200 {"status":"ok","service":"gemma-local-studio"}`
- Ollama and Studio listeners are bound to `127.0.0.1` only
- Studio source confirms its default memory store is a private personal vault

Decision:

- Project Clarity must not call the Studio API.
- The worker will call Ollama directly at `127.0.0.1:11434` with a professional prompt.
- The worker will require an explicit separate lead-vault path and refuse to start if it resolves to the personal-vault path.
- No public source or Cloudflare binding will reference ports 11434 or 11435.

### Mailbox decision

The installed Hermes Gmail OAuth token belongs to another mailbox, not `bonjour@thomas-nicoli.com`. To avoid cross-account access and avoid adding a high-privilege Resend key, the MVP uses a bounded Cloudflare D1 submission queue plus an authenticated claim/update endpoint. Resend remains an owner notification transport. The public workflow receives no Gmail, Hermes, shell, browser, filesystem or local-model access.

## Release checkpoint

Production promotion and public Project Clarity submission remain blocked until Thomas supplies and approves the missing legal/controller/retention data listed at the end of this log. Engineering, tests and an isolated Cloudflare preview continue independently.

## 2026-07-24T03:19:29Z — implementation and local verification

Implemented:

- ES/EN/FR Project Clarity routes with six progressive conceptual questions, separate contact details and a legal-gated consent/submission state;
- real buyer-path links to statically generated preselected routes;
- hardened contact and Project Clarity Functions: same-origin, bounded body, allowlists, Turnstile, D1 rate limits, HTML/plain-text neutralisation and no wildcard CORS;
- D1 queue with unique idempotency, leases and five states;
- professional loopback-only worker, strict schema, one retry, separate lead vault, flat Obsidian YAML, encoded URI, recoverable retention flow and unsent `.eml` drafts;
- CSP/HSTS/Permissions Policy/frame/referrer headers;
- resilient initial rendering and removal of `state.clock` usage;
- proof hierarchy and optional Studio Lab positioning;
- 100 flattened Next 16 RSC aliases to eliminate Cloudflare static-host prefetch 404s.

Verification:

- `npm ci`: exit 0; lock SHA-256 unchanged during install;
- `npm run lint`: exit 0;
- `npm run typecheck`: exit 0;
- `npm test`: 15/15 pass;
- `npm run build`: exit 0;
- `npm run pages:build`: exit 0, 52 pages, 100 RSC aliases;
- `npm audit --audit-level=moderate`: 0 vulnerabilities;
- Playwright: ES/EN/FR at 375/768/1280, keyboard-only six-step flow, reduced motion, aria errors, no overflow, zero console errors and zero missing resources;
- no-JS: services visible and a server-rendered email fallback visibly available;
- actual `gemma4-local` synthetic run: validated schema `1.0`, note and `.eml` draft created, reopened, six draft checks true, `X-Unsent: 1`, no message sent;
- retention preview: non-destructive with exact empty candidate list.

Evidence:

- `docs/evidence/project-clarity/final-local-release-matrix.txt`
- `docs/evidence/project-clarity/final-exact-source-gates.txt`
- `docs/evidence/project-clarity/QA_MATRIX.md`
- `docs/evidence/project-clarity/screenshots/local/`
- `[PRIVATE_LEAD_VAULT]/Leads/PC-20260724-0A11CE01.md`
- `[PRIVATE_LEAD_VAULT]/Drafts/PC-20260724-0A11CE01.eml`

## Cloudflare preview resources prepared

- D1 `project-clarity-preview`, region WEUR, ID `12884390-e178-4cff-a336-88b63007a81f`; three migration queries applied successfully.
- Turnstile widget `Project Clarity thomas-nicoli`, managed mode, two Pages hostnames (project root and stable Preview alias), no pre-clearance.
- Preview variables contain only the public site key, three false release flags and encrypted `TURNSTILE_SECRET_KEY`.
- Preview binding `PROJECT_CLARITY_DB` points to `project-clarity-preview`.
- Legacy Preview variables `DEFAULT_LOCALE`, `GEMINI_MODEL`, plain-text `GOOGLE_API_KEY` and `SITE_URL` were removed without reading their hidden values.
- Production received only the encrypted Turnstile secret; no production deployment occurred and the live custom domain remains on `24e5b68`.

## 2026-07-24T04:02Z — Cloudflare Preview verification

Deployment:

- branch alias: `https://feature-project-clarity.thomas-nicoli.pages.dev`;
- verified source commit: `1216ec0`;
- deployment ID: `410fd2b6-c892-49ab-a2c3-8f6b83b92da3`;
- immutable deployment URL: `https://410fd2b6.thomas-nicoli.pages.dev`;
- Pages Functions compiled and uploaded successfully with `nodejs_compat` from `wrangler.toml`.

Results:

- 24/24 ES/EN/FR routes returned HTTP 200;
- wrong-origin Project Clarity write returned 403 `origin_rejected`;
- same-origin Project Clarity write returned 503 `legal_checkpoint`;
- contact without Turnstile returned 400 `turnstile_required`;
- deliberately invalid Turnstile returned 400 `turnstile_invalid`;
- private write responses contained no CORS allow-origin header;
- browser matrix passed 12/12 Preview pages with no overflow, app error or missing RSC resource;
- managed Turnstile mounted on all three contact routes; no submission was attempted;
- Preview headers include tested CSP, HSTS, Permissions Policy, frame protection, strict referrer policy, nosniff, COOP and CORP.

The first Preview browser run found Cloudflare Web Analytics blocked by CSP. Commit `8eefd9b` added only the exercised Cloudflare Analytics script/connect origins. The next run had no application or CSP errors. Commit `1216ec0` added the `next/script` `onReady` lifecycle needed when Turnstile loads before React hydration.

Production checkpoint evidence:

- `origin/main` remains `24e5b68f23512526e0f2f8ccdb1d3ee9c7707796`;
- `https://thomas-nicoli.com/es/project-clarity` returns 404;
- the custom domain still lacks the new security-header set, as documented in `PRODUCTION_HEADER_REPORT.md`;
- no custom-domain promotion occurred.
