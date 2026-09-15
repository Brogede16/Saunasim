import { describe, expect, it } from "vitest";
import { REAL_MS_PER_GAME_WEEK } from "../sim/canonicalTime";
import { createCanonicalCanalEnvelope, advanceCanalSimulation } from "../sim/canalRealtime";
import { initialState } from "../sim/game";
import {
  exportCanonicalSimulationSave,
  importCanonicalSimulationSave,
  migrateLegacyGameSaveToCanonical,
  resumeCanonicalSimulationSave,
} from "./canonicalSimulationSave";
import { exportSave } from "./savegame";

describe("canonical simulation save", () => {
  it("round-trips canonical timestamps, RNG and game state", () => {
    const envelope = createCanonicalCanalEnvelope({ ...initialState, cash: 7_500 }, 10_000, 42);
    const restored = importCanonicalSimulationSave(exportCanonicalSimulationSave(envelope));
    expect(restored).toEqual(envelope);
  });

  it("resuming a saved game produces the same state as continuous canonical advance", () => {
    const start = 20_000;
    const target = start + REAL_MS_PER_GAME_WEEK;
    const initial = createCanonicalCanalEnvelope(
      {
        ...initialState,
        construction: [{ moduleId: "arrival" as const, completesAt: start + REAL_MS_PER_GAME_WEEK / 2 }],
      },
      start,
      88,
    );

    const direct = advanceCanalSimulation(initial, target);
    const resumed = resumeCanonicalSimulationSave(exportCanonicalSimulationSave(initial), target);

    expect(resumed).toEqual(direct);
  });

  it("persists settled midweek blocks so resume cannot replay revenue, cost or wear", () => {
    const start = 30_000;
    const midweek = start + REAL_MS_PER_GAME_WEEK * 0.55;
    const end = start + REAL_MS_PER_GAME_WEEK;
    const initial = createCanonicalCanalEnvelope(
      {
        ...initialState,
        built: ["program" as const],
        condition: { program: 100 },
        masterHired: true,
        master: {
          name: "Save Test Master",
          style: "Traditional" as const,
          heatCraft: 3,
          aromaCraft: 3,
          performanceCraft: 2,
          weeklyWage: 500,
          equipment: [],
        },
      },
      start,
      91,
    );

    const partial = advanceCanalSimulation(initial, midweek).envelope;
    expect(partial.operatingRuntime?.settledBlockKeys.length).toBeGreaterThan(0);
    expect(partial.world.cash).not.toBe(initial.world.cash);
    expect(partial.world.condition.program).toBeLessThan(100);

    const serialized = exportCanonicalSimulationSave(partial);
    const restored = importCanonicalSimulationSave(serialized);
    expect(restored?.operatingRuntime).toEqual(partial.operatingRuntime);

    const resumed = resumeCanonicalSimulationSave(serialized, end);
    const continuous = advanceCanalSimulation(partial, end);
    expect(resumed).toEqual(continuous);
  });

  it("migrates an existing compatible browser save without fabricating offline time", () => {
    const legacy = exportSave({ ...initialState, venueName: "Old Canal", cash: 6_200 });
    const migrated = migrateLegacyGameSaveToCanonical(legacy, 123_456, 17);

    expect(migrated).toMatchObject({
      startedAt: 123_456,
      lastSimulatedAt: 123_456,
      world: { venueName: "Old Canal", cash: 6_200 },
    });
  });
});
