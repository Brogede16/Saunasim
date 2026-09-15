import { describe, expect, it } from "vitest";
import legacyBaseline from "./fixtures/canal-baseline-v1.json";
import canonicalBaseline from "./fixtures/canal-canonical-week-v2.json";
import { simulateCanalWeek } from "./canalBalance";
import { advanceCanalSimulation, createCanonicalCanalEnvelope } from "./canalRealtime";
import { initialState } from "./game";

describe("portable browser-to-native baseline fixtures", () => {
  it(legacyBaseline.name, () => {
    const result = simulateCanalWeek(legacyBaseline.input);
    expect(result).toMatchObject(legacyBaseline.expected);
  });

  it(canonicalBaseline.name, () => {
    const state = {
      ...initialState,
      cash: canonicalBaseline.input.cash,
      built: [],
      masterHired: true,
      master: {
        ...canonicalBaseline.input.master,
        style: canonicalBaseline.input.master.style as "Traditional",
        equipment: [],
      },
      admissionPrice: canonicalBaseline.input.admissionPrice,
      schedule: canonicalBaseline.input.schedule,
    };
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
});
