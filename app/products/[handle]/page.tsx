import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { commerce } from "@/lib/commerce";
import { htmlToText } from "@/lib/commerce/specs";
import ProductView from "@/components/pdp/ProductView";
import ProductRail from "@/components/product/ProductRail";
import RecentlyViewed from "@/components/pdp/RecentlyViewed";

export const revalidate = 60;

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await commerce.getProduct(handle);
  if (!product) return { title: "Product" };
  const description = htmlToText(product.descriptionHtml)
    .replace(/\n/g, " ")
    .slice(0, 160);
  return {
    title: product.title,
    description,
    alternates: { canonical: `/products/${handle}` },
    openGraph: {
      title: product.title,
      description,
      images: product.images[0] ? [{ url: product.images[0].src }] : [],
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await commerce.getProduct(handle);
  if (!product) notFound();

  // "Pairs well with" — same product type from the full catalogue.
  let related = (await commerce.getAllProducts(250))
    .filter(
      (p) =>
        p.handle !== product.handle &&
        p.availableForSale &&
        p.productType === product.productType
    )
    .slice(0, 4);
  if (related.length < 4) {
    const fill = (await commerce.getCollectionProducts("best-seller", 12)).filter(
      (p) => p.handle !== product.handle && !related.some((r) => r.handle === p.handle)
    );
    related = [...related, ...fill].slice(0, 4);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.slice(0, 4).map((i) => i.src),
    description: htmlToText(product.descriptionHtml).slice(0, 500),
    sku: product.specs.designCode ?? product.id,
    brand: { "@type": "Brand", name: "Bornfree" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: product.priceRange.min.amount,
      highPrice: product.priceRange.max.amount,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl}/products/${product.handle}`,
    },
  };

  return (
    <>
      <ProductView product={product} />
      <ProductRail title="Pairs well with" products={related} eyebrow="From the same line" />
      <RecentlyViewed exclude={product.handle} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
