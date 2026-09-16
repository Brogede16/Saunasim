import type { GameState } from "./game";
import type { MaintainableModuleId } from "./maintenance";
import type { RuntimeOperatingBlock } from "./canalWeekRuntime";

function roundWear(value: number) {
  return Math.round(Math.max(0, value) * 10000) / 10000;
}

/**
 * Direct causal wear for one completed operating block.
 *
 * Programme wear follows actual Special Gus use continuously instead of reserving a weekly wear
 * budget first. Recovery facilities wear from the recovery demand they physically serve. The
 * coefficients are current Canal balance values and intentionally live in one pure function so
 * Swift can port the exact rule without reproducing a weekly allocator.
 */
export function calculateCanalBlockWear(
  snapshot: GameState,
  block: Pick<RuntimeOperatingBlock, "specialSeats" | "recoveryDemand">,
): Partial<Record<MaintainableModuleId, number>> {
  const wear: Partial<Record<MaintainableModuleId, number>> = {};
  const eligible = (id: MaintainableModuleId) =>
    snapshot.built.includes(id) &&
    snapshot.repairTask?.moduleId !== id &&
    (snapshot.condition[id] ?? 100) > 0;

  if (eligible("program") && block.specialSeats > 0) {
    wear.program = roundWear(block.specialSeats / 5);
  }
  if (eligible("shower") && block.recoveryDemand > 0) {
    wear.shower = roundWear(block.recoveryDemand);
  }
  if (eligible("cold-plunge") && block.recoveryDemand > 0) {
    wear["cold-plunge"] = roundWear(block.recoveryDemand);
  }
  return wear;
}
