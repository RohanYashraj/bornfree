import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { commerce } from "@/lib/commerce";
import { applyFilters, deriveOptions, parseFilters } from "@/lib/filtering";
import CollectionView from "@/components/plp/CollectionView";

export const revalidate = 60;

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = await commerce.getCollection(handle);
  if (!collection) return { title: "Collection" };
  return {
    title: collection.title,
    description:
      collection.description ||
      `Shop ${collection.title} — men's bottomwear in 100% cotton, made in Kolkata.`,
    alternates: { canonical: `/collections/${handle}` },
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const sp = await searchParams;

  const [collection, allProducts] = await Promise.all([
    commerce.getCollection(handle),
    commerce.getCollectionProducts(handle),
  ]);
  if (!collection && allProducts.length === 0) notFound();

  const filters = parseFilters(sp);
  const filtered = applyFilters(allProducts, filters);
  const options = deriveOptions(allProducts);
  const shown = parseInt(typeof sp.n === "string" ? sp.n : "") || 24;
  const visible = filtered.slice(0, shown);

  const title = collection?.title ?? handle.replace(/-/g, " ");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: `/collections/${handle}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
      <nav aria-label="Breadcrumb" className="pt-6">
        <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-umber">
          <li>
            <Link href="/" className="hover:text-carbon">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-carbon">
            {title}
          </li>
        </ol>
      </nav>

      <div className="flex items-baseline gap-4 py-6">
        <h1 className="type-display text-3xl md:text-5xl">{title}</h1>
        <p className="type-spec text-umber">
          {filtered.length} {filtered.length === 1 ? "item" : "items"}
        </p>
      </div>

      <CollectionView
        products={visible}
        totalCount={filtered.length}
        options={options}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
