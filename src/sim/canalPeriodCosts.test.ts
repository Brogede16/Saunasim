import { describe, expect, it } from "vitest";
import { initialState } from "./game";
import { calculateCanalPeriodCosts } from "./canalPeriodCosts";

describe("Canal fixed period obligations", () => {
  it("charges the compact venue fixed base even before optional facilities exist", () => {
    expect(calculateCanalPeriodCosts(initialState)).toEqual({
      venueBase: 300,
      utilitiesAndCleaning: 212,
      facilities: 0,
      total: 512,
    });
  });

  it("classifies inherited yard/program support as facility obligations instead of session materials", () => {
    const costs = calculateCanalPeriodCosts({
      ...initialState,
      built: ["shower", "cold-plunge", "aufguss-yard", "program"],
      condition: { shower: 100, "cold-plunge": 100, program: 100 },
    });
    expect(costs.facilities).toBe(575);
    expect(costs.total).toBe(1087);
  });

  it("does not charge an unavailable maintainable facility while it is under repair", () => {
    const costs = calculateCanalPeriodCosts({
      ...initialState,
      built: ["program"],
      condition: { program: 20 },
      repairTask: { moduleId: "program", completesAt: 12345 },
    });
    expect(costs.facilities).toBe(0);
  });
});
