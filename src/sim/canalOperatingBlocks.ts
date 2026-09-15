import type { WeekReport } from "./canalBalance";
import type { GameState } from "./game";
import type { CanalOperatingPlan } from "./canalOperatingPlan";

export type CanalDaypart = "night" | "morning" | "day" | "evening";

export type CanalOperatingBlock = {
  dayIndex: number;
  daypart: CanalDaypart;
  startsAt: number;
  endsAt: number;
  openHours: number;
  scheduledAufguss: number;
  demandWeight: number;
  admissions: number;
  specialSeats: number;
};

const DAYPARTS: Array<{ id: CanalDaypart; from: number; to: number }> = [
  { id: "night", from: 0, to: 7 },
  { id: "morning", from: 7, to: 11 },
  { id: "day", from: 11, to: 17 },
  { id: "evening", from: 17, to: 24 },
];

function overlap(from: number, to: number, windowFrom: number, windowTo: number) {
  return Math.max(0, Math.min(to, windowTo) - Math.max(from, windowFrom));
}

function intentWeight(snapshot: GameState, daypart: CanalDaypart) {
  const intent = snapshot.activeProgram.intent;
  if (intent === "Quiet Recovery") {
    return daypart === "morning" ? 1.2 : daypart === "day" ? 1.15 : daypart === "evening" ? 0.85 : 0.45;
  }
  if (intent === "Social Energy" || intent === "Show Journey") {
    return daypart === "evening" ? 1.25 : daypart === "day" ? 0.95 : daypart === "morning" ? 0.7 : 0.5;
  }
  return daypart === "evening" ? 1.05 : daypart === "day" ? 1.05 : daypart === "morning" ? 0.9 : 0.55;
}

function allocateIntegerTotal<T>(items: T[], total: number, weightOf: (item: T) => number) {
  if (items.length === 0 || total <= 0) return items.map(() => 0);
  const weights = items.map((item) => Math.max(0, weightOf(item)));
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) return items.map((_, index) => (index === 0 ? total : 0));

  const raw = weights.map((weight) => (total * weight) / sum);
  const allocated = raw.map((value) => Math.floor(value));
  let remaining = total - allocated.reduce((a, b) => a + b, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  for (const entry of order) {
    if (remaining <= 0) break;
    allocated[entry.index] += 1;
    remaining -= 1;
  }
  return allocated;
}

/**
 * Turns the canonical weekly operating plan into concrete open day/daypart blocks.
 *
 * This is deliberately an allocation layer first: admissions and Gus seats still sum exactly to
 * the proven weekly ledger. The next migration step can move revenue/cost/wear into these blocks
 * without changing the externally visible weekly result in the same commit.
 */
export function buildCanalOperatingBlocks(
  snapshot: GameState,
  operatingPlan: CanalOperatingPlan,
  ledger: Pick<WeekReport, "admissions" | "specialSeats">,
): CanalOperatingBlock[] {
  const schedule = operatingPlan.effectiveSchedule;
  const openDays = Math.max(0, Math.min(7, Math.trunc(schedule.openDays)));
  const blocks: CanalOperatingBlock[] = [];

  for (let dayIndex = 0; dayIndex < openDays; dayIndex += 1) {
    for (const daypart of DAYPARTS) {
      const openHours = overlap(schedule.opensAt, schedule.closesAt, daypart.from, daypart.to);
      if (openHours <= 0) continue;
      const startsAt = Math.max(schedule.opensAt, daypart.from);
      const endsAt = Math.min(schedule.closesAt, daypart.to);
      const scheduledAufguss = operatingPlan.aufguss.scheduled.filter(
        (session) => session.dayIndex === dayIndex && session.startsAt >= startsAt && session.startsAt < endsAt,
      ).length;
      const demandWeight = openHours * intentWeight(snapshot, daypart);
      blocks.push({
        dayIndex,
        daypart: daypart.id,
        startsAt,
        endsAt,
        openHours,
        scheduledAufguss,
        demandWeight,
        admissions: 0,
        specialSeats: 0,
      });
    }
  }

  const admissionAllocations = allocateIntegerTotal(blocks, ledger.admissions, (block) => block.demandWeight);
  const specialAllocations = allocateIntegerTotal(
    blocks,
    ledger.specialSeats,
    (block) => block.scheduledAufguss > 0 ? block.scheduledAufguss * Math.max(0.25, block.demandWeight) : 0,
  );

  return blocks.map((block, index) => ({
    ...block,
    admissions: admissionAllocations[index] ?? 0,
    specialSeats: specialAllocations[index] ?? 0,
  }));
}

export function summarizeCanalOperatingBlocks(blocks: CanalOperatingBlock[]) {
  return {
    openHours: blocks.reduce((total, block) => total + block.openHours, 0),
    admissions: blocks.reduce((total, block) => total + block.admissions, 0),
    specialSeats: blocks.reduce((total, block) => total + block.specialSeats, 0),
    scheduledAufguss: blocks.reduce((total, block) => total + block.scheduledAufguss, 0),
  };
}
