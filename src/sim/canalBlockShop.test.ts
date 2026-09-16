import { describe, expect, it } from "vitest";
import { initialState } from "./game";
import { calculateCanalBlockShopOutcome } from "./canalBlockShop";

describe("native Canal block shop", () => {
  it("produces no shop economy without the shop module", () => {
    expect(calculateCanalBlockShopOutcome(initialState, 20)).toEqual({ sales: 0, revenue: 0, procurement: 0, lines: [] });
  });

  it("produces sales and automatic procurement from visitors when the shop exists", () => {
    const snapshot = { ...initialState, built: ["shop" as const] };
    const result = calculateCanalBlockShopOutcome(snapshot, 30);
    expect(result.sales).toBeGreaterThan(0);
    expect(result.revenue).toBeGreaterThan(result.procurement);
    expect(result.procurement).toBeGreaterThan(0);
    expect(result.lines.reduce((total, line) => total + line.units, 0)).toBe(result.sales);
  });

  it("uses the active range rather than a hidden weekly sales total", () => {
    const broad = { ...initialState, built: ["shop" as const] };
    const narrow = { ...broad, shopRange: ["cold-water" as const] };
    const broadResult = calculateCanalBlockShopOutcome(broad, 40);
    const narrowResult = calculateCanalBlockShopOutcome(narrow, 40);
    expect(broadResult).not.toEqual(narrowResult);
  });
});
