import type { Metadata } from "next";
import { siteConfig } from "@/content/site";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Bornfree — call +91 79-80360960 (Mon–Sat, 11 AM – 7 PM) or write to contact@bornfreefashions.com.",
  alternates: { canonical: "/pages/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-8">
      <p className="type-spec mb-3 text-umber">Say hello</p>
      <h1 className="type-display mb-10 text-3xl md:text-5xl">Contact</h1>

      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="max-w-md text-sm leading-relaxed text-carbon/80">
            We would love to hear from you — about an order, a fit question,
            or working with us.
          </p>
          <dl className="mt-8 max-w-md border border-border-spec font-mono text-sm">
            <div className="grid grid-cols-[96px_1fr] gap-3 border-b border-border-spec px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.1em] text-umber">Phone</dt>
              <dd>
                <a href={`tel:${siteConfig.contact.phone.replace(/[^+\d]/g, "")}`} className="hover:text-olive">
                  {siteConfig.contact.phone}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-3 border-b border-border-spec px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.1em] text-umber">Email</dt>
              <dd>
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-olive">
                  {siteConfig.contact.email}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-3 border-b border-border-spec px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.1em] text-umber">Hours</dt>
              <dd>{siteConfig.contact.hours}</dd>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-3 px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.1em] text-umber">Office</dt>
              <dd className="font-sans text-sm">{siteConfig.address}</dd>
            </div>
          </dl>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
