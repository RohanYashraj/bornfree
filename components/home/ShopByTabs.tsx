"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import ProductCard from "@/components/product/ProductCard";

export type ProductTab = {
  label: string;
  handle: string;
  eyebrow: string;
  products: Product[];
};

/**
 * Tabbed product grid — the Bear House "SHOP BY" pattern in Mill Spec.
 * Tabs switch between pre-fetched collections; products are supplied by the
 * server so no client-side data fetching is needed.
 */
export default function ShopByTabs({ tabs }: { tabs: ProductTab[] }) {
  const available = tabs.filter((t) => t.products.length > 0);
  const [active, setActive] = useState(0);
  if (available.length === 0) return null;

  const current = available[Math.min(active, available.length - 1)];

  return (
    <section className="py-14">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="type-spec mb-2 text-umber">{current.eyebrow}</p>
            <h2 className="type-display text-2xl md:text-4xl">Shop by</h2>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Shop by">
            {available.map((tab, i) => (
              <button
                key={tab.handle}
                type="button"
                role="tab"
                aria-selected={i === active}
                data-active={i === active}
                onClick={() => setActive(i)}
                className="pill-spec type-spec h-10 px-4"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div
          role="tabpanel"
          className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4"
        >
          {current.products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href={`/collections/${current.handle}`}
            className="type-spec link-spec"
          >
            View all {current.label.toLowerCase()}
          </Link>
        </div>
      </div>
    </section>
  );
}
