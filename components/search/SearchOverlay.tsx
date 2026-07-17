"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { popularSearches } from "@/content/site";
import { formatRupees } from "@/lib/money";
import BfImage from "@/components/ui/BfImage";

export type SearchHit = {
  handle: string;
  title: string;
  price: number;
  image: string | null;
  available: boolean;
};

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Debounced predictive search
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    const t = setTimeout(async () => {
      if (q.length < 2) {
        setHits([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setHits(data.products ?? []);
      } catch {
        setHits([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query, open]);

  const submit = () => {
    const q = query.trim();
    if (!q) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-carbon/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-0 max-h-[85vh] overflow-y-auto bg-paper"
          >
            <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
              <div className="flex items-center gap-4 border-b border-carbon pb-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="shrink-0">
                  <circle cx="8" cy="8" r="6.3" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M12.7 12.7L17 17" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Search cargos, shorts, joggers…"
                  aria-label="Search products"
                  className="w-full bg-transparent text-lg outline-none placeholder:text-umber"
                />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="type-spec shrink-0 text-umber hover:text-carbon"
                >
                  Esc
                </button>
              </div>

              {query.trim().length < 2 ? (
                <div className="py-8">
                  <p className="type-spec mb-4 text-umber">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQuery(s)}
                        className="type-spec rounded-spec border border-border-spec px-4 py-2 hover:border-olive hover:text-olive"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-6">
                  {loading && hits.length === 0 && (
                    <p className="type-spec py-4 text-umber">Searching…</p>
                  )}
                  {!loading && hits.length === 0 && (
                    <p className="py-4 text-sm text-umber">
                      Nothing found for “{query}”. Try “cargo” or “shorts”.
                    </p>
                  )}
                  <ul className="divide-y divide-border-spec">
                    {hits.map((h) => (
                      <li key={h.handle}>
                        <Link
                          href={`/products/${h.handle}`}
                          onClick={onClose}
                          className="flex items-center gap-4 py-3 hover:bg-bone"
                        >
                          {h.image && (
                            <div className="relative h-16 w-13 shrink-0 overflow-hidden bg-bone" style={{ width: 52 }}>
                              <BfImage src={h.image} alt={h.title} fill sizes="52px" className="object-cover" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{h.title}</p>
                            <p className="font-mono text-xs text-olive">{formatRupees(h.price)}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {hits.length > 0 && (
                    <button
                      type="button"
                      onClick={submit}
                      className="type-spec mt-4 w-full border border-carbon py-3 transition-colors hover:bg-carbon hover:text-paper"
                    >
                      View all results
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
