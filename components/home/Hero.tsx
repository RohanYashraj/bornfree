"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { heroSlides } from "@/content/site";
import BfImage from "@/components/ui/BfImage";

/**
 * Split editorial hero — oversized type on carbon, clean photography right.
 * The store's banner artwork carries baked-in copy, so we art-direct the
 * untreated photoshoot frames instead of stretching catalogue images.
 */
export default function Hero() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || heroSlides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, [reduced]);

  const slide = heroSlides[index];

  return (
    <section
      aria-label="Featured"
      className="relative flex h-[calc(100svh-36px)] min-h-[560px] w-full flex-col-reverse overflow-hidden bg-carbon text-bone md:flex-row"
    >
      {/* Type panel */}
      <div className="relative z-10 flex flex-1 flex-col justify-end px-4 pb-10 pt-24 md:justify-center md:px-10 md:pb-0 lg:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="type-spec mb-4 text-khaki">{slide.eyebrow}</p>
            <h1 className="type-display max-w-[9ch] text-[clamp(2.5rem,5vw,5rem)] text-paper">
              {slide.headline.join(" ")}
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={slide.cta.href}
                className="type-spec bg-paper px-8 py-4 text-carbon transition-colors duration-150 hover:bg-khaki"
              >
                {slide.cta.label}
              </Link>
              <Link
                href={slide.ghost.href}
                className="type-spec border border-paper/60 px-8 py-4 text-paper transition-colors duration-150 hover:bg-paper/10"
              >
                {slide.ghost.label}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between md:absolute md:bottom-10 md:left-10 md:right-10 md:mt-0 lg:left-16 lg:right-16">
          <div className="flex gap-2" role="tablist" aria-label="Hero slides">
            {heroSlides.map((s, i) => (
              <button
                key={s.image}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-0.5 w-10 transition-colors ${i === index ? "bg-paper" : "bg-paper/30"}`}
              />
            ))}
          </div>
          <p className="type-spec hidden text-bone/50 md:block">{slide.code}</p>
        </div>
      </div>

      {/* Photography panel */}
      <div className="relative h-[46%] w-full md:h-auto md:w-[46%] lg:w-[42%]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0"
              style={reduced ? undefined : { animation: "kenburns 6.5s ease-out forwards" }}
            >
              <BfImage
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 46vw"
                className="object-cover object-top"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
