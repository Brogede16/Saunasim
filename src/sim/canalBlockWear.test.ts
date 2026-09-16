import { describe, expect, it } from "vitest";
import { calculateCanalBlockWear } from "./canalBlockWear";
import { initialState } from "./game";

describe("Canal block wear", () => {
  it("wears the programme facility directly from Special Gus use", () => {
    const state = { ...initialState, built: ["program" as const], condition: { program: 100 } };
    expect(calculateCanalBlockWear(state, { specialSeats: 7, recoveryDemand: 0 })).toEqual({ program: 1.4 });
  });

  it("wears only recovery facilities that physically exist and receive recovery demand", () => {
    const state = {
      ...initialState,
      built: ["shower" as const, "cold-plunge" as const],
      condition: { shower: 100, "cold-plunge": 100 },
    };
    expect(calculateCanalBlockWear(state, { specialSeats: 0, recoveryDemand: 3 })).toEqual({
      shower: 3,
      "cold-plunge": 3,
    });
  });

  it("does not add wear to an out-of-service or actively repaired facility", () => {
    const out = {
      ...initialState,
      built: ["program" as const, "shower" as const],
      condition: { program: 0, shower: 40 },
      repairTask: { moduleId: "shower" as const, completesAt: 123 },
    };
    expect(calculateCanalBlockWear(out, { specialSeats: 12, recoveryDemand: 4 })).toEqual({});
  });
});
