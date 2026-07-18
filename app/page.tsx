import { Suspense } from "react";
import { commerce } from "@/lib/commerce";
import { trustProps, productTabs } from "@/content/site";
import Hero from "@/components/home/Hero";
import QuickLinks from "@/components/layout/QuickLinks";
import SegmentRail from "@/components/home/SegmentRail";
import CategoryRail from "@/components/home/CategoryRail";
import ShopBySizePrice from "@/components/home/ShopBySizePrice";
import PromoBanner from "@/components/home/PromoBanner";
import ShopByTabs, { type ProductTab } from "@/components/home/ShopByTabs";
import Standard from "@/components/home/Standard";
import ShopByColour from "@/components/home/ShopByColour";
import Testimonials from "@/components/home/Testimonials";
import NewsletterForm from "@/components/home/NewsletterForm";
import Reveal from "@/components/ui/Reveal";

export const revalidate = 60;

async function ShopByTabsSection() {
  const tabs: ProductTab[] = await Promise.all(
    productTabs.map(async (tab) => {
      const products = (await commerce.getCollectionProducts(tab.handle, 20))
        .filter((p) => p.availableForSale)
        .slice(0, 8);
      return { ...tab, products };
    })
  );
  return <ShopByTabs tabs={tabs} />;
}

export default function Home() {
  return (
    <>
      <Hero />
      <QuickLinks />

      <Suspense>
        <CategoryRail />
      </Suspense>

      <ShopBySizePrice />

      <SegmentRail />

      <PromoBanner />

      <Suspense>
        <ShopByTabsSection />
      </Suspense>

      <Standard />

      <Suspense>
        <ShopByColour />
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
