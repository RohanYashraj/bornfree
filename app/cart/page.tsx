import type { Metadata } from "next";
import CartPageView from "@/components/cart/CartPageView";

export const metadata: Metadata = {
  title: "Cart",
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8">
      <p className="type-spec mb-3 text-khaki">Your selection</p>
      <h1 className="type-display mb-10 text-3xl md:text-5xl">Cart</h1>
      <CartPageView />
    </div>
  );
}
