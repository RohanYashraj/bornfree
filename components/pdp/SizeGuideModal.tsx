"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

/** Bottomwear size chart matching Bornfree's dual-size labels. */
const SIZES = [
  { label: "30-31", waist: "30–31 in", hip: "38–39 in" },
  { label: "32-33", waist: "32–33 in", hip: "40–41 in" },
  { label: "34-35", waist: "34–35 in", hip: "42–43 in" },
  { label: "36-37", waist: "36–37 in", hip: "44–45 in" },
  { label: "38-39", waist: "38–39 in", hip: "46–47 in" },
];

export default function SizeGuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    ref.current?.focus();
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Size guide">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-carbon/40"
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-paper p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="type-spec">Size guide — bottomwear</h2>
              <button
                type="button"
                aria-label="Close size guide"
                onClick={onClose}
                className="p-1 hover:opacity-70"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </button>
            </div>
            <table className="w-full border border-border-spec font-mono text-xs">
              <thead>
                <tr className="border-b border-border-spec bg-bone text-left">
                  <th className="px-3 py-2 font-medium uppercase tracking-[0.08em]">Size</th>
                  <th className="px-3 py-2 font-medium uppercase tracking-[0.08em]">Waist</th>
                  <th className="px-3 py-2 font-medium uppercase tracking-[0.08em]">Hip</th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map((s) => (
                  <tr key={s.label} className="border-b border-border-spec last:border-0">
                    <td className="px-3 py-2">{s.label}</td>
                    <td className="px-3 py-2">{s.waist}</td>
                    <td className="px-3 py-2">{s.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-khaki">
              Elasticated waistbands flex about an inch either way. Between sizes?
              Take the smaller one.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
