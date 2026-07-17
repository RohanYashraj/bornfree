"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { testimonials } from "@/content/site";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      5500
    );
    return () => clearInterval(t);
  }, [reduced]);

  const t = testimonials[index];

  return (
    <section className="border-y border-border-spec bg-paper py-16" aria-label="Customer reviews">
      <div className="mx-auto flex min-h-40 max-w-3xl flex-col items-center justify-center px-4 text-center md:px-8">
        <p className="type-spec mb-6 text-umber">What they say</p>
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-lg leading-relaxed md:text-xl">“{t.quote}”</p>
            <footer className="type-spec mt-5 text-umber">— {t.name}</footer>
          </motion.blockquote>
        </AnimatePresence>
        <div className="mt-8 flex gap-2" role="tablist" aria-label="Reviews">
          {testimonials.map((item, i) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Review ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === index ? "bg-carbon" : "bg-khaki/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
