# Thomas Nicoli Consulting — website

Personal website for an independent consultant working across e-commerce, CRM, web and automation, based in Madrid. Built with Next.js 16 (App Router + Turbopack), React 19, TypeScript strict, Tailwind CSS 4, Motion, Lenis and React Three Fiber.

**Trilingual (ES / EN / FR)** — Spanish is the default locale. All routes live under `/[lang]` (`/es`, `/en`, `/fr`); a Next 16 `proxy.ts` redirects unprefixed paths to the best locale from `Accept-Language`. Every page ships canonical + hreflang (`x-default` → ES), localized metadata, localized OG images and a 3-locale sitemap.

Fully independent side business — no employer names, assets, or implied endorsements anywhere. Case studies are honestly labelled **concept studies** until real client work replaces them.

## Local setup

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /es
npm run pages:build && npm run pages:dev  # Cloudflare Pages + contact Function
```

Quality gates:

```bash
npx tsc --noEmit   # typecheck
npx eslint .       # lint
npm run build      # production build (Turbopack) — 40 static outputs
npm run pages:build # static Pages output in .vercel/output/static
```

## Environment variables

Copy `.env.example` to `.env.local` for local development. In Cloudflare Pages, keep the existing Resend variables configured for both Production and Preview.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, OG tags |
| `RESEND_API_KEY` | Resend API key (server-only, never exposed to the browser) |
| `RESEND_TO` | Where enquiry emails are delivered |
| `MAIL_DOMAIN` | Existing verified Resend domain used by the previous deployment |
| `RESEND_FROM_EMAIL` | Optional complete sender override |
| `NEXT_PUBLIC_CALENDAR_URL` | Shows the "Book a discovery call" button when set |
| `NEXT_PUBLIC_WHATSAPP_URL` | Shows the WhatsApp button when set |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Feature flag (no analytics shipped by default) |
| `NEXT_PUBLIC_EXPERIMENTAL_WEBGPU` | Reserved flag — WebGPU is not implemented; the site uses stable WebGL2 |

## Editing text and links

All copy lives in the **dictionaries** — one per locale, same shape enforced by TypeScript:

- **`src/i18n/dictionaries/es.ts`** — Spanish (default public locale)
- **`src/i18n/dictionaries/en.ts`** — English
- **`src/i18n/dictionaries/fr.ts`** — French
- **`src/content/site-config.ts`** — locale-independent identity: name, contact channels, socials, profile image path, feature flags, site URL.

Components never hardcode copy; empty contact values (email, phone, WhatsApp, calendar) automatically hide the related UI. To change the default locale, edit `defaultLocale` in `src/i18n/config.ts`.

## Design system

Avant-garde editorial direction: porcelain `#f4f1ea` / graphite `#121215` / cobalt `#1f3be0→#3d5bff`, Fraunces (display) + Inter (body) + JetBrains Mono (meta labels). Motion: Lenis smooth scroll, masked word reveals (`TextReveal`), magnetic buttons, custom difference-blend cursor, clip-path image reveals, scroll-pinned horizontal work gallery, film-grain overlay — all disabled under `prefers-reduced-motion`. Hero 3D: custom GLSL simplex-displacement blob with cobalt fresnel rim (WebGL2, procedural lighting only, static SVG fallback).

## Replacing the profile photo

1. Export your portrait as WebP (quality ~85–90; keep enough resolution for its rendered size).
2. Drop it at `public/images/profile.webp` — done. Or set `media.profileImage` in `site-config.ts` to another path.
3. Preserve the source ratio in the image container. Adjust `media.profileImageFocus` only if a different-ratio crop is intentional.
4. Rollback: point to `/images/profile-placeholder.svg`.

See `docs/IMAGE_GUIDE.md` for the portrait art-direction brief and concept-cover briefs.

## Replacing concept work with real work

In each file under `src/i18n/dictionaries/`:

1. Add the verified project content to the same dictionary shape in ES, EN and FR.
2. Include context, exact contribution, decisions, launched output and sourced results.
3. Replace or add the cover in `public/visuals/` or `public/images/` with imagery you are allowed to publish.
4. Keep concept studies separate from real client work; never remove the concept label from a fictional case.

## Enabling Resend (contact-form email)

1. Create a Resend account and verify your sending domain.
2. Keep the existing Cloudflare values for `RESEND_API_KEY`, `RESEND_TO` and `MAIL_DOMAIN`. `RESEND_FROM_EMAIL` is an optional full sender override.
3. Redeploy. Missing required email variables produces an error rather than silently discarding a real enquiry.

The browser performs localized validation, then the Cloudflare Pages Function revalidates every field before calling Resend. It includes a honeypot + time-trap and never logs message contents.

## WebGPU experimentation

Not implemented. The hero uses stable WebGL2 via React Three Fiber. `NEXT_PUBLIC_EXPERIMENTAL_WEBGPU` is reserved in config for a future progressive-enhancement branch; leave it `false`.

## Deploying to Cloudflare Pages

The existing Cloudflare project is connected to `thmStarKiller/thomas-nicoli` and deploys pushes to `main`.

- Build command: `npm run pages:build`
- Output directory: `.vercel/output/static`
- Pages Function: `functions/api/contact.ts`
- Production variables: `RESEND_API_KEY`, `RESEND_TO`, `MAIL_DOMAIN`

For a manual deployment, run `npm run pages:deploy` after `wrangler login`.

## Custom domain

1. Keep `thomas-nicoli.com` attached to the existing Cloudflare Pages project.
2. Set `NEXT_PUBLIC_SITE_URL=https://thomas-nicoli.com` and redeploy.
3. Validate structured data at https://validator.schema.org/ and submit `/sitemap.xml` in Google Search Console.

## Pre-launch checklist

Work through **`docs/CONTENT_CHECKLIST.md`** — legal identity (NIF, address for the aviso legal), business email, package prices, portrait approval, real work permissions, Resend + domain configuration. The privacy and legal pages are templates, **not legal advice**.

## Project structure

```
src/
  app/            routes + sitemap.ts, robots.ts, opengraph-image.tsx
  components/     layout/ sections/ ui/ three/ forms/
  content/        site-config.ts, site-content.ts  ← edit these
  lib/            cn, seo, structured-data
  types/          shared domain types
functions/        Cloudflare Pages Function for Resend contact delivery
scripts/          Cloudflare Pages build adapter
public/images/    profile.webp, profile-placeholder.svg
public/visuals/   concept-study SVG covers
docs/             BUILD_PLAN, IMAGE_GUIDE, CONTENT_CHECKLIST
```
