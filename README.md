# Thomas Nicoli Consulting — website

Personal website for Thomas Nicoli, an independent AI consultant for businesses and professionals, based in Madrid. Built with Next.js 16 (App Router + Turbopack), React 19, TypeScript strict, Tailwind CSS 4, Motion and Lenis.

**Trilingual (ES / EN / FR)** — Spanish is the default locale. All routes live under `/[lang]` (`/es`, `/en`, `/fr`); a Next 16 `proxy.ts` redirects unprefixed paths to the best locale from `Accept-Language`. Every page ships canonical + hreflang (`x-default` → ES), localized metadata, localized OG images and a 3-locale sitemap.

Fully independent side business: no employer names, assets or implied endorsements anywhere. The work pages show real experience and self-initiated builds only. No client results are claimed.

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

## Editing text and links

Copy lives in two places, one file per locale in each, with the same shape enforced by TypeScript:

- **`src/i18n/site/{es,en,fr}.ts`**: home, the two audience pages (`/business`, `/professionals`), offers and prices, the work index and every case. The shape is in `src/i18n/site/types.ts`.
- **`src/i18n/dictionaries/{es,en,fr}.ts`**: about, contact form, privacy, legal, footer and page metadata.
- **`src/content/site-config.ts`**: name, contact channels, socials, profile image path, feature flags, site URL.

Feature flags in `site-config.ts`:

- `showPrices`: prices come from the offer catalogue. Set to `false` to hide every price.
- `showDraftPlaceholders`: shows dashed "Draft" blocks where content is still missing (client quotes). Set to `false` before going live.

Empty contact values (email, phone, WhatsApp, calendar) hide the related UI. With `NEXT_PUBLIC_CALENDAR_URL` set, the main button opens the calendar; without it, it leads to the enquiry form. To change the default locale, edit `defaultLocale` in `src/i18n/config.ts`.

## Design system

Flat and square, on purpose: no gradients, no rounded corners, no decorative shapes. Tokens are in `src/app/globals.css`.

- Colour: night `#0b0a09`, sand `#ece4d4` and `#dfd4bf`, one accent, spice `#9c350c` on sand and `#e8642c` on night.
- Type: Bodoni Moda for display (fixed optical size so the hairlines stay readable), Hanken Grotesk for text and labels. Both are SIL Open Font Licence and self-hosted through `next/font`.
- Scale: the home hero and the closing question use `--text-mega`, sized from the viewport so the headline runs across the portrait. The audit sits on a full block of spice with its price as the largest thing on the page.
- Motion: an opening curtain once per browser session (`.intro`, started by an inline script in the layout), a wipe after each navigation (`RouteCurtain`), a hero pinned on tall desktop screens while two bands of oversized words slide over it and react to scroll speed (`Ticker`), headline words that rise and turn into place (`Headline`), hairlines that draw across (`Rule`), images uncovered from the bottom (`data-wipe`), sections that rise (`Rise`), figures that count up, index rows and buttons that fill with spice on hover, a portrait that drifts on scroll, a header that hides going down and returns going up, plus Lenis smooth scroll. Everything is off under `prefers-reduced-motion`, and nothing is hidden without JavaScript.

## Replacing the profile photo

1. Export your portrait as WebP (quality ~85–90; keep enough resolution for its rendered size).
2. Drop it at `public/images/profile.webp` — done. Or set `media.profileImage` in `site-config.ts` to another path.
3. Preserve the source ratio in the image container. Adjust `media.profileImageFocus` only if a different-ratio crop is intentional.
4. Rollback: point to `/images/profile-placeholder.svg`.

The portrait is shown in black and white and returns to colour on hover.

## Adding a case to the work index

In each of `src/i18n/site/{es,en,fr}.ts`, add an entry to `work.cases` with the same `slug` in all three files: period, title, label, status, summary, context, what was built, what it shows and the stack. The case page and the sitemap pick it up from there. Experience entries are in `work.experience.items`. Keep to verified facts and do not name an employer.

## Enabling Resend (contact-form email)

1. Create a Resend account and verify your sending domain.
2. Keep the existing Cloudflare values for `RESEND_API_KEY`, `RESEND_TO` and `MAIL_DOMAIN`. `RESEND_FROM_EMAIL` is an optional full sender override.
3. Redeploy. Missing required email variables produces an error rather than silently discarding a real enquiry.

The browser performs localized validation, then the Cloudflare Pages Function revalidates every field before calling Resend. It includes a honeypot + time-trap and never logs message contents.

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
  components/     layout/ home/ sections/ ui/ motion/ forms/ chat/
  content/        site-config.ts
  i18n/           site/ (new structure copy), dictionaries/ (shared copy)
  lib/            cn, seo, structured-data
  types/          shared domain types
functions/        Cloudflare Pages Function for Resend contact delivery
scripts/          Cloudflare Pages build adapter
public/images/    profile.webp, profile-placeholder.svg
docs/             BUILD_PLAN, IMAGE_GUIDE, CONTENT_CHECKLIST
```
