import type { CommerceProvider } from "./types";
import { publicProvider } from "./public-provider";
import {
  storefrontProvider,
  storefrontConfigured,
} from "./storefront-provider";

export type CommerceMode = "storefront" | "public";

export function commerceMode(): CommerceMode {
  const mode = process.env.COMMERCE_MODE;
  if (mode === "storefront" && storefrontConfigured()) return "storefront";
  return "public";
}

export const commerce: CommerceProvider =
  commerceMode() === "storefront" ? storefrontProvider : publicProvider;

export * from "./types";
export { parseSpecs, specStrip, productBadge, productAvailable } from "./specs";
