# Project Clarity executable QA matrix

Evidence captured 2026-07-24 UTC. Secret values are omitted.

| Gate | Exact execution / tool | Timestamp UTC | Expected | Actual | Evidence |
| --- | --- | --- | --- | --- | --- |
| Clean baseline | `git status --short --branch`; `git remote -v`; `git log -1 --oneline` | 00:20 | `main`, expected origin, no changes | Pass: `main`, expected GitHub origin, `24e5b68`, clean | `2026-07-24-implementation-log.md` |
| Dependencies | SHA-256 lockfile before/after `npm ci` | 02:33 | Exit 0, lock unchanged | Pass; hashes equal | `final-local-release-matrix.txt` |
| Static checks | `npm run lint`; `npm run typecheck` | 03:18 | Exit 0 | Pass | `final-exact-source-gates.txt`; terminal verification |
| Production build | `npm run pages:build` | 03:16 | Exit 0; static output + Functions source | Pass; 52 static pages, 100 RSC aliases | `final-exact-source-gates.txt` |
| Unit/integration | `npm test` | 03:18 | All pass | 15/15 pass | Vitest output; `tests/functions/security.test.ts`; `tests/worker/security.test.ts` |
| Wrong origin | Handler test + Wrangler POST with `Origin: https://example.com` | local QA | 403 before other work | 403 `origin_rejected`; network spy 0 calls | Vitest test; implementation log |
| Missing/invalid control token | Contact handler with missing token and Siteverify failure stub | local QA | Rejected, no queue/email | 400; no Resend/queue work | `tests/functions/security.test.ts` |
| Body/value bounds | Malformed JSON, `Content-Length: 20000`, unknown locale/service/package | local QA | 400/413, no email/queue | Pass | `tests/functions/security.test.ts` |
| Injection/escaping | `<script>` + `ignore previous instructions` in contact and diagnostic | local QA + actual Gemma run | Escaped/neutralised; prompt unchanged | Pass; `[script removed]` in note, no script in report | tests; lead note SHA-256 `70359e…`; `final-exact-source-gates.txt` |
| Duplicate | Same idempotency key twice against in-memory D1 | local QA | One lead, one notification | Pass; one D1 row, one Resend call | `tests/functions/security.test.ts` |
| Cross-lead isolation | Two unique lead canaries, two analyses | local QA | No cross-canary | Pass | `tests/worker/security.test.ts` |
| Persona isolation | Adult/persona canary in synthetic personal-vault fixture | local QA | Canary absent; equal path refused | Pass | `tests/worker/security.test.ts` |
| Invalid model output | Ollama stub: malformed then schema-invalid JSON | local QA | One retry max, no partial draft | Pass; 2 calls then `InvalidModelOutputError` | `tests/worker/security.test.ts` |
| Worker offline | Queue handler with no local worker process | local QA | 202 + stable reference | Pass; `PC-20260724-AABBCCDD` | `tests/functions/security.test.ts` |
| Email safety | Actual `gemma4-local` fixture through worker | 02:21 | Draft reopened/verified; nothing sent | Six checks true; `X-Unsent: 1`; `.invalid` recipient | EML SHA-256 `f86496…`; lead vault paths in implementation log |
| Retention | `npm run clarity:retention` | local QA | Candidate list only, no mutation | `destructive:false`, `candidates:[]`; unit fixture also proves existing file remains | terminal output; `tests/worker/security.test.ts` |
| Browser matrix | `node scripts/project-clarity-browser-qa.mjs` | local QA | ES/EN/FR × 375/768/1280; no overflow/errors | Pass; 9 responsive + 3 no-JS captures | `screenshots/local/browser-results.json` SHA-256 `f02976…` |
| Keyboard/reduced motion | Playwright: focus + keyboard typing/Enter, `reducedMotion:'reduce'` | local QA | Complete six questions without mouse | Pass | browser harness + result JSON |
| No-JS/slow JS | Playwright `javaScriptEnabled:false`; delayed hydration detection | local QA | Services visible; email fallback visible | Pass; server Suspense fallback fixed and visually reviewed | `screenshots/local/*-375-no-js.png` |
| Headers | Wrangler local response headers | local QA | CSP, HSTS, Permissions Policy, frame/referrer protection | Pass | implementation log |
| Public boundary | `netstat -ano` + exact public-output string scan | local QA | 11434/11435 loopback only; no private paths/ports in assets | Pass locally; repeat against preview source after deploy | implementation log; final scan output |
| Preview routes | ES/EN/FR homepage, services, work, contact, privacy, legal, Project Clarity | pending deployment | 200; correct locale; zero new console errors | Pending commit/deployment | To be appended after preview |
| Preview headers | `curl -I https://<preview>/es` + Playwright console | pending deployment | All required headers, no CSP violations | Pending commit/deployment | To be appended after preview |
| Production promotion | Custom domain smoke check after legal approval only | checkpoint | Exact preview commit promoted | **Blocked intentionally**; production remains `24e5b68` | `docs/project-clarity/LEGAL_CHECKPOINT.md` |

## Screenshot index

- `screenshots/local/es-375.png`, `es-768.png`, `es-1280.png`
- `screenshots/local/en-375.png`, `en-768.png`, `en-1280.png`
- `screenshots/local/fr-375.png`, `fr-768.png`, `fr-1280.png`
- `screenshots/local/es-375-no-js.png`, `en-375-no-js.png`, `fr-375-no-js.png`
