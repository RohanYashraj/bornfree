import Link from "next/link";
import { categoryTiles } from "@/content/site";
import { commerce } from "@/lib/commerce";
import BfImage from "@/components/ui/BfImage";
import Reveal from "@/components/ui/Reveal";

export default async function CategoryRail() {
  const tiles = await Promise.all(
    categoryTiles.map(async (tile) => {
      const [collection, products] = await Promise.all([
        commerce.getCollection(tile.handle),
        commerce.getCollectionProducts(tile.handle, 3),
      ]);
      const image =
        collection?.image ??
        products.find((p) => p.images[0])?.images[0] ??
        null;
      return { ...tile, image };
    })
  );

  return (
    <section className="py-14">
      <Reveal className="mx-auto max-w-[1440px] px-4 md:px-8">
        <p className="type-spec mb-2 text-umber">The line</p>
        <h2 className="type-display mb-6 text-2xl md:text-4xl">
          Shop by category
        </h2>
      </Reveal>
      <div className="no-scrollbar mx-auto grid max-w-[1440px] auto-cols-[42%] grid-flow-col gap-3 overflow-x-auto px-4 sm:auto-cols-[30%] md:grid-flow-row md:grid-cols-4 md:px-8 [scroll-snap-type:x_mandatory]">
        {tiles.map((tile) => (
          <Link
            key={tile.handle}
            href={`/collections/${tile.handle}`}
            className="group snap-start"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-paper">
              {tile.image && (
                <BfImage
                  src={tile.image.src}
                  alt={`${tile.label} collection`}
                  fill
                  sizes="(max-width: 768px) 42vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-spec group-hover:scale-105"
                />
              )}
            </div>
            <p className="type-spec link-spec mt-3 inline-block">{tile.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
