import { GAME_DAYS_PER_WEEK, REAL_MS_PER_GAME_WEEK } from "./canonicalTime";
import { allocateCanalBlockEconomy } from "./canalBlockEconomy";
import { calculateCanalBlockWear } from "./canalBlockWear";
import { buildCanalOperatingBlocks } from "./canalOperatingBlocks";
import type { GameState } from "./game";
import { planCanalOperations } from "./canalOperatingPlan";
import { operatingBlockKey, type OperatingWeekRuntime, type RuntimeOperatingBlock } from "./canalWeekRuntime";

function blockSettlesAt(startedAt: number, week: number, block: RuntimeOperatingBlock) {
  const weekStart = startedAt + (week - 1) * REAL_MS_PER_GAME_WEEK;
  const realMsPerGameDay = REAL_MS_PER_GAME_WEEK / GAME_DAYS_PER_WEEK;
  const gameHoursFromWeekStart = block.dayIndex * 24 + block.endsAt;
  return weekStart + (gameHoursFromWeekStart / 24) * realMsPerGameDay;
}

/** Rebuild only still-future blocks after a canonical command/world change. */
export function replanFutureCanalOperatingRuntime(
  snapshot: GameState,
  runtime: OperatingWeekRuntime,
  startedAt: number,
  at: number,
): OperatingWeekRuntime {
  if (runtime.week !== snapshot.week) return runtime;

  const settled = runtime.plannedBlocks.filter((block) => runtime.settledBlockKeys.includes(operatingBlockKey(block)));
  const freshPlan = planCanalOperations(snapshot);
  const freshAll = allocateCanalBlockEconomy(
    buildCanalOperatingBlocks(snapshot, freshPlan),
  ).map((block) => ({
    ...block,
    wear: calculateCanalBlockWear(snapshot, block),
  })) as RuntimeOperatingBlock[];
  const future = freshAll.filter(
    (block) => blockSettlesAt(startedAt, runtime.week, block) > at && !runtime.settledBlockKeys.includes(operatingBlockKey(block)),
  );

  return {
    ...runtime,
    plannedBlocks: [...settled, ...future].sort((a, b) =>
      blockSettlesAt(startedAt, runtime.week, a) - blockSettlesAt(startedAt, runtime.week, b),
    ),
  };
}
