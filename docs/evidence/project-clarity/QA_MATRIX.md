# Project Clarity executable QA matrix

Evidence captured 2026-07-24 UTC. Secret values are omitted.

| Gate | Exact execution / tool | Timestamp UTC | Expected | Actual | Evidence |
| --- | --- | --- | --- | --- | --- |
| Clean baseline | `git status --short --branch`; `git remote -v`; `git log -1 --oneline` | 00:20 | `main`, expected origin, no changes | Pass: `main`, expected GitHub origin, `24e5b68`, clean | `2026-07-24-implementation-log.md` |
| Dependencies | SHA-256 lockfile before/after `npm ci` | 02:33 | Exit 0, lock unchanged | Pass; hashes equal | `final-local-release-matrix.txt` |
| Static checks | `npm run lint`; `npm run typecheck` | 03:18 | Exit 0 | Pass | `final-exact-source-gates.txt`; terminal verification |
| Production build | `npm run pages:build` | 03:16 | Exit 0; static output + Functions source | Pass; 52 static pages, 100 RSC aliases | `final-exact-source-gates.txt` |
| Unit/integration | `npm test` | activation release | All pass | 17/17 pass | Vitest output; `tests/functions/security.test.ts`; `tests/worker/security.test.ts` |
| Wrong origin | Handler test + Preview POST with `Origin: https://example.com` | local + 03:43 Preview | 403 before other work | 403 `origin_rejected`; network spy 0 calls; no CORS header | Vitest; `PREVIEW_REPORT.md` |
| Missing/invalid control token | Handler test + Preview contact POST missing token then deliberately invalid token | local + 03:43 Preview | Rejected, no queue/email | 400 `turnstile_required`; 400 `turnstile_invalid`; no Resend/queue work | tests; `PREVIEW_REPORT.md` |
| Body/value bounds | Malformed JSON, `Content-Length: 20000`, unknown locale/service/package | local QA | 400/413, no email/queue | Pass | `tests/functions/security.test.ts` |
| Injection/escaping | `<script>` + `ignore previous instructions` in contact and diagnostic | local QA + actual Gemma run | Escaped/neutralised; prompt unchanged | Pass; `[script removed]` in note, no script in report | tests; lead note SHA-256 `70359e…`; `final-exact-source-gates.txt` |
| Duplicate | Same idempotency key twice against in-memory D1 | local QA | One lead, one notification | Pass; one D1 row, one Resend call | `tests/functions/security.test.ts` |
| Cross-lead isolation | Two unique lead canaries, two analyses | local QA | No cross-canary | Pass | `tests/worker/security.test.ts` |
| Persona isolation | Adult/persona canary in synthetic personal-vault fixture | local QA | Canary absent; equal path refused | Pass | `tests/worker/security.test.ts` |
| Invalid model output | Ollama stub: malformed then schema-invalid JSON | local QA | One retry max, no partial draft | Pass; 2 calls then `InvalidModelOutputError` | `tests/worker/security.test.ts` |
| Worker offline | Queue handler with no local worker process | local QA | Enabled intake returns 202 + stable reference; public submission path never waits for Gemma | Pass locally with `PC-20260724-AABBCCDD`; queue write is independent from the laptop | tests; architecture document |
| Email safety | Actual `gemma4-local` fixture through worker | 02:21 | Draft reopened/verified; nothing sent | Six checks true; `X-Unsent: 1`; `.invalid` recipient | EML SHA-256 `f86496…`; lead vault paths in implementation log |
| Retention | `npm run clarity:retention`; authenticated `/api/project-clarity/purge`; D1 migration `0002` | activation release | Local preview is non-destructive; queue purge requires auth + confirmation and deletes only expired rows | Pass; Preview and Production D1 retention index applied; purge tests pass | terminal output; `tests/functions/security.test.ts`; `tests/worker/security.test.ts` |
| AI motion | `npm run clarity:qa-motion` | activation release | Directional transitions; zero transform/filter in reduced motion; first question visible without JS; no mobile overflow | Pass; measured transition matrix/opacity/blur, reduced values `none`, mobile 375 px overflow false | `screenshots/activation-local/motion-results.json` |
| Browser matrix | `node scripts/project-clarity-browser-qa.mjs` against local and branch alias | local + real Preview | ES/EN/FR × 375/768/1280; no overflow/errors | Pass twice; real Preview 9 responsive + 3 no-JS captures | `screenshots/preview/browser-results.json`; `PREVIEW_REPORT.md` |
| Keyboard/reduced motion | Playwright: focus + keyboard typing/Enter, `reducedMotion:'reduce'` | local QA | Complete six questions without mouse | Pass | browser harness + result JSON |
| No-JS/slow JS | Playwright `javaScriptEnabled:false`; delayed hydration detection | local QA | Services visible; email fallback visible | Pass; server Suspense fallback fixed and visually reviewed | `screenshots/local/*-375-no-js.png` |
| Headers | `curl.exe --ssl-no-revoke -I https://feature-project-clarity.thomas-nicoli.pages.dev/es` + Playwright | 04:01 Preview | CSP, HSTS, Permissions Policy, frame/referrer protection | Pass; no application/CSP console errors | `PREVIEW_REPORT.md` |
| Turnstile path | `node scripts/project-clarity-turnstile-qa.mjs` on ES/EN/FR contact | real Preview | Managed widget mounted; no overflow/app error; no submit | Pass 3/3; headless-only Cloudflare diagnostic counted separately | `screenshots/preview/turnstile-results.json` |
| Public boundary | `netstat -ano` + exact built-output string scan | local + exact Preview artifact | 11434/11435 loopback only; no private paths/ports/secrets in public assets | Pass; all exact-string hit arrays empty; no tunnel introduced | implementation log; `PREVIEW_REPORT.md` |
| Preview routes | 24 ES/EN/FR homepage, services, work, contact, privacy, legal, Project Clarity and preselection URLs | 03:42 Preview | 200; correct locale; zero new app/CSP console errors | Pass 24/24; branch alias and immutable URL recorded | `PREVIEW_REPORT.md` |
| Preview headers | `curl -I` branch alias + Playwright console | 04:01 Preview | All required headers, no CSP violations | Pass after commit `8eefd9b`; first run caught and fixed Web Analytics CSP | `PREVIEW_REPORT.md` |
| Activation configuration | `wrangler.toml` Preview + Production vars | activation release | Public gate, both server gates, consent version and retention are explicit | Active release candidate: `true` / `true` / `true`, `2026-07-24-v1`, 30 days | `wrangler.toml`; `docs/project-clarity/LEGAL_CHECKPOINT.md` |
| Production promotion | Custom-domain smoke after exact Preview commit passes | pending runtime gate | Promote the exact tested commit only | Pending Preview deployment and runtime intake test | this release procedure |

## Screenshot index

- `screenshots/local/es-375.png`, `es-768.png`, `es-1280.png`
- `screenshots/local/en-375.png`, `en-768.png`, `en-1280.png`
- `screenshots/local/fr-375.png`, `fr-768.png`, `fr-1280.png`
- `screenshots/local/es-375-no-js.png`, `en-375-no-js.png`, `fr-375-no-js.png`
- `screenshots/preview/es-{375,768,1280}.png` and EN/FR equivalents
- `screenshots/preview/{es,en,fr}-375-no-js.png`
- `screenshots/preview/{es,en,fr}-contact-turnstile-1280.png`
- `screenshots/activation-local/home-black-to-cobalt-to-paths.png`
- `screenshots/activation-local/clarity-hero-signal-band.png`, `clarity-question-{1,2}.png`, `clarity-mobile.png`
- `screenshots/activation-local-matrix/{es,en,fr}-{375,768,1280}.png` and no-JS equivalents
