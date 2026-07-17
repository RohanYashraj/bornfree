"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart, cartSubtotal, cartPermalink } from "@/lib/cart-store";
import { formatRupees } from "@/lib/money";
import { createCheckout } from "@/app/actions/cart";
import BfImage from "@/components/ui/BfImage";

/** Full-page cart fallback — the drawer is the primary surface. */
export default function CartPageView() {
  const { lines, updateQuantity, removeLine } = useCart();
  const [mounted, setMounted] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6 pb-24">
        <p className="type-spec text-khaki">Your cart is empty.</p>
        <Link
          href="/collections/best-seller"
          className="type-spec border border-carbon px-8 py-3 transition-colors hover:bg-carbon hover:text-paper"
        >
          Browse best sellers
        </Link>
      </div>
    );
  }

  const checkout = async () => {
    setCheckingOut(true);
    try {
      const url =
        (await createCheckout(
          lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity }))
        )) ?? cartPermalink(lines);
      window.location.href = url;
    } catch {
      window.location.href = cartPermalink(lines);
    }
  };

  return (
    <div className="pb-24">
      <ul className="divide-y divide-border-spec border-y border-border-spec">
        {lines.map((line) => (
          <li key={line.variantId} className="flex gap-5 py-5">
            <Link
              href={`/products/${line.handle}`}
              className="relative block h-28 w-24 shrink-0 overflow-hidden bg-paper"
            >
              {line.image && (
                <BfImage src={line.image.src} alt={line.image.alt} fill sizes="96px" className="object-cover" />
              )}
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <Link href={`/products/${line.handle}`} className="text-sm font-medium">
                {line.title}
              </Link>
              <p className="mt-0.5 font-mono text-[11px] text-khaki">{line.optionsText}</p>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center border border-border-spec">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    className="h-9 w-9 hover:bg-paper"
                    onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="w-9 text-center font-mono text-sm">{line.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className="h-9 w-9 hover:bg-paper"
                    onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-mono text-sm">
                    {formatRupees(line.price.amount * line.quantity)}
                  </p>
                  <button
                    type="button"
                    aria-label={`Remove ${line.title}`}
                    onClick={() => removeLine(line.variantId)}
                    className="type-spec text-khaki hover:text-signal"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <span className="type-spec">Subtotal</span>
        <span className="font-mono text-lg">{formatRupees(cartSubtotal(lines))}</span>
      </div>
      <p className="mt-1 text-xs text-khaki">
        Shipping &amp; discounts calculated at checkout
      </p>
      <button
        type="button"
        onClick={checkout}
        disabled={checkingOut}
        className="type-spec mt-6 w-full bg-olive py-4 text-paper transition-colors hover:bg-olive-deep disabled:opacity-60"
      >
        {checkingOut ? "Preparing checkout…" : "Checkout"}
      </button>
    </div>
  );
}
