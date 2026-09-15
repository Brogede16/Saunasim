import { describe, expect, it } from "vitest";
import { REAL_MS_PER_GAME_WEEK } from "./canonicalTime";
import { createRngState } from "./deterministicRng";
import { advanceSimulation, type SimulationAdapter, type SimulationEnvelope } from "./simulationEngine";

type TestWorld = {
  elapsedMs: number;
  pendingMilestones: number[];
  completedMilestones: number[];
  settledWeeks: number;
  order: string[];
};

const adapter: SimulationAdapter<TestWorld> = {
  nextMilestoneAt(world, after, to) {
    return world.pendingMilestones.filter((at) => at > after && at <= to).sort((a, b) => a - b)[0];
  },
  advanceInterval(world, context) {
    return {
      world: { ...world, elapsedMs: world.elapsedMs + (context.to - context.from) },
      rng: context.rng,
    };
  },
  resolveMilestonesAt(world, at, rng) {
    const matching = world.pendingMilestones.filter((value) => value === at);
    return {
      world: {
        ...world,
        pendingMilestones: world.pendingMilestones.filter((value) => value !== at),
        completedMilestones: [...world.completedMilestones, ...matching],
        order: [...world.order, ...matching.map(() => `milestone:${at}`)],
      },
      rng,
      events: matching.map(() => ({ at, type: "milestone-completed" })),
    };
  },
  resolveGameWeekBoundary(world, at, rng) {
    return {
      world: {
        ...world,
        settledWeeks: world.settledWeeks + 1,
        order: [...world.order, `week:${at}`],
      },
      rng,
      events: [{ at, type: "game-week-settled" }],
    };
  },
};

function initialEnvelope(milestones: number[] = []): SimulationEnvelope<TestWorld> {
  return {
    startedAt: 0,
    lastSimulatedAt: 0,
    rng: createRngState(12345),
    world: {
      elapsedMs: 0,
      pendingMilestones: milestones,
      completedMilestones: [],
      settledWeeks: 0,
      order: [],
    },
  };
}

describe("canonical simulation engine", () => {
  it("produces the same canonical state when advanced online in chunks or offline in one call", () => {
    const target = REAL_MS_PER_GAME_WEEK * 2.5;
    const milestones = [
      2 * 60 * 60 * 1000,
      REAL_MS_PER_GAME_WEEK + 90 * 60 * 1000,
    ];

    const offline = advanceSimulation(initialEnvelope(milestones), target, adapter).envelope;

    let online = initialEnvelope(milestones);
    const chunk = 3 * 60 * 60 * 1000;
    for (let to = chunk; to < target; to += chunk) {
      online = advanceSimulation(online, to, adapter).envelope;
    }
    online = advanceSimulation(online, target, adapter).envelope;

    expect(online).toEqual(offline);
    expect(offline.world).toMatchObject({
      elapsedMs: target,
      settledWeeks: 2,
      completedMilestones: milestones,
    });
  });

  it("resolves a real-time milestone before settlement when both share a timestamp", () => {
    const at = REAL_MS_PER_GAME_WEEK;
    const result = advanceSimulation(initialEnvelope([at]), at, adapter);
    expect(result.envelope.world.order).toEqual([`milestone:${at}`, `week:${at}`]);
    expect(result.events.map((event) => event.type)).toEqual(["milestone-completed", "game-week-settled"]);
  });

  it("does nothing when no canonical time elapsed", () => {
    const input = initialEnvelope();
    expect(advanceSimulation(input, 0, adapter)).toEqual({ envelope: input, events: [] });
  });

  it("refuses backwards advancement", () => {
    const input = { ...initialEnvelope(), lastSimulatedAt: 10 };
    expect(() => advanceSimulation(input, 9, adapter)).toThrow(/backwards/i);
  });
});
