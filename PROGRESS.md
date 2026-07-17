# Bornfree Headless Storefront — PROGRESS

Demo headless storefront for bornfreefashions.com. Next.js 16 (App Router) + Tailwind v4 + Motion + Shopify (Storefront API or public JSON, switchable).

## Design direction — "Mill Spec" (restated before build)

**One signature element:** the spec-tag system — monospace garment-label strips/panels fed by real product data (Type / Fit / Fabric / Pattern / Pockets parsed from each product's "Key Features" table). Everything else stays quiet and editorial.

**Tokens (CSS vars → Tailwind v4 `@theme`):**

| Token | Value | Role |
|---|---|---|
| `--bf-bone` | `#ECE8DF` | page background (tag paper) |
| `--bf-paper` | `#F7F5F0` | cards, drawers, tags |
| `--bf-carbon` | `#1A1A16` | primary ink |
| `--bf-olive` | `#4E5238` | brand primary (buttons, links) |
| `--bf-khaki` | `#A99B7A` | borders (40% alpha), muted UI |
| `--bf-signal` | `#C2451E` | sale/focus accent, ≤5% of any view |

- Type: Archivo (display, 600–800, uppercase +tracking) · Instrument Sans (body/UI 400/500) · IBM Plex Mono (spec tags, eyebrows, batch codes) — all via `next/font`.
- Radius 0–2px, 1px khaki/40 borders, 8px grid, max-w 1440px, flat (shadows only on drawers/modals).
- Easing `cubic-bezier(0.22,1,0.36,1)`; 150/300/500–700ms; reduced-motion honored.
- Currency: en-IN INR, 0 decimals (`₹1,049`).

**Restraint check (§4.3):** ✓ single signature (spec tags) · ✗ no gradients/glass/glows/blobs · numbered eyebrows only where a real sequence exists · photography full-bleed, UI quiet.

**Home sections (build order within Phase 5):**
1. Announcement bar (2 live offers, rotating, dismissible)
2. Header (transparent→solid, mega menu, mobile drawer)
3. Quick-link chip bar
4. Hero carousel (100svh−header, Ken Burns, CDN lifestyle imagery)
5. Shop by Category rail (8 tiles)
6. Best Sellers rail (`best-seller`)
7. The Bornfree Standard (manufacturing band, spec-tag rows)
8. Shop by Occasion (6 tiles)
9. Shop by Colour (computed families from live data)
10. New Launch rail (`new-launch`)
11. Testimonials (real quotes from live homepage)
12. Trust strip (single-line spec strip)
13. Newsletter
14. Footer (carbon, ghost wordmark)

## Verified endpoints (2026-07-17)

- ✅ `products.json?limit=250&page=N` — full products w/ variants (`available`, `price`, `compare_at_price` as strings), images
- ✅ `products/{handle}.js` — options w/ values, 30 images on sample, `price` in **paise (integer)** vs products.json **rupee strings** — normalize in provider
- ✅ `collections/{handle}/products.json` — works
- ✅ `collections.json?limit=250` — 28 live collections incl. new ones (`cargos` 32, `denim-cargos`, `comfort-series`, `sale` 17); snapshot in brief is stale → fetch live
- ✅ `search/suggest.json?q=` — predictive search works
- Images on `cdn.shopify.com/s/files/1/0587/4257/1092/...` (also served via `bornfreefashions.com/cdn/...`), `?width=` transform supported

## Decisions log

- 2026-07-17 · create-next-app gave Next 16.2.10 (>15, App Router) — accepted.
- 2026-07-17 · Body font: Instrument Sans (over Inter) — slightly warmer, pairs better with Archivo.
- 2026-07-17 · Availability rule (§1.4): product sold-out ⇔ every variant unavailable; badge logic unit-tested.
- 2026-07-17 · Sample product's variants show `available:false` on several sizes but product `available:true` — confirms per-variant derivation matters.
- 2026-07-17 · COMMERCE_MODE=public is default (no credential); storefront provider implemented but untested against live token.

## Phase status

- [ ] Phase 0 — Scaffold (Next 16, TS strict, Tailwind v4, Motion, tokens, fonts, image config, folders)
- [ ] Phase 1 — Data layer (types, public+storefront providers, spec parser, availability logic, tests)
- [ ] Phase 2 — Shell (announcement, header, mega menu, mobile drawer, quick links, footer)
- [ ] Phase 3 — PLP (card, grid, filters/sort URL state, skeletons, empty states)
- [ ] Phase 4 — PDP + Cart (gallery, buy panel, Mill Spec, accordions, drawer, checkout handoff)
- [ ] Phase 5 — Home (all 14 sections)
- [ ] Phase 6 — Search, Our Story, wishlist, offline-store, contact, 404
- [ ] Phase 7 — Polish & QA
