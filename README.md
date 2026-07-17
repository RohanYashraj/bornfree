# Bornfree — Headless Storefront Demo

A from-scratch headless storefront for [Bornfree Fashions](https://bornfreefashions.com) — Kolkata-based men's bottomwear, 25+ years of in-house manufacturing. Shopify stays the commerce backend (products, inventory, checkout); Next.js is the entire visible storefront.

**Design system: "Mill Spec"** — a manufacturer's spec sheet turned into a design language. Monospace garment-tag specs (parsed from real product data), earth-tone palette sampled from the product line, Archivo display type, flat print-like surfaces.

## Stack

- Next.js 16 (App Router, RSC-first) · TypeScript strict · Tailwind CSS v4 · Motion · Zustand
- Data from Shopify via **two interchangeable providers** behind one interface (`lib/commerce/`)
- Images stay on the Shopify CDN with `?width=` transforms via a custom `next/image` loader

## Commerce modes

Set `COMMERCE_MODE` in `.env.local`:

### `public` (default — zero credentials)

Uses the store's public JSON endpoints (`/products.json`, `/collections/{handle}/products.json`, `/products/{handle}.js`, `/search/suggest.json`). Cart is client-side (Zustand + localStorage); **Checkout** builds a Shopify cart permalink (`https://{store}.myshopify.com/cart/{variantId}:{qty},…`) that lands on the real Shopify checkout.

### `storefront` (needs one credential)

Uses the Shopify Storefront GraphQL API (version `2025-07`). Create a token in Shopify Admin → Settings → Apps and sales channels → Develop apps → new app → Storefront API scopes (unauthenticated product/collection/cart read+write), then:

```env
COMMERCE_MODE=storefront
SHOPIFY_STORE_DOMAIN=345b3a-68.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_…
```

Checkout creates a real Shopify cart via `cartCreate` (Server Action, cart id persisted in a cookie) and redirects to its `checkoutUrl`. Full `cartLinesAdd/Update/Remove` mutations are implemented in [app/actions/cart.ts](app/actions/cart.ts).

## Env reference

```env
COMMERCE_MODE=public                              # or "storefront"
SHOPIFY_STORE_DOMAIN=345b3a-68.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=                  # storefront mode only
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=345b3a-68.myshopify.com   # cart permalinks
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # spec parser + availability/badge unit tests
npm run build
```

## Key implementation notes

- **Availability (fixes the live theme's "Sold Out" bug):** a product is sold out only when *every* variant is unavailable; badges derive strictly from variant-level data (`lib/commerce/specs.ts`, unit-tested).
- **Spec parser:** the "Key Features" block in product descriptions (Type / Fit / Fabric / Pattern / Pockets / Closure / Design Code) is parsed into structured specs that power the card spec strips and the PDP "Mill Spec" panel.
- **Offers as config:** both live promos are constants in [content/site.ts](content/site.ts) and drive the cart drawer's progress module.
- **Editorial content** (nav, offers, testimonials, stores, hero) lives in `content/site.ts` — editable without touching components.
- Prices always render `₹1,049` style via `Intl.NumberFormat('en-IN')`, no decimals.
- ISR 60s with cache tags (`products`, `collection:{handle}`, `product:{handle}`) ready for `revalidateTag` webhooks.

See [PROGRESS.md](PROGRESS.md) for the build log and decisions.
