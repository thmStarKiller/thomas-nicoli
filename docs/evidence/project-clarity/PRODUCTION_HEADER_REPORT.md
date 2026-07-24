# Production custom-domain header report

Captured 2026-07-24T04:00:35Z from <https://thomas-nicoli.com/es>.

## Release state

- HTTP status: **200**
- `origin/main`: `24e5b68f23512526e0f2f8ccdb1d3ee9c7707796`
- Project Clarity Preview commit: `1216ec004bed2c4b73d04543ed1a9bbfc66aac43`
- `https://thomas-nicoli.com/es/project-clarity`: **404**

The custom domain intentionally remains on the pre-Project-Clarity commit because the legal-data checkpoint is incomplete.

## Current production headers

Present:

- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Content-Type-Options: nosniff`
- Cloudflare static response `Access-Control-Allow-Origin: *` (not a private write endpoint)

Not yet present on the custom domain:

- Content Security Policy
- Strict-Transport-Security
- Permissions Policy
- `frame-ancestors` / `X-Frame-Options`
- COOP / CORP

All of those headers are verified on the Cloudflare Preview. They must not be described as production headers until Thomas supplies/approves the missing legal data, the exact Preview commit is promoted, and the custom-domain smoke matrix is repeated.
