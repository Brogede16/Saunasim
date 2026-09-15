import { serviceTeamTiers } from "./serviceTeam";
import type { VenueSchedule } from "./game";

export const OWNER_FREE_HOST_HOURS_PER_GAME_WEEK = 50;
export const FULL_TIME_STAFF_HOURS_PER_GAME_WEEK = 50;

export type VenueStaffingInput = {
  schedule: VenueSchedule;
  serviceHostCount: number;
  ownerAvailable?: boolean;
};

export type VenueStaffingPlan = {
  openHours: number;
  requiredHostHours: number;
  ownerHostHours: number;
  paidHostHours: number;
  uncoveredHostHours: number;
  paidHostWage: number;
  status: "adequate" | "strained" | "missing";
  reasons: string[];
};

export function weeklyOpenHours(schedule: VenueSchedule) {
  const dailyHours = Math.max(0, Math.min(24, schedule.closesAt - schedule.opensAt));
  return Math.max(0, Math.min(7, schedule.openDays)) * dailyHours;
}

/**
 * Current compact-venue staffing contract.
 *
 * One host-function must be covered while the venue is open. The owner may cover one compatible
 * basic host function for up to a normal 50-hour game-week. Hired Service Hosts belong to this
 * venue and cover remaining host hours automatically. They are paid only for assigned hours.
 *
 * This deliberately models coverage, not a player-authored rota. Larger venues can add additional
 * simultaneous function requirements later without changing this contract shape.
 */
export function planVenueStaffing(input: VenueStaffingInput): VenueStaffingPlan {
  const openHours = weeklyOpenHours(input.schedule);
  const requiredHostHours = openHours;
  const ownerHostHours = input.ownerAvailable === false
    ? 0
    : Math.min(requiredHostHours, OWNER_FREE_HOST_HOURS_PER_GAME_WEEK);
  const remaining = Math.max(0, requiredHostHours - ownerHostHours);
  const hired = Math.max(0, Math.min(serviceTeamTiers.length, Math.trunc(input.serviceHostCount)));
  const availablePaidHours = hired * FULL_TIME_STAFF_HOURS_PER_GAME_WEEK;
  const paidHostHours = Math.min(remaining, availablePaidHours);
  const uncoveredHostHours = Math.max(0, remaining - paidHostHours);

  let hoursLeft = paidHostHours;
  let paidHostWage = 0;
  for (const tier of serviceTeamTiers.slice(0, hired)) {
    if (hoursLeft <= 0) break;
    const assigned = Math.min(FULL_TIME_STAFF_HOURS_PER_GAME_WEEK, hoursLeft);
    paidHostWage += (tier.weeklyWage / FULL_TIME_STAFF_HOURS_PER_GAME_WEEK) * assigned;
    hoursLeft -= assigned;
  }
  paidHostWage = Math.round(paidHostWage);

  const coverageRatio = requiredHostHours === 0 ? 1 : (requiredHostHours - uncoveredHostHours) / requiredHostHours;
  const status: VenueStaffingPlan["status"] = uncoveredHostHours === 0
    ? "adequate"
    : coverageRatio >= 0.8
      ? "strained"
      : "missing";
  const reasons: string[] = [];
  if (uncoveredHostHours > 0) {
    reasons.push(`${Math.round(uncoveredHostHours)} host-hours are uncovered.`);
  }

  return {
    openHours,
    requiredHostHours,
    ownerHostHours,
    paidHostHours,
    uncoveredHostHours,
    paidHostWage,
    status,
    reasons,
  };
}
