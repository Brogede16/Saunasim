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
