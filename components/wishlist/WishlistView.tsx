"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useWishlist } from "@/lib/wishlist-store";
import type { Product } from "@/lib/commerce/types";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistView() {
  const handles = useWishlist((s) => s.handles);
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    if (handles.length === 0) {
      setProducts([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/products?handles=${handles.join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setProducts(data.products ?? []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [handles]);

  if (products === null) {
    return (
      <div className="grid animate-pulse grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] bg-khaki/20" />
            <div className="mt-3 h-4 w-3/4 bg-khaki/20" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6 pb-24">
        <p className="type-spec text-khaki">
          Nothing saved yet — tap the heart on any product.
        </p>
        <Link
          href="/collections/best-seller"
          className="type-spec border border-carbon px-8 py-3 transition-colors hover:bg-carbon hover:text-paper"
        >
          Browse best sellers
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 pb-16 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
