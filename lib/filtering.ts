import type { Product, SortKey } from "@/lib/commerce/types";

export type FilterState = {
  colors: string[];
  sizes: string[];
  min: number | null;
  max: number | null;
  inStock: boolean;
  sort: SortKey;
};

export function parseFilters(params: {
  [key: string]: string | string[] | undefined;
}): FilterState {
  const get = (k: string) => {
    const v = params[k];
    return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
  };
  const list = (k: string) =>
    get(k)?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const num = (k: string) => {
    const n = parseFloat(get(k) ?? "");
    return Number.isFinite(n) ? n : null;
  };
  const sort = get("sort");
  return {
    colors: list("color"),
    sizes: list("size"),
    min: num("min"),
    max: num("max"),
    inStock: get("instock") === "1",
    sort: (["featured", "price-asc", "price-desc", "newest"] as const).includes(
      sort as SortKey
    )
      ? (sort as SortKey)
      : "featured",
  };
}

export function applyFilters(products: Product[], f: FilterState): Product[] {
  let result = products.filter((p) => {
    if (f.inStock && !p.availableForSale) return false;
    const price = p.priceRange.min.amount;
    if (f.min !== null && price < f.min) return false;
    if (f.max !== null && price > f.max) return false;
    if (f.colors.length > 0) {
      const productColors = p.variants.flatMap((v) =>
        Object.entries(v.options)
          .filter(([k]) => k === "color" || k === "colour")
          .map(([, val]) => val.toLowerCase())
      );
      if (!f.colors.some((c) => productColors.includes(c.toLowerCase())))
        return false;
    }
    if (f.sizes.length > 0) {
      const productSizes = p.variants
        .filter((v) => v.availableForSale)
        .map((v) => v.options.size);
      if (!f.sizes.some((s) => productSizes.includes(s))) return false;
    }
    return true;
  });

  switch (f.sort) {
    case "price-asc":
      result = [...result].sort(
        (a, b) => a.priceRange.min.amount - b.priceRange.min.amount
      );
      break;
    case "price-desc":
      result = [...result].sort(
        (a, b) => b.priceRange.min.amount - a.priceRange.min.amount
      );
      break;
    case "newest":
      result = [...result].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
  }
  return result;
}

export type FilterOptions = {
  colors: string[];
  sizes: string[];
  priceMin: number;
  priceMax: number;
};

export function deriveOptions(products: Product[]): FilterOptions {
  const colors = new Set<string>();
  const sizes = new Set<string>();
  let priceMin = Infinity;
  let priceMax = 0;
  for (const p of products) {
    for (const v of p.variants) {
      const c = v.options.color ?? v.options.colour;
      if (c) colors.add(c);
      if (v.options.size) sizes.add(v.options.size);
    }
    priceMin = Math.min(priceMin, p.priceRange.min.amount);
    priceMax = Math.max(priceMax, p.priceRange.max.amount);
  }
  return {
    colors: [...colors].sort(),
    sizes: [...sizes].sort((a, b) => (parseInt(a) || 0) - (parseInt(b) || 0)),
    priceMin: priceMin === Infinity ? 0 : Math.floor(priceMin),
    priceMax: Math.ceil(priceMax),
  };
}
