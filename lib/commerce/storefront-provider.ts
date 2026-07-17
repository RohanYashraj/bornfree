/**
 * Mode A — Shopify Storefront API (GraphQL). Requires
 * SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN.
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

const API_VERSION = "2025-07";
const REVALIDATE = 60;

export function storefrontConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN &&
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  );
}

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  tags: string[] = []
): Promise<T | null> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!domain || !token) return null;
  try {
    const res = await fetch(
      `https://${domain}/api/${API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({ query, variables }),
        next: { revalidate: REVALIDATE, tags },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (json.errors) {
      console.error("Storefront API errors:", json.errors);
      return null;
    }
    return json.data as T;
  } catch (e) {
    console.error("Storefront API fetch failed:", e);
    return null;
  }
}

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    descriptionHtml
    productType
    tags
    createdAt
    availableForSale
    options {
      name
      optionValues {
        name
      }
    }
    images(first: 40) {
      nodes {
        url
        altText
        width
        height
      }
    }
    variants(first: 100) {
      nodes {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
`;

/* eslint-disable @typescript-eslint/no-explicit-any */

function gidToNumeric(gid: string): string {
  const m = gid.match(/\/(\d+)$/);
  return m ? m[1] : gid;
}

function money(m: any): Money | null {
  if (!m) return null;
  return { amount: parseFloat(m.amount), currencyCode: "INR" };
}

function mapImage(img: any, fallbackAlt: string): ProductImage | null {
  if (!img?.url) return null;
  return {
    src: img.url,
    alt: img.altText || fallbackAlt,
    width: img.width ?? 1600,
    height: img.height ?? 2000,
  };
}

function mapProduct(p: any): Product {
  const variants: Variant[] = (p.variants?.nodes ?? []).map((v: any) => {
    const options: Record<string, string> = {};
    for (const o of v.selectedOptions ?? []) {
      options[o.name.toLowerCase()] = o.value;
    }
    return {
      id: gidToNumeric(v.id),
      title: v.title,
      options,
      availableForSale: Boolean(v.availableForSale),
      price: money(v.price) ?? { amount: 0, currencyCode: "INR" as const },
      compareAtPrice: money(v.compareAtPrice),
      image: mapImage(v.image, `${p.title} — ${v.title}`),
    };
  });
  const prices = variants.map((v) => v.price.amount);
  const compares = variants
    .map((v) => v.compareAtPrice?.amount)
    .filter((n): n is number => typeof n === "number");
  return {
    id: gidToNumeric(p.id),
    handle: p.handle,
    title: p.title,
    descriptionHtml: p.descriptionHtml ?? "",
    productType: p.productType ?? "",
    tags: p.tags ?? [],
    options: (p.options ?? []).map((o: any) => ({
      name: o.name,
      values: (o.optionValues ?? []).map((v: any) => v.name),
    })),
    variants,
    images: (p.images?.nodes ?? [])
      .map((img: any) => mapImage(img, p.title))
      .filter(Boolean) as ProductImage[],
    priceRange: {
      min: { amount: prices.length ? Math.min(...prices) : 0, currencyCode: "INR" },
      max: { amount: prices.length ? Math.max(...prices) : 0, currencyCode: "INR" },
    },
    compareAtPriceRange:
      compares.length > 0
        ? {
            min: { amount: Math.min(...compares), currencyCode: "INR" },
            max: { amount: Math.max(...compares), currencyCode: "INR" },
          }
        : null,
    availableForSale: productAvailable(variants),
    specs: parseSpecs(p.descriptionHtml ?? ""),
    createdAt: p.createdAt ?? "",
  };
}

export const storefrontProvider: CommerceProvider = {
  async getCollections(): Promise<Collection[]> {
    const data = await shopifyFetch<any>(
      /* GraphQL */ `
        query Collections {
          collections(first: 100) {
            nodes {
              handle
              title
              description
              image { url altText width height }
            }
          }
        }
      `,
      {},
      ["collections"]
    );
    return (data?.collections?.nodes ?? []).map((c: any) => ({
      handle: c.handle,
      title: c.title,
      description: c.description ?? "",
      image: mapImage(c.image, c.title),
    }));
  },

  async getCollection(handle: string): Promise<Collection | null> {
    const data = await shopifyFetch<any>(
      /* GraphQL */ `
        query Collection($handle: String!) {
          collection(handle: $handle) {
            handle
            title
            description
            image { url altText width height }
          }
        }
      `,
      { handle },
      [`collection:${handle}`]
    );
    const c = data?.collection;
    if (!c) return null;
    return {
      handle: c.handle,
      title: c.title,
      description: c.description ?? "",
      image: mapImage(c.image, c.title),
    };
  },

  async getCollectionProducts(handle: string, limit = 250): Promise<Product[]> {
    const data = await shopifyFetch<any>(
      /* GraphQL */ `
        query CollectionProducts($handle: String!, $first: Int!) {
          collection(handle: $handle) {
            products(first: $first) {
              nodes { ...ProductFields }
            }
          }
        }
        ${PRODUCT_FRAGMENT}
      `,
      { handle, first: Math.min(limit, 250) },
      ["products", `collection:${handle}`]
    );
    return (data?.collection?.products?.nodes ?? []).map(mapProduct);
  },

  async getAllProducts(limit = 250): Promise<Product[]> {
    const data = await shopifyFetch<any>(
      /* GraphQL */ `
        query AllProducts($first: Int!) {
          products(first: $first) {
            nodes { ...ProductFields }
          }
        }
        ${PRODUCT_FRAGMENT}
      `,
      { first: Math.min(limit, 250) },
      ["products"]
    );
    return (data?.products?.nodes ?? []).map(mapProduct);
  },

  async getProduct(handle: string): Promise<Product | null> {
    const data = await shopifyFetch<any>(
      /* GraphQL */ `
        query ProductByHandle($handle: String!) {
          product(handle: $handle) { ...ProductFields }
        }
        ${PRODUCT_FRAGMENT}
      `,
      { handle },
      [`product:${handle}`]
    );
    return data?.product ? mapProduct(data.product) : null;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const data = await shopifyFetch<any>(
      /* GraphQL */ `
        query Search($query: String!) {
          products(first: 20, query: $query) {
            nodes { ...ProductFields }
          }
        }
        ${PRODUCT_FRAGMENT}
      `,
      { query },
      ["search"]
    );
    return (data?.products?.nodes ?? []).map(mapProduct);
  },
};
