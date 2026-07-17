"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { FilterOptions } from "@/lib/filtering";
import { swatchColor } from "@/lib/colors";
import { formatRupees } from "@/lib/money";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
];

export default function Toolbar({
  options,
  resultCount,
  onDensity,
  density,
}: {
  options: FilterOptions;
  resultCount: number;
  density: 2 | 4;
  onDensity: (d: 2 | 4) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const activeColors = params.get("color")?.split(",").filter(Boolean) ?? [];
  const activeSizes = params.get("size")?.split(",").filter(Boolean) ?? [];
  const activeCount =
    activeColors.length +
    activeSizes.length +
    (params.get("min") ? 1 : 0) +
    (params.get("max") ? 1 : 0) +
    (params.get("instock") === "1" ? 1 : 0);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
    next.delete("n"); // reset pagination on any filter change
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const toggleListParam = (key: string, value: string) => {
    const current = params.get(key)?.split(",").filter(Boolean) ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setParam(key, next.length ? next.join(",") : null);
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="sticky top-16 z-30 -mx-4 flex items-center justify-between border-b border-border-spec bg-bone/95 px-4 py-3 backdrop-blur-sm md:-mx-8 md:px-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="type-spec flex items-center gap-2 border border-border-spec bg-paper px-4 py-2 hover:border-carbon"
        >
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden>
            <path d="M0 2h14M2 6h10M4 10h6" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          Filter{activeCount > 0 && ` (${activeCount})`}
        </button>

        <p className="type-spec hidden text-umber sm:block" aria-live="polite">
          {resultCount} {resultCount === 1 ? "product" : "products"}
        </p>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 md:flex" role="group" aria-label="Grid density">
            <button
              type="button"
              aria-label="2 columns"
              aria-pressed={density === 2}
              onClick={() => onDensity(2)}
              className={`p-2 font-mono text-xs ${density === 2 ? "text-carbon" : "text-umber"}`}
            >
              ▮▮
            </button>
            <button
              type="button"
              aria-label="4 columns"
              aria-pressed={density === 4}
              onClick={() => onDensity(4)}
              className={`p-2 font-mono text-xs ${density === 4 ? "text-carbon" : "text-umber"}`}
            >
              ▮▮▮▮
            </button>
          </div>
          <label className="type-spec flex items-center gap-2">
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select
              value={params.get("sort") ?? "featured"}
              onChange={(e) =>
                setParam("sort", e.target.value === "featured" ? null : e.target.value)
              }
              className="border border-border-spec bg-paper px-2 py-2 font-mono text-[11px] uppercase tracking-[0.08em]"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Filter slide-over */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Filters">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-carbon/40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              initial={reduced ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduced ? { opacity: 0 } : { x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-paper"
            >
              <div className="flex h-14 items-center justify-between border-b border-border-spec px-5">
                <h2 className="type-spec">Filter</h2>
                <button
                  type="button"
                  aria-label="Close filters"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center hover:opacity-70"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 space-y-8 px-5 py-6">
                {options.colors.length > 0 && (
                  <fieldset>
                    <legend className="type-spec mb-3 text-umber">Colour</legend>
                    <div className="flex flex-wrap gap-2">
                      {options.colors.map((color) => {
                        const active = activeColors.includes(color);
                        return (
                          <button
                            key={color}
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggleListParam("color", color)}
                            className={`flex items-center gap-2 border px-3 py-1.5 text-xs transition-colors ${
                              active ? "border-carbon bg-carbon text-paper" : "border-border-spec hover:border-carbon"
                            }`}
                          >
                            <span
                              aria-hidden
                              className="h-3 w-3 rounded-full border border-carbon/20"
                              style={{ backgroundColor: swatchColor(color) }}
                            />
                            {color}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                {options.sizes.length > 0 && (
                  <fieldset>
                    <legend className="type-spec mb-3 text-umber">Size</legend>
                    <div className="flex flex-wrap gap-2">
                      {options.sizes.map((size) => {
                        const active = activeSizes.includes(size);
                        return (
                          <button
                            key={size}
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggleListParam("size", size)}
                            className={`border px-3 py-1.5 font-mono text-xs transition-colors ${
                              active ? "border-carbon bg-carbon text-paper" : "border-border-spec hover:border-carbon"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                <fieldset>
                  <legend className="type-spec mb-3 text-umber">
                    Price ({formatRupees(options.priceMin)}–{formatRupees(options.priceMax)})
                  </legend>
                  <div className="flex items-center gap-3">
                    <label className="flex-1">
                      <span className="sr-only">Minimum price</span>
                      <input
                        type="number"
                        placeholder="Min"
                        defaultValue={params.get("min") ?? ""}
                        onBlur={(e) => setParam("min", e.target.value || null)}
                        className="w-full border border-border-spec bg-transparent px-3 py-2 font-mono text-sm"
                      />
                    </label>
                    <span aria-hidden className="text-umber">—</span>
                    <label className="flex-1">
                      <span className="sr-only">Maximum price</span>
                      <input
                        type="number"
                        placeholder="Max"
                        defaultValue={params.get("max") ?? ""}
                        onBlur={(e) => setParam("max", e.target.value || null)}
                        className="w-full border border-border-spec bg-transparent px-3 py-2 font-mono text-sm"
                      />
                    </label>
                  </div>
                </fieldset>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={params.get("instock") === "1"}
                    onChange={(e) => setParam("instock", e.target.checked ? "1" : null)}
                    className="h-4 w-4 accent-olive"
                  />
                  <span className="text-sm">In stock only</span>
                </label>
              </div>

              <div className="flex gap-3 border-t border-border-spec px-5 py-4">
                <button
                  type="button"
                  onClick={() => router.replace(pathname, { scroll: false })}
                  className="type-spec flex-1 border border-carbon py-3 hover:bg-bone"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="type-spec flex-1 bg-olive py-3 text-paper hover:bg-olive-deep"
                >
                  Show {resultCount}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
