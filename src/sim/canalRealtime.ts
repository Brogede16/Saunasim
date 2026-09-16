import { simulateCanalWeek, type WeekReport } from "./canalBalance";
import { simulateGuestWeek } from "./guestWeek";
import {
  initialState,
  maintainableModules,
  masterCandidates,
  type GameState,
  type MaintainableModuleId,
} from "./game";
import { calculateCanalBlockWear } from "./canalBlockWear";
import { evaluateComposition, type ActiveProgram } from "./program";
import { evaluateProgramDelivery } from "./programEvaluation";
import { createRngState, type RngState } from "./deterministicRng";
import { planCanalOperations } from "./canalOperatingPlan";
import { buildCanalOperatingBlocks } from "./canalOperatingBlocks";
import { allocateCanalBlockEconomy } from "./canalBlockEconomy";
import { calculateCanalPeriodCosts } from "./canalPeriodCosts";
import { replanFutureCanalOperatingRuntime } from "./canalRuntimeReplan";
import {
  emptyOperatingWeekRuntime,
  operatingBlockKey,
  settleOperatingBlock,
  type OperatingWeekRuntime,
  type RuntimeOperatingBlock,
} from "./canalWeekRuntime";
import {
  advanceSimulation,
  type AdvanceSimulationResult,
  type SimulationAdapter,
  type SimulationEnvelope,
  type SimulationEvent,
} from "./simulationEngine";
import { GAME_DAYS_PER_WEEK, REAL_MS_PER_GAME_WEEK, type CanonicalTimestamp } from "./canonicalTime";

export type CanonicalCanalEnvelope = SimulationEnvelope<GameState> & {
  operatingRuntime?: OperatingWeekRuntime;
};

type RuntimeGameState = GameState & {
  __operatingRuntime?: OperatingWeekRuntime;
};

export function createCanonicalCanalEnvelope(
  gameState: GameState = initialState,
  startedAt: CanonicalTimestamp,
  seed = 0x5a17,
): CanonicalCanalEnvelope {
  return {
    startedAt,
    lastSimulatedAt: startedAt,
    rng: createRngState(seed),
    world: structuredClone(gameState),
  };
}

function money(value: number) {
  return Math.round(value * 100) / 100;
}

function operationalBalanceInput(snapshot: GameState) {
  const operatingPlan = planCanalOperations(snapshot);
  const loanRepayment = snapshot.loans.reduce((total, loan) => total + loan.weeklyPayment, 0);
  const unavailable = maintainableModules.filter(
    (id) => (snapshot.condition[id] ?? 100) <= 0 || snapshot.repairTask?.moduleId === id,
  );
  const scheduledProgram = operatingPlan.effectiveRequestedSessions > 0
    ? { ...snapshot.activeProgram, requestedSessions: operatingPlan.effectiveRequestedSessions }
    : snapshot.activeProgram;
  const balanceInput = {
    ...snapshot,
    schedule: operatingPlan.effectiveSchedule,
    activeProgram: scheduledProgram,
    brandIdentity: snapshot.repertoire.length,
    built: snapshot.built.filter((id) => !unavailable.includes(id as MaintainableModuleId)),
    loanRepayment,
    masterWage: 0,
  };
  return { operatingPlan, balanceInput, scheduledProgram };
}

function calculateLegacyWeekReference(snapshot: GameState) {
  const { operatingPlan, balanceInput, scheduledProgram } = operationalBalanceInput(snapshot);
  const legacyLedger = simulateCanalWeek(balanceInput);
  const staffCostDelta = operatingPlan.staffWage - legacyLedger.costBreakdown.staff;
  const report: WeekReport = {
    ...legacyLedger,
    guestSnapshots: undefined,
    programReview: undefined,
    operatingCosts: legacyLedger.operatingCosts + staffCostDelta,
    netResult: legacyLedger.netResult - staffCostDelta,
    costBreakdown: { ...legacyLedger.costBreakdown, staff: operatingPlan.staffWage },
    requestedSessions: snapshot.activeProgram.requestedSessions,
    feasibleSessions: operatingPlan.aufguss.scheduled.length,
    signal: operatingPlan.warnings.length
      ? `${legacyLedger.signal} ${operatingPlan.warnings.join(" ")}`
      : legacyLedger.signal,
  };

  return { operatingPlan, balanceInput, scheduledProgram, report };
}

