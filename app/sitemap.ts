import type { MetadataRoute } from "next";
import { commerce } from "@/lib/commerce";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [collections, products] = await Promise.all([
    commerce.getCollections(),
    commerce.getAllProducts(500),
  ]);

  return [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    ...["/pages/our-story", "/pages/offline-store", "/pages/contact", "/search"].map(
      (p) => ({ url: `${siteUrl}${p}`, changeFrequency: "monthly" as const, priority: 0.5 })
    ),
    ...collections.map((c) => ({
      url: `${siteUrl}/collections/${c.handle}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${siteUrl}/products/${p.handle}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
