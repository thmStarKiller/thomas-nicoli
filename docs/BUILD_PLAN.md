# Build Plan — Thomas Nicoli Consulting

Premium personal website for an independent digital studio (e-commerce, web & AI automation consulting), Madrid-based, side business fully independent from any employer.

## Decisions & assumptions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js **16.2.11** (App Router, Turbopack) | Already scaffolded. v16 breaking changes applied: async `params` everywhere, no `next lint`, no runtime config. |
| Language | TypeScript strict | Per brief. |
| Styling | Tailwind CSS **v4** (`@theme` tokens in `globals.css`) | Already configured via `@tailwindcss/postcss`. |
| Package manager | **npm** (lockfile already present) | Brief suggested pnpm; workspace was initialized with npm (`package-lock.json`). Keeping npm avoids a mixed-state repo. Documented assumption. |
| Animation | `motion` (Motion for React) | Installed. Used sparingly: hero entrance, section reveals, hover states. |
| 3D | `three` + `@react-three/fiber` v9 + `@react-three/drei` v10 | One hero sculpture only. Procedural geometry + procedural `Environment` (Lightformers, no remote HDRI/GLB). DPR ≤ 1.5, `PerformanceMonitor`, `AdaptiveDpr`, dynamic import with `ssr: false`, CSS/SVG fallback, reduced-motion aware, paused offscreen/hidden. |
| Forms | Server Action + `zod`, optional `resend` | No API route needed. Honeypot + time-trap. Works unconfigured in dev. |
| Content | `src/content/site-config.ts` + `src/content/site-content.ts` | Single source of truth; no CMS in v1. |
| Fonts | `next/font/google`: **Fraunces** (display) + **Inter** (sans) | Quiet-luxury editorial pairing, self-hosted by Next. |
| Portrait | Real photo wired in | Owner supplied `my photo/20250119_031810 (1).jpg` → converted to `public/images/profile.webp` (1400px). Swap via one config value (`site-config.ts → media.profileImage`). Placeholder SVG kept for rollback. |
| Employer | `showEmployerReference: false` | No employer name, assets, or implied endorsement anywhere. |
| Case studies | 3 × `isConcept: true` + separate **Selected builds** (real, self-initiated) | No fake clients/metrics/quotes. |
| Prices | `showPrices: false` → "Custom quote" | Per brief. |
| WebGPU | Flag exists in config/env, **not implemented** (WebGL2 only) | Not a launch blocker per brief §10. Flag documented for future experimentation. |

## Architecture

```
src/
  app/            routes: /, /services, /work, /work/[slug], /about, /contact, /privacy, /legal
                  + sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx
  components/
    layout/       header, footer, mobile menu
    sections/     home-page sections (hero, services, work, process, packages, faq, cta…)
    ui/           container, button, badge, reveal, card
    three/        hero canvas + scene + fallback
    forms/        contact form (client)
  content/        site-config.ts (identity, flags, contact, theme), site-content.ts (copy, services, work, packages, faqs…)
  lib/            cn, seo, structured-data
functions/      Cloudflare Pages contact Function (Resend)
  types/          shared domain types
public/images/    profile.webp, profile-placeholder.svg
public/visuals/   abstract SVG concept covers
docs/             BUILD_PLAN, IMAGE_GUIDE, CONTENT_CHECKLIST
```

## Risk watchlist

1. **Next 16 async request APIs** — all `[slug]` pages/`generateMetadata` await `params`. ✅ handled.
2. **drei v10 `Environment`** — must use children `Lightformer`s (procedural) not `preset` (remote fetch). ✅ handled.
3. **MeshTransmissionMaterial cost** — replaced with `meshPhysicalMaterial` transmission + quality tiers via `PerformanceMonitor`.
4. **Turbopack + three** — verified via production build.
5. **`scroll-behavior: smooth`** — not set globally (Next 16 no longer overrides it); anchor jumps are instant.
