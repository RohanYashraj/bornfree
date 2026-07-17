import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col items-start justify-center px-4 py-16 md:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-umber">
        Error 404 · Batch not found
      </p>
      <h1 className="type-display mt-4 text-4xl md:text-6xl">
        This page slipped the line
      </h1>
      <p className="mt-4 max-w-sm text-sm text-carbon/70">
        The page you’re after doesn’t exist or has moved. The racks below are
        fully stocked.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {[
          { label: "Best sellers", href: "/collections/best-seller" },
          { label: "Cargo pants", href: "/collections/cargo-pants" },
          { label: "New launch", href: "/collections/new-launch" },
          { label: "Home", href: "/" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="type-spec border border-carbon px-6 py-3 transition-colors hover:bg-carbon hover:text-paper"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
