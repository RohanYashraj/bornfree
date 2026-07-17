import { Suspense } from "react";
import { commerce } from "@/lib/commerce";
import { trustProps } from "@/content/site";
import Hero from "@/components/home/Hero";
import QuickLinks from "@/components/layout/QuickLinks";
import CategoryRail from "@/components/home/CategoryRail";
import Standard from "@/components/home/Standard";
import ShopByColour from "@/components/home/ShopByColour";
import Testimonials from "@/components/home/Testimonials";
import NewsletterForm from "@/components/home/NewsletterForm";
import ProductRail from "@/components/product/ProductRail";
import Reveal from "@/components/ui/Reveal";

export const revalidate = 60;

async function BestSellersRail() {
  const products = (await commerce.getCollectionProducts("best-seller", 20))
    .filter((p) => p.availableForSale)
    .slice(0, 10);
  return (
    <ProductRail
      title="Best sellers"
      eyebrow="Proven in the wash"
      products={products}
      viewAllHref="/collections/best-seller"
    />
  );
}

async function NewLaunchRail() {
  const products = (await commerce.getCollectionProducts("new-launch", 20))
    .filter((p) => p.availableForSale)
    .slice(0, 10);
  return (
    <ProductRail
      title="New launch"
      eyebrow="Fresh off the line"
      products={products}
      viewAllHref="/collections/new-launch"
    />
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <QuickLinks />

      <Suspense>
        <CategoryRail />
      </Suspense>

      <Suspense>
        <BestSellersRail />
      </Suspense>

      <Standard />

      <Suspense>
        <ShopByColour />
      </Suspense>

      <Suspense>
        <NewLaunchRail />
      </Suspense>

      <Testimonials />

      {/* Trust strip */}
      <section aria-label="Why shop with Bornfree" className="border-b border-border-spec">
        <div className="no-scrollbar mx-auto flex max-w-[1440px] items-center gap-6 overflow-x-auto px-4 py-5 md:justify-center md:px-8">
          {trustProps.map((prop, i) => (
            <span key={prop} className="type-spec flex shrink-0 items-center gap-6 text-carbon/70">
              {i > 0 && <span aria-hidden className="text-umber">·</span>}
              {prop}
            </span>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-olive py-16 text-bone">
        <Reveal className="mx-auto max-w-md px-4 text-center md:px-8">
          <p className="type-spec mb-2 text-bone/70">Stay on the list</p>
          <h2 className="type-display mb-6 text-2xl md:text-3xl">
            New drops, first
          </h2>
          <NewsletterForm />
        </Reveal>
      </section>
    </>
  );
}
