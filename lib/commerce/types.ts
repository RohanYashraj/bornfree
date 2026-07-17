export type Money = {
  /** Amount in rupees (not paise). */
  amount: number;
  currencyCode: "INR";
};

export type ProductImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Variant = {
  /** Numeric Shopify variant id as string (usable in cart permalinks). */
  id: string;
  title: string;
  /** option name (lowercased) -> value, e.g. { color: "Dark Olive", size: "32-33" } */
  options: Record<string, string>;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
  image: ProductImage | null;
};

export type ProductOption = {
  name: string;
  values: string[];
};

/** Structured attributes parsed from the "Key Features" description block. */
export type ProductSpecs = {
  type: string | null;
  fit: string | null;
  fabric: string | null;
  pattern: string | null;
  pockets: string | null;
  pocketCount: number | null;
  closure: string | null;
  designCode: string | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  options: ProductOption[];
  variants: Variant[];
  images: ProductImage[];
  priceRange: { min: Money; max: Money };
  compareAtPriceRange: { min: Money; max: Money } | null;
  /** True iff at least one variant is available (§1.4). */
  availableForSale: boolean;
  specs: ProductSpecs;
  createdAt: string;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  image: ProductImage | null;
};

export type CartLine = {
  variantId: string;
  handle: string;
  title: string;
  variantTitle: string;
  optionsText: string;
  image: ProductImage | null;
  price: Money;
  quantity: number;
};

export type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

export interface CommerceProvider {
  getCollections(): Promise<Collection[]>;
  getCollection(handle: string): Promise<Collection | null>;
  getCollectionProducts(handle: string, limit?: number): Promise<Product[]>;
  getAllProducts(limit?: number): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | null>;
  searchProducts(query: string): Promise<Product[]>;
}
