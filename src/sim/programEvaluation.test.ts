import { describe, expect, it } from "vitest";
import { type MasterProfile } from "./game";
import { starterProgram } from "./program";
import { evaluateProgramDelivery } from "./programEvaluation";

const peakMaster: MasterProfile = {
  name: "Morgan Vale", style: "Traditional", heatCraft: 8, aromaCraft: 8, performanceCraft: 8, weeklyWage: 0, equipment: [],
};

describe("three-part Gus review", () => {
  it("allows a well-delivered Ultimate Classic Ritual to reach five stars", () => {
    const program = { ...starterProgram, intent: "Classic Ritual" as const, performance: "Classic Towelwork" as const, recoveryFinish: "Outdoor Shower" as const, supplementPrice: 18, revealedTier: "Ultimate" as const };
    expect(evaluateProgramDelivery(program, ["program", "shower"], peakMaster, 70)).toMatchObject({ composition: "Ultimate", execution: "Iconic", venueFit: "Iconic", stars: 5 });
  });

  it("does not hard-cap a staged Show Journey below five stars", () => {
    const program = { ...starterProgram, intent: "Show Journey" as const, performance: "Story-led Performance" as const, supplementPrice: 18, revealedTier: "Iconic" as const };
    const theatricalMaster = { ...peakMaster, style: "Theatrical" as const };
    expect(evaluateProgramDelivery(program, ["program", "aufguss-yard"], theatricalMaster, 70)).toMatchObject({ composition: "Iconic", execution: "Iconic", venueFit: "Iconic", stars: 5 });
  });
});
