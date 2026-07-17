import type { Money } from "@/lib/commerce/types";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatMoney(money: Money): string {
  return inr.format(money.amount);
}

export function formatRupees(amount: number): string {
  return inr.format(amount);
}
