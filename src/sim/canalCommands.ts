import type { CanonicalCanalEnvelope } from "./canalRealtime";
import { replanFutureCanalOperatingRuntime } from "./canalRuntimeReplan";
import type { GameState } from "./game";

export type CanalWorldChange = (world: GameState) => GameState;

/**
 * Applies an instantaneous player/domain change at the envelope's already-simulated canonical time.
 *
 * Time advancement is intentionally NOT hidden here: callers must first advance the envelope to the
 * real command timestamp. If an operating week is already in progress, only future unsettled blocks
 * are re-planned; settled history and accrued accounting remain immutable.
 *
 * This is the command-boundary shape the Swift core should mirror.
 */
export function applyCanalWorldChange(
  envelope: CanonicalCanalEnvelope,
  change: CanalWorldChange,
): CanonicalCanalEnvelope {
  const world = change(structuredClone(envelope.world));
  const operatingRuntime = envelope.operatingRuntime
    ? replanFutureCanalOperatingRuntime(
        world,
        envelope.operatingRuntime,
        envelope.startedAt,
        envelope.lastSimulatedAt,
      )
    : undefined;

  return {
    ...envelope,
    world,
    operatingRuntime,
  };
}
