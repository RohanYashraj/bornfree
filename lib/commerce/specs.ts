import type { Product, ProductSpecs, Variant } from "./types";

/** Strip HTML tags and collapse whitespace, keeping <br>/block boundaries as newlines. */
export function htmlToText(html: string): string {
  return html
    .replace(/<(br|\/tr|\/p|\/li|\/td)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;|&rsquo;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

function extract(text: string, label: string): string | null {
  const re = new RegExp(`${label}\\s*:?\\s*([^\\n]+)`, "i");
  const m = text.match(re);
  if (!m) return null;
  const value = m[1].trim().replace(/[.\s]+$/, "");
  return value.length > 0 ? value : null;
}

/**
 * Parse the "Key Features" block found in Bornfree product descriptions
 * (Type / Fit / Fabric / Pattern / Number of Pockets / Closure / Design Code)
 * into structured specs. Resilient: any missing field is null.
 */
export function parseSpecs(descriptionHtml: string): ProductSpecs {
  const text = htmlToText(descriptionHtml ?? "");
  const pockets = extract(text, "(?:Number of )?Pockets?");
  let pocketCount: number | null = null;
  if (pockets) {
    const nums = pockets.match(/\d+/g);
    if (nums && nums.length > 0) {
      pocketCount = nums.reduce((sum, n) => sum + parseInt(n, 10), 0);
    }
  }
  return {
    type: extract(text, "Type"),
    fit: extract(text, "Fit"),
    fabric: extract(text, "Fabric"),
    pattern: extract(text, "Pattern"),
    pockets,
    pocketCount,
    closure: extract(text, "Closure"),
    designCode: extract(text, "Design Code"),
  };
}

/** Short spec strip for product cards: `100% COTTON · REGULAR FIT · 6 POCKETS` */
export function specStrip(specs: ProductSpecs): string | null {
  const parts: string[] = [];
  if (specs.fabric) parts.push(specs.fabric);
  if (specs.fit) parts.push(specs.fit);
  if (specs.pocketCount) parts.push(`${specs.pocketCount} pockets`);
  else if (specs.pattern) parts.push(specs.pattern);
  if (parts.length === 0) return null;
  return parts.join(" · ").toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Availability & badges (§1.4)                                        */
/* ------------------------------------------------------------------ */

/** A product is available iff at least one variant is purchasable. */
export function productAvailable(variants: Pick<Variant, "availableForSale">[]): boolean {
  return variants.some((v) => v.availableForSale);
}

export type Badge = "sale" | "sold-out" | null;

/**
 * `On Sale` if any variant compare-at > price; `Sold Out` only if every
 * variant is unavailable; never both (sold-out wins visibility, but the
 * default is: sold-out only per the strict rule, sale otherwise).
 */
export function productBadge(
  product: Pick<Product, "variants" | "availableForSale">
): Badge {
  if (!product.availableForSale) return "sold-out";
  const onSale = product.variants.some(
    (v) =>
      v.compareAtPrice !== null && v.compareAtPrice.amount > v.price.amount
  );
  return onSale ? "sale" : null;
}
