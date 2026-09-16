import { describe, expect, it } from "vitest";
import { initialState } from "./game";
import { REAL_MS_PER_GAME_WEEK } from "./canonicalTime";
import { advanceCanalSimulation, createCanonicalCanalEnvelope } from "./canalRealtime";
import { applyCanalWorldChange } from "./canalCommands";

function expectedGuestSampleCount(admissions: number) {
  return Math.min(8, Math.max(4, Math.ceil(admissions / 12)));
}

describe("Canal canonical realtime bridge", () => {
  it("produces the same canonical state when 24 hours advance in one offline jump or four online chunks", () => {
    const start = 1_000_000;
    const state = {
      ...initialState,
      construction: [{ moduleId: "arrival" as const, completesAt: start + REAL_MS_PER_GAME_WEEK / 4 }],
    };

    const offline = advanceCanalSimulation(createCanonicalCanalEnvelope(state, start, 12345), start + REAL_MS_PER_GAME_WEEK);

    let onlineEnvelope = createCanonicalCanalEnvelope(state, start, 12345);
    for (let quarter = 1; quarter <= 4; quarter += 1) {
      onlineEnvelope = advanceCanalSimulation(
        onlineEnvelope,
        start + (REAL_MS_PER_GAME_WEEK * quarter) / 4,
      ).envelope;
    }

    expect(onlineEnvelope).toEqual(offline.envelope);
    expect(offline.envelope.world.week).toBe(2);
    expect(offline.envelope.world.built).toContain("arrival");
    expect(offline.envelope.lastSimulatedAt).toBe(start + REAL_MS_PER_GAME_WEEK);
  });

  it("replans only future blocks when an operating input changes midweek", () => {
    const start = 1_500_000;
    const midweek = start + REAL_MS_PER_GAME_WEEK * 0.35;
    const boundary = start + REAL_MS_PER_GAME_WEEK;
    const initial = createCanonicalCanalEnvelope(initialState, start, 54321);
    const partial = advanceCanalSimulation(initial, midweek).envelope;

    const beforeRuntime = partial.operatingRuntime!;
    expect(beforeRuntime.settledBlockKeys.length).toBeGreaterThan(0);
    const settledBefore = [...beforeRuntime.settledBlockKeys];
    const admissionsBefore = beforeRuntime.accruedAdmissions;
    const cashBefore = partial.world.cash;

    const repriced = applyCanalWorldChange(partial, (world) => ({ ...world, admissionPrice: 40 }));

    expect(repriced.world.cash).toBe(cashBefore);
    expect(repriced.operatingRuntime?.settledBlockKeys).toEqual(settledBefore);
    expect(repriced.operatingRuntime?.accruedAdmissions).toBe(admissionsBefore);

    const changedWeek = advanceCanalSimulation(repriced, boundary).envelope;
    const unchangedWeek = advanceCanalSimulation(partial, boundary).envelope;
    expect(changedWeek.world.lastReport!.admissions).toBeLessThan(unchangedWeek.world.lastReport!.admissions);
    expect(changedWeek.world.lastReport!.revenueBreakdown.admissions).toBeLessThan(unchangedWeek.world.lastReport!.revenueBreakdown.admissions);
    expect(changedWeek.world.lastReport!.guestSnapshots).toHaveLength(
      expectedGuestSampleCount(changedWeek.world.lastReport!.admissions),
    );
    expect(unchangedWeek.world.lastReport!.guestSnapshots).toHaveLength(
      expectedGuestSampleCount(unchangedWeek.world.lastReport!.admissions),
    );
  });

  it("publishes program-review occupancy from actually delivered Gus capacity", () => {
    const start = 1_750_000;
    const boundary = start + REAL_MS_PER_GAME_WEEK;
    const state = {
      ...initialState,
      masterHired: true,
      master: {
        name: "Review Master",
        style: "Traditional" as const,
        heatCraft: 3,
        aromaCraft: 3,
        performanceCraft: 2,
        weeklyWage: 500,
        equipment: [],
      },
      activeProgram: { ...initialState.activeProgram, requestedSessions: 2 },
    };

    const result = advanceCanalSimulation(createCanonicalCanalEnvelope(state, start, 31337), boundary).envelope;
    expect(result.world.lastReport).toMatchObject({
      specialSeats: 14,
      specialCapacity: 16,
      specialOccupancy: 88,
    });
    expect(result.world.lastReport?.programReview).toBeDefined();
  });

  it("resolves real-time work before the weekly settlement when both share the boundary timestamp", () => {
    const start = 2_000_000;
    const boundary = start + REAL_MS_PER_GAME_WEEK;
    const result = advanceCanalSimulation(
      createCanonicalCanalEnvelope(
        {
          ...initialState,
          construction: [{ moduleId: "arrival" as const, completesAt: boundary }],
        },
        start,
        99,
      ),
      boundary,
    );

    const constructionIndex = result.events.findIndex((event) => event.type === "construction-completed");
    const settlementIndex = result.events.findIndex((event) => event.type === "game-week-settled");
    expect(constructionIndex).toBeGreaterThanOrEqual(0);
    expect(settlementIndex).toBeGreaterThan(constructionIndex);
    expect(result.events[constructionIndex]?.at).toBe(boundary);
    expect(result.events[settlementIndex]?.at).toBe(boundary);
    expect(result.events.filter((event) => event.type === "operating-block-settled").length).toBeGreaterThan(0);
    expect(result.envelope.world.built).toContain("arrival");
    expect(result.envelope.world.lastReport?.netResult).toBeDefined();
  });

  it("resolves repair and recruitment milestones without waiting for a full game week", () => {
    const start = 3_000_000;
    const state = {
      ...initialState,
      built: ["shower" as const],
      condition: { shower: 20 },
      technicianHired: true,
      repairTask: { moduleId: "shower" as const, completesAt: start + 10_000 },
      masterSearch: { tier: "patient" as const, completesAt: start + 20_000 },
    };

    const result = advanceCanalSimulation(createCanonicalCanalEnvelope(state, start, 7), start + 30_000);

    expect(result.envelope.world.condition.shower).toBe(100);
    expect(result.envelope.world.repairTask).toBeUndefined();
    expect(result.envelope.world.masterSearch).toBeUndefined();
    expect(result.envelope.world.masterCandidates).toHaveLength(2);
    expect(result.envelope.world.week).toBe(1);
  });
});
