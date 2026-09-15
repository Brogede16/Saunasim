import { simulateCanalWeek, type WeekReport } from "./canalBalance";
import { simulateGuestWeek } from "./guestWeek";
import {
  initialState,
  maintainableModules,
  masterCandidates,
  type GameState,
  type MaintainableModuleId,
} from "./game";
import { conditionWear } from "./maintenance";
import { evaluateComposition, type ActiveProgram } from "./program";
import { evaluateProgramDelivery } from "./programEvaluation";
import { createRngState, type RngState } from "./deterministicRng";
import { planCanalOperations } from "./canalOperatingPlan";
import {
  advanceSimulation,
  type AdvanceSimulationResult,
  type SimulationAdapter,
  type SimulationEnvelope,
  type SimulationEvent,
} from "./simulationEngine";
import type { CanonicalTimestamp } from "./canonicalTime";

export type CanonicalCanalEnvelope = SimulationEnvelope<GameState>;

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

function nextRealtimeMilestone(world: GameState, after: CanonicalTimestamp, to: CanonicalTimestamp) {
  const candidates = [
    ...world.construction.map((project) => project.completesAt),
    world.repairTask?.completesAt,
    world.masterSearch?.completesAt,
  ].filter((value): value is number => value !== undefined && value > after && value <= to);

  return candidates.length ? Math.min(...candidates) : undefined;
}

function resolveRealtimeMilestones(world: GameState, at: CanonicalTimestamp) {
  let next = world;
  const events: SimulationEvent[] = [];

  const completedConstruction = next.construction.filter((project) => project.completesAt <= at);
  if (completedConstruction.length) {
    const completedIds = completedConstruction.map((project) => project.moduleId);
    next = {
      ...next,
      built: [...next.built, ...completedIds.filter((id) => !next.built.includes(id))],
      construction: next.construction.filter((project) => project.completesAt > at),
    };
    events.push(...completedIds.map((id) => ({ at, type: "construction-completed", detail: id })));
  }

  if (next.repairTask && next.repairTask.completesAt <= at) {
    const moduleId = next.repairTask.moduleId;
    next = {
      ...next,
      condition: { ...next.condition, [moduleId]: 100 },
      repairTask: undefined,
    };
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

  return { world: next, events };
}

/**
 * Transitional canonical settlement for the existing Canal reference.
 *
 * Wave 2 now supplies concrete venue-staffing coverage and an automatic weekly Aufguss schedule
 * before calling the proven Canal balance model. The remaining admission/demand/shop/recovery
 * equations are still the weekly reference and will be decomposed into smaller operating blocks
 * incrementally rather than rewritten in one risky step.
 */
export function settleLegacyCanalGameWeek(snapshot: GameState): GameState {
  if (snapshot.financialDecisionPending) return snapshot;

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
  const legacyLedger = simulateCanalWeek(balanceInput);
  const staffCostDelta = operatingPlan.staffWage - legacyLedger.costBreakdown.staff;
  const ledger: WeekReport = {
    ...legacyLedger,
    operatingCosts: legacyLedger.operatingCosts + staffCostDelta,
    netResult: legacyLedger.netResult - staffCostDelta,
    costBreakdown: { ...legacyLedger.costBreakdown, staff: operatingPlan.staffWage },
    requestedSessions: snapshot.activeProgram.requestedSessions,
    feasibleSessions: operatingPlan.aufguss.scheduled.length,
    signal: operatingPlan.warnings.length
      ? `${legacyLedger.signal} ${operatingPlan.warnings.join(" ")}`
      : legacyLedger.signal,
  };
  const guestWeek = simulateGuestWeek(balanceInput, ledger, snapshot.week, scheduledProgram);
  const revealedProgram: ActiveProgram = snapshot.masterHired
    ? { ...snapshot.activeProgram, revealedTier: evaluateComposition(snapshot.activeProgram) }
    : snapshot.activeProgram;
  const report: WeekReport = {
    ...ledger,
    ...guestWeek,
    programReview: snapshot.masterHired && operatingPlan.aufguss.scheduled.length > 0
      ? evaluateProgramDelivery(revealedProgram, snapshot.built, snapshot.master, ledger.specialOccupancy ?? 0)
      : undefined,
  };
  const cash = snapshot.cash + report.netResult;

  return {
    ...snapshot,
    cash,
    week: snapshot.week + 1,
    loans: snapshot.loans
      .map((loan) => ({ ...loan, remainingWeeks: loan.remainingWeeks - 1 }))
      .filter((loan) => loan.remainingWeeks > 0),
    profitableWeeks: report.netResult > 0 ? snapshot.profitableWeeks + 1 : 0,
    financialDecisionPending: cash < 0,
    selectedGuestId: report.guestSnapshots?.[0]?.id,
    activeProgram: revealedProgram,
    condition: Object.fromEntries(
      maintainableModules
        .filter((id) => snapshot.built.includes(id))
        .map((id) => [
          id,
          snapshot.repairTask?.moduleId === id
            ? (snapshot.condition[id] ?? 100)
            : Math.max(
                0,
                (snapshot.condition[id] ?? 100) -
                  conditionWear(id, {
                    specialSeats: ledger.specialSeats,
                    recoveryDemand: ledger.recoveryDemand ?? 0,
                  }),
              ),
        ]),
    ),
    lastReport: report,
  };
}

const canalRealtimeAdapter: SimulationAdapter<GameState> = {
  nextMilestoneAt: nextRealtimeMilestone,
  advanceInterval(world, context) {
    // Canonical elapsed time and real-time milestones already flow through this boundary. Demand
    // and guest traffic are still settled at the canonical game-week boundary while Wave 2 moves
    // them into smaller deterministic operating blocks.
    return { world, rng: context.rng };
  },
  resolveMilestonesAt(world, at, rng) {
    const resolved = resolveRealtimeMilestones(world, at);
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
): AdvanceSimulationResult<GameState> {
  return advanceSimulation(envelope, to, canalRealtimeAdapter);
}

export function canonicalCanalStateEquals(a: CanonicalCanalEnvelope, b: CanonicalCanalEnvelope) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function withRngState(envelope: CanonicalCanalEnvelope, rng: RngState): CanonicalCanalEnvelope {
  return { ...envelope, rng };
}
