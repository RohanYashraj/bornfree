import Image from "next/image";
import Link from "next/link";
import { segmentTiles } from "@/content/site";
import Reveal from "@/components/ui/Reveal";

/**
 * Poster rail — pre-composed campaign cards, one per wearing occasion.
 * The copy is baked into the artwork, so the card stays chrome-free; the
 * mono caption row underneath carries the Mill Spec batch code + link.
 */
export default function SegmentRail() {
  return (
    <section aria-label="Shop by occasion" className="py-14">
      <Reveal className="mx-auto max-w-[1440px] px-4 md:px-8">
        <p className="type-spec mb-2 text-umber">Where it&apos;s worn</p>
        <h2 className="type-display mb-6 text-2xl md:text-4xl">
          Match the mood
        </h2>
      </Reveal>
      <div className="no-scrollbar mx-auto flex max-w-[1440px] snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:px-8">
        {segmentTiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="group w-[78%] shrink-0 snap-start sm:w-[45%] md:w-[31%] lg:w-[27%]"
          >
            <div className="relative aspect-[2/3] overflow-hidden bg-paper">
              <Image
                src={tile.image}
                alt={tile.alt}
                fill
                sizes="(max-width: 768px) 78vw, 27vw"
                className="object-cover transition-transform duration-500 ease-spec group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="type-spec text-umber">{tile.code}</span>
              <span className="type-spec link-spec">{tile.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
