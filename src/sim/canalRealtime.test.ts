import { describe, expect, it } from "vitest";
import { initialState } from "./game";
import { REAL_MS_PER_GAME_WEEK } from "./canonicalTime";
import { advanceCanalSimulation, createCanonicalCanalEnvelope } from "./canalRealtime";

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

  it("resolves real-time work before the weekly settlement when both matter in the same advance", () => {
    const start = 2_000_000;
    const result = advanceCanalSimulation(
      createCanonicalCanalEnvelope(
        {
          ...initialState,
          construction: [{ moduleId: "arrival" as const, completesAt: start + REAL_MS_PER_GAME_WEEK }],
        },
        start,
        99,
      ),
      start + REAL_MS_PER_GAME_WEEK,
    );

    const types = result.events.map((event) => event.type);
    expect(types[0]).toBe("construction-completed");
    expect(types.at(-1)).toBe("game-week-settled");
    expect(types.filter((type) => type === "operating-block-settled").length).toBeGreaterThan(0);
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
