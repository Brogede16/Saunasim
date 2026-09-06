import { describe, expect, it } from "vitest";
import { runCanalScenarioMatrix, scenarioReport } from "../../src/sim/canalScenarioMatrix";

describe("Canal balance scenario matrix", () => {
  it("keeps every core trade-off in one explicit, runnable contract", () => {
    const rows = runCanalScenarioMatrix();
    expect(rows).toHaveLength(8);
    expect(rows.map((row) => row.scenario.id)).toEqual([
      "owner-routine",
      "healthy-starter",
      "overpriced-starter",
      "higher-frequency",
      "capacity-before-demand",
      "social-yard-fit",
      "cold-recovery-pressure",
      "loan-pressure",
    ]);
  });

  it("protects the intended economic relationships", () => {
    const owner = scenarioReport("owner-routine");
    const healthy = scenarioReport("healthy-starter");
    const overpriced = scenarioReport("overpriced-starter");
    const frequent = scenarioReport("higher-frequency");
    const capacityFirst = scenarioReport("capacity-before-demand");
    const socialYard = scenarioReport("social-yard-fit");
    const loan = scenarioReport("loan-pressure");

    expect(owner.netResult).toBe(8);
    expect(healthy.netResult).toBe(558);
    expect(overpriced.netResult).toBeLessThan(healthy.netResult);
    // specialSeats includes the bounded walk-up top-up (2026-08-26) filling some of the capacity
    // four feasible sessions leave spare beyond real programme demand, on top of Bench Refit.
    expect(frequent).toMatchObject({ feasibleSessions: 4, specialSeats: 32, specialCapacity: 44 });
    expect(capacityFirst.netResult).toBeLessThan(healthy.netResult);
    // Includes the bounded walk-up top-up (2026-08-26) on top of the Outdoor Gus Sauna's own
    // physical-fit demand boost.
    expect(socialYard).toMatchObject({ specialSeats: 27 });
    expect(socialYard.venueDemandNote).toContain("Outdoor Gus Sauna");
    expect(loan.netResult).toBe(healthy.netResult - 375);
  });
});
