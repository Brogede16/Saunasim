import { describe, expect, it } from "vitest";
import { REAL_MS_PER_GAME_WEEK } from "./canonicalTime";
import { advanceCanalSimulation, createCanonicalCanalEnvelope } from "./canalRealtime";
import { initialState } from "./game";

describe("canonical Canal operating events", () => {
  it("emits time-stamped operating blocks before the weekly settlement", () => {
    const start = 1_000_000;
    const master = {
      name: "Test Master",
      style: "Traditional" as const,
      heatCraft: 3,
      aromaCraft: 3,
      performanceCraft: 2,
      weeklyWage: 500,
      equipment: [],
    };
    const state = {
      ...initialState,
      masterHired: true,
      master,
      activeProgram: { ...initialState.activeProgram, requestedSessions: 3 },
    };

    const result = advanceCanalSimulation(
      createCanonicalCanalEnvelope(state, start, 42),
      start + REAL_MS_PER_GAME_WEEK,
    );
    const blocks = result.events.filter((event) => event.type === "operating-block-settled");
    const settlement = result.events.at(-1);

    expect(blocks.length).toBeGreaterThan(0);
    expect(settlement?.type).toBe("game-week-settled");
    expect(blocks.every((event) => event.at >= start && event.at < start + REAL_MS_PER_GAME_WEEK)).toBe(true);
    const parsed = blocks.map((event) => JSON.parse(event.detail ?? "{}") as { admissions?: number; specialSeats?: number; scheduledAufguss?: number });
    expect(parsed.reduce((total, block) => total + (block.admissions ?? 0), 0)).toBe(result.envelope.world.lastReport?.admissions);
    expect(parsed.reduce((total, block) => total + (block.specialSeats ?? 0), 0)).toBe(result.envelope.world.lastReport?.specialSeats);
    expect(parsed.some((block) => (block.scheduledAufguss ?? 0) > 0)).toBe(true);
  });

  it("mutates cash, condition and runtime before the weekly report is published", () => {
    const start = 2_000_000;
    const state = {
      ...initialState,
      built: ["program" as const],
      condition: { program: 100 },
      masterHired: true,
      master: {
        name: "Runtime Master",
        style: "Traditional" as const,
        heatCraft: 3,
        aromaCraft: 3,
        performanceCraft: 2,
        weeklyWage: 500,
        equipment: [],
      },
    };
    const partial = advanceCanalSimulation(
      createCanonicalCanalEnvelope(state, start, 43),
      start + REAL_MS_PER_GAME_WEEK * 0.4,
    );

    expect(partial.envelope.world.week).toBe(1);
    expect(partial.envelope.world.lastReport).toBeUndefined();
    expect(partial.envelope.operatingRuntime?.settledBlockKeys.length).toBeGreaterThan(0);
    expect(partial.envelope.world.cash).not.toBe(state.cash);
    expect(partial.envelope.world.condition.program).toBeLessThan(100);
    expect(partial.events.some((event) => event.type === "operating-block-settled")).toBe(true);
  });

  it("keeps one-jump offline and chunked online canonical world state identical with block events enabled", () => {
    const start = 5_000_000;
    const offline = advanceCanalSimulation(createCanonicalCanalEnvelope(initialState, start, 77), start + REAL_MS_PER_GAME_WEEK);

    let online = createCanonicalCanalEnvelope(initialState, start, 77);
    for (let part = 1; part <= 8; part += 1) {
      online = advanceCanalSimulation(online, start + (REAL_MS_PER_GAME_WEEK * part) / 8).envelope;
    }

    expect(online).toEqual(offline.envelope);
  });
});
