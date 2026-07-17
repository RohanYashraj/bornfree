import Link from "next/link";
import { occasionTiles } from "@/content/site";
import { commerce } from "@/lib/commerce";
import BfImage from "@/components/ui/BfImage";
import Reveal from "@/components/ui/Reveal";

export default async function OccasionGrid() {
  const tiles = await Promise.all(
    occasionTiles.map(async (tile) => {
      const products = await commerce.getCollectionProducts(tile.handle, 3);
      // Prefer a lifestyle (2nd) frame where one exists.
      const withImages = products.find((p) => p.images.length > 0);
      const image = withImages?.images[1] ?? withImages?.images[0] ?? null;
      return { ...tile, image, count: products.length };
    })
  );

  return (
    <section className="py-14">
      <Reveal className="mx-auto max-w-[1440px] px-4 md:px-8">
        <p className="type-spec mb-2 text-khaki">Where it goes</p>
        <h2 className="type-display mb-6 text-2xl md:text-4xl">
          Shop by occasion
        </h2>
      </Reveal>
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-3 px-4 md:px-8 lg:grid-cols-3">
        {tiles
          .filter((t) => t.image)
          .map((tile, i) => (
            <Link
              key={tile.handle}
              href={`/collections/${tile.handle}`}
              className={`group relative overflow-hidden bg-paper ${
                i % 5 === 0 ? "row-span-2 aspect-[3/4.5]" : "aspect-[4/3]"
              }`}
            >
              <BfImage
                src={tile.image!.src}
                alt={`${tile.label} collection`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-spec group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon/50 to-transparent" />
              <span className="type-spec link-spec absolute bottom-4 left-4 text-paper">
                {tile.label}
              </span>
            </Link>
          ))}
      </div>
    </section>
  );
}
