import { describe, expect, it } from "vitest";
import fixture from "./fixtures/canal-upgraded-channels-v1.json";
import { advanceCanalSimulation, createCanonicalCanalEnvelope } from "./canalRealtime";
import { initialState } from "./game";

describe("shared upgraded channel parity fixture", () => {
  it(fixture.name, () => {
    const input = fixture.input;
    const state = {
      ...initialState,
      cash: input.cash,
      built: input.built as typeof initialState.built,
      condition: input.condition,
      masterHired: input.masterHired,
      master: {
        ...input.master,
        style: input.master.style as "Traditional",
        equipment: [],
      },
      admissionPrice: input.admissionPrice,
      schedule: input.schedule,
      activeProgram: {
        ...initialState.activeProgram,
        recoveryFinish: input.recoveryFinish as "Cold Plunge",
      },
    };
    const completed = advanceCanalSimulation(
      createCanonicalCanalEnvelope(state, fixture.canonical.startedAt, fixture.canonical.seed),
      fixture.canonical.advanceTo,
    ).envelope;
    const report = completed.world.lastReport!;

    expect(completed.world.week).toBe(fixture.expected.week);
    expect(completed.world.cash).toBe(fixture.expected.cash);
    expect(report.admissions).toBe(fixture.expected.admissions);
    expect(report.specialSeats).toBe(fixture.expected.specialSeats);
    expect(report.specialCapacity).toBe(fixture.expected.specialCapacity);
    expect(report.specialDemand).toBe(fixture.expected.specialDemand);
    expect(report.walkUpSeats).toBe(fixture.expected.walkUpSeats);
    expect(report.turnedAwayFromGus).toBe(fixture.expected.turnedAwayFromGus);
    expect(report.shopSales).toBe(fixture.expected.shopSales);
    expect(report.revenueBreakdown.shop).toBe(fixture.expected.shopRevenue);
    expect(report.costBreakdown.shopProcurement).toBe(fixture.expected.shopProcurement);
    expect(report.recoveryDemand).toBe(fixture.expected.recoveryDemand);
    expect(report.queueLoss).toBe(fixture.expected.queueLoss);
    expect(report.revenueBreakdown.admissions).toBe(fixture.expected.admissionRevenue);
    expect(report.revenueBreakdown.specialGus).toBe(fixture.expected.specialRevenue);
    expect(report.revenue).toBe(fixture.expected.revenue);
    expect(report.operatingCosts).toBe(fixture.expected.operatingCosts);
    expect(report.netResult).toBe(fixture.expected.netResult);
    expect(completed.world.condition.program).toBe(fixture.expected.condition.program);
    expect(completed.world.condition.shower).toBe(fixture.expected.condition.shower);
    expect(completed.world.condition["cold-plunge"]).toBe(fixture.expected.condition["cold-plunge"]);
    expect(completed.operatingRuntime === undefined).toBe(fixture.expected.runtimeClearedAtBoundary);
  });
});
