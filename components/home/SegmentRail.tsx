"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { segmentTiles } from "@/content/site";
import Reveal from "@/components/ui/Reveal";

const DRIFT_SPEED = 40; // px per second
const RESUME_DELAY = 2000; // ms after a touch gesture ends

/**
 * Poster marquee — pre-composed campaign cards drifting past like a banner,
 * on a real scroll container so users can also swipe/wheel it back and forth.
 * The track holds three copies of the list; scroll position is kept inside
 * the middle copy (wrapping by one copy-width is invisible), which leaves a
 * full copy of runway in each direction for manual scrolling. The drift
 * pauses on hover, focus and touch, and never runs under reduced motion.
 */
export default function SegmentRail() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || reduced) return;

    const copy = scroller.querySelector<HTMLElement>("[data-copy]");
    if (!copy) return;

    let hovering = false;
    let touching = false;
    let focused = false;
    let resumeAt = 0;
    let pos = copy.offsetWidth;
    let last: number | null = null;
    scroller.scrollLeft = pos;

    // Keep scrollLeft within [0.5, 1.5] copy-widths; jumping by exactly one
    // copy-width lands on identical content, so the loop never hits an edge.
    const wrap = () => {
      const w = copy.offsetWidth;
      if (scroller.scrollLeft < w * 0.5) scroller.scrollLeft += w;
      else if (scroller.scrollLeft >= w * 1.5) scroller.scrollLeft -= w;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last === null ? 0 : Math.min(now - last, 100) / 1000;
      last = now;
      wrap();
      if (hovering || touching || focused || now < resumeAt || document.hidden) {
        pos = scroller.scrollLeft;
        return;
      }
      // Resync after manual wheel/scrollbar moves, then keep drifting.
      if (Math.abs(scroller.scrollLeft - pos) > 1) pos = scroller.scrollLeft;
      pos += DRIFT_SPEED * dt;
      scroller.scrollLeft = pos;
    };
    let raf = requestAnimationFrame(tick);

    const onPointerEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovering = true;
    };
    const onPointerLeave = () => {
      hovering = false;
    };
    const onTouchStart = () => {
      touching = true;
    };
    const onTouchEnd = () => {
      touching = false;
      resumeAt = performance.now() + RESUME_DELAY;
    };
    const onFocusIn = () => {
      focused = true;
    };
    const onFocusOut = () => {
      focused = false;
    };

    scroller.addEventListener("pointerenter", onPointerEnter);
    scroller.addEventListener("pointerleave", onPointerLeave);
    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchend", onTouchEnd);
    scroller.addEventListener("touchcancel", onTouchEnd);
    scroller.addEventListener("focusin", onFocusIn);
    scroller.addEventListener("focusout", onFocusOut);

    return () => {
      cancelAnimationFrame(raf);
      scroller.removeEventListener("pointerenter", onPointerEnter);
      scroller.removeEventListener("pointerleave", onPointerLeave);
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("touchcancel", onTouchEnd);
      scroller.removeEventListener("focusin", onFocusIn);
      scroller.removeEventListener("focusout", onFocusOut);
    };
  }, [reduced]);

  return (
    <section aria-label="Shop by occasion" className="py-14">
      <Reveal className="mx-auto max-w-[1440px] px-4 md:px-8">
        <p className="type-spec mb-2 text-umber">Where it&apos;s worn</p>
        <h2 className="type-display mb-6 text-2xl md:text-4xl">
          Match the mood
        </h2>
      </Reveal>
      <div
        ref={scrollerRef}
        className="no-scrollbar overflow-x-auto overscroll-x-contain"
      >
        <div className="flex w-max">
          {[0, 1, 2].map((copy) => (
            <div
              key={copy}
              data-copy={copy === 0 ? "" : undefined}
              aria-hidden={copy > 0 || undefined}
              className={`flex gap-4 pr-4 ${copy > 0 ? "motion-reduce:hidden" : ""}`}
            >
              {segmentTiles.map((tile) => (
                <Link
                  key={tile.href}
                  href={tile.href}
                  tabIndex={copy > 0 ? -1 : undefined}
                  className="group relative block w-[280px] shrink-0 overflow-hidden bg-paper md:w-[340px]"
                >
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={tile.image}
                      alt={copy === 0 ? tile.alt : ""}
                      fill
                      sizes="340px"
                      className="object-cover transition-transform duration-500 ease-spec group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon/75 via-carbon/30 to-transparent pt-16">
                    <div className="flex items-baseline justify-between px-4 pb-3.5">
                      <span className="type-spec text-bone/70">{tile.code}</span>
                      <span className="type-spec text-bone">
                        {tile.label}{" "}
                        <span
                          aria-hidden
                          className="inline-block transition-transform duration-300 ease-spec group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
