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
    expect(frequent).toMatchObject({ feasibleSessions: 4, specialSeats: 28, specialCapacity: 44 });
    expect(capacityFirst.netResult).toBeLessThan(healthy.netResult);
    expect(socialYard).toMatchObject({ specialSeats: 22 });
    expect(socialYard.venueDemandNote).toContain("Outdoor Gus Yard");
    expect(loan.netResult).toBe(healthy.netResult - 375);
  });
});
