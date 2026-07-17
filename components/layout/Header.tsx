"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { megaMenu, siteConfig } from "@/content/site";
import { useCart, cartCount } from "@/lib/cart-store";
import BfImage from "@/components/ui/BfImage";
import MobileMenu from "./MobileMenu";
import SearchOverlay from "@/components/search/SearchOverlay";

export type MenuImageTile = {
  src: string;
  alt: string;
  href: string;
  label: string;
};

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

export default function Header({ menuImage }: { menuImage: MenuImageTile | null }) {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useMounted();
  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.openCart);
  const count = mounted ? cartCount(lines) : 0;

  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 24,
    () => false
  );

  // Close menus on navigation (setState-during-render pattern).
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMegaOpen(false);
    setMobileOpen(false);
  }

  const overHero = pathname === "/" && !scrolled && !megaOpen;
  const solid = !overHero;

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleCloseMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  const iconClass =
    "relative flex h-9 w-9 items-center justify-center transition-colors duration-150 hover:opacity-70";

  return (
    <>
      <header
        onKeyDown={(e) => {
          if (e.key === "Escape") setMegaOpen(false);
        }}
        className={`sticky top-0 z-40 transition-colors duration-200 ${
          solid
            ? "border-b border-border-spec bg-paper text-carbon"
            : "border-b border-transparent bg-transparent text-paper"
        } ${pathname === "/" ? "-mb-[65px]" : ""}`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-8">
          {/* Left: nav */}
          <div className="flex flex-1 items-center gap-6">
            <button
              type="button"
              className={`${iconClass} lg:hidden`}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
                <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
              <button
                type="button"
                className="type-spec link-spec py-2"
                aria-expanded={megaOpen}
                aria-controls="mega-menu"
                onMouseEnter={openMega}
                onMouseLeave={scheduleCloseMega}
                onFocus={openMega}
                onClick={() => setMegaOpen((o) => !o)}
              >
                Shop
              </button>
              <Link href="/pages/our-story" className="type-spec link-spec py-2">
                Our Story
              </Link>
              <Link href="/pages/offline-store" className="type-spec link-spec py-2">
                Stores
              </Link>
              <Link href="/pages/contact" className="type-spec link-spec py-2">
                Contact
              </Link>
            </nav>
          </div>

          {/* Center: wordmark */}
          <Link
            href="/"
            aria-label="Bornfree home"
            className="type-display text-xl tracking-[0.12em] md:text-2xl"
          >
            BORNFREE
          </Link>

          {/* Right: icons */}
          <div className="flex flex-1 items-center justify-end gap-1 md:gap-2">
            <button
              type="button"
              className={iconClass}
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <circle cx="8" cy="8" r="6.3" stroke="currentColor" strokeWidth="1.4" />
                <path d="M12.7 12.7L17 17" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <Link href="/wishlist" className={`${iconClass} hidden sm:flex`} aria-label="Wishlist">
              <svg width="18" height="17" viewBox="0 0 18 17" fill="none" aria-hidden>
                <path
                  d="M9 16S1 11.2 1 5.6C1 2.9 3 1 5.4 1 7 1 8.3 1.9 9 3.2 9.7 1.9 11 1 12.6 1 15 1 17 2.9 17 5.6 17 11.2 9 16 9 16Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            </Link>
            <a
              href={siteConfig.accountUrl}
              className={`${iconClass} hidden sm:flex`}
              aria-label="Account"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <circle cx="9" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M1.8 17c.8-3.6 3.8-5.6 7.2-5.6s6.4 2 7.2 5.6" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
            <button
              type="button"
              className={iconClass}
              aria-label={`Cart, ${count} items`}
              onClick={openCart}
            >
              <svg width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden>
                <path d="M2 5.5h14l-1 12.5H3L2 5.5Z" stroke="currentColor" strokeWidth="1.4" />
                <path d="M6 8V4a3 3 0 0 1 6 0v4" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-signal px-1 font-mono text-[10px] leading-none text-paper">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              id="mega-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={openMega}
              onMouseLeave={scheduleCloseMega}
              className="absolute inset-x-0 top-full hidden border-b border-border-spec bg-paper text-carbon shadow-[0_24px_48px_-24px_rgba(26,26,22,0.25)] lg:block"
            >
              <div className="mx-auto grid max-w-[1440px] grid-cols-4 gap-10 px-8 py-10">
                <div>
                  <p className="type-spec mb-4 text-umber">Featured</p>
                  <ul className="space-y-3">
                    {megaMenu.featured.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="link-spec text-sm font-medium">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="type-spec mb-4 text-umber">Categories</p>
                  <ul className="space-y-3">
                    {megaMenu.categories.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="link-spec text-sm">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="type-spec mb-4 text-umber">Shop by Occasion</p>
                  <ul className="space-y-3">
                    {megaMenu.occasions.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="link-spec text-sm">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {menuImage && (
                  <Link
                    href={menuImage.href}
                    className="group relative block overflow-hidden rounded-spec bg-bone"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                      <BfImage
                        src={menuImage.src}
                        alt={menuImage.alt}
                        fill
                        sizes="320px"
                        className="object-cover transition-transform duration-500 ease-spec group-hover:scale-105"
                      />
                    </div>
                    <span className="type-spec absolute bottom-3 left-3 bg-paper/90 px-3 py-1.5">
                      {menuImage.label}
                    </span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
