import { GAME_DAYS_PER_WEEK, REAL_MS_PER_GAME_WEEK } from "./canonicalTime";
import { allocateCanalBlockEconomy } from "./canalBlockEconomy";
import { buildCanalOperatingBlocks } from "./canalOperatingBlocks";
import type { GameState } from "./game";
import { maintainableModules } from "./game";
import { conditionWear } from "./maintenance";
import { planCanalOperations } from "./canalOperatingPlan";
import { operatingBlockKey, type OperatingWeekRuntime, type RuntimeOperatingBlock } from "./canalWeekRuntime";

function blockSettlesAt(startedAt: number, week: number, block: RuntimeOperatingBlock) {
  const weekStart = startedAt + (week - 1) * REAL_MS_PER_GAME_WEEK;
  const realMsPerGameDay = REAL_MS_PER_GAME_WEEK / GAME_DAYS_PER_WEEK;
  const gameHoursFromWeekStart = block.dayIndex * 24 + block.endsAt;
  return weekStart + (gameHoursFromWeekStart / 24) * realMsPerGameDay;
}

function allocateWear(total: number, blocks: RuntimeOperatingBlock[], weightOf: (block: RuntimeOperatingBlock) => number) {
  if (blocks.length === 0 || total <= 0) return blocks.map(() => 0);
  const weights = blocks.map((block) => Math.max(0, weightOf(block)));
  const weightSum = weights.reduce((sum, value) => sum + value, 0);
  if (weightSum <= 0) return blocks.map((_, index) => index === 0 ? total : 0);
  const raw = weights.map((weight) => (total * weight) / weightSum);
  const allocated = raw.map((value) => Math.round(value * 10000) / 10000);
  const residual = Math.round((total - allocated.reduce((sum, value) => sum + value, 0)) * 10000) / 10000;
  allocated[allocated.length - 1] = Math.round((allocated[allocated.length - 1] + residual) * 10000) / 10000;
  return allocated;
}

/**
 * Rebuilds only the still-future operating blocks after a midweek configuration or world change.
 * Settled blocks and all accrued accounting remain immutable. This is the portable command-boundary
 * contract Swift should use after price, programme, staffing, schedule, construction or repair
 * changes once the current canonical time has already been advanced to `at`.
 */
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
    buildCanalOperatingBlocks(snapshot, freshPlan, runtime.plannedReport),
    runtime.plannedReport,
  ).map((block) => ({ ...block, wear: {} })) as RuntimeOperatingBlock[];
  const future = freshAll.filter(
    (block) => blockSettlesAt(startedAt, runtime.week, block) > at && !runtime.settledBlockKeys.includes(operatingBlockKey(block)),
  );

  const freshSpecialSeats = freshAll.reduce((total, block) => total + block.specialSeats, 0);
  const freshRecoveryDemand = freshAll.reduce((total, block) => total + block.recoveryDemand, 0);

  for (const id of maintainableModules) {
    if (!snapshot.built.includes(id) || snapshot.repairTask?.moduleId === id) continue;
    const freshWeeklyWear = conditionWear(id, {
      specialSeats: freshSpecialSeats,
      recoveryDemand: freshRecoveryDemand,
    });
    const alreadySettledWear = settled.reduce((total, block) => total + (block.wear[id] ?? 0), 0);
    const remainingWear = Math.max(0, Math.round((freshWeeklyWear - alreadySettledWear) * 10000) / 10000);
    const allocated = allocateWear(
      remainingWear,
      future,
      id === "program" ? (block) => block.specialSeats : (block) => block.recoveryDemand,
    );
    future.forEach((block, index) => {
      if ((allocated[index] ?? 0) > 0) block.wear[id] = allocated[index];
    });
  }

  return {
    ...runtime,
    plannedBlocks: [...settled, ...future].sort((a, b) =>
      blockSettlesAt(startedAt, runtime.week, a) - blockSettlesAt(startedAt, runtime.week, b),
    ),
  };
}
