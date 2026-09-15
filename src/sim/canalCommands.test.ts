import { describe, expect, it } from "vitest";
import { REAL_MS_PER_GAME_WEEK } from "./canonicalTime";
import { applyCanalWorldChange } from "./canalCommands";
import { advanceCanalSimulation, createCanonicalCanalEnvelope } from "./canalRealtime";
import { initialState } from "./game";
import { operatingBlockKey } from "./canalWeekRuntime";

const master = {
  name: "Command Master",
  style: "Traditional" as const,
  heatCraft: 3,
  aromaCraft: 3,
  performanceCraft: 2,
  weeklyWage: 500,
  equipment: [],
};

describe("canonical Canal world-change commands", () => {
  it("captures a new price only in future blocks", () => {
    const start = 40_000_000;
    const at = start + REAL_MS_PER_GAME_WEEK * 0.4;
    const state = {
      ...initialState,
      masterHired: true,
      master,
      activeProgram: { ...initialState.activeProgram, requestedSessions: 5 },
    };
    const partial = advanceCanalSimulation(createCanonicalCanalEnvelope(state, start, 61), at).envelope;
    const settledKeys = partial.operatingRuntime!.settledBlockKeys;

    const changed = applyCanalWorldChange(partial, (world) => ({ ...world, admissionPrice: 37 }));
    const settled = changed.operatingRuntime!.plannedBlocks.filter((block) => settledKeys.includes(operatingBlockKey(block)));
    const future = changed.operatingRuntime!.plannedBlocks.filter((block) => !settledKeys.includes(operatingBlockKey(block)));

    expect(changed.world.admissionPrice).toBe(37);
    expect(settled.every((block) => block.admissionPrice === 24)).toBe(true);
    expect(future.length).toBeGreaterThan(0);
    expect(future.every((block) => block.admissionPrice === 37)).toBe(true);
  });

  it("can continue to the same week boundary after a midweek change without replaying settled blocks", () => {
    const start = 50_000_000;
    const at = start + REAL_MS_PER_GAME_WEEK * 0.4;
    const end = start + REAL_MS_PER_GAME_WEEK;
    const state = {
      ...initialState,
      masterHired: true,
      master,
      activeProgram: { ...initialState.activeProgram, requestedSessions: 5 },
    };
    const partial = advanceCanalSimulation(createCanonicalCanalEnvelope(state, start, 62), at).envelope;
    const cashAtChange = partial.world.cash;
    const changed = applyCanalWorldChange(partial, (world) => ({ ...world, admissionPrice: 37 }));
    const finished = advanceCanalSimulation(changed, end).envelope;

    expect(finished.world.week).toBe(2);
    expect(finished.world.lastReport).toBeDefined();
    expect(finished.operatingRuntime).toBeUndefined();
    expect(finished.world.cash).not.toBe(cashAtChange);
  });
});
