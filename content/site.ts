/**
 * Central site configuration — all editorial/config content lives here
 * so the demo is editable without touching components.
 * Every fact traces to bornfreefashions.com.
 */

export const offers = {
  buyTwo: {
    code: "BUY2",
    message: "Buy any 2 & get ₹150 off",
    minItems: 2,
    discount: 150,
  },
  above2500: {
    code: "FLAT250",
    message: "Flat ₹250 OFF on purchase above ₹2500",
    threshold: 2500,
    discount: 250,
  },
} as const;

export const announcements = [
  offers.buyTwo.message,
  offers.above2500.message,
];

export const quickLinks = [
  { label: "Best Sellers", href: "/collections/best-seller" },
  { label: "New Launch", href: "/collections/new-launch" },
  { label: "Cargo Pants", href: "/collections/cargo-pants" },
  { label: "Cargo Shorts", href: "/collections/cargo-shorts" },
  { label: "Bermudas", href: "/collections/bermudas" },
  { label: "Joggers", href: "/collections/basic-joggers" },
  { label: "3/4ths", href: "/collections/3-4th" },
  { label: "Pyjamas", href: "/collections/pyjamas" },
];

/** Category tiles — imagery resolved at render time from each collection's own products. */
export const categoryTiles = [
  { label: "Cargo Pants", handle: "cargo-pants" },
  { label: "Cargo Shorts", handle: "cargo-shorts" },
  { label: "Casual Shorts", handle: "casual-shorts" },
  { label: "Bermudas", handle: "bermudas" },
  { label: "Joggers", handle: "basic-joggers" },
  { label: "3/4ths", handle: "3-4th" },
  { label: "Pyjamas", handle: "pyjamas" },
  { label: "Summer Shorts", handle: "summer-shorts" },
];

export const occasionTiles = [
  { label: "Outdoor", handle: "outdoor" },
  { label: "Adventure", handle: "adventure" },
  { label: "All-Day Comfort", handle: "all-day-comfort" },
  { label: "Beach Ready", handle: "beach-ready" },
  { label: "Everyday", handle: "everyday" },
  { label: "Vacation", handle: "vacation" },
];

export const megaMenu = {
  featured: [
    { label: "Best Sellers", href: "/collections/best-seller" },
    { label: "New Launch", href: "/collections/new-launch" },
    { label: "Sale", href: "/collections/sale" },
    { label: "Shop All", href: "/collections/all" },
  ],
  categories: [
    { label: "Cargo Pants", href: "/collections/cargo-pants" },
    { label: "Cargo Shorts", href: "/collections/cargo-shorts" },
    { label: "Casual Shorts", href: "/collections/casual-shorts" },
    { label: "Bermudas", href: "/collections/bermudas" },
    { label: "Basic Joggers", href: "/collections/basic-joggers" },
    { label: "Cargo Joggers", href: "/collections/cargo-joggers-1" },
    { label: "3/4ths", href: "/collections/3-4th" },
    { label: "Pyjamas", href: "/collections/pyjamas" },
    { label: "Summer Shorts", href: "/collections/summer-shorts" },
  ],
  occasions: occasionTiles.map((o) => ({
    label: o.label,
    href: `/collections/${o.handle}`,
  })),
};

export const popularSearches = [
  "cargo pants",
  "cargo shorts",
  "joggers",
  "bermudas",
  "pyjamas",
  "olive",
];

export const trustProps = [
  "Free & fast delivery",
  "Easy returns & exchange",
  "Secure payments",
  "COD available",
];

/** The five quality props behind "The Bornfree Standard" (from live site). */
export const qualityProps = [
  {
    code: "01",
    title: "Advanced technology",
    body: "State-of-the-art machinery across 3 manufacturing units.",
  },
  {
    code: "02",
    title: "Research & expertise",
    body: "Fits perfected for the Indian body over 25 years.",
  },
  {
    code: "03",
    title: "Designed for all",
    body: "Cargos, shorts, joggers and pyjamas for every day.",
  },
  {
    code: "04",
    title: "Special wash",
    body: "Every garment is wash-treated for softness before it ships.",
  },
  {
    code: "05",
    title: "25-step QA",
    body: "More than 25 quality checks on each piece.",
  },
];

/** Real customer quotes from the live homepage. */
export const testimonials = [
  {
    quote:
      "Bornfree’s cargo shorts are super comfy and stylish. Perfect for everyday wear. Great quality at an amazing price!",
    name: "Rajiv Mehta, Mumbai",
  },
  {
    quote:
      "Absolutely love the joggers from Bornfree! Soft fabric, great fit, and perfect for casual outings. Highly recommended!",
    name: "Amit Sharma, Delhi",
  },
  {
    quote:
      "Bornfree’s Bermudas are my go-to summer wear. Breathable, durable, and stylish. Best value for money!",
    name: "Rohan Iyer, Bengaluru",
  },
  {
    quote:
      "Bought pyjamas from Bornfree, and they are the comfiest ever. Great quality and super soft fabric!",
    name: "Sandeep Joshi, Pune",
  },
  {
    quote:
      "Their shorts are stylish, comfortable, and durable. Perfect for daily wear. Bornfree never disappoints!",
    name: "Vikram Singh, Jaipur",
  },
];

