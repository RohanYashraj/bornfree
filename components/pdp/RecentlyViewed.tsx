"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatRupees } from "@/lib/money";
import BfImage from "@/components/ui/BfImage";

type Entry = {
  handle: string;
  title: string;
  price: number;
  image: string | null;
};

export default function RecentlyViewed({ exclude }: { exclude?: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    try {
      const all = JSON.parse(
        localStorage.getItem("bf-recently-viewed") ?? "[]"
      ) as Entry[];
      setEntries(all.filter((e) => e.handle !== exclude).slice(0, 6));
    } catch {}
  }, [exclude]);

  if (entries.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 md:px-8">
      <p className="type-spec mb-6 text-khaki">Recently viewed</p>
      <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto">
        {entries.map((e) => (
          <Link
            key={e.handle}
            href={`/products/${e.handle}`}
            className="w-36 shrink-0 snap-start"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-paper">
              {e.image && (
                <BfImage src={e.image} alt={e.title} fill sizes="144px" className="object-cover" />
              )}
            </div>
            <p className="mt-2 line-clamp-1 text-xs">{e.title}</p>
            <p className="font-mono text-xs text-olive">{formatRupees(e.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
