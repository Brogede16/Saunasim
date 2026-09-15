import { describe, expect, it } from "vitest";
import { REAL_MS_PER_GAME_WEEK } from "./canonicalTime";
import { advanceCanalSimulation, createCanonicalCanalEnvelope } from "./canalRealtime";
import { replanFutureCanalOperatingRuntime } from "./canalRuntimeReplan";
import { initialState } from "./game";
import { operatingBlockKey } from "./canalWeekRuntime";

const master = {
  name: "Replan Master",
  style: "Traditional" as const,
  heatCraft: 3,
  aromaCraft: 3,
  performanceCraft: 2,
  weeklyWage: 500,
  equipment: [],
};

describe("future-only Canal operating replan", () => {
  it("keeps settled blocks and accrued accounting immutable while future blocks take a new price", () => {
    const start = 10_000_000;
    const at = start + REAL_MS_PER_GAME_WEEK * 0.4;
    const state = {
      ...initialState,
      masterHired: true,
      master,
      activeProgram: { ...initialState.activeProgram, requestedSessions: 5 },
    };
    const partial = advanceCanalSimulation(createCanonicalCanalEnvelope(state, start, 55), at).envelope;
    const runtime = partial.operatingRuntime!;
    const settledBefore = runtime.plannedBlocks.filter((block) => runtime.settledBlockKeys.includes(operatingBlockKey(block)));
    const accruedBefore = {
      admissions: runtime.accruedAdmissions,
      specialSeats: runtime.accruedSpecialSeats,
      shopSales: runtime.accruedShopSales,
      revenue: runtime.accruedRevenueBreakdown,
      costs: runtime.accruedCostBreakdown,
      net: runtime.accruedOperatingNet,
    };
    const updatedWorld = { ...partial.world, admissionPrice: 40 };

    const replanned = replanFutureCanalOperatingRuntime(updatedWorld, runtime, start, at);
    const settledAfter = replanned.plannedBlocks.filter((block) => replanned.settledBlockKeys.includes(operatingBlockKey(block)));
    const future = replanned.plannedBlocks.filter((block) => !replanned.settledBlockKeys.includes(operatingBlockKey(block)));

    expect(settledAfter).toEqual(settledBefore);
    expect({
      admissions: replanned.accruedAdmissions,
      specialSeats: replanned.accruedSpecialSeats,
      shopSales: replanned.accruedShopSales,
      revenue: replanned.accruedRevenueBreakdown,
      costs: replanned.accruedCostBreakdown,
      net: replanned.accruedOperatingNet,
    }).toEqual(accruedBefore);
    expect(future.length).toBeGreaterThan(0);
    expect(future.every((block) => block.admissionPrice === 40)).toBe(true);
    expect(settledAfter.every((block) => block.admissionPrice === 24)).toBe(true);
  });

  it("removes only future Gus sessions when the programme is changed midweek", () => {
    const start = 20_000_000;
    const at = start + REAL_MS_PER_GAME_WEEK * 0.4;
    const state = {
      ...initialState,
      masterHired: true,
      master,
      activeProgram: { ...initialState.activeProgram, requestedSessions: 5 },
    };
    const partial = advanceCanalSimulation(createCanonicalCanalEnvelope(state, start, 56), at).envelope;
    const runtime = partial.operatingRuntime!;
    const alreadySettledGus = runtime.plannedBlocks
      .filter((block) => runtime.settledBlockKeys.includes(operatingBlockKey(block)))
      .reduce((sum, block) => sum + block.scheduledAufguss, 0);
    const updatedWorld = {
      ...partial.world,
      activeProgram: { ...partial.world.activeProgram, requestedSessions: 0 },
    };

    const replanned = replanFutureCanalOperatingRuntime(updatedWorld, runtime, start, at);
    const settledGusAfter = replanned.plannedBlocks
      .filter((block) => replanned.settledBlockKeys.includes(operatingBlockKey(block)))
      .reduce((sum, block) => sum + block.scheduledAufguss, 0);
    const futureGus = replanned.plannedBlocks
      .filter((block) => !replanned.settledBlockKeys.includes(operatingBlockKey(block)))
      .reduce((sum, block) => sum + block.scheduledAufguss, 0);

    expect(settledGusAfter).toBe(alreadySettledGus);
    expect(futureGus).toBe(0);
  });

  it("does not reapply wear that was already settled before replanning", () => {
    const start = 30_000_000;
    const at = start + REAL_MS_PER_GAME_WEEK * 0.4;
    const state = {
      ...initialState,
      built: ["program" as const],
      condition: { program: 100 },
      masterHired: true,
      master,
      activeProgram: { ...initialState.activeProgram, requestedSessions: 5 },
    };
    const partial = advanceCanalSimulation(createCanonicalCanalEnvelope(state, start, 57), at).envelope;
    const runtime = partial.operatingRuntime!;
    const settledWear = runtime.plannedBlocks
      .filter((block) => runtime.settledBlockKeys.includes(operatingBlockKey(block)))
      .reduce((sum, block) => sum + (block.wear.program ?? 0), 0);

    const replanned = replanFutureCanalOperatingRuntime(partial.world, runtime, start, at);
    const futureWear = replanned.plannedBlocks
      .filter((block) => !replanned.settledBlockKeys.includes(operatingBlockKey(block)))
      .reduce((sum, block) => sum + (block.wear.program ?? 0), 0);
    const originalWeeklyWear = runtime.plannedBlocks.reduce((sum, block) => sum + (block.wear.program ?? 0), 0);

    expect(settledWear).toBeGreaterThan(0);
    expect(Math.round((settledWear + futureWear) * 10000) / 10000).toBe(originalWeeklyWear);
  });
});
