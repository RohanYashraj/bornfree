"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Product, Variant } from "@/lib/commerce/types";

export type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  /** Last added variant, for the drawer peek. */
  lastAdded: string | null;
  addLine: (product: Product, variant: Variant, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeLine: (variantId: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      lastAdded: null,
      addLine: (product, variant, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find(
            (l) => l.variantId === variant.id
          );
          const lines = existing
            ? state.lines.map((l) =>
                l.variantId === variant.id
                  ? { ...l, quantity: l.quantity + quantity }
                  : l
              )
            : [
                ...state.lines,
                {
                  variantId: variant.id,
                  handle: product.handle,
                  title: product.title,
                  variantTitle: variant.title,
                  optionsText: Object.values(variant.options).join(" / "),
                  image: variant.image ?? product.images[0] ?? null,
                  price: variant.price,
                  quantity,
                },
              ];
          return { lines, isOpen: true, lastAdded: variant.id };
        }),
      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.variantId !== variantId)
              : state.lines.map((l) =>
                  l.variantId === variantId ? { ...l, quantity } : l
                ),
        })),
      removeLine: (variantId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.variantId !== variantId),
        })),
      clear: () => set({ lines: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "bf-cart",
      partialize: (s) => ({ lines: s.lines }),
    }
  )
);

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.price.amount * l.quantity, 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

/** Mode B checkout — Shopify cart permalink drops into real checkout. */
export function cartPermalink(lines: CartLine[]): string {
  const domain =
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "345b3a-68.myshopify.com";
  const items = lines.map((l) => `${l.variantId}:${l.quantity}`).join(",");
  return `https://${domain}/cart/${items}`;
}
