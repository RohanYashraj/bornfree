import Link from "next/link";
import { sizeOptions, priceBands } from "@/content/site";
import Reveal from "@/components/ui/Reveal";

/**
 * Two-up merchandising panels — Shop by Size / Shop by Price.
 * Each pill deep-links into the all-products PLP with the matching filter
 * (?size / ?max) already applied via lib/filtering parseFilters.
 */
export default function ShopBySizePrice() {
  return (
    <section className="py-14">
      <Reveal className="mx-auto grid max-w-[1440px] gap-4 px-4 md:grid-cols-2 md:px-8">
        {/* Shop by Size */}
        <div className="panel-spec p-6 md:p-8">
          <p className="type-spec mb-1 text-umber">Find your fit</p>
          <h2 className="type-display mb-5 text-xl md:text-2xl">Shop by size</h2>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="pill-spec type-spec flex h-10 min-w-10 items-center justify-center px-3"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Shop by Price */}
        <div className="panel-spec p-6 md:p-8">
          <p className="type-spec mb-1 text-umber">Every budget</p>
          <h2 className="type-display mb-5 text-xl md:text-2xl">Shop by price</h2>
          <div className="flex flex-wrap gap-2">
            {priceBands.map((b) => (
              <Link
                key={b.label}
                href={b.href}
                className="pill-spec type-spec flex h-10 items-center justify-center px-4"
              >
                {b.label}
              </Link>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
