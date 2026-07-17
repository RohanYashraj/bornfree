"use server";

import { cookies } from "next/headers";
import { shopifyFetch, storefrontConfigured } from "@/lib/commerce/storefront-provider";

const CART_COOKIE = "bf_cartId";

type CartResult = {
  id: string;
  checkoutUrl: string;
} | null;

/* eslint-disable @typescript-eslint/no-explicit-any */

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
          }
        }
      }
    }
  }
`;

function toGid(variantId: string): string {
  return variantId.startsWith("gid://")
    ? variantId
    : `gid://shopify/ProductVariant/${variantId}`;
}

async function cartCreate(
  lines: { variantId: string; quantity: number }[]
): Promise<CartResult> {
  const data = await shopifyFetch<any>(
    /* GraphQL */ `
      mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart { ...CartFields }
        }
      }
      ${CART_FRAGMENT}
    `,
    {
      input: {
        lines: lines.map((l) => ({
          merchandiseId: toGid(l.variantId),
          quantity: l.quantity,
        })),
      },
    }
  );
  return data?.cartCreate?.cart ?? null;
}

export async function cartLinesAdd(
  cartId: string,
  lines: { variantId: string; quantity: number }[]
): Promise<CartResult> {
  const data = await shopifyFetch<any>(
    /* GraphQL */ `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
        }
      }
      ${CART_FRAGMENT}
    `,
    {
      cartId,
      lines: lines.map((l) => ({
        merchandiseId: toGid(l.variantId),
        quantity: l.quantity,
      })),
    }
  );
  return data?.cartLinesAdd?.cart ?? null;
}

export async function cartLinesUpdate(
  cartId: string,
  lines: { lineId: string; quantity: number }[]
): Promise<CartResult> {
  const data = await shopifyFetch<any>(
    /* GraphQL */ `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
        }
      }
      ${CART_FRAGMENT}
    `,
    {
      cartId,
      lines: lines.map((l) => ({ id: l.lineId, quantity: l.quantity })),
    }
  );
  return data?.cartLinesUpdate?.cart ?? null;
}

export async function cartLinesRemove(
  cartId: string,
  lineIds: string[]
): Promise<CartResult> {
  const data = await shopifyFetch<any>(
    /* GraphQL */ `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { ...CartFields }
        }
      }
      ${CART_FRAGMENT}
    `,
    { cartId, lineIds }
  );
  return data?.cartLinesRemove?.cart ?? null;
}

/**
 * Mode A checkout handoff: create (or reuse) a Shopify cart from the
 * client cart lines and return the real checkoutUrl. Returns null when
 * Storefront credentials are missing (caller falls back to permalink).
 */
export async function createCheckout(
  lines: { variantId: string; quantity: number }[]
): Promise<string | null> {
  if (!storefrontConfigured() || lines.length === 0) return null;
  const cart = await cartCreate(lines);
  if (!cart) return null;
  const jar = await cookies();
  jar.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  return cart.checkoutUrl;
}

export async function isStorefrontMode(): Promise<boolean> {
  return process.env.COMMERCE_MODE === "storefront" && storefrontConfigured();
}
