import { qualityProps } from "@/content/site";
import Reveal from "@/components/ui/Reveal";

/** "The Bornfree Standard" — the manufacturing story as spec-tag rows. */
export default function Standard() {
  return (
    <section className="bg-carbon py-20 text-bone">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 md:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="type-spec mb-4 text-khaki">The Bornfree standard</p>
          <h2 className="type-display text-3xl leading-tight md:text-5xl">
            Cut, sewn and washed in our own Kolkata facility for 25 years.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-bone/70">
            Three manufacturing units. Five hundred–plus workers. Solar powered.
            We don’t outsource the thing we’re best at.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="border border-bone/20 font-mono">
            {qualityProps.map((prop, i) => (
              <div
                key={prop.code}
                className={`grid grid-cols-[48px_1fr] gap-4 px-5 py-4 ${
                  i < qualityProps.length - 1 ? "border-b border-bone/15" : ""
                }`}
              >
                <span className="text-[11px] uppercase tracking-[0.14em] text-khaki">
                  / {prop.code}
                </span>
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.1em]">
                    {prop.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-bone/60">
                    {prop.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
