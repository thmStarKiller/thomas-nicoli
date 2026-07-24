# Project Clarity Cloudflare Preview report

Verified 2026-07-24T04:02Z.

## Deployment

- Project: `thomas-nicoli`
- Environment: **Preview**
- Branch: `feature/project-clarity`
- Verified source commit: `1216ec0`
- Deployment ID: `410fd2b6-c892-49ab-a2c3-8f6b83b92da3`
- Immutable URL: <https://410fd2b6.thomas-nicoli.pages.dev>
- Stable branch URL: <https://feature-project-clarity.thomas-nicoli.pages.dev>
- Production branch and custom domain were not changed.

## Runtime configuration

Preview contains only these Project Clarity variables/bindings:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — public build value
- `NEXT_PUBLIC_PROJECT_CLARITY_LEGAL_READY=false`
- `PROJECT_CLARITY_SUBMISSIONS_ENABLED=false`
- `PROJECT_CLARITY_LEGAL_APPROVED=false`
- `TURNSTILE_SECRET_KEY` — encrypted
- `PROJECT_CLARITY_DB` — D1 binding to the preview-only database

Legacy Preview variables for Gemini/Google were removed. No secret value is recorded here.

## Routes and boundary tests

- 24 ES/EN/FR homepage, services, work, contact, privacy, legal, Project Clarity, and preselected route requests: **24/24 HTTP 200**.
- `POST /api/project-clarity` with `Origin: https://example.com`: **403 `origin_rejected`**.
- Same-origin Project Clarity write: **503 `legal_checkpoint`**. No queue item or email can be created.
- Contact POST without Turnstile: **400 `turnstile_required`**.
- Contact POST with deliberately invalid token: **400 `turnstile_invalid`**.
- Private write responses had no `Access-Control-Allow-Origin` header.
- Production `https://thomas-nicoli.com/es/project-clarity`: **404**, proving no accidental promotion.

## Browser and visual QA

- `scripts/project-clarity-browser-qa.mjs`: **12/12 pages passed** on the real Preview.
- ES/EN/FR at 375, 768, and 1280 px; keyboard-only six-step completion; preselection; `aria-invalid`; reduced motion; no overflow; no application/CSP console errors; 3 no-JS fallbacks visible.
- `scripts/project-clarity-turnstile-qa.mjs`: ES/EN/FR contact routes **HTTP 200**, managed Turnstile response control mounted, no overflow, no application/CSP error. Cloudflare's exact invisible headless diagnostic probe is counted separately and never treated as an application error.
- Independent visual review found no clipping, overflow, hierarchy defect, or design-system mismatch.

Evidence:

- `docs/evidence/project-clarity/screenshots/preview/browser-results.json`
- `docs/evidence/project-clarity/screenshots/preview/turnstile-results.json`
- `docs/evidence/project-clarity/screenshots/preview/*.png`

## Header result

The Preview returned:

- restrictive CSP with only self, Turnstile, and Cloudflare Web Analytics exceptions actually exercised;
- HSTS `max-age=63072000; includeSubDomains; preload`;
- restrictive Permissions Policy;
- `frame-ancestors 'none'` and `X-Frame-Options: DENY`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `X-Content-Type-Options: nosniff`;
- COOP and CORP;
- Cloudflare's automatic `x-robots-tag: noindex` on the Preview.

The first Preview browser run correctly caught a blocked Cloudflare Web Analytics beacon. Commit `8eefd9b` added only `static.cloudflareinsights.com` and `cloudflareinsights.com`; the rerun passed with no CSP violation.
