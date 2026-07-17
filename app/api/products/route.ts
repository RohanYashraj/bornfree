import { NextRequest, NextResponse } from "next/server";
import { commerce } from "@/lib/commerce";

/** Fetch full product objects by handle — used by the wishlist page. */
export async function GET(req: NextRequest) {
  const handles = (req.nextUrl.searchParams.get("handles") ?? "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean)
    .slice(0, 24);

  const products = (
    await Promise.all(handles.map((h) => commerce.getProduct(h)))
  ).filter(Boolean);

  return NextResponse.json({ products });
}
