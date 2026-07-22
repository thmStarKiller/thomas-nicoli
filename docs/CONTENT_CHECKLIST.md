# Content checklist — evidence still worth adding

The live copy is intentionally conservative: concept studies are labelled as fictional, and no commercial metric is claimed without a source. Use this list to strengthen future case studies without turning assumptions into credentials.

## Portfolio evidence

For every real client project that may be published, collect:

- [ ] Written permission to name the client and show its assets.
- [ ] A one-sentence context: organisation, audience and reason for the work.
- [ ] The exact role Thomas held and the dates or phase covered.
- [ ] Named collaborators or agencies where credit is relevant.
- [ ] The starting constraint or baseline, with its source.
- [ ] Three to five decisions Thomas directly shaped.
- [ ] What was actually launched, implemented or handed over.
- [ ] A result with evidence: analytics period, stakeholder confirmation or operational before/after.
- [ ] One reflection: what changed in the approach or what Thomas would do differently.

Safe drafting markers for unpublished working documents:

- `[AÑADIR CONTEXTO VERIFICADO]`
- `[AÑADIR PAPEL EXACTO]`
- `[AÑADIR RESULTADO Y FUENTE]`
- `[CONFIRMAR PERMISO DE PUBLICACIÓN]`

Do not ship these markers on public pages. Until the information exists, keep the current explicit “concept / no client metrics” wording.

## Self-initiated builds

The four selected builds would become stronger with:

- [ ] Public URL, repository or private-demo availability for Property Finder, SFCC Inspector and SiteSync Pro.
- [ ] Current status for each item: prototype, active tool, archived experiment or production product.
- [ ] A screenshot or short product walkthrough for each.
- [ ] Usage evidence only where available: active users, runs, time saved or a concrete problem resolved.
- [ ] Confirmation of the exact technology list before adding it to the case page.

The current cards describe contribution and purpose only; they do not invent adoption or impact.

## Bio and positioning

- [ ] Confirm whether “more than ten years” remains the preferred public wording.
- [ ] Confirm which employer, client or sector names may be mentioned publicly, if any.
- [ ] Decide whether the next priority is independent-client work, platform consulting, agency collaboration or a mix; the current wording deliberately leaves room for all four.
- [ ] Confirm that “weekly written checkpoints” and the indicative website timelines reflect the intended operating model.
- [ ] Confirm whether “Italian — basic” should remain public.

## Contact and commercial details

- [ ] Confirm package names, scopes and budget bands in all three languages.
- [ ] Confirm the one-working-day response expectation shown on the contact page.
- [ ] Add a dedicated public business email in `src/content/site-config.ts` and configure `RESEND_TO`.
- [ ] Confirm LinkedIn, GitHub and Malt URLs.
- [ ] Add WhatsApp or a booking calendar only if they are meant to be public.

## Legal — required before a public Spanish launch

- [ ] Legal name, NIF and registered/fiscal address for the *Aviso legal*.
- [ ] Confirm data controller, retention period, hosting provider and email provider.
- [ ] Have the privacy and legal templates reviewed professionally.
- [ ] Add a cookie notice only if non-essential analytics or tracking is enabled.

## Imagery

- [x] New owner-supplied portrait integrated at `public/images/profile.webp`.
- [x] Natural 2:3 ratio preserved in the About and home portrait containers.
- [x] Localised accessible alternative text added.
- [x] Previous portrait variants removed from `public/images/`.
- [ ] Replace abstract concept covers only when approved imagery exists; keep the “Concept study” label.

## Infrastructure and final production checks

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production domain.
- [ ] Configure Resend in Cloudflare Pages: `RESEND_API_KEY`, `RESEND_TO`, `MAIL_DOMAIN` (and optionally `RESEND_FROM_EMAIL`).
- [ ] Validate structured data after deploy: <https://validator.schema.org/>.
- [ ] Submit `/sitemap.xml` in Google Search Console.
- [ ] Re-check the privacy statement if analytics, embeds or new processors are introduced.

> Privacy and legal pages are templates, not legal advice.
