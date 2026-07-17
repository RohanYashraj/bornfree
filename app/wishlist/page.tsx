import type { Metadata } from "next";
import WishlistView from "@/components/wishlist/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
  alternates: { canonical: "/wishlist" },
};

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-8">
      <p className="type-spec mb-3 text-umber">Saved for later</p>
      <h1 className="type-display mb-10 text-3xl md:text-5xl">Wishlist</h1>
      <WishlistView />
    </div>
  );
}
