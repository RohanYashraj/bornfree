import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Predictive search proxy — Shopify's suggest endpoint has no CORS headers,
 * so the overlay queries this route. Works in both commerce modes.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ products: [] });

  try {
    const res = await fetch(
      `https://bornfreefashions.com/search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=8`,
      { next: { revalidate: 300 } }
    );
    const data = await res.json();
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const products = (data?.resources?.results?.products ?? []).map(
      (p: any) => ({
        handle: p.handle,
        title: p.title,
        price: parseFloat(p.price),
        image: p.featured_image?.url ?? p.image ?? null,
        available: Boolean(p.available),
      })
    );
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] }, { status: 200 });
  }
}
