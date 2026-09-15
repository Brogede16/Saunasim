import { assertCanonicalInterval, nextGameWeekBoundary, type CanonicalTimestamp } from "./canonicalTime";
import type { RngState } from "./deterministicRng";

export type SimulationEvent = {
  at: CanonicalTimestamp;
  type: string;
  detail?: string;
};

export type SimulationEnvelope<TWorld> = {
  startedAt: CanonicalTimestamp;
  lastSimulatedAt: CanonicalTimestamp;
  rng: RngState;
  world: TWorld;
};

export type SimulationStepResult<TWorld> = {
  world: TWorld;
  rng: RngState;
  events?: SimulationEvent[];
};

export type SimulationContext = {
  from: CanonicalTimestamp;
  to: CanonicalTimestamp;
  rng: RngState;
  startedAt: CanonicalTimestamp;
};

export type SimulationAdapter<TWorld> = {
  /**
   * Return the next canonical milestone strictly after `after` and at or before `to`.
   * Construction completion, technician arrival/repair completion, operating-block settlement and
   * similar real-time jobs belong here. `startedAt` is the canonical epoch so domain adapters can
   * map game-week/day/hour coordinates to absolute timestamps without consulting wall-clock time.
   */
  nextMilestoneAt?(
    world: TWorld,
    after: CanonicalTimestamp,
    to: CanonicalTimestamp,
    startedAt: CanonicalTimestamp,
  ): CanonicalTimestamp | undefined;

  /** Resolve ordinary simulation for [from, to). UI/rendering must not participate. */
  advanceInterval(world: TWorld, context: SimulationContext): SimulationStepResult<TWorld>;

  /** Resolve all canonical milestone changes at one timestamp before a weekly settlement. */
  resolveMilestonesAt?(world: TWorld, at: CanonicalTimestamp, rng: RngState, startedAt: CanonicalTimestamp): SimulationStepResult<TWorld>;

  /** Resolve the end-of-game-week settlement/report boundary. */
  resolveGameWeekBoundary?(world: TWorld, at: CanonicalTimestamp, rng: RngState, startedAt: CanonicalTimestamp): SimulationStepResult<TWorld>;
};

export type AdvanceSimulationResult<TWorld> = {
  envelope: SimulationEnvelope<TWorld>;
  events: SimulationEvent[];
};

function appendEvents(target: SimulationEvent[], events: SimulationEvent[] | undefined) {
  if (events?.length) target.push(...events);
}

export function advanceSimulation<TWorld>(
  input: SimulationEnvelope<TWorld>,
  to: CanonicalTimestamp,
  adapter: SimulationAdapter<TWorld>,
): AdvanceSimulationResult<TWorld> {
  assertCanonicalInterval(input.lastSimulatedAt, to);
  if (input.lastSimulatedAt === to) return { envelope: input, events: [] };

  let cursor = input.lastSimulatedAt;
  let world = input.world;
  let rng = input.rng;
  const events: SimulationEvent[] = [];

  while (cursor < to) {
    const weekBoundary = nextGameWeekBoundary(input.startedAt, cursor);
    const milestone = adapter.nextMilestoneAt?.(world, cursor, to, input.startedAt);
    if (milestone !== undefined && (milestone <= cursor || milestone > to)) {
      throw new Error("Simulation adapter returned an invalid milestone timestamp.");
    }

    const next = Math.min(to, weekBoundary, milestone ?? Number.POSITIVE_INFINITY);

    if (next > cursor) {
      const advanced = adapter.advanceInterval(world, { from: cursor, to: next, rng, startedAt: input.startedAt });
      world = advanced.world;
      rng = advanced.rng;
      appendEvents(events, advanced.events);
      cursor = next;
    }

    if (milestone !== undefined && cursor === milestone) {
      const resolved = adapter.resolveMilestonesAt?.(world, cursor, rng, input.startedAt);
      if (resolved) {
        world = resolved.world;
        rng = resolved.rng;
        appendEvents(events, resolved.events);
      }
    }

    if (cursor === weekBoundary) {
      const resolved = adapter.resolveGameWeekBoundary?.(world, cursor, rng, input.startedAt);
      if (resolved) {
        world = resolved.world;
        rng = resolved.rng;
        appendEvents(events, resolved.events);
      }
    }
  }

  return {
    envelope: {
      ...input,
      lastSimulatedAt: to,
      world,
      rng,
    },
    events,
  };
}
