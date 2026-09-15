import { previewProgram, type ActiveProgram } from "./program";
import type { MasterProfile, VenueSchedule } from "./game";

export const MASTER_MAX_PAID_GAP_HOURS = 2;
export const MASTER_REFERENCE_WEEKLY_HOURS = 50;

export type ScheduledAufguss = {
  dayIndex: number;
  startsAt: number;
  endsAt: number;
  roomId: "compact-room" | "program-sauna" | "outdoor-yard";
};

export type AufgussSchedulePlan = {
  requested: number;
  scheduled: ScheduledAufguss[];
  unfilled: number;
  unfilledReasons: string[];
  masterPaidHours: number;
  masterWage: number;
};

export type AufgussScheduleInput = {
  schedule: VenueSchedule;
  program: ActiveProgram;
  master?: MasterProfile;
  hasProgramSauna: boolean;
  hasOutdoorYard: boolean;
};

function preferredHours(program: ActiveProgram) {
  if (program.intent === "Quiet Recovery") return [11, 14, 16, 18, 20];
  if (program.intent === "Social Energy" || program.intent === "Show Journey") return [19, 18, 20, 17, 16, 14];
  return [17, 14, 19, 12, 20, 10];
}

function chooseRoom(input: AufgussScheduleInput): ScheduledAufguss["roomId"] {
  if (input.hasProgramSauna) return "program-sauna";
  if (input.hasOutdoorYard) return "outdoor-yard";
  return "compact-room";
}

function overlaps(a: ScheduledAufguss, b: ScheduledAufguss) {
  return a.dayIndex === b.dayIndex && a.startsAt < b.endsAt && b.startsAt < a.endsAt;
}

function masterWorkHours(sessions: ScheduledAufguss[]) {
  const byDay = new Map<number, ScheduledAufguss[]>();
  for (const session of sessions) {
    const day = byDay.get(session.dayIndex) ?? [];
    day.push(session);
    byDay.set(session.dayIndex, day);
  }

  let total = 0;
  for (const daySessions of byDay.values()) {
    const sorted = [...daySessions].sort((a, b) => a.startsAt - b.startsAt);
    let blockStart = sorted[0]?.startsAt;
    let blockEnd = sorted[0]?.endsAt;
    if (blockStart === undefined || blockEnd === undefined) continue;

    for (const session of sorted.slice(1)) {
      const gap = session.startsAt - blockEnd;
      if (gap <= MASTER_MAX_PAID_GAP_HOURS) {
        blockEnd = Math.max(blockEnd, session.endsAt);
      } else {
        total += blockEnd - blockStart;
        blockStart = session.startsAt;
        blockEnd = session.endsAt;
      }
    }
    total += blockEnd - blockStart;
  }
  return total;
}

/**
 * Deterministic compact-venue scheduler.
 *
 * The player chooses a weekly frequency, not clock times. The scheduler spreads sessions across
 * open days, prefers dayparts that fit the program intent, rejects overlaps and returns explicit
 * unfilled reasons. Multi-Master/multi-room concurrency can extend the same plan type later.
 */
export function planWeeklyAufguss(input: AufgussScheduleInput): AufgussSchedulePlan {
  const requested = Math.max(0, Math.trunc(input.program.requestedSessions));
  if (requested === 0) return { requested, scheduled: [], unfilled: 0, unfilledReasons: [], masterPaidHours: 0, masterWage: 0 };
  if (!input.master) {
    return {
      requested,
      scheduled: [],
      unfilled: requested,
      unfilledReasons: ["No Aufguss Master is hired."],
      masterPaidHours: 0,
      masterWage: 0,
    };
  }

  const roomMinutes = previewProgram(input.program).roomMinutes;
  const durationHours = roomMinutes / 60;
  const openDays = Math.max(0, Math.min(7, Math.trunc(input.schedule.openDays)));
  const roomId = chooseRoom(input);
  const candidates: ScheduledAufguss[] = [];

  for (let dayIndex = 0; dayIndex < openDays; dayIndex += 1) {
    for (const preferred of preferredHours(input.program)) {
      const startsAt = Math.max(input.schedule.opensAt, preferred);
      const endsAt = startsAt + durationHours;
      if (startsAt >= input.schedule.opensAt && endsAt <= input.schedule.closesAt) {
        candidates.push({ dayIndex, startsAt, endsAt, roomId });
      }
    }
  }

  const scheduled: ScheduledAufguss[] = [];
  const usedDays = new Map<number, number>();
  while (scheduled.length < requested) {
    const feasible = candidates
      .filter((candidate) => !scheduled.some((existing) => overlaps(existing, candidate)))
      .sort((a, b) => {
        const aCount = usedDays.get(a.dayIndex) ?? 0;
        const bCount = usedDays.get(b.dayIndex) ?? 0;
        if (aCount !== bCount) return aCount - bCount;
        if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;
        return preferredHours(input.program).indexOf(a.startsAt) - preferredHours(input.program).indexOf(b.startsAt);
      });

    const next = feasible[0];
    if (!next) break;
    scheduled.push(next);
    usedDays.set(next.dayIndex, (usedDays.get(next.dayIndex) ?? 0) + 1);
    const index = candidates.indexOf(next);
    if (index >= 0) candidates.splice(index, 1);
  }

  const unfilled = Math.max(0, requested - scheduled.length);
  const unfilledReasons = unfilled > 0
    ? [openDays === 0 ? "The venue has no open days." : "Opening hours and one-Master room capacity cannot fit every requested session."]
    : [];
  const masterPaidHours = masterWorkHours(scheduled);
  const hourlyWage = input.master.weeklyWage / MASTER_REFERENCE_WEEKLY_HOURS;
  const masterWage = Math.round(masterPaidHours * hourlyWage);

  return { requested, scheduled, unfilled, unfilledReasons, masterPaidHours, masterWage };
}
