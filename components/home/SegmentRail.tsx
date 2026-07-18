import Image from "next/image";
import Link from "next/link";
import { segmentTiles } from "@/content/site";
import Reveal from "@/components/ui/Reveal";

/**
 * Poster marquee — pre-composed campaign cards drifting past like a banner.
 * The campaign copy is baked into the artwork; the Mill Spec batch code +
 * collection link sit on a bottom scrim inside each poster. The track holds
 * two copies of the list so the -50% translate loops seamlessly; it pauses
 * on hover/focus, and under reduced motion the global override freezes the
 * animation while the rail falls back to manual swipe.
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
      <div className="group/rail no-scrollbar overflow-hidden motion-reduce:overflow-x-auto">
        <div className="flex w-max animate-marquee group-focus-within/rail:[animation-play-state:paused] group-hover/rail:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1 || undefined}
              className={`flex gap-4 pr-4 pl-0 ${copy === 1 ? "motion-reduce:hidden" : ""}`}
            >
              {segmentTiles.map((tile) => (
                <Link
                  key={tile.href}
                  href={tile.href}
                  tabIndex={copy === 1 ? -1 : undefined}
                  className="group relative block w-[280px] shrink-0 overflow-hidden bg-paper md:w-[340px]"
                >
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={tile.image}
                      alt={copy === 0 ? tile.alt : ""}
                      fill
                      sizes="340px"
                      className="object-cover transition-transform duration-500 ease-spec group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon/75 via-carbon/30 to-transparent pt-16">
                    <div className="flex items-baseline justify-between px-4 pb-3.5">
                      <span className="type-spec text-bone/70">{tile.code}</span>
                      <span className="type-spec text-bone">
                        {tile.label}{" "}
                        <span
                          aria-hidden
                          className="inline-block transition-transform duration-300 ease-spec group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
