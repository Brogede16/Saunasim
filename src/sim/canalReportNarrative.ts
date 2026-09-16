import { evaluateScheduleFit, type WeekReport } from "./canalBalance";
import type { GameState } from "./game";
import { planCanalOperations } from "./canalOperatingPlan";

export type CanonicalReportFacts = Pick<
  WeekReport,
  "admissions" | "specialSeats" | "specialCapacity" | "specialOccupancy" | "queueLoss" | "netResult" | "walkUpSeats" | "turnedAwayFromGus"
>;

/**
 * Report copy is explanatory UI data, not simulation authority. Schedule fit describes the player's
 * current configuration at settlement; the factual historical numbers beside it come from completed
 * blocks. This avoids pretending one schedule label can summarize a week whose settings changed.
 */
export function composeCanalReportNarrative(snapshot: GameState, facts: CanonicalReportFacts) {
  const plan = planCanalOperations(snapshot);
  const fit = evaluateScheduleFit(plan.effectiveSchedule, snapshot.activeProgram);
  const warnings = plan.warnings;
  const signals: string[] = [];

  if ((facts.queueLoss ?? 0) > 0) signals.push(`${facts.queueLoss} guest recovery places were lost to cold-recovery pressure.`);
  if ((facts.turnedAwayFromGus ?? 0) > 0) signals.push(`${facts.turnedAwayFromGus} Gus requests could not be served.`);
  if ((facts.walkUpSeats ?? 0) > 0) signals.push(`${facts.walkUpSeats} spare Gus places were filled by walk-up guests.`);
  if (warnings.length) signals.push(warnings.join(" "));
  if (!signals.length) {
    signals.push(facts.netResult >= 0
      ? "The completed operating week covered its current costs."
      : "The completed operating week did not cover its current costs.");
  }

  return {
    requestedSessions: snapshot.activeProgram.requestedSessions,
    feasibleSessions: plan.aufguss.scheduled.length,
    scheduleFit: fit.fit,
    scheduleNote: `Current configuration: ${fit.note}`,
    venueDemandNote: facts.admissions > 0
      ? `${facts.admissions} ordinary visits were delivered across the completed operating blocks.`
      : "No ordinary guest visits were delivered in the completed operating blocks.",
    signal: signals.join(" "),
  } satisfies Pick<
    WeekReport,
    "requestedSessions" | "feasibleSessions" | "scheduleFit" | "scheduleNote" | "venueDemandNote" | "signal"
  >;
}
