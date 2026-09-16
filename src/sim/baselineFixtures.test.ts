import { describe, expect, it } from "vitest";
import legacyBaseline from "./fixtures/canal-baseline-v1.json";
import canonicalBaseline from "./fixtures/canal-canonical-week-v2.json";
import midweekReprice from "./fixtures/canal-midweek-reprice-v1.json";
import { simulateCanalWeek } from "./canalBalance";
import { advanceCanalSimulation, createCanonicalCanalEnvelope } from "./canalRealtime";
import { applyCanalWorldChange } from "./canalCommands";
import { REAL_MS_PER_GAME_WEEK } from "./canonicalTime";
import { initialState } from "./game";

function stateFromFixture(input: typeof canonicalBaseline.input) {
  return {
    ...initialState,
    cash: input.cash,
    built: [],
    masterHired: true,
    master: {
      ...input.master,
      style: input.master.style as "Traditional",
      equipment: [],
    },
    admissionPrice: input.admissionPrice,
    schedule: input.schedule,
  };
}

describe("portable browser-to-native baseline fixtures", () => {
  it(legacyBaseline.name, () => {
    const result = simulateCanalWeek(legacyBaseline.input);
    expect(result).toMatchObject(legacyBaseline.expected);
  });

  it(canonicalBaseline.name, () => {
    const state = stateFromFixture(canonicalBaseline.input);
    const result = advanceCanalSimulation(
      createCanonicalCanalEnvelope(state, canonicalBaseline.canonical.startedAt, canonicalBaseline.canonical.seed),
      canonicalBaseline.canonical.advanceTo,
    );
    const report = result.envelope.world.lastReport;

    expect(result.envelope.world.week).toBe(canonicalBaseline.expected.week);
    expect(result.envelope.world.cash).toBe(canonicalBaseline.expected.cash);
    expect(report).toMatchObject({
      admissions: canonicalBaseline.expected.admissions,
      specialSeats: canonicalBaseline.expected.specialSeats,
      shopSales: canonicalBaseline.expected.shopSales,
      revenue: canonicalBaseline.expected.revenue,
      operatingCosts: canonicalBaseline.expected.operatingCosts,
      loanRepayment: canonicalBaseline.expected.loanRepayment,
      netResult: canonicalBaseline.expected.netResult,
      feasibleSessions: canonicalBaseline.expected.feasibleSessions,
      costBreakdown: { staff: canonicalBaseline.expected.staffCost },
    });
    expect(result.envelope.operatingRuntime === undefined).toBe(canonicalBaseline.expected.runtimeClearedAtBoundary);
  });

  it(midweekReprice.name, () => {
    const state = stateFromFixture(midweekReprice.input);
    const startedAt = midweekReprice.canonical.startedAt;
    const changeAt = startedAt + REAL_MS_PER_GAME_WEEK * midweekReprice.canonical.changeAtFractionOfWeek;
    const boundary = startedAt + REAL_MS_PER_GAME_WEEK;
    const partial = advanceCanalSimulation(
      createCanonicalCanalEnvelope(state, startedAt, midweekReprice.canonical.seed),
      changeAt,
    ).envelope;

    expect(partial.operatingRuntime?.settledBlockKeys).toHaveLength(midweekReprice.expected.settledBlocksBeforeCommand);
    expect(partial.operatingRuntime?.accruedAdmissions).toBe(midweekReprice.expected.accruedAdmissionsBeforeCommand);

    const repriced = applyCanalWorldChange(partial, (world) => ({
      ...world,
      admissionPrice: midweekReprice.command.value,
    }));
    const completed = advanceCanalSimulation(repriced, boundary).envelope;
    const report = completed.world.lastReport!;

    expect(completed.world.week).toBe(midweekReprice.expected.finalWeek);
    expect(report.admissions).toBe(midweekReprice.expected.finalAdmissions);
    expect(report.specialSeats).toBe(midweekReprice.expected.finalSpecialSeats);
    expect(report.revenueBreakdown.admissions).toBe(midweekReprice.expected.finalAdmissionRevenue);
    expect(report.revenueBreakdown.specialGus).toBe(midweekReprice.expected.finalSpecialRevenue);
    expect(report.revenue).toBe(midweekReprice.expected.finalRevenue);
    expect(report.operatingCosts).toBe(midweekReprice.expected.finalOperatingCosts);
    expect(report.netResult).toBe(midweekReprice.expected.finalNetResult);
    expect(completed.world.cash).toBe(midweekReprice.expected.finalCash);
    expect(completed.operatingRuntime === undefined).toBe(midweekReprice.expected.runtimeClearedAtBoundary);
  });
});