function createOperatingRuntime(snapshot: GameState): OperatingWeekRuntime {
  const reference = calculateLegacyWeekReference(snapshot);
  const baseBlocks = allocateCanalBlockEconomy(
    buildCanalOperatingBlocks(snapshot, reference.operatingPlan, reference.report),
    reference.report,
  ).map((block) => ({
    ...block,
    wear: calculateCanalBlockWear(snapshot, block),
  })) as RuntimeOperatingBlock[];

  return emptyOperatingWeekRuntime(snapshot.week, reference.report, baseBlocks);
}

function weekStartAt(startedAt: CanonicalTimestamp, gameWeek: number) {
  return startedAt + (gameWeek - 1) * REAL_MS_PER_GAME_WEEK;
}

function operatingBlockSettlesAt(startedAt: CanonicalTimestamp, week: number, block: RuntimeOperatingBlock) {
  const realMsPerGameDay = REAL_MS_PER_GAME_WEEK / GAME_DAYS_PER_WEEK;
  const gameHoursFromWeekStart = block.dayIndex * 24 + block.endsAt;
  return weekStartAt(startedAt, week) + (gameHoursFromWeekStart / 24) * realMsPerGameDay;
}

function runtimeFor(world: RuntimeGameState) {
  if (world.__operatingRuntime?.week === world.week) return world.__operatingRuntime;
  if (world.financialDecisionPending) return undefined;
  return createOperatingRuntime(world);
}

function nextRealtimeMilestone(
  world: RuntimeGameState,
  after: CanonicalTimestamp,
  to: CanonicalTimestamp,
  startedAt: CanonicalTimestamp,
) {
  const runtime = runtimeFor(world);
  const operatingCandidates = runtime?.plannedBlocks
    .filter((block) => !runtime.settledBlockKeys.includes(operatingBlockKey(block)))
    .map((block) => operatingBlockSettlesAt(startedAt, runtime.week, block)) ?? [];
  const candidates = [
    ...world.construction.map((project) => project.completesAt),
    world.repairTask?.completesAt,
    world.masterSearch?.completesAt,
    ...operatingCandidates,
  ].filter((value): value is number => value !== undefined && value > after && value <= to);

  return candidates.length ? Math.min(...candidates) : undefined;
}

function applyBlockWear(world: RuntimeGameState, block: RuntimeOperatingBlock) {
  const condition = { ...world.condition };
  for (const id of maintainableModules) {
    const wear = block.wear[id] ?? 0;
    if (wear <= 0 || world.repairTask?.moduleId === id) continue;
    condition[id] = Math.max(0, Math.round(((condition[id] ?? 100) - wear) * 10000) / 10000);
  }
  return condition;
}

