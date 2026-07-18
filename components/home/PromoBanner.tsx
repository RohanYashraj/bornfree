import Link from "next/link";
import { promoBanner } from "@/content/site";
import BfImage from "@/components/ui/BfImage";

/**
 * Full-bleed editorial banner between the home rails — a single lifestyle
 * frame with Archivo split headline, batch code, and CTA over a scrim.
 */
export default function PromoBanner() {
  const { eyebrow, headline, cta, image, alt, code } = promoBanner;
  return (
    <section className="py-14">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <Link
          href={cta.href}
          className="group relative block aspect-[16/10] overflow-hidden rounded-spec bg-carbon sm:aspect-[21/9]"
        >
          <BfImage
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 1440px) 100vw, 1376px"
            className="object-cover transition-transform duration-700 ease-spec group-hover:scale-105"
          />
          {/* Legibility scrim — darker toward the type side */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-carbon/80 via-carbon/40 to-transparent"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-bone md:justify-center md:p-14">
            <p className="type-spec mb-3 text-bone/70">{eyebrow}</p>
            <h2 className="type-display max-w-xl text-3xl leading-[0.95] md:text-6xl">
              {headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <span className="type-spec mt-6 inline-flex w-fit items-center gap-2 border border-bone/50 px-5 py-2.5 transition-colors duration-200 ease-spec group-hover:bg-bone group-hover:text-carbon">
              {cta.label}
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
                <path
                  d="M9 1l4 4-4 4M13 5H1"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            </span>
          </div>
          <span className="type-spec absolute right-4 top-4 text-bone/60 md:right-6 md:top-6">
            {code}
          </span>
        </Link>
      </div>
    </section>
  );
}
