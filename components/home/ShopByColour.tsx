import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { colorFamilies } from "@/lib/colors";
import Reveal from "@/components/ui/Reveal";

/**
 * Data-driven colour families: groups every product colour option into
 * families at build/revalidate time and links to pre-filtered PLPs.
 */
export default async function ShopByColour() {
  const products = await commerce.getAllProducts(250);

  const families = colorFamilies
    .map((family) => {
      const matching = new Set<string>();
      let count = 0;
      for (const p of products) {
        const colors = new Set(
          p.variants
            .map((v) => v.options.color ?? v.options.colour)
            .filter((c): c is string => Boolean(c))
        );
        const hits = [...colors].filter((c) => family.match(c));
        if (hits.length > 0) {
          count++;
          hits.forEach((h) => matching.add(h));
        }
      }
      return { ...family, count, values: [...matching] };
    })
    .filter((f) => f.count > 2);

  if (families.length === 0) return null;

  return (
    <section className="py-14">
      <Reveal className="mx-auto max-w-[1440px] px-4 md:px-8">
        <p className="type-spec mb-2 text-umber">The palette</p>
        <h2 className="type-display mb-6 text-2xl md:text-4xl">
          Shop by colour
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {families.map((family) => (
            <Link
              key={family.name}
              href={`/collections/all?color=${encodeURIComponent(family.values.join(","))}`}
              className="group border border-border-spec bg-paper p-4 transition-colors hover:border-carbon"
            >
              <span
                aria-hidden
                className="block h-16 w-full transition-transform duration-300 ease-spec group-hover:scale-[1.03]"
                style={{ backgroundColor: family.swatch }}
              />
              <p className="type-spec mt-3">{family.name}</p>
              <p className="font-mono text-[10px] text-umber">
                {family.count} styles
              </p>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
