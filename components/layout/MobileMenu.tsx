"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { megaMenu, siteConfig } from "@/content/site";

function Accordion({
  label,
  items,
  defaultOpen = false,
}: {
  label: string;
  items: { label: string; href: string }[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = `mm-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="border-b border-border-spec">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="type-spec">{label}</span>
        <span aria-hidden className="font-mono text-base leading-none">
          {open ? "−" : "+"}
        </span>
      </button>
      <div id={id} hidden={!open} className="pb-4">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block py-2.5 pl-2 text-base"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Body scroll lock + Escape + initial focus
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-carbon/40"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={reduced ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-y-0 left-0 flex w-full max-w-md flex-col overflow-y-auto bg-paper px-5 pb-10"
          >
            <div className="flex h-16 items-center justify-between">
              <span className="type-display text-lg tracking-[0.12em]">BORNFREE</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </div>

            <Accordion label="Featured" items={megaMenu.featured} defaultOpen />
            <Accordion label="Categories" items={megaMenu.categories} />
            <Accordion label="Shop by Occasion" items={megaMenu.occasions} />

            <nav className="mt-6 space-y-1" aria-label="Pages">
              {[
                { label: "Our Story", href: "/pages/our-story" },
                { label: "Offline Stores", href: "/pages/offline-store" },
                { label: "Contact", href: "/pages/contact" },
                { label: "Wishlist", href: "/wishlist" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="block py-3 text-base font-medium">
                  {l.label}
                </Link>
              ))}
              <a href={siteConfig.accountUrl} className="block py-3 text-base font-medium">
                Account
              </a>
            </nav>

            <p className="type-spec mt-auto pt-10 text-khaki">
              {siteConfig.contact.phone} · {siteConfig.contact.hours}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
