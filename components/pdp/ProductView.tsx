"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Product } from "@/lib/commerce/types";
import { productBadge } from "@/lib/commerce/specs";
import { formatMoney, formatRupees } from "@/lib/money";
import { swatchColor } from "@/lib/colors";
import { useCart, cartPermalink } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { siteConfig } from "@/content/site";
import { createCheckout } from "@/app/actions/cart";
import BfImage from "@/components/ui/BfImage";
import MillSpecPanel from "./MillSpecPanel";
import SizeGuideModal from "./SizeGuideModal";

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = `acc-${title.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="border-b border-border-spec">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="type-spec">{title}</span>
        <span aria-hidden className="font-mono text-lg leading-none">
          {open ? "−" : "+"}
        </span>
      </button>
      <div id={id} hidden={!open} className="pb-5 text-sm leading-relaxed text-carbon/80">
        {children}
      </div>
    </div>
  );
}

export default function ProductView({ product }: { product: Product }) {
  const colorOption = product.options.find(
    (o) => o.name.toLowerCase() === "color" || o.name.toLowerCase() === "colour"
  );
  const sizeOption = product.options.find((o) => o.name.toLowerCase() === "size");
  const colorKey = colorOption?.name.toLowerCase() ?? "color";

  const firstAvailable =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0];

  const [activeColor, setActiveColor] = useState<string | null>(
    firstAvailable?.options[colorKey] ?? colorOption?.values[0] ?? null
  );
  const [activeSize, setActiveSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [atcState, setAtcState] = useState<"idle" | "loading" | "added">("idle");
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const buyPanelRef = useRef<HTMLDivElement>(null);

  const addLine = useCart((s) => s.addLine);
  const wishlisted = useWishlist((s) => s.handles.includes(product.handle));
  const toggleWishlist = useWishlist((s) => s.toggle);

  const badge = productBadge(product);

  // Gallery: put the active colour's variant image first.
  const gallery = useMemo(() => {
    const variantForColor = product.variants.find(
      (v) => activeColor && v.options[colorKey] === activeColor && v.image
    );
    const featured = variantForColor?.image;
    if (!featured) return product.images;
    const rest = product.images.filter((img) => img.src !== featured.src);
    return [featured, ...rest];
  }, [product, activeColor, colorKey]);

  const selectedVariant = useMemo(
    () =>
      product.variants.find(
        (v) =>
          (!colorOption || v.options[colorKey] === activeColor) &&
          (!sizeOption || v.options.size === activeSize)
      ) ?? null,
    [product.variants, activeColor, activeSize, colorOption, sizeOption, colorKey]
  );

  const displayVariant =
    selectedVariant ??
    product.variants.find((v) => !colorOption || v.options[colorKey] === activeColor) ??
    product.variants[0];

  const price = displayVariant?.price ?? product.priceRange.min;
  const compareAt =
    displayVariant?.compareAtPrice &&
    displayVariant.compareAtPrice.amount > price.amount
      ? displayVariant.compareAtPrice
      : null;

  const sizeAvailability = (size: string) =>
    product.variants.some(
      (v) =>
        (!colorOption || v.options[colorKey] === activeColor) &&
        v.options.size === size &&
        v.availableForSale
    );

  // Recently viewed (localStorage)
  useEffect(() => {
    try {
      const key = "bf-recently-viewed";
      const entry = {
        handle: product.handle,
        title: product.title,
        price: product.priceRange.min.amount,
        image: product.images[0]?.src ?? null,
      };
      const prev = JSON.parse(localStorage.getItem(key) ?? "[]") as (typeof entry)[];
      const next = [entry, ...prev.filter((e) => e.handle !== product.handle)].slice(0, 8);
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  }, [product]);

  // Sticky mobile ATC bar
  useEffect(() => {
    const el = buyPanelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Lightbox escape
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const needsSize = Boolean(sizeOption) && !activeSize;

  const addToCart = () => {
    if (!selectedVariant || !selectedVariant.availableForSale) return;
    setAtcState("loading");
    addLine(product, selectedVariant, quantity);
    setTimeout(() => setAtcState("added"), 200);
    setTimeout(() => setAtcState("idle"), 1600);
  };

  const buyNow = async () => {
    if (!selectedVariant || !selectedVariant.availableForSale) return;
    setBuyNowLoading(true);
    const lines = [{ variantId: selectedVariant.id, quantity }];
    try {
      const url =
        (await createCheckout(lines)) ??
        cartPermalink([
          {
            variantId: selectedVariant.id,
            quantity,
            handle: product.handle,
            title: product.title,
            variantTitle: selectedVariant.title,
            optionsText: "",
            image: null,
            price: selectedVariant.price,
          },
        ]);
      window.location.href = url;
    } catch {
      setBuyNowLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
      <nav aria-label="Breadcrumb" className="py-4">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-khaki">
          <li>
            <Link href="/" className="hover:text-carbon">Home</Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/collections/all" className="hover:text-carbon">Shop</Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="line-clamp-1 text-carbon">{product.title}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        {/* Gallery */}
        <div>
          {/* Mobile: snap carousel */}
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 lg:hidden" aria-label="Product images">
            {gallery.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setLightbox(i)}
                className="relative aspect-[4/5] w-[85%] shrink-0 snap-center overflow-hidden bg-paper"
                aria-label={`View image ${i + 1} full screen`}
              >
                <BfImage
                  src={img.src}
                  alt={img.alt || product.title}
                  fill
                  priority={i === 0}
                  sizes="85vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Desktop: stacked images */}
          <div className="hidden gap-2 lg:grid lg:grid-cols-2">
            {gallery.slice(0, 8).map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setLightbox(i)}
                className={`relative overflow-hidden bg-paper ${i === 0 ? "col-span-2 aspect-[4/5]" : "aspect-[4/5]"}`}
                aria-label={`View image ${i + 1} full screen`}
              >
                <BfImage
                  src={img.src}
                  alt={img.alt || product.title}
                  fill
                  priority={i === 0}
                  sizes={i === 0 ? "58vw" : "29vw"}
                  className="object-cover transition-transform duration-500 ease-spec hover:scale-[1.03]"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Buy panel */}
        <div>
          <div ref={buyPanelRef} className="lg:sticky lg:top-24">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl font-semibold leading-snug md:text-2xl">
                {product.title}
              </h1>
              <button
                type="button"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wishlisted}
                onClick={() => toggleWishlist(product.handle)}
                className="mt-1 shrink-0 p-1"
              >
                <svg width="20" height="19" viewBox="0 0 18 17" fill={wishlisted ? "var(--bf-signal)" : "none"} aria-hidden>
                  <path
                    d="M9 16S1 11.2 1 5.6C1 2.9 3 1 5.4 1 7 1 8.3 1.9 9 3.2 9.7 1.9 11 1 12.6 1 15 1 17 2.9 17 5.6 17 11.2 9 16 9 16Z"
                    stroke={wishlisted ? "var(--bf-signal)" : "currentColor"}
                    strokeWidth="1.4"
                  />
                </svg>
              </button>
            </div>

            <p className="mt-2 flex items-center gap-3 font-mono text-lg">
              {compareAt && <s className="text-khaki">{formatMoney(compareAt)}</s>}
              <span className={compareAt ? "text-signal" : ""}>{formatMoney(price)}</span>
              {badge === "sale" && (
                <span className="type-spec bg-signal px-2 py-0.5 text-xs text-paper">Sale</span>
              )}
              {badge === "sold-out" && (
                <span className="type-spec bg-carbon px-2 py-0.5 text-xs text-paper">Sold out</span>
              )}
            </p>

            {/* Colour selector */}
            {colorOption && (
              <fieldset className="mt-6">
                <legend className="type-spec mb-3">
                  Colour · <span className="text-khaki">{activeColor}</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {colorOption.values.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-pressed={activeColor === color}
                      aria-label={`Colour ${color}`}
                      onClick={() => {
                        setActiveColor(color);
                        setActiveSize(null);
                      }}
                      className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-105 ${
                        activeColor === color
                          ? "border-carbon ring-1 ring-carbon ring-offset-2 ring-offset-bone"
                          : "border-carbon/15"
                      }`}
                      style={{ backgroundColor: swatchColor(color) }}
                    />
                  ))}
                </div>
              </fieldset>
            )}

            {/* Size selector */}
            {sizeOption && (
              <fieldset className="mt-6">
                <legend className="mb-3 flex w-full items-center justify-between">
                  <span className="type-spec">Size</span>
                </legend>
                <div className="mb-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="link-spec -mt-9 font-mono text-[11px] uppercase tracking-[0.08em] text-khaki hover:text-carbon"
                  >
                    Size guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizeOption.values.map((size) => {
                    const available = sizeAvailability(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={!available}
                        aria-pressed={activeSize === size}
                        onClick={() => setActiveSize(size)}
                        className={`min-w-16 border px-4 py-2.5 font-mono text-sm transition-colors ${
                          activeSize === size
                            ? "border-carbon bg-carbon text-paper"
                            : available
                              ? "border-border-spec hover:border-carbon"
                              : "cursor-not-allowed border-border-spec text-khaki line-through"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* Quantity + ATC */}
            <div className="mt-6 flex gap-3">
              <div className="flex items-center border border-border-spec">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-12 w-11 hover:bg-paper"
                >
                  −
                </button>
                <span className="w-10 text-center font-mono" aria-live="polite">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-12 w-11 hover:bg-paper"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={addToCart}
                disabled={
                  !product.availableForSale ||
                  needsSize ||
                  (selectedVariant ? !selectedVariant.availableForSale : false) ||
                  atcState !== "idle"
                }
                className="type-spec h-12 flex-1 bg-olive text-paper transition-colors hover:bg-olive-deep disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!product.availableForSale
                  ? "Sold out"
                  : atcState === "added"
                    ? "Added ✓"
                    : atcState === "loading"
                      ? "Adding…"
                      : needsSize
                        ? "Select a size"
                        : "Add to cart"}
              </button>
            </div>
            <button
              type="button"
              onClick={buyNow}
              disabled={!selectedVariant?.availableForSale || buyNowLoading}
              className="type-spec mt-3 h-12 w-full border border-carbon transition-colors hover:bg-carbon hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
            >
              {buyNowLoading ? "Redirecting…" : "Buy now"}
            </button>

            <p className="type-spec mt-4 text-center text-[10px] text-khaki">
              COD available · Free delivery · Easy returns
            </p>

            <div className="mt-6">
              <MillSpecPanel specs={product.specs} />
            </div>

            {/* Accordions */}
            <div className="mt-8">
              <Accordion title="Description" defaultOpen>
                <div
                  className="[&_table]:w-full [&_td]:align-top"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              </Accordion>
              <Accordion title="Fabric & care">
                <p>
                  {product.specs.fabric ?? "100% cotton"}
                  {product.specs.pattern ? ` · ${product.specs.pattern}` : ""}. Special
                  wash-treated for softness. Machine wash cold with like colours,
                  line dry in shade.
                </p>
              </Accordion>
              <Accordion title="Shipping & COD">
                <p>
                  Free and fast delivery across India. Cash on delivery available.
                  Orders ship from our Kolkata facility.
                </p>
              </Accordion>
              <Accordion title="Returns & exchange">
                <p>
                  Easy returns and exchanges.{" "}
                  <a
                    href={siteConfig.returnsPortal}
                    className="underline underline-offset-2"
                    rel="noopener"
                  >
                    Start a return or exchange →
                  </a>
                </p>
              </Accordion>
              <Accordion title="Reviews">
                <p className="text-khaki">
                  Reviews are being migrated from our previous store and will
                  appear here soon.
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/90"
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              aria-label="Close image viewer"
              onClick={() => setLightbox(null)}
              className="absolute right-5 top-5 z-10 p-2 text-paper"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <div className="relative h-[85vh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <BfImage
                src={gallery[lightbox].src}
                alt={gallery[lightbox].alt || product.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() => setLightbox((i) => (i! - 1 + gallery.length) % gallery.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-paper/90 p-3"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() => setLightbox((i) => (i! + 1) % gallery.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-paper/90 p-3"
                  >
                    →
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      {/* Sticky mobile ATC */}
      <AnimatePresence>
        {stickyVisible && product.availableForSale && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border-spec bg-paper px-4 py-3 lg:hidden"
          >
            {product.images[0] && (
              <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-bone">
                <BfImage src={product.images[0].src} alt="" fill sizes="40px" className="object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{product.title}</p>
              <p className="font-mono text-sm">{formatMoney(price)}</p>
            </div>
            <button
              type="button"
              onClick={addToCart}
              disabled={needsSize || atcState !== "idle"}
              className="type-spec shrink-0 bg-olive px-5 py-3 text-paper disabled:opacity-50"
            >
              {needsSize ? "Select size" : atcState === "added" ? "Added ✓" : "Add"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
