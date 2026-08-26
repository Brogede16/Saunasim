import { describe, expect, it } from "vitest";
import { resolveShopLines } from "./shop";

describe("shop range economics", () => {
  it("allocates every automatic purchase to a selected visible product", () => {
    const lines = resolveShopLines(["cold-water", "sauna-towel", "house-blend"], 23);
    expect(lines.reduce((total, line) => total + line.units, 0)).toBe(23);
    expect(lines.map((line) => line.name)).toEqual(["Cold Water", "Sauna Towel", "House Blend Oil"]);
    expect(lines.every((line) => line.revenue > line.procurement)).toBe(true);
  });

  it("does not invent sales for an empty range", () => {
    expect(resolveShopLines([], 12)).toEqual([]);
  });
});
