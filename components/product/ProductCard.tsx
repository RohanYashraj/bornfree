"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { productBadge, specStrip } from "@/lib/commerce/specs";
import { formatMoney } from "@/lib/money";
import { swatchColor } from "@/lib/colors";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import BfImage from "@/components/ui/BfImage";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const colorOption = product.options.find(
    (o) => o.name.toLowerCase() === "color" || o.name.toLowerCase() === "colour"
  );
  const sizeOption = product.options.find((o) => o.name.toLowerCase() === "size");
  const colorKey = colorOption?.name.toLowerCase() ?? "color";

  const defaultColor = useMemo(() => {
    if (!colorOption) return null;
    const availableColor = colorOption.values.find((c) =>
      product.variants.some((v) => v.options[colorKey] === c && v.availableForSale)
    );
    return availableColor ?? colorOption.values[0] ?? null;
  }, [colorOption, colorKey, product.variants]);

  const [activeColor, setActiveColor] = useState<string | null>(defaultColor);
  const [quickAdd, setQuickAdd] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const addLine = useCart((s) => s.addLine);
  const wishlisted = useWishlist((s) => s.handles.includes(product.handle));
  const toggleWishlist = useWishlist((s) => s.toggle);

  const activeVariant = useMemo(
    () =>
      product.variants.find(
        (v) => !activeColor || v.options[colorKey] === activeColor
      ) ?? product.variants[0],
    [product.variants, activeColor, colorKey]
  );

  const badge = productBadge(product);
  const strip = specStrip(product.specs);

  // Primary image follows the active colour; hover shows the next frame.
  const primaryIndex = useMemo(() => {
    const src = activeVariant?.image?.src;
    if (!src) return 0;
    const i = product.images.findIndex((img) => img.src === src);
    return i >= 0 ? i : 0;
  }, [activeVariant, product.images]);
  const primary = product.images[primaryIndex];
  const secondary = product.images[primaryIndex + 1] ?? null;

  const price = activeVariant?.price ?? product.priceRange.min;
  const compareAt =
    activeVariant?.compareAtPrice &&
    activeVariant.compareAtPrice.amount > price.amount
      ? activeVariant.compareAtPrice
      : null;

  const sizesForColor = (sizeOption?.values ?? []).map((size) => {
    const variant = product.variants.find(
      (v) =>
        (!activeColor || v.options[colorKey] === activeColor) &&
        v.options.size === size
    );
    return { size, variant, available: Boolean(variant?.availableForSale) };
  });

  const quickAddVariant = (size: string) => {
    const entry = sizesForColor.find((s) => s.size === size);
    if (!entry?.variant || !entry.available) return;
    addLine(product, entry.variant);
    setAdded(size);
    setTimeout(() => {
      setAdded(null);
      setQuickAdd(false);
    }, 900);
  };

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper">
        <Link
          href={`/products/${product.handle}`}
          aria-label={product.title}
          className="absolute inset-0"
        >
          {primary && (
            <BfImage
              src={primary.src}
              alt={`${product.title}${activeColor ? ` in ${activeColor}` : ""}`}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-opacity duration-300 group-hover:opacity-0"
            />
          )}
          {secondary && (
            <BfImage
              src={secondary.src}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Badges (§1.4 logic only) */}
        {badge && (
          <span
            className={`type-spec absolute left-2 top-2 px-2 py-1 text-paper ${
              badge === "sale" ? "bg-signal" : "bg-carbon"
            }`}
          >
            {badge === "sale" ? "Sale" : "Sold out"}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={() => toggleWishlist(product.handle)}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-paper/80 transition-colors hover:bg-paper"
        >
          <svg width="15" height="14" viewBox="0 0 18 17" fill={wishlisted ? "var(--bf-signal)" : "none"} aria-hidden>
            <path
              d="M9 16S1 11.2 1 5.6C1 2.9 3 1 5.4 1 7 1 8.3 1.9 9 3.2 9.7 1.9 11 1 12.6 1 15 1 17 2.9 17 5.6 17 11.2 9 16 9 16Z"
              stroke={wishlisted ? "var(--bf-signal)" : "currentColor"}
              strokeWidth="1.4"
            />
          </svg>
        </button>

        {/* Hover reveal: spec strip + quick add */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 ease-spec group-focus-within:translate-y-0 group-hover:translate-y-0">
          {!quickAdd ? (
            <div className="pointer-events-auto">
              {strip && (
                <p className="type-spec truncate border-t border-border-spec bg-paper/95 px-3 py-2 text-[10px]">
                  {strip}
                </p>
              )}
              {product.availableForSale && sizesForColor.length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuickAdd(true)}
                  className="type-spec w-full bg-carbon py-2.5 text-paper transition-colors hover:bg-olive"
                >
                  Quick add
                </button>
              )}
            </div>
          ) : (
            <div className="pointer-events-auto bg-paper/95 p-2">
              <div className="mb-1 flex items-center justify-between px-1">
                <span className="type-spec text-[10px] text-khaki">Select size</span>
                <button
                  type="button"
                  aria-label="Close size selector"
                  onClick={() => setQuickAdd(false)}
                  className="type-spec text-[10px] hover:text-signal"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {sizesForColor.map(({ size, available }) => (
                  <button
                    key={size}
                    type="button"
                    disabled={!available}
                    onClick={() => quickAddVariant(size)}
                    className={`min-w-11 flex-1 border px-1 py-1.5 font-mono text-[11px] transition-colors ${
                      added === size
                        ? "border-olive bg-olive text-paper"
                        : available
                          ? "border-border-spec hover:border-carbon"
                          : "cursor-not-allowed border-border-spec text-khaki line-through"
                    }`}
                  >
                    {added === size ? "✓" : size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 pt-3">
        <Link
          href={`/products/${product.handle}`}
          className="line-clamp-2 text-sm font-medium leading-snug"
        >
          {product.title}
        </Link>
        <p className="font-mono text-sm">
          {compareAt && (
            <s className="mr-2 text-khaki">{formatMoney(compareAt)}</s>
          )}
          <span className={compareAt ? "text-signal" : ""}>{formatMoney(price)}</span>
        </p>
        {colorOption && colorOption.values.length > 1 && (
          <div className="mt-1 flex items-center gap-1.5">
            {colorOption.values.slice(0, 5).map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Colour ${color}`}
                aria-pressed={activeColor === color}
                onClick={() => setActiveColor(color)}
                className={`h-3.5 w-3.5 rounded-full border transition-transform hover:scale-110 ${
                  activeColor === color
                    ? "border-carbon ring-1 ring-carbon ring-offset-1 ring-offset-bone"
                    : "border-carbon/20"
                }`}
                style={{ backgroundColor: swatchColor(color) }}
              />
            ))}
            {colorOption.values.length > 5 && (
              <span className="font-mono text-[10px] text-khaki">
                +{colorOption.values.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
