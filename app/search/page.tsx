import type { Metadata } from "next";
import { commerce } from "@/lib/commerce";
import { applyFilters, deriveOptions, parseFilters } from "@/lib/filtering";
import CollectionView from "@/components/plp/CollectionView";

export const metadata: Metadata = {
  title: "Search",
  alternates: { canonical: "/search" },
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim();

  const results = q ? await commerce.searchProducts(q) : [];
  const filters = parseFilters(sp);
  const filtered = applyFilters(results, filters);
  const shown = parseInt(typeof sp.n === "string" ? sp.n : "") || 24;

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
      <div className="flex items-baseline gap-4 py-8">
        <h1 className="type-display text-3xl md:text-5xl">
          {q ? `Results for “${q}”` : "Search"}
        </h1>
        {q && (
          <p className="type-spec text-umber">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </p>
        )}
      </div>

      {q ? (
        <CollectionView
          products={filtered.slice(0, shown)}
          totalCount={filtered.length}
          options={deriveOptions(results)}
        />
      ) : (
        <p className="pb-24 text-sm text-umber">
          Use the search icon in the header to look for cargos, shorts,
          joggers and more.
        </p>
      )}
    </div>
  );
}