function resolveRealtimeMilestones(
  world: RuntimeGameState,
  at: CanonicalTimestamp,
  startedAt: CanonicalTimestamp,
) {
  let next = world;
  const events: SimulationEvent[] = [];
  let operatingInputsChanged = false;

  const completedConstruction = next.construction.filter((project) => project.completesAt <= at);
  if (completedConstruction.length) {
    const completedIds = completedConstruction.map((project) => project.moduleId);
    next = {
      ...next,
      built: [...next.built, ...completedIds.filter((id) => !next.built.includes(id))],
      construction: next.construction.filter((project) => project.completesAt > at),
    };
    operatingInputsChanged = true;
    events.push(...completedIds.map((id) => ({ at, type: "construction-completed", detail: id })));
  }

  if (next.repairTask && next.repairTask.completesAt <= at) {
    const moduleId = next.repairTask.moduleId;
    next = {
      ...next,
      condition: { ...next.condition, [moduleId]: 100 },
      repairTask: undefined,
    };
    operatingInputsChanged = true;
    events.push({ at, type: "repair-completed", detail: moduleId });
  }

  if (next.masterSearch && next.masterSearch.completesAt <= at) {
    const first = 1 + (next.masterSearchCount % (masterCandidates.length - 1));
    const second = 1 + ((next.masterSearchCount + 1) % (masterCandidates.length - 1));
    next = {
      ...next,
      masterCandidates: [masterCandidates[first], masterCandidates[second]],
      masterSearch: undefined,
      masterSearchCount: next.masterSearchCount + 1,
    };
    events.push({ at, type: "master-search-completed" });
  }

  if (operatingInputsChanged && next.__operatingRuntime?.week === next.week) {
    next = {
      ...next,
      __operatingRuntime: replanFutureCanalOperatingRuntime(
        next,
        next.__operatingRuntime,
        startedAt,
        at,
      ),
    };
  }

  const runtime = runtimeFor(next);
  if (runtime) {
    let updatedRuntime = runtime;
    for (const block of runtime.plannedBlocks) {
      const key = operatingBlockKey(block);
      if (updatedRuntime.settledBlockKeys.includes(key)) continue;
      const settlesAt = operatingBlockSettlesAt(startedAt, runtime.week, block);
      if (settlesAt !== at) continue;
      updatedRuntime = settleOperatingBlock(updatedRuntime, block);
      next = {
        ...next,
        cash: money(next.cash + block.operatingNet),
        condition: applyBlockWear(next, block),
      };
      events.push({
        at,
        type: "operating-block-settled",
        detail: JSON.stringify({
          dayIndex: block.dayIndex,
          daypart: block.daypart,
          startsAt: block.startsAt,
          endsAt: block.endsAt,
          admissions: block.admissions,
          specialSeats: block.specialSeats,
          specialCapacity: block.specialCapacity,
          scheduledAufguss: block.scheduledAufguss,
          shopSales: block.shopSales,
          recoveryDemand: block.recoveryDemand,
          recoveryQueueLoss: block.recoveryQueueLoss,
          recoveryBottleneck: block.recoveryBottleneck,
          revenue: block.revenue,
          costs: block.costs,
          operatingNet: block.operatingNet,
          wear: block.wear,
        }),
      });
    }
    next = { ...next, __operatingRuntime: updatedRuntime };
  }

  return { world: next, events };
}

function sumRevenue(breakdown: WeekReport["revenueBreakdown"]) {
  return money(breakdown.admissions + breakdown.specialGus + breakdown.shop);
}

function sumCosts(breakdown: WeekReport["costBreakdown"]) {
  return money(
    breakdown.venueBase +
      breakdown.staff +
      breakdown.utilitiesAndCleaning +
      breakdown.programMaterials +
      breakdown.shopProcurement +
      breakdown.facilities,
  );
}

function reportFromCompletedBlocks(snapshot: RuntimeGameState, runtime: OperatingWeekRuntime): WeekReport {
  const periodCosts = calculateCanalPeriodCosts(snapshot);
  const costBreakdown: WeekReport["costBreakdown"] = {
    ...runtime.accruedCostBreakdown,
    venueBase: money(runtime.accruedCostBreakdown.venueBase + periodCosts.venueBase),
    utilitiesAndCleaning: money(runtime.accruedCostBreakdown.utilitiesAndCleaning + periodCosts.utilitiesAndCleaning),
    facilities: money(runtime.accruedCostBreakdown.facilities + periodCosts.facilities),
  };
  const revenue = sumRevenue(runtime.accruedRevenueBreakdown);
  const operatingCosts = sumCosts(costBreakdown);
  const loanRepayment = snapshot.loans.reduce((total, loan) => total + loan.weeklyPayment, 0);
  const specialCapacity = runtime.accruedSpecialCapacity;
  const specialOccupancy = specialCapacity > 0
    ? Math.round((runtime.accruedSpecialSeats / specialCapacity) * 100)
    : undefined;
  const report: WeekReport = {
    ...runtime.plannedReport,
    guestSnapshots: undefined,
    programReview: undefined,
    admissions: runtime.accruedAdmissions,
    specialSeats: runtime.accruedSpecialSeats,
    specialCapacity,
    specialOccupancy,
    shopSales: runtime.accruedShopSales,
    recoveryDemand: runtime.accruedRecoveryDemand,
    queueLoss: runtime.accruedRecoveryQueueLoss,
    bottleneck: runtime.accruedRecoveryQueueLoss > 0 ? "Cold recovery" : undefined,
    revenueBreakdown: runtime.accruedRevenueBreakdown,
    costBreakdown,
    revenue,
    operatingCosts,
    loanRepayment,
    netResult: money(revenue - operatingCosts - loanRepayment),
  };

  const { balanceInput, scheduledProgram } = operationalBalanceInput(snapshot);
  const guestWeek = simulateGuestWeek(balanceInput, report, snapshot.week, scheduledProgram);
  const revealedProgram: ActiveProgram = snapshot.masterHired
    ? { ...snapshot.activeProgram, revealedTier: evaluateComposition(snapshot.activeProgram) }
    : snapshot.activeProgram;
  const programReview = snapshot.masterHired && specialCapacity > 0
    ? evaluateProgramDelivery(revealedProgram, snapshot.built, snapshot.master, specialOccupancy ?? 0)
    : undefined;

  return {
    ...report,
    guestSnapshots: guestWeek.guestSnapshots,
    programReview,
  };
}

