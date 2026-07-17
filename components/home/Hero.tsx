"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { heroSlides } from "@/content/site";

/**
 * Full-bleed lifestyle hero — the photography carries the section; type sits
 * over the open right side of the frame with a legibility scrim.
 */
export default function Hero() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  // Timer restarts on every slide change so a manual selection gets a full
  // dwell before auto-advance resumes.
  useEffect(() => {
    if (reduced || heroSlides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), 6500);
    return () => clearInterval(t);
  }, [reduced, index]);

  const slide = heroSlides[index];

  return (
    <section
      aria-label="Featured"
      className="relative h-[calc(100svh-36px)] min-h-[560px] w-full overflow-hidden bg-carbon text-bone"
    >
      {/* Photography */}
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
            style={reduced ? undefined : { animation: "kenburns 7s ease-out forwards" }}
          >
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-[35%_center] md:object-center"
            />
          </div>
          {/* Legibility scrims: bottom fade + soft right-side vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-carbon/70 via-carbon/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-carbon/45" />
          <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-carbon/50 to-transparent md:block" />
        </motion.div>
      </AnimatePresence>

      {/* Type block — right half on desktop, bottom-left on mobile */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-4 pb-14 md:flex-row md:items-center md:justify-end md:px-8 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="md:w-[44%] md:pr-4 lg:w-[40%]"
          >
            <p className="type-spec mb-3 text-bone/90">{slide.eyebrow}</p>
            <h1 className="type-display text-[clamp(2.6rem,5.5vw,5.25rem)] text-paper drop-shadow-[0_2px_16px_rgba(26,26,22,0.35)]">
              {slide.headline[0]}
              <br />
              {slide.headline[1]}
            </h1>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={slide.cta.href}
                className="type-spec inline-flex items-center gap-2 bg-olive px-8 py-4 text-paper transition-colors duration-150 hover:bg-olive-deep"
              >
                {slide.cta.label}
                <span aria-hidden>→</span>
              </Link>
              <Link
                href={slide.ghost.href}
                className="type-spec border border-paper/70 px-8 py-4 text-paper transition-colors duration-150 hover:bg-paper/10"
              >
                {slide.ghost.label}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide controls + batch code */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 pb-5 md:px-8">
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
          <p className="type-spec hidden text-bone/60 md:block">{slide.code}</p>
        </div>
      </div>
    </section>
  );
}
