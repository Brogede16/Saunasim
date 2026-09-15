import { planWeeklyAufguss, type AufgussSchedulePlan } from "./aufgussScheduler";
import type { GameState, VenueSchedule } from "./game";
import { planVenueStaffing, type VenueStaffingPlan } from "./venueStaffing";

export type CanalOperatingPlan = {
  staffing: VenueStaffingPlan;
  aufguss: AufgussSchedulePlan;
  effectiveSchedule: VenueSchedule;
  effectiveRequestedSessions: number;
  staffWage: number;
  warnings: string[];
};

/**
 * Connects player configuration to the concrete operating week consumed by the legacy Canal
 * balance model while Wave 2 is being decomposed into smaller operating blocks.
 *
 * Missing host coverage does not become a hidden happiness penalty: uncovered hours simply cannot
 * operate yet. The temporary compact-venue adapter keeps the earliest covered hours; a later
 * daypart-aware assignment pass may choose the most valuable blocks without changing the rule that
 * uncovered time cannot earn revenue.
 */
export function planCanalOperations(snapshot: GameState): CanalOperatingPlan {
  const staffing = planVenueStaffing({
    schedule: snapshot.schedule,
    serviceHostCount: snapshot.serviceHostCount,
    ownerAvailable: true,
  });
  const coverageRatio = staffing.requiredHostHours === 0
    ? 1
    : (staffing.requiredHostHours - staffing.uncoveredHostHours) / staffing.requiredHostHours;
  const requestedDailyHours = Math.max(0, snapshot.schedule.closesAt - snapshot.schedule.opensAt);
  const coveredDailyHours = requestedDailyHours * coverageRatio;
  const effectiveSchedule: VenueSchedule = {
    ...snapshot.schedule,
    closesAt: snapshot.schedule.opensAt + coveredDailyHours,
  };

  const aufguss = planWeeklyAufguss({
    schedule: effectiveSchedule,
    program: snapshot.activeProgram,
    master: snapshot.masterHired ? snapshot.master : undefined,
    hasProgramSauna: snapshot.built.includes("program"),
    hasOutdoorYard: snapshot.built.includes("aufguss-yard"),
  });

  const warnings = [...staffing.reasons, ...aufguss.unfilledReasons];
  return {
    staffing,
    aufguss,
    effectiveSchedule,
    effectiveRequestedSessions: aufguss.scheduled.length,
    staffWage: staffing.paidHostWage + aufguss.masterWage,
    warnings,
  };
}
