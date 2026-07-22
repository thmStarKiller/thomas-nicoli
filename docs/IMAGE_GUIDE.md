# Image Guide

All imagery lives under `public/`. The site ships with zero remote images.

## Owner portrait

- **Current source:** owner-supplied `profilepicthomas.png` (1024 × 1536, native 2:3).
- **Current web file:** `public/images/profile.webp` (1024 × 1536, WebP quality 90, 104,200 bytes).
- **Treatment:** format optimisation only. No crop, filter, retouching, colour change or synthetic background was applied.
- **Localized alt text:** `Retrato de Thomas Nicoli` / `Portrait of Thomas Nicoli` / `Portrait de Thomas Nicoli`.
- **Layout:** both portrait containers use `aspect-[2/3]`, so the full composition is preserved on desktop and mobile.
- **To replace it:** export a new portrait as WebP (quality ~85–90), drop it at `public/images/profile.webp`, or point `media.profileImage` in `src/content/site-config.ts` at another local path.
- **Crop control:** `media.profileImageFocus` in the same file (CSS `object-position`, currently centred at `50% 50%`). It only matters if a future container changes aspect ratio.
- **Rollback:** set `media.profileImage` to `/images/profile-placeholder.svg`.

### Portrait art direction (for a future shoot)

Editorial portrait of an approachable independent digital consultant, chest-up or waist-up, direct but relaxed expression, modern neutral clothing without logos, warm-gray or cream studio background, soft directional window light, subtle cobalt accent in the environment, natural skin texture, premium beauty-editorial polish without looking over-retouched, generous negative space for web cropping, vertical 4:5 composition, no text, no employer branding.

## Concept-study covers

Abstract SVGs live in `public/visuals/` (`concept-aurea.svg`, `concept-casa.svg`, `concept-atelier.svg`). They are intentional placeholders — art-directed, lightweight, and clearly conceptual. Replace with generated photography when ready, keeping the same filenames (or update `site-content.ts → work[].cover`).

### Concept-study visual: beauty/wellness

Editorial campaign image for a fictional independent wellness studio, sculptural cream interior, natural stone, brushed metal, soft morning light, restrained botanical detail, premium but welcoming, no visible real-world logo, vertical and landscape crops, photorealistic, clearly suitable for a concept project.

### Concept-study visual: hospitality

Contemporary neighborhood café or restaurant for a fictional brand, intimate warm lighting, tactile materials, elegant menu details, local and human atmosphere, art-directed editorial photography, no readable real-world trademarks, landscape 16:10 composition.

### Concept-study visual: boutique retail

Fictional independent boutique product display, refined packaging with abstract non-readable labels, cobalt and porcelain color accents, sculptural plinths, clean directional light, high-end product photography, landscape 16:10 composition, no real brand marks.

### Abstract campaign texture

Macro photograph of translucent glass, chrome, and warm paper interacting with a single cobalt light source, sophisticated editorial texture, subtle grain, no text, no logos, suitable as a website background crop.

## Rules

- Keep concept imagery labeled **Concept study** on the site until it represents real client work.
- Never use third-party logos, trademarks, or employer assets.
- Use `next/image` with explicit dimensions; only the hero-adjacent portrait may be preloaded.
