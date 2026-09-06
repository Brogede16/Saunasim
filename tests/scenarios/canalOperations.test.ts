import { describe, expect, it } from "vitest";
import { simulateCanalWeek } from "../../src/sim/canalBalance";
import { evaluateProgramDelivery } from "../../src/sim/programEvaluation";
import { starterProgram } from "../../src/sim/program";
import { makeMaster } from "../factories";

const starterMaster = makeMaster();

describe("Canal operating scenarios", () => {
  it("keeps a modest, two-session starter offer in the healthy first-week band", () => {
    const report = simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24, activeProgram: starterProgram });
    expect(report.admissions).toBeGreaterThanOrEqual(65);
    expect(report.admissions).toBeLessThanOrEqual(75);
    expect(report.specialSeats).toBe(14);
    expect(report.revenue).toBe(1_778);
    expect(report.operatingCosts).toBe(1_220);
    expect(report.netResult).toBe(558);
  });

  it("makes an unsupported entry-price increase worse than the healthy offer", () => {
    const healthy = simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24, activeProgram: starterProgram });
    const overpriced = simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 32, activeProgram: starterProgram });
    expect(overpriced.admissions).toBeLessThan(healthy.admissions);
    expect(overpriced.netResult).toBeLessThan(healthy.netResult);
  });

  it("gives a dedicated programme room a bounded fit benefit rather than a solved economy", () => {
    const compact = simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24, activeProgram: starterProgram });
    const expanded = simulateCanalWeek({ cash: 0, built: ["program"], masterHired: true, admissionPrice: 24, activeProgram: starterProgram });
    expect(expanded.specialCapacity).toBeGreaterThan(compact.specialCapacity ?? 0);
    expect(expanded.specialSeats).toBeGreaterThan(compact.specialSeats);
    expect(expanded.specialSeats).toBeLessThan(expanded.specialCapacity ?? 0);
    expect(expanded.venueDemandNote).toContain("dedicated sauna");
    expect(expanded.netResult - compact.netResult).toBeLessThan(200);
  });

  it("lets a fitting social Gus fill extra seats before it needs a major new room", () => {
    const social = { ...starterProgram, intent: "Social Energy" as const, performance: "Rhythmic Flow" as const };
    const report = simulateCanalWeek({ cash: 0, built: ["bench-refit"], masterHired: true, admissionPrice: 24, activeProgram: social });
    // +1 seat above the pre-walk-up 19 is the bounded walk-up top-up (2026-08-26) filling some of
    // the capacity Bench Refit adds beyond what the social programme's own demand fills.
    expect(report.specialSeats).toBe(20);
    expect(report.specialOccupancy).toBeGreaterThanOrEqual(80);
  });

  it("makes the Outdoor Gus Sauna help a social promise rather than all programmes equally", () => {
    const social = { ...starterProgram, intent: "Social Energy" as const, performance: "Rhythmic Flow" as const };
    const compact = simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24, activeProgram: social });
    const yard = simulateCanalWeek({ cash: 0, built: ["aufguss-yard"], masterHired: true, admissionPrice: 24, activeProgram: social });
    expect(yard.specialSeats).toBeGreaterThan(compact.specialSeats);
    expect(yard.venueDemandNote).toContain("Outdoor Gus Sauna");
  });

  it("treats a recovery promise without its physical asset as a failed venue fit", () => {
    const program = { ...starterProgram, intent: "Quiet Recovery" as const, recoveryFinish: "Cold Plunge" as const };
    const withoutPlunge = evaluateProgramDelivery(program, [], starterMaster, 70);
    const withPlunge = evaluateProgramDelivery(program, ["cold-plunge"], starterMaster, 70);
    expect(withoutPlunge.venueFit).toBe("Bad");
    expect(withPlunge.venueFit).not.toBe("Bad");
  });

  it("keeps a loan repayment visible as a distinct drag on the same operating week", () => {
    const operating = simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24, activeProgram: starterProgram });
    const borrowed = simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24, activeProgram: starterProgram, loanRepayment: 375 });
    expect(borrowed.netResult).toBe(operating.netResult - 375);
    expect(borrowed.loanRepayment).toBe(375);
  });

  it("makes a Host pay for ordinary reception and shop flow, then improve further under pressure", () => {
    const withoutHost = simulateCanalWeek({ cash: 0, built: ["shop"], masterHired: true, admissionPrice: 24, activeProgram: starterProgram });
    const withHost = simulateCanalWeek({ cash: 0, built: ["shop"], masterHired: true, hostHired: true, admissionPrice: 24, activeProgram: starterProgram });
    expect(withHost.shopSales).toBeGreaterThan(withoutHost.shopSales);
    expect(withHost.netResult).toBeGreaterThan(withoutHost.netResult);

    const pressuredBuilt = ["arrival", "shop", "program", "aufguss-yard", "cold-plunge"] as const;
    const pressuredWithoutHost = simulateCanalWeek({ cash: 0, built: pressuredBuilt, masterHired: true, admissionPrice: 24, activeProgram: starterProgram });
    const pressuredWithHost = simulateCanalWeek({ cash: 0, built: pressuredBuilt, masterHired: true, hostHired: true, admissionPrice: 24, activeProgram: starterProgram });
    expect(pressuredWithHost.admissions).toBeGreaterThan(pressuredWithoutHost.admissions);
    expect(pressuredWithHost.netResult).toBeGreaterThan(pressuredWithoutHost.netResult);
  });
});
