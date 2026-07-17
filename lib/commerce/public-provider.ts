/**
 * Mode B — public Shopify JSON endpoints (no credentials).
 *
 * Field-mapping notes (verified against live responses 2026-07-17):
 * - `/products.json` & `/collections/{h}/products.json`: prices are rupee
 *   strings ("1049.00"); options include `values`.
 * - `/products/{handle}.js`: prices are integers in paise — divide by 100.
 */
import type {
  Collection,
  CommerceProvider,
  Money,
  Product,
  ProductImage,
  Variant,
} from "./types";
import { parseSpecs, productAvailable } from "./specs";

const BASE = "https://bornfreefashions.com";
const REVALIDATE = 60;

function money(value: string | number | null | undefined): Money | null {
  if (value === null || value === undefined || value === "") return null;
  const amount =
    typeof value === "number" ? value / 100 : parseFloat(value);
  if (Number.isNaN(amount)) return null;
  return { amount, currencyCode: "INR" };
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapImage(img: any, fallbackAlt: string): ProductImage | null {
  if (!img) return null;
  const src: string | undefined = typeof img === "string" ? img : img.src;
  if (!src) return null;
  const abs = src.startsWith("//") ? `https:${src}` : src;
  return {
    src: abs,
    alt: (typeof img === "object" && img.alt) || fallbackAlt,
    width: (typeof img === "object" && img.width) || 1600,
    height: (typeof img === "object" && img.height) || 2000,
  };
}

function mapVariant(v: any, optionNames: string[], title: string): Variant {
  const options: Record<string, string> = {};
  optionNames.forEach((name, i) => {
    const value = v[`option${i + 1}`] ?? (Array.isArray(v.options) ? v.options[i] : null);
    if (value) options[name.toLowerCase()] = value;
  });
  return {
    id: String(v.id),
    title: v.title,
    options,
    availableForSale: Boolean(v.available),
    price: money(v.price) ?? { amount: 0, currencyCode: "INR" },
    compareAtPrice: money(v.compare_at_price),
    image: mapImage(v.featured_image, `${title} — ${v.title}`),
  };
}

function mapProduct(p: any): Product {
  const optionNames: string[] = (p.options ?? []).map((o: any) =>
    typeof o === "string" ? o : o.name
  );
  const variants: Variant[] = (p.variants ?? []).map((v: any) =>
    mapVariant(v, optionNames, p.title)
  );
  const images: ProductImage[] = (p.images ?? [])
    .map((img: any) => mapImage(img, p.title))
    .filter(Boolean) as ProductImage[];

  const prices = variants.map((v) => v.price.amount);
  const compares = variants
    .map((v) => v.compareAtPrice?.amount)
    .filter((n): n is number => typeof n === "number");

  const descriptionHtml: string = p.body_html ?? p.description ?? "";

  return {
    id: String(p.id),
    handle: p.handle,
    title: p.title,
    descriptionHtml,
    productType: p.product_type ?? p.type ?? "",
    tags: Array.isArray(p.tags)
      ? p.tags
      : typeof p.tags === "string"
        ? p.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
    options: (p.options ?? []).map((o: any) => ({
      name: typeof o === "string" ? o : o.name,
      values:
        typeof o === "object" && Array.isArray(o.values)
          ? o.values
          : Array.from(
              new Set(
                variants
                  .map((v) => v.options[(typeof o === "string" ? o : o.name).toLowerCase()])
                  .filter(Boolean)
              )
            ),
    })),
    variants,
    images,
    priceRange: {
      min: { amount: Math.min(...prices, Infinity) === Infinity ? 0 : Math.min(...prices), currencyCode: "INR" },
      max: { amount: Math.max(...prices, 0), currencyCode: "INR" },
    },
    compareAtPriceRange:
      compares.length > 0
        ? {
            min: { amount: Math.min(...compares), currencyCode: "INR" },
            max: { amount: Math.max(...compares), currencyCode: "INR" },
          }
        : null,
    availableForSale: productAvailable(variants),
    specs: parseSpecs(descriptionHtml),
    createdAt: p.published_at ?? p.created_at ?? "",
  };
}

async function fetchJson(path: string, tags: string[]): Promise<any | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${BASE}${path}`, {
        next: { revalidate: REVALIDATE, tags },
        headers: { accept: "application/json" },
      });
      if (res.ok) return await res.json();
      // Transient throttling (429/503): brief backoff, retry once.
      if (res.status !== 429 && res.status !== 503) return null;
    } catch {
      // network error — retry once
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return null;
}

export const publicProvider: CommerceProvider = {
  async getCollections(): Promise<Collection[]> {
    const collections: Collection[] = [];
    for (let page = 1; page <= 2; page++) {
      const data = await fetchJson(
        `/collections.json?limit=250&page=${page}`,
        ["collections"]
      );
      const batch = data?.collections ?? [];
      for (const c of batch) {
        collections.push({
          handle: c.handle,
          title: c.title,
          description: c.description ?? "",
          image: mapImage(c.image, c.title),
        });
      }
      if (batch.length < 250) break;
    }
    return collections;
  },

  async getCollection(handle: string): Promise<Collection | null> {
    if (handle === "all") {
      return { handle: "all", title: "Shop All", description: "", image: null };
    }
    const all = await this.getCollections();
    return all.find((c) => c.handle === handle) ?? null;
  },

  async getCollectionProducts(handle: string, limit = 250): Promise<Product[]> {
    const path =
      handle === "all"
        ? `/products.json?limit=${Math.min(limit, 250)}`
        : `/collections/${handle}/products.json?limit=${Math.min(limit, 250)}`;
    const data = await fetchJson(path, ["products", `collection:${handle}`]);
    return (data?.products ?? []).map(mapProduct);
  },

  async getAllProducts(limit = 250): Promise<Product[]> {
    const products: Product[] = [];
    let page = 1;
    while (products.length < limit && page <= 4) {
      const data = await fetchJson(
        `/products.json?limit=250&page=${page}`,
        ["products"]
      );
      const batch = data?.products ?? [];
      products.push(...batch.map(mapProduct));
      if (batch.length < 250) break;
      page++;
    }
    return products.slice(0, limit);
  },

  async getProduct(handle: string): Promise<Product | null> {
    const data = await fetchJson(`/products/${handle}.js`, [
      `product:${handle}`,
    ]);
    if (!data) return null;
    return mapProduct(data);
  },

  async searchProducts(query: string): Promise<Product[]> {
    const data = await fetchJson(
      `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=10`,
      ["search"]
    );
    const hits: any[] = data?.resources?.results?.products ?? [];
    const products = await Promise.all(
      hits.map((h) => this.getProduct(h.handle))
    );
    return products.filter((p): p is Product => p !== null);
  },
};
