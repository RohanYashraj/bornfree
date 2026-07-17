"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Shopify CDN loader — uses the `?width=` URL transform so we never ship
 * oversized images. Quality is handled by Shopify's CDN.
 */
export default function shopifyLoader({ src, width }: ImageLoaderProps) {
  try {
    const url = new URL(src);
    if (
      url.hostname.endsWith("cdn.shopify.com") ||
      url.pathname.startsWith("/cdn/")
    ) {
      url.searchParams.set("width", String(width));
      return url.toString();
    }
    return src;
  } catch {
    return src;
  }
}