export const siteConfig = {
  name: "Bornfree",
  legalName: "BORNFREE FASHIONS PVT. LTD.",
  address:
    "Diamond Heritage Building, 16 Strand Road, Kolkata, West Bengal 700001",
  contact: {
    phone: "+91 79-80360960",
    hours: "Mon–Sat, 11 AM – 7 PM",
    email: "contact@bornfreefashions.com",
  },
  social: {
    instagram: "https://www.instagram.com/bornfree__india",
    facebook: "https://www.facebook.com/people/Bornfree-India/61557282098470/",
  },
  accountUrl: "https://bornfreefashions.com/account",
  returnsPortal: "https://345b3a-68.myshopify.com/apps/return_prime",
  logoUrl:
    "https://bornfreefashions.com/cdn/shop/files/Bornfree_logo_png_e51f4ef3-9a62-4855-b40e-af936e77f883.png?v=1730459855",
} as const;

/**
 * Hero slides — full-bleed lifestyle photography (local, in /public/hero)
 * with the type overlaid on the open right side of each frame.
 */
export const heroSlides = [
  {
    eyebrow: "New · Cargo pants",
    headline: ["Built for the", "long day"],
    cta: { label: "Shop cargo pants", href: "/collections/cargo-pants" },
    ghost: { label: "New launch", href: "/collections/new-launch" },
    image: "/hero/hero1.png",
    imageAlt:
      "Man in Bornfree blue cargo pants leaning on a fence post at sunset",
    code: "01 / DUSK",
  },
  {
    eyebrow: "Cargo shorts · Beach ready",
    headline: ["Summer,", "sorted"],
    cta: { label: "Shop cargo shorts", href: "/collections/cargo-shorts" },
    ghost: { label: "Best sellers", href: "/collections/best-seller" },
    image: "/hero/hero2.png",
    imageAlt: "Man in Bornfree khaki cargo shorts on a beach at sunrise",
    code: "02 / SHORE",
  },
];

/**
 * Segment posters — pre-composed campaign cards (local, in /public/segments),
 * each pairing a wearing occasion with the collection built for it.
 */
export const segmentTiles = [
  {
    label: "Cargo pants",
    code: "01 / TRANSIT",
    href: "/collections/cargo-pants",
    image: "/segments/all-season-cargos.png",
    alt: "All-season lightweight cargos — man in khaki cargos standing in a metro carriage",
  },
  {
    label: "Outdoor",
    code: "02 / TRAIL",
    href: "/collections/outdoor",
    image: "/segments/outdoor-cargos.png",
    alt: "Built for every move — man hiking a rocky mountain trail in stone cargo pants",
  },
  {
    label: "Cargo shorts",
    code: "03 / OPEN ROAD",
    href: "/collections/cargo-shorts",
    image: "/segments/comfort-shorts.png",
    alt: "All-day comfort shorts — man in navy cargo shorts on a sunlit country road",
  },
  {
    label: "Vacation",
    code: "04 / DEPARTURES",
    href: "/collections/vacation",
    image: "/segments/travel-pants.png",
    alt: "All-day travel pants — man with a suitcase in an airport terminal",
  },
  {
    label: "Pyjamas",
    code: "05 / LIGHTS OUT",
    href: "/collections/pyjamas",
    image: "/segments/sleep-shorts.png",
    alt: "100% cotton sleep shorts — man relaxing on a sofa with a mug",
  },
];

/** Offline stores — from /pages/offline-store. */
export const offlineStores = [
  {
    name: "Bansberia Shop",
    address: "Bansberia, Military Road, Chak Bansberia, Hooghly, WB 712502",
  },
  {
    name: "Mogra Shop",
    address: "Mogra, Adarsh Bhavan, Amodhaghata, Mogra, Hooghly, WB 712148",
  },
  {
    name: "Bandel Shop",
    address:
      "Bandel, Annapurna Enclave, Station Road, Bandel, beside Lenskart",
  },
  {
    name: "Raniganj Shop",
    address:
      "Raniganj, Munia Devi Market, NSB Road, Raniganj, Paschim Bardhaman, opp. SBI Bank, WB 713347",
  },
  {
    name: "Krishnanagar Shop",
    address:
      "D.L. Roy Road, Bow Bazar, Krishnanagar, opp. M Baazar, Nadia, WB 741101",
  },
];

export const storeHours = "Every day, 11 AM – 7 PM";
export const storePhone = "+91 9001597579";
