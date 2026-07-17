import type { ProductSpecs } from "@/lib/commerce/types";

/**
 * The signature "Mill Spec" panel — a garment-tag style spec sheet built
 * from real product data parsed out of the Key Features block.
 */
export default function MillSpecPanel({ specs }: { specs: ProductSpecs }) {
  const rows: [string, string][] = [];
  if (specs.type) rows.push(["Type", specs.type]);
  if (specs.fit) rows.push(["Fit", specs.fit]);
  if (specs.fabric) rows.push(["Fabric", specs.fabric]);
  if (specs.pattern) rows.push(["Pattern", specs.pattern]);
  if (specs.pockets) rows.push(["Pockets", specs.pockets]);
  if (specs.closure) rows.push(["Closure", specs.closure]);

  if (rows.length === 0) return null;

  return (
    <section
      aria-label="Product specifications"
      className="border border-carbon/60 bg-paper font-mono"
    >
      <header className="flex items-center justify-between border-b border-carbon/60 px-4 py-2.5">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em]">
          Mill Spec
        </span>
        <span className="text-[10px] uppercase tracking-[0.14em] text-khaki">
          BF · KOL · EST. 25Y
        </span>
      </header>
      <dl>
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className={`grid grid-cols-[88px_1fr] gap-3 px-4 py-2 text-[11px] leading-relaxed ${
              i < rows.length - 1 ? "border-b border-border-spec" : ""
            }`}
          >
            <dt className="uppercase tracking-[0.1em] text-khaki">{label}</dt>
            <dd className="uppercase tracking-[0.03em]">{value}</dd>
          </div>
        ))}
      </dl>
      {specs.designCode && (
        <footer className="border-t border-carbon/60 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-khaki">
          Batch № {specs.designCode} · 25-step QA passed
        </footer>
      )}
    </section>
  );
}
