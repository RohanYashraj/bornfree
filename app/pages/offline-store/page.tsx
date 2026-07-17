import type { Metadata } from "next";
import { offlineStores, storeHours, storePhone } from "@/content/site";

export const metadata: Metadata = {
  title: "Offline Stores",
  description:
    "Visit a Bornfree store in West Bengal — Bansberia, Mogra, Bandel, Raniganj and Krishnanagar. Open every day, 11 AM – 7 PM.",
  alternates: { canonical: "/pages/offline-store" },
};

export default function OfflineStorePage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-8">
      <p className="type-spec mb-3 text-khaki">Visit us</p>
      <h1 className="type-display mb-4 text-3xl md:text-5xl">Offline stores</h1>
      <p className="mb-10 max-w-md text-sm text-carbon/80">
        Five stores across West Bengal, open for shopping and exchanges.{" "}
        {storeHours}.
      </p>

      <div className="grid gap-px overflow-hidden border border-border-spec bg-border-spec md:grid-cols-2 lg:grid-cols-3">
        {offlineStores.map((store, i) => (
          <div key={store.name} className="flex flex-col bg-paper p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-khaki">
              / {String(i + 1).padStart(2, "0")}
            </p>
            <h2 className="type-spec mt-3 text-sm">{store.name}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-carbon/80">
              {store.address}
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-border-spec pt-4">
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(`Bornfree ${store.address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-spec type-spec"
              >
                Get directions
              </a>
              <a
                href={`tel:${storePhone.replace(/\s/g, "")}`}
                className="font-mono text-xs text-olive"
              >
                {storePhone}
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="type-spec mt-8 text-khaki">
        Open {storeHours.toLowerCase()} · Text an ambassador at {storePhone}
      </p>
    </div>
  );
}
