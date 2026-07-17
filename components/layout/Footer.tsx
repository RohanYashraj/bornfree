import Link from "next/link";
import { megaMenu, siteConfig, trustProps } from "@/content/site";
import NewsletterForm from "@/components/home/NewsletterForm";

const shopLinks = [
  { label: "Best Sellers", href: "/collections/best-seller" },
  { label: "New Launch", href: "/collections/new-launch" },
  { label: "Cargo Pants", href: "/collections/cargo-pants" },
  { label: "Cargo Shorts", href: "/collections/cargo-shorts" },
  { label: "Shop All", href: "/collections/all" },
];

const helpLinks = [
  { label: "Returns & Exchange", href: siteConfig.returnsPortal, external: true },
  { label: "Offline Stores", href: "/pages/offline-store" },
  { label: "Contact", href: "/pages/contact" },
  { label: "Wishlist", href: "/wishlist" },
];

const companyLinks = [
  { label: "Our Story", href: "/pages/our-story" },
  { label: "Account", href: siteConfig.accountUrl, external: true },
];

function Column({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <p className="type-spec mb-4 text-khaki">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) =>
          l.external ? (
            <li key={l.label}>
              <a href={l.href} className="link-spec text-sm text-bone/80" rel="noopener">
                {l.label}
              </a>
            </li>
          ) : (
            <li key={l.label}>
              <Link href={l.href} className="link-spec text-sm text-bone/80">
                {l.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-carbon text-bone">
      {/* Trust strip */}
      <div className="border-b border-bone/10">
        <div className="no-scrollbar mx-auto flex max-w-[1440px] items-center gap-8 overflow-x-auto px-4 py-4 md:justify-center md:px-8">
          {trustProps.map((prop, i) => (
            <span key={prop} className="type-spec flex shrink-0 items-center gap-8 text-bone/70">
              {i > 0 && <span aria-hidden className="text-bone/30">·</span>}
              {prop}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 md:grid-cols-2 md:px-8 lg:grid-cols-5">
        <Column title="Shop" links={shopLinks} />
        <Column
          title="Occasions"
          links={megaMenu.occasions.slice(0, 5).map((o) => ({ label: o.label, href: o.href }))}
        />
        <Column title="Help" links={helpLinks} />
        <Column title="Company" links={companyLinks} />

        <div>
          <p className="type-spec mb-4 text-khaki">Newsletter</p>
          <NewsletterForm />
          <div className="mt-8 space-y-1 text-xs leading-relaxed text-bone/60">
            <p className="font-mono">{siteConfig.legalName}</p>
            <p>{siteConfig.address}</p>
            <p>
              <a href={`tel:${siteConfig.contact.phone.replace(/[^+\d]/g, "")}`} className="hover:text-bone">
                {siteConfig.contact.phone}
              </a>{" "}
              ({siteConfig.contact.hours})
            </p>
            <p>
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-bone">
                {siteConfig.contact.email}
              </a>
            </p>
          </div>
          <div className="mt-4 flex gap-4">
            <a href={siteConfig.social.instagram} aria-label="Instagram" rel="noopener" className="text-bone/60 hover:text-bone">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <rect x="1" y="1" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="9" cy="9" r="3.6" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="13.6" cy="4.4" r="1" fill="currentColor" />
              </svg>
            </a>
            <a href={siteConfig.social.facebook} aria-label="Facebook" rel="noopener" className="text-bone/60 hover:text-bone">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M12.5 2H10a4 4 0 0 0-4 4v2H4v3h2v5h3v-5h2.5l.5-3H9V6a1 1 0 0 1 1-1h2.5V2Z" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-bone/10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-5 md:px-8">
          <p className="font-mono text-[11px] text-bone/50">
            © {new Date().getFullYear()} {siteConfig.legalName} · Kolkata, India
          </p>
          <p className="font-mono text-[11px] tracking-[0.1em] text-bone/50">
            BF · KOL · EST. 25Y
          </p>
        </div>
      </div>

      {/* Ghost wordmark — closing brand moment. SVG textLength keeps the
          full word fitted to the footer width at every viewport. */}
      <div aria-hidden className="pointer-events-none select-none px-2">
        <svg viewBox="0 0 1000 128" className="block w-full" role="presentation">
          <text
            x="500"
            y="122"
            textAnchor="middle"
            textLength="992"
            lengthAdjust="spacingAndGlyphs"
            className="fill-bone/[0.06]"
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              fontWeight: 700,
              fontSize: "138px",
            }}
          >
            BORNFREE
          </text>
        </svg>
      </div>
    </footer>
  );
}
