"use client";

import Image, { type ImageProps } from "next/image";
import shopifyLoader from "@/lib/shopify-image-loader";

/** next/image preconfigured with the Shopify CDN width-transform loader. */
export default function BfImage({ alt, ...props }: ImageProps) {
  return <Image loader={shopifyLoader} alt={alt ?? ""} {...props} />;
}
