import { describe, expect, it } from "vitest";
import { simulateCanalWeek } from "../../src/sim/canalBalance";
import { starterProgram } from "../../src/sim/program";

describe("Canal Gus capacity scenarios", () => {
  it("keeps the compact starter Gus at two eight-seat sessions", () => {
    const report = simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24, activeProgram: starterProgram });
    expect(report).toMatchObject({ specialCapacity: 16, specialSeats: 14, specialOccupancy: 88 });
  });

  it("makes Bench Refit create capacity without inventing demand", () => {
    const report = simulateCanalWeek({ cash: 0, built: ["bench-refit"], masterHired: true, admissionPrice: 24, activeProgram: starterProgram });
    expect(report).toMatchObject({ specialCapacity: 22, specialSeats: 14, specialOccupancy: 64 });
  });

  it("lets a social program attract more guests but makes its higher price matter", () => {
    const social = { ...starterProgram, intent: "Social Energy" as const, supplementPrice: 7 };
    const premiumSocial = { ...social, supplementPrice: 14 };
    const ordinary = simulateCanalWeek({ cash: 0, built: ["bench-refit"], masterHired: true, admissionPrice: 24, activeProgram: social });
    const expensive = simulateCanalWeek({ cash: 0, built: ["bench-refit"], masterHired: true, admissionPrice: 24, activeProgram: premiumSocial });
    expect(ordinary.specialSeats).toBeGreaterThan(starterProgram.requestedSessions * 8);
    expect(expensive.specialSeats).toBeLessThan(ordinary.specialSeats);
  });

  it("lets a wider opening schedule create more demand at a higher operating cost", () => {
    const compact = simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24, activeProgram: starterProgram, schedule: { openDays: 3, opensAt: 12, closesAt: 18 } });
    const wide = simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24, activeProgram: starterProgram, schedule: { openDays: 6, opensAt: 8, closesAt: 22 } });
    expect(wide.admissions).toBeGreaterThan(compact.admissions);
    expect(wide.operatingCosts).toBeGreaterThan(compact.operatingCosts);
  });

  it("turns a viable higher requested frequency into more possible Gus attendance", () => {
    const twoSessions = simulateCanalWeek({ cash: 0, built: ["bench-refit"], masterHired: true, admissionPrice: 24, activeProgram: starterProgram });
    const fourSessions = simulateCanalWeek({
      cash: 0,
      built: ["bench-refit"],
      masterHired: true,
      admissionPrice: 24,
      activeProgram: { ...starterProgram, requestedSessions: 4 },
    });
    expect(fourSessions.feasibleSessions).toBe(4);
    expect(fourSessions.specialCapacity).toBeGreaterThan(twoSessions.specialCapacity ?? 0);
    expect(fourSessions.specialSeats).toBeGreaterThan(twoSessions.specialSeats);
    expect(fourSessions.costBreakdown.programMaterials).toBeGreaterThan(twoSessions.costBreakdown.programMaterials);
  });
});
