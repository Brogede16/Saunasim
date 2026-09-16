import { describe, expect, it } from "vitest";
import smallLoan from "./fixtures/canal-finance-small-loan-v1.json";
import distress from "./fixtures/canal-finance-distress-v1.json";
import constructionCompletion from "./fixtures/canal-construction-completion-v1.json";
import constructionRush from "./fixtures/canal-construction-rush-v1.json";
import { advanceCanalSimulation, createCanonicalCanalEnvelope } from "./canalRealtime";
import { rushCanalConstruction } from "./canalConstructionCommands";
import { initialState, type LoanId } from "./game";

function starterState(cash: number) {
  return {
    ...initialState,
    cash,
    built: [],
    masterHired: true,
    master: {
      name: "Starter Master",
      style: "Traditional" as const,
      heatCraft: 3,
      aromaCraft: 3,
      performanceCraft: 2,
      weeklyWage: 500,
      equipment: [],
    },
    admissionPrice: 24,
    schedule: { openDays: 5, opensAt: 10, closesAt: 20 },
  };
}

for (const fixture of [smallLoan, distress]) {
  describe(`finance fixture: ${fixture.name}`, () => {
    it("matches the canonical settlement contract", () => {
      const state = {
        ...starterState(fixture.input.cash),
        loans: [{
          id: fixture.input.loan.id as LoanId,
          weeklyPayment: fixture.input.loan.weeklyPayment,
          remainingWeeks: fixture.input.loan.remainingWeeks,
        }],
      };
      const completed = advanceCanalSimulation(
        createCanonicalCanalEnvelope(state, fixture.canonical.startedAt, fixture.canonical.seed),
        fixture.canonical.advanceTo,
      ).envelope.world;

      expect(completed.week).toBe(fixture.expected.week);
      expect(completed.cash).toBe(fixture.expected.cash);
      expect(completed.lastReport?.loanRepayment).toBe(fixture.expected.loanRepayment);
      expect(completed.lastReport?.netResult).toBe(fixture.expected.netResult);
      expect(completed.loans[0]?.remainingWeeks).toBe(fixture.expected.remainingWeeks);
      expect(completed.profitableWeeks).toBe(fixture.expected.profitableWeeks);
      expect(completed.financialDecisionPending).toBe(fixture.expected.financialDecisionPending);
    });
  });
}

describe("construction parity fixtures", () => {
  it(constructionCompletion.name, () => {
    const state = {
      ...starterState(constructionCompletion.input.cash),
      construction: [{
        moduleId: constructionCompletion.input.moduleId as "arrival",
        completesAt: constructionCompletion.canonical.completionAt,
      }],
    };
    const result = advanceCanalSimulation(
      createCanonicalCanalEnvelope(state, constructionCompletion.canonical.startedAt, constructionCompletion.canonical.seed),
      constructionCompletion.canonical.completionAt,
    );

    expect(result.envelope.world.built.includes("arrival")).toBe(constructionCompletion.expected.built);
    expect(result.envelope.world.construction).toHaveLength(constructionCompletion.expected.constructionRemaining);
    expect(result.events).toContainEqual({
      at: constructionCompletion.canonical.completionAt,
      type: constructionCompletion.expected.eventType,
      detail: constructionCompletion.expected.eventDetail,
    });
  });

  it(constructionRush.name, () => {
    const state = {
      ...starterState(constructionRush.input.cash),
      construction: [{
        moduleId: constructionRush.input.moduleId as "program",
        completesAt: constructionRush.input.projectCompletesAt,
      }],
    };
    const envelope = createCanonicalCanalEnvelope(state, constructionRush.canonical.startedAt, constructionRush.canonical.seed);
    const rushed = rushCanalConstruction(envelope, "program");
    expect(rushed.ok).toBe(true);
    if (!rushed.ok) return;

    expect(constructionRush.input.cash - rushed.envelope.world.cash).toBe(constructionRush.expected.rushCost);
    expect(rushed.envelope.world.cash).toBe(constructionRush.expected.cash);
    expect(rushed.envelope.world.built.includes("program")).toBe(constructionRush.expected.built);
    expect(rushed.envelope.world.construction).toHaveLength(constructionRush.expected.constructionRemaining);
  });
});
