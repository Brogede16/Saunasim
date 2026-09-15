import { describe, expect, it } from "vitest";
import { REAL_MS_PER_GAME_WEEK } from "./canonicalTime";
import { planCanalOperations } from "./canalOperatingPlan";
import { advanceCanalSimulation, createCanonicalCanalEnvelope } from "./canalRealtime";
import { initialState, type GameState, type MasterProfile } from "./game";

const master: MasterProfile = {
  name: "Plan Master",
  style: "Traditional",
  heatCraft: 3,
  aromaCraft: 3,
  performanceCraft: 2,
  weeklyWage: 500,
  equipment: [],
};

function runCanonicalWeek(state: GameState, seed = 100) {
  const start = 1_000_000;
  return advanceCanalSimulation(
    createCanonicalCanalEnvelope(state, start, seed),
    start + REAL_MS_PER_GAME_WEEK,
  ).envelope.world;
}

describe("Canal operating plan integration", () => {
  it("uses actual scheduled Gus sessions as the feasible weekly count", () => {
    const state = {
      ...initialState,
      masterHired: true,
      master,
      activeProgram: { ...initialState.activeProgram, requestedSessions: 4 },
    };
    const plan = planCanalOperations(state);
    const settled = runCanonicalWeek(state);

    expect(plan.aufguss.scheduled).toHaveLength(4);
    expect(settled.lastReport).toMatchObject({ requestedSessions: 4, feasibleSessions: 4 });
  });

  it("charges the Master from concrete paid work windows instead of all opening hours", () => {
    const state = {
      ...initialState,
      masterHired: true,
      master,
      activeProgram: { ...initialState.activeProgram, requestedSessions: 2 },
    };
    const plan = planCanalOperations(state);
    const settled = runCanonicalWeek(state);

    expect(plan.aufguss.masterWage).toBeGreaterThan(0);
    expect(plan.aufguss.masterWage).toBeLessThan(master.weeklyWage);
    expect(settled.lastReport?.costBreakdown.staff).toBe(plan.staffWage);
  });

  it("turns uncovered 24-hour opening into lost operating time instead of free revenue", () => {
    const unstaffed: GameState = {
      ...initialState,
      schedule: { openDays: 7, opensAt: 0, closesAt: 24 },
      serviceHostCount: 0,
    };
    const staffed: GameState = {
      ...unstaffed,
      built: ["shop"],
      hostHired: true,
      serviceHostCount: 3,
    };

    const unstaffedPlan = planCanalOperations(unstaffed);
    const staffedPlan = planCanalOperations(staffed);
    const unstaffedWeek = runCanonicalWeek(unstaffed, 101);
    const staffedWeek = runCanonicalWeek(staffed, 102);

    expect(unstaffedPlan.staffing.uncoveredHostHours).toBe(118);
    expect(unstaffedPlan.effectiveSchedule.closesAt).toBeLessThan(24);
    expect(staffedPlan.staffing.uncoveredHostHours).toBe(0);
    expect(staffedWeek.lastReport!.admissions).toBeGreaterThan(unstaffedWeek.lastReport!.admissions);
    expect(staffedWeek.lastReport!.costBreakdown.staff).toBeGreaterThan(unstaffedWeek.lastReport!.costBreakdown.staff);
  });
});
