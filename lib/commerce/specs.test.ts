import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseSpecs,
  specStrip,
  productAvailable,
  productBadge,
} from "./specs.ts";
import type { Money, Variant } from "./types.ts";

const SAMPLE_HTML = `<table><tbody><tr><td>
<strong>Key Features</strong><br><span> </span><br>
<span> </span>Type: Cargo Shorts<br>
<span> </span>Fit: Regular Fit<br>
<span> </span>Fabric: 100% Cotton<br>
<span> </span>Pattern: Printed<br>
<span> </span>Number of Pockets: 2 Side Pockets with 2 side zip with cargo pockets, 2 Back pocket.<br>
<span> </span>Closure: Elasticated Waistband with Front Button.<br>
<span> </span>Note: The product's actual colour may vary.<br>
<strong><span> </span>Design Code: 10600</strong>
</td></tr></tbody></table>`;

test("parseSpecs extracts all Key Features fields", () => {
  const s = parseSpecs(SAMPLE_HTML);
  assert.equal(s.type, "Cargo Shorts");
  assert.equal(s.fit, "Regular Fit");
  assert.equal(s.fabric, "100% Cotton");
  assert.equal(s.pattern, "Printed");
  assert.equal(s.pocketCount, 6); // 2 side + 2 zip + 2 back
  assert.equal(s.designCode, "10600");
  assert.match(s.closure ?? "", /Elasticated Waistband/);
});

test("parseSpecs is resilient to missing fields", () => {
  const s = parseSpecs("<p>Just a plain description.</p>");
  assert.equal(s.type, null);
  assert.equal(s.fabric, null);
  assert.equal(s.pocketCount, null);
});

test("parseSpecs handles empty/undefined input", () => {
  const s = parseSpecs("");
  assert.equal(s.fit, null);
});

test("specStrip builds card strip from specs", () => {
  const s = parseSpecs(SAMPLE_HTML);
  assert.equal(specStrip(s), "100% COTTON · REGULAR FIT · 6 POCKETS");
});

test("specStrip returns null when nothing parsed", () => {
  assert.equal(specStrip(parseSpecs("")), null);
});

/* ---------------- availability & badges (§1.4) ---------------- */

const inr = (amount: number): Money => ({ amount, currencyCode: "INR" });

function variant(available: boolean, price = 1049, compareAt?: number): Variant {
  return {
    id: "1",
    title: "v",
    options: {},
    availableForSale: available,
    price: inr(price),
    compareAtPrice: compareAt ? inr(compareAt) : null,
    image: null,
  };
}

test("product available when at least one variant is", () => {
  assert.equal(productAvailable([variant(false), variant(true)]), true);
});

test("product sold out only when ALL variants unavailable", () => {
  assert.equal(productAvailable([variant(false), variant(false)]), false);
});

test("badge: no sold-out when any variant purchasable (theme bug fix)", () => {
  const variants = [variant(false), variant(true)];
  const p = { variants, availableForSale: productAvailable(variants) };
  assert.equal(productBadge(p), null);
});

test("badge: sale when compare-at > price", () => {
  const variants = [variant(true, 899, 1199)];
  const p = { variants, availableForSale: true };
  assert.equal(productBadge(p), "sale");
});

test("badge: no sale when compare-at equals price", () => {
  const variants = [variant(true, 899, 899)];
  const p = { variants, availableForSale: true };
  assert.equal(productBadge(p), null);
});

test("badge: sold-out wins when everything unavailable, never both", () => {
  const variants = [variant(false, 899, 1199)];
  const p = { variants, availableForSale: false };
  assert.equal(productBadge(p), "sold-out");
});
