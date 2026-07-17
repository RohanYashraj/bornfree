import Link from "next/link";
import { quickLinks } from "@/content/site";

export default function QuickLinks() {
  return (
    <nav
      aria-label="Quick links"
      className="no-scrollbar flex gap-2 overflow-x-auto border-b border-border-spec bg-bone px-4 py-3 md:justify-center md:px-8"
    >
      {quickLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="type-spec whitespace-nowrap rounded-spec border border-border-spec bg-paper px-4 py-2 text-carbon transition-colors duration-150 hover:border-olive hover:bg-olive hover:text-paper"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