/**
 * Finalises the canonical game week after its operating blocks have already happened.
 * Cash and facility wear from settled blocks are not applied twice here. Visible guest samples and
 * programme review are generated from the completed canonical report, not week-start predictions.
 */
export function settleLegacyCanalGameWeek(snapshot: RuntimeGameState): RuntimeGameState {
  if (snapshot.financialDecisionPending) return snapshot;

  const runtime = runtimeFor(snapshot);
  if (!runtime) return snapshot;
  const report = reportFromCompletedBlocks(snapshot, runtime);
  const remainingNet = money(report.netResult - runtime.accruedOperatingNet);
  const cash = money(snapshot.cash + remainingNet);
  const revealedProgram: ActiveProgram = snapshot.masterHired
    ? { ...snapshot.activeProgram, revealedTier: evaluateComposition(snapshot.activeProgram) }
    : snapshot.activeProgram;

  return {
    ...snapshot,
    __operatingRuntime: undefined,
    cash,
    week: snapshot.week + 1,
    loans: snapshot.loans
      .map((loan) => ({ ...loan, remainingWeeks: loan.remainingWeeks - 1 }))
      .filter((loan) => loan.remainingWeeks > 0),
    profitableWeeks: report.netResult > 0 ? snapshot.profitableWeeks + 1 : 0,
    financialDecisionPending: cash < 0,
    selectedGuestId: report.guestSnapshots?.[0]?.id,
    activeProgram: revealedProgram,
    lastReport: report,
  };
}

const canalRealtimeAdapter: SimulationAdapter<RuntimeGameState> = {
  nextMilestoneAt: nextRealtimeMilestone,
  advanceInterval(world, context) {
    const runtime = runtimeFor(world);
    if (!runtime || world.__operatingRuntime) return { world, rng: context.rng };
    const reachesOperatingBlock = runtime.plannedBlocks.some(
      (block) => operatingBlockSettlesAt(context.startedAt, runtime.week, block) === context.to,
    );
    return {
      world: reachesOperatingBlock ? { ...world, __operatingRuntime: runtime } : world,
      rng: context.rng,
    };
  },
  resolveMilestonesAt(world, at, rng, startedAt) {
    const resolved = resolveRealtimeMilestones(world, at, startedAt);
    return { ...resolved, rng };
  },
  resolveGameWeekBoundary(world, at, rng) {
    const next = settleLegacyCanalGameWeek(world);
    return {
      world: next,
      rng,
      events: next === world ? [] : [{ at, type: "game-week-settled", detail: `week-${world.week}` }],
    };
  },
};

export function advanceCanalSimulation(
  envelope: CanonicalCanalEnvelope,
  to: CanonicalTimestamp,
): AdvanceSimulationResult<GameState> & { envelope: CanonicalCanalEnvelope } {
  const internalWorld: RuntimeGameState = {
    ...envelope.world,
    __operatingRuntime: envelope.operatingRuntime,
  };
  const advanced = advanceSimulation(
    { ...envelope, world: internalWorld },
    to,
    canalRealtimeAdapter,
  );
  const { __operatingRuntime, ...world } = advanced.envelope.world;
  return {
    events: advanced.events,
    envelope: {
      startedAt: advanced.envelope.startedAt,
      lastSimulatedAt: advanced.envelope.lastSimulatedAt,
      rng: advanced.envelope.rng,
      world,
      operatingRuntime: __operatingRuntime,
    },
  };
}

export function canonicalCanalStateEquals(a: CanonicalCanalEnvelope, b: CanonicalCanalEnvelope) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function withRngState(envelope: CanonicalCanalEnvelope, rng: RngState): CanonicalCanalEnvelope {
  return { ...envelope, rng };
}
