"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { announcements } from "@/content/site";

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % announcements.length),
      5000
    );
    return () => clearInterval(t);
  }, [reduced]);

  if (dismissed) return null;

  return (
    <div
      className="relative z-50 flex h-9 items-center justify-center bg-carbon text-bone"
      role="region"
      aria-label="Offers"
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="type-spec px-10 text-center"
        >
          {announcements[index]}
        </motion.p>
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-bone/70 transition-colors hover:text-bone"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>
    </div>
  );
}
