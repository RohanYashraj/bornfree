"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import type { Product } from "@/lib/commerce/types";
import type { FilterOptions } from "@/lib/filtering";
import ProductCard from "@/components/product/ProductCard";
import Toolbar from "./Toolbar";

export default function CollectionView({
  products,
  totalCount,
  options,
}: {
  /** Already filtered/sorted/sliced on the server. */
  products: Product[];
  totalCount: number;
  options: FilterOptions;
}) {
  const [density, setDensity] = useState<2 | 4>(4);
  const params = useSearchParams();
  const pathname = usePathname();

  const loadMoreParams = new URLSearchParams(params.toString());
  loadMoreParams.set("n", String(products.length + 24));

  return (
    <>
      <Toolbar
        options={options}
        resultCount={totalCount}
        density={density}
        onDensity={setDensity}
      />

      {totalCount === 0 ? (
        <div className="flex flex-col items-center gap-6 py-24 text-center">
          <p className="type-spec text-khaki">
            Nothing matches these filters
          </p>
          <p className="max-w-sm text-sm text-carbon/70">
            Try clearing a filter, or start from our best sellers.
          </p>
          <div className="flex gap-3">
            <Link
              href={pathname}
              className="type-spec border border-carbon px-6 py-3 hover:bg-carbon hover:text-paper"
            >
              Clear filters
            </Link>
            <Link
              href="/collections/best-seller"
              className="type-spec bg-olive px-6 py-3 text-paper hover:bg-olive-deep"
            >
              Best sellers
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`grid gap-x-4 gap-y-10 py-8 ${
              density === 4
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>

          {products.length < totalCount && (
            <div className="flex flex-col items-center gap-3 pb-16">
              <p className="type-spec text-khaki">
                Showing {products.length} of {totalCount}
              </p>
              <Link
                href={`${pathname}?${loadMoreParams.toString()}`}
                scroll={false}
                className="type-spec border border-carbon px-10 py-3 transition-colors hover:bg-carbon hover:text-paper"
              >
                Load more
              </Link>
            </div>
          )}
        </>
      )}
    </>
  );
}
