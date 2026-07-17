import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import ProductCard from "./ProductCard";

/** Horizontal scroll-snap product rail with edge peek. */
export default function ProductRail({
  title,
  products,
  viewAllHref,
  eyebrow,
}: {
  title: string;
  products: Product[];
  viewAllHref?: string;
  eyebrow?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="py-14">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            {eyebrow && <p className="type-spec mb-2 text-umber">{eyebrow}</p>}
            <h2 className="type-display text-2xl md:text-4xl">{title}</h2>
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className="link-spec type-spec shrink-0">
              View all
            </Link>
          )}
        </div>
      </div>
      <div className="no-scrollbar mx-auto flex max-w-[1440px] snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:px-8">
        {products.map((p) => (
          <div
            key={p.id}
            className="w-[70%] shrink-0 snap-start sm:w-[45%] md:w-[31%] lg:w-[23%]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
