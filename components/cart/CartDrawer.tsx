"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCart, cartSubtotal, cartPermalink } from "@/lib/cart-store";
import { formatRupees } from "@/lib/money";
import { offers } from "@/content/site";
import BfImage from "@/components/ui/BfImage";
import { createCheckout } from "@/app/actions/cart";
import type { CartLine } from "@/lib/commerce/types";

export type CrossSellItem = {
  handle: string;
  title: string;
  price: number;
  image: string | null;
};

function OfferProgress({ lines }: { lines: CartLine[] }) {
  const subtotal = cartSubtotal(lines);
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
  const { threshold, discount } = offers.above2500;
  const away = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, (subtotal / threshold) * 100);

  return (
    <div className="border-b border-border-spec bg-bone px-5 py-4">
      <p className="type-spec mb-2">
        {away > 0
          ? `You're ${formatRupees(away)} away from ${formatRupees(discount)} off`
          : `${formatRupees(discount)} off unlocked — applied at checkout`}
      </p>
      <div
        className="h-1 w-full bg-khaki/30"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress toward ${formatRupees(discount)} off above ${formatRupees(threshold)}`}
      >
        <div
          className="h-full bg-olive transition-[width] duration-500 ease-spec"
          style={{ width: `${pct}%` }}
        />
      </div>
      {itemCount === 1 && (
        <p className="mt-2 font-mono text-[11px] text-olive">
          Add one more item — {offers.buyTwo.message.toLowerCase()}
        </p>
      )}
    </div>
  );
}

export default function CartDrawer({
  crossSell = [],
}: {
  crossSell?: CrossSellItem[];
}) {
  const { lines, isOpen, closeCart, updateQuantity, removeLine } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const subtotal = cartSubtotal(lines);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  const checkout = async () => {
    if (lines.length === 0 || checkingOut) return;
    setCheckingOut(true);
    try {
      // Mode A: real Shopify cart via Storefront API; Mode B: cart permalink.
      const url =
        (await createCheckout(
          lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity }))
        )) ?? cartPermalink(lines);
      window.location.href = url;
    } catch {
      window.location.href = cartPermalink(lines);
    }
  };

  const inCart = new Set(lines.map((l) => l.handle));
  const suggestions = crossSell.filter((c) => !inCart.has(c.handle)).slice(0, 2);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Cart">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-carbon/40"
            onClick={closeCart}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={reduced ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-paper shadow-[-24px_0_48px_-24px_rgba(26,26,22,0.3)]"
          >
            <div className="flex h-14 items-center justify-between border-b border-border-spec px-5">
              <h2 className="type-spec">
                Cart{lines.length > 0 && ` · ${lines.reduce((n, l) => n + l.quantity, 0)}`}
              </h2>
              <button
                type="button"
                aria-label="Close cart"
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center hover:opacity-70"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
                <p className="type-spec text-khaki">Your cart is empty</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Best Sellers", href: "/collections/best-seller" },
                    { label: "Cargo Pants", href: "/collections/cargo-pants" },
                    { label: "New Launch", href: "/collections/new-launch" },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={closeCart}
                      className="type-spec border border-carbon px-8 py-3 transition-colors hover:bg-carbon hover:text-paper"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <OfferProgress lines={lines} />

                <ul className="flex-1 divide-y divide-border-spec overflow-y-auto px-5">
                  {lines.map((line) => (
                    <li key={line.variantId} className="flex gap-4 py-4">
                      <Link
                        href={`/products/${line.handle}`}
                        onClick={closeCart}
                        className="relative block h-24 w-20 shrink-0 overflow-hidden bg-bone"
                      >
                        {line.image && (
                          <BfImage
                            src={line.image.src}
                            alt={line.image.alt}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/products/${line.handle}`}
                            onClick={closeCart}
                            className="line-clamp-2 text-sm font-medium"
                          >
                            {line.title}
                          </Link>
                          <button
                            type="button"
                            aria-label={`Remove ${line.title}`}
                            onClick={() => removeLine(line.variantId)}
                            className="shrink-0 p-1 text-khaki hover:text-signal"
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.2" />
                            </svg>
                          </button>
                        </div>
                        <p className="mt-0.5 font-mono text-[11px] text-khaki">
                          {line.optionsText}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center border border-border-spec">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              className="h-8 w-8 hover:bg-bone"
                              onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-mono text-sm" aria-live="polite">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              className="h-8 w-8 hover:bg-bone"
                              onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <p className="font-mono text-sm">
                            {formatRupees(line.price.amount * line.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {suggestions.length > 0 && (
                  <div className="border-t border-border-spec px-5 py-3">
                    <p className="type-spec mb-2 text-khaki">Complete the fit</p>
                    <div className="grid grid-cols-2 gap-3">
                      {suggestions.map((s) => (
                        <Link
                          key={s.handle}
                          href={`/products/${s.handle}`}
                          onClick={closeCart}
                          className="flex items-center gap-2"
                        >
                          {s.image && (
                            <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-bone">
                              <BfImage src={s.image} alt={s.title} fill sizes="44px" className="object-cover" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-xs">{s.title}</p>
                            <p className="font-mono text-[11px] text-olive">
                              {formatRupees(s.price)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-border-spec px-5 py-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="type-spec">Subtotal</span>
                    <span className="font-mono text-base">{formatRupees(subtotal)}</span>
                  </div>
                  <p className="mb-4 text-xs text-khaki">
                    Shipping &amp; discounts calculated at checkout
                  </p>
                  <button
                    type="button"
                    onClick={checkout}
                    disabled={checkingOut}
                    className="type-spec w-full bg-olive py-4 text-paper transition-colors hover:bg-olive-deep disabled:opacity-60"
                  >
                    {checkingOut ? "Preparing checkout…" : "Checkout"}
                  </button>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="link-spec mx-auto mt-3 block text-center text-xs"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
