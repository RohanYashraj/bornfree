import type { Metadata } from "next";
import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { qualityProps } from "@/content/site";
import BfImage from "@/components/ui/BfImage";
import Reveal from "@/components/ui/Reveal";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "25 years of men's bottomwear, made in our own Kolkata facility. Cargos, shorts, joggers and pyjamas — fits perfected for the Indian body.",
  alternates: { canonical: "/pages/our-story" },
};

/* All facts below trace to bornfreefashions.com/pages/our-story. */

const TIMELINE = [
  {
    year: "2001",
    text: "Bornfree begins, with a plan to redefine men's bottomwear.",
  },
  {
    year: "2010s",
    text: "Fits researched and refined for the Indian body across cargos, shorts, joggers and Bermudas.",
  },
  {
    year: "TODAY",
    text: "3 manufacturing units, 500+ workers, solar powered, fair employment practice.",
  },
];

export default async function OurStoryPage() {
  const bestSellers = await commerce.getCollectionProducts("best-seller", 8);
  const imgs = bestSellers
    .flatMap((p) => p.images.slice(0, 1))
    .slice(0, 3);

  return (
    <div>
      {/* Opener */}
      <section className="bg-carbon py-24 text-bone md:py-36">
        <Reveal className="mx-auto max-w-[1440px] px-4 md:px-8">
          <p className="type-spec mb-4 text-khaki">Our story</p>
          <h1 className="type-display max-w-4xl text-[clamp(2.2rem,5vw,4.5rem)]">
            Freedom of body. Made in Kolkata for 25 years.
          </h1>
        </Reveal>
      </section>

      {/* Bands */}
      <section className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        <Reveal>
          <p className="type-spec mb-3 text-umber">The craft</p>
          <h2 className="type-display mb-5 text-2xl md:text-3xl">
            Bottomwear is all we do
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-carbon/80">
            Bornfree specialises in men’s bottomwear — cargos, shorts,
            joggers and Bermudas — built on a deep understanding of the male
            physique and fits tailored for the Indian body. Each garment
            passes more than 25 quality checks before it leaves the line.
          </p>
        </Reveal>
        {imgs[0] && (
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/5] max-w-md overflow-hidden bg-paper">
              <BfImage src={imgs[0].src} alt={imgs[0].alt} fill sizes="(max-width:768px) 100vw, 40vw" className="object-cover" />
            </div>
          </Reveal>
        )}
      </section>

      <section className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        {imgs[1] && (
          <Reveal className="order-2 md:order-1">
            <div className="relative aspect-[4/5] max-w-md overflow-hidden bg-paper md:ml-auto">
              <BfImage src={imgs[1].src} alt={imgs[1].alt} fill sizes="(max-width:768px) 100vw, 40vw" className="object-cover" />
            </div>
          </Reveal>
        )}
        <Reveal delay={0.1} className="order-1 md:order-2">
          <p className="type-spec mb-3 text-umber">The wash</p>
          <h2 className="type-display mb-5 text-2xl md:text-3xl">
            Softness is a process
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-carbon/80">
            Every piece is treated to a special wash process that enhances
            softness and keeps it comfortable through the whole day — with
            state-of-the-art machinery run by a team of skilled professionals.
          </p>
        </Reveal>
      </section>

      {/* Timeline */}
      <section className="border-y border-border-spec bg-paper py-16">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <p className="type-spec mb-8 text-umber">25 years, briefly</p>
          <div className="grid gap-8 md:grid-cols-3">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.06}>
                <p className="font-mono text-2xl text-olive">{t.year}</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-carbon/80">
                  {t.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing props */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
        <p className="type-spec mb-8 text-umber">The standard</p>
        <div className="grid gap-px overflow-hidden border border-border-spec bg-border-spec sm:grid-cols-2 lg:grid-cols-5">
          {qualityProps.map((prop) => (
            <div key={prop.code} className="bg-bone p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-umber">
                / {prop.code}
              </p>
              <p className="mt-3 text-sm font-medium">{prop.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-carbon/70">
                {prop.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-olive py-20 text-center text-bone">
        <Reveal>
          <h2 className="type-display text-2xl md:text-4xl">
            Wear the work
          </h2>
          <Link
            href="/collections/best-seller"
            className="type-spec mt-8 inline-block bg-paper px-10 py-4 text-carbon transition-colors hover:bg-bone"
          >
            Shop best sellers
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
