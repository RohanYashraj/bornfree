/**
 * Colour utilities — maps Bornfree's variant colour names to swatch values
 * and groups them into families for shop-by-colour.
 */

const SWATCHES: Record<string, string> = {
  black: "#1d1d1b",
  white: "#f4f2ec",
  "off white": "#efeadd",
  cream: "#ece3cd",
  beige: "#d8c9a8",
  sand: "#d3bf96",
  stone: "#b8ad98",
  khaki: "#a99b7a",
  olive: "#5b5c3d",
  "dark olive": "#42432c",
  "medium olive": "#5f6140",
  "light olive": "#8a8a62",
  green: "#3f5741",
  "bottle green": "#1f4a38",
  "dark green": "#274c3a",
  sage: "#9aa88b",
  navy: "#232b3f",
  "navy blue": "#232b3f",
  blue: "#3c5a7d",
  "sky blue": "#8fb2cd",
  "light blue": "#a5c2d8",
  indigo: "#39456b",
  denim: "#4a5e79",
  grey: "#7d7d78",
  gray: "#7d7d78",
  "dark grey": "#4c4c48",
  "light grey": "#b3b3ad",
  charcoal: "#3a3a36",
  brown: "#6b4e35",
  "dark brown": "#4c3826",
  tan: "#b08d5e",
  camel: "#b3906a",
  mustard: "#c8962e",
  yellow: "#d9b23c",
  orange: "#c26a2e",
  rust: "#a6552f",
  maroon: "#5d2a2e",
  wine: "#5e2b3a",
  red: "#a33327",
  pink: "#cf9ba0",
  peach: "#dfad8f",
  lavender: "#a99ab8",
  purple: "#5d4a70",
  teal: "#2f6363",
  aqua: "#69a8a1",
};

export function swatchColor(name: string): string {
  const key = name.trim().toLowerCase();
  if (SWATCHES[key]) return SWATCHES[key];
  // try last word ("Printed Navy" -> navy) then any contained token
  for (const token of Object.keys(SWATCHES)) {
    if (key.includes(token)) return SWATCHES[token];
  }
  return "#c9c2b2"; // neutral fallback
}

export type ColorFamily = {
  name: string;
  swatch: string;
  match: (colorName: string) => boolean;
};

const family = (name: string, swatch: string, tokens: string[]): ColorFamily => ({
  name,
  swatch,
  match: (c) => tokens.some((t) => c.toLowerCase().includes(t)),
});

/** Ordered — first match wins. */
export const colorFamilies: ColorFamily[] = [
  family("Olive", "#4e5238", ["olive"]),
  family("Khaki", "#a99b7a", ["khaki", "tan", "camel"]),
  family("Stone", "#b8ad98", ["stone", "grey", "gray", "charcoal", "silver"]),
  family("Sand", "#d3bf96", ["sand", "beige", "cream", "off white", "ecru", "ivory"]),
  family("Black", "#1d1d1b", ["black"]),
  family("Navy", "#232b3f", ["navy", "indigo", "denim", "blue"]),
  family("Green", "#3f5741", ["green", "sage", "moss", "forest"]),
  family("Prints", "#8a7f68", ["print", "camo", "check", "stripe", "floral", "palm", "tie dye", "tie-dye"]),
];

export function familyFor(colorName: string): ColorFamily | null {
  return colorFamilies.find((f) => f.match(colorName)) ?? null;
}
