import type { Metadata } from "next";
import { Archivo, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/content/site";
import { commerce } from "@/lib/commerce";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header, { type MenuImageTile } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer, { type CrossSellItem } from "@/components/cart/CartDrawer";
import { Analytics } from "@vercel/analytics/next"

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bornfree — Men's Bottomwear, Made in Kolkata",
    template: "%s · Bornfree",
  },
  description:
    "Men's cargos, shorts, joggers and pyjamas in 100% cotton. Cut, sewn and washed in our own Kolkata facility for 25 years.",
  openGraph: {
    siteName: "Bornfree",
    locale: "en_IN",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Shared shell data: mega-menu image tile + cart cross-sell suggestions.
  let menuImage: MenuImageTile | null = null;
  let crossSell: CrossSellItem[] = [];
  try {
    const bestSellers = await commerce.getCollectionProducts("best-seller", 6);
    const first = bestSellers.find((p) => p.images[0]);
    if (first) {
      menuImage = {
        src: first.images[0].src,
        alt: first.images[0].alt,
        href: "/collections/best-seller",
        label: "Best Sellers",
      };
    }
    crossSell = bestSellers
      .filter((p) => p.availableForSale)
      .slice(0, 4)
      .map((p) => ({
        handle: p.handle,
        title: p.title,
        price: p.priceRange.min.amount,
        image: p.images[0]?.src ?? null,
      }));
  } catch {
    // Shell renders without the image tile / cross-sell if the fetch fails.
  }
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bornfree Fashions Pvt. Ltd.",
    url: siteUrl,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Diamond Heritage Building, 16 Strand Road",
      addressLocality: "Kolkata",
      addressRegion: "West Bengal",
      postalCode: "700001",
      addressCountry: "IN",
    },
    sameAs: [siteConfig.social.instagram, siteConfig.social.facebook],
  };

  return (
    <html lang="en-IN">
      <body
        className={`${archivo.variable} ${instrument.variable} ${plexMono.variable} antialiased`}
      >
        <AnnouncementBar />
        <Header menuImage={menuImage} />
        <main id="main">{children}</main>
        <Footer />
        <CartDrawer crossSell={crossSell} />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
