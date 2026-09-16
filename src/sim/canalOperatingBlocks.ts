import type { WeekReport } from "./canalBalance";
import { calculateNativeCanalBlockAdmissions, calculateNativeCanalSpecialDemand, canalSessionSeatCapacity } from "./canalBlockDemand";
import { calculateCanalBlockRecovery } from "./canalBlockRecovery";
import { calculateCanalBlockShopOutcome } from "./canalBlockShop";
import type { GameState } from "./game";
import type { CanalOperatingPlan } from "./canalOperatingPlan";
import { previewProgram, programSignature } from "./program";
import type { ShopLine } from "./shop";

export type CanalDaypart = "night" | "morning" | "day" | "evening";
export type CanalAdmissionMode = "native" | "legacy-allocation";

export type CanalOperatingBlock = {
  dayIndex: number;
  daypart: CanalDaypart;
  startsAt: number;
  endsAt: number;
  openHours: number;
  scheduledAufguss: number;
  specialCapacity: number;
  specialDemand: number;
  walkUpSeats: number;
  turnedAwayFromGus: number;
  programSignature: string;
  demandWeight: number;
  admissionPrice: number;
  supplementPrice: number;
  sessionMaterialCost: number;
  staffCost: number;
  admissions: number;
  specialSeats: number;
  shopSales: number;
  shopRevenue: number;
  shopProcurement: number;
  shopLines: ShopLine[];
  recoveryDemand: number;
  recoveryQueueLoss: number;
  recoveryBottleneck?: "Cold recovery";
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

function allocateMoney<T>(items: T[], total: number, weightOf: (item: T) => number) {
  if (items.length === 0) return [] as number[];
  if (total === 0) return items.map(() => 0);
  const weights = items.map((item) => Math.max(0, weightOf(item)));
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) return items.map((_, index) => index === 0 ? total : 0);
  const result = weights.map((weight) => Math.round(((total * weight) / sum) * 100) / 100);
  const residual = Math.round((total - result.reduce((a, b) => a + b, 0)) * 100) / 100;
  result[result.length - 1] = Math.round((result[result.length - 1] + residual) * 100) / 100;
  return result;
}

export function buildCanalOperatingBlocks(
  snapshot: GameState,
  operatingPlan: CanalOperatingPlan,
  ledger?: Partial<Pick<WeekReport, "admissions" | "specialSeats">>,
  admissionMode: CanalAdmissionMode = "native",
): CanalOperatingBlock[] {
  const schedule = operatingPlan.effectiveSchedule;
  const openDays = Math.max(0, Math.min(7, Math.trunc(schedule.openDays)));
  const blocks: CanalOperatingBlock[] = [];
  const sessionMaterialCost = previewProgram(snapshot.activeProgram).materialCost;
  const sessionCapacity = canalSessionSeatCapacity(snapshot);
  const activeProgramSignature = programSignature(snapshot.activeProgram);

  for (let dayIndex = 0; dayIndex < openDays; dayIndex += 1) {
    for (const daypart of DAYPARTS) {
      const openHours = overlap(schedule.opensAt, schedule.closesAt, daypart.from, daypart.to);
      if (openHours <= 0) continue;
      const startsAt = Math.max(schedule.opensAt, daypart.from);
      const endsAt = Math.min(schedule.closesAt, daypart.to);
      const scheduledAufguss = operatingPlan.aufguss.scheduled.filter(
        (session) => session.dayIndex === dayIndex && session.startsAt >= startsAt && session.startsAt < endsAt,
      ).length;
      const demandWeight = openHours * intentWeight(snapshot, daypart.id);
      blocks.push({
        dayIndex,
        daypart: daypart.id,
        startsAt,
        endsAt,
        openHours,
        scheduledAufguss,
        specialCapacity: scheduledAufguss * sessionCapacity,
        specialDemand: 0,
        walkUpSeats: 0,
        turnedAwayFromGus: 0,
        programSignature: activeProgramSignature,
        demandWeight,
        admissionPrice: snapshot.admissionPrice,
        supplementPrice: snapshot.activeProgram.supplementPrice,
        sessionMaterialCost,
        staffCost: 0,
        admissions: 0,
        specialSeats: 0,
        shopSales: 0,
        shopRevenue: 0,
        shopProcurement: 0,
        shopLines: [],
        recoveryDemand: 0,
        recoveryQueueLoss: 0,
      });
    }
  }

  const staffCosts = allocateMoney(
    blocks,
    operatingPlan.staffWage,
    (block) => block.openHours + block.scheduledAufguss,
  );
  blocks.forEach((block, index) => {
    block.staffCost = staffCosts[index] ?? 0;
  });

  const admissionAllocations = admissionMode === "legacy-allocation" && ledger?.admissions !== undefined
    ? allocateIntegerTotal(blocks, ledger.admissions, (block) => block.demandWeight)
    : calculateNativeCanalBlockAdmissions(snapshot, operatingPlan, blocks).map((block) => block.admissions);

  const blocksWithAdmissions = blocks.map((block, index) => {
    const admissions = admissionAllocations[index] ?? 0;
    const shop = admissionMode === "legacy-allocation"
      ? { sales: 0, revenue: 0, procurement: 0, lines: [] }
      : calculateCanalBlockShopOutcome(snapshot, admissions);
    return {
      ...block,
      admissions,
      shopSales: shop.sales,
      shopRevenue: shop.revenue,
      shopProcurement: shop.procurement,
      shopLines: shop.lines,
    };
  });

  if (admissionMode === "legacy-allocation" && ledger?.specialSeats !== undefined) {
    const specialAllocations = allocateIntegerTotal(
      blocksWithAdmissions,
      ledger.specialSeats,
      (block) => block.scheduledAufguss > 0 ? block.scheduledAufguss * Math.max(0.25, block.demandWeight) : 0,
    );
    return blocksWithAdmissions.map((block, index) => ({
      ...block,
      specialSeats: specialAllocations[index] ?? 0,
    }));
  }

  const special = calculateNativeCanalSpecialDemand(snapshot, operatingPlan, blocksWithAdmissions);
  const sessionWeight = (block: CanalOperatingBlock) => block.scheduledAufguss > 0
    ? block.scheduledAufguss * Math.max(0.25, block.demandWeight)
    : 0;
  const demandByBlock = allocateIntegerTotal(blocksWithAdmissions, special.programmeDemand, sessionWeight);
  const walkUpsByBlock = allocateIntegerTotal(blocksWithAdmissions, special.walkUpSeats, sessionWeight);
  const turnedAwayByBlock = allocateIntegerTotal(blocksWithAdmissions, special.turnedAway, sessionWeight);

  return blocksWithAdmissions.map((block, index) => {
    const specialSeats = special.seats[index] ?? 0;
    const recovery = calculateCanalBlockRecovery(snapshot, { scheduledAufguss: block.scheduledAufguss, specialSeats });
    return {
      ...block,
      specialSeats,
      specialDemand: demandByBlock[index] ?? 0,
      walkUpSeats: walkUpsByBlock[index] ?? 0,
      turnedAwayFromGus: turnedAwayByBlock[index] ?? 0,
      recoveryDemand: recovery.recoveryDemand,
      recoveryQueueLoss: recovery.queueLoss,
      recoveryBottleneck: recovery.bottleneck,
    };
  });
}

export function summarizeCanalOperatingBlocks(blocks: CanalOperatingBlock[]) {
  return {
    openHours: blocks.reduce((total, block) => total + block.openHours, 0),
    admissions: blocks.reduce((total, block) => total + block.admissions, 0),
    specialSeats: blocks.reduce((total, block) => total + block.specialSeats, 0),
    specialCapacity: blocks.reduce((total, block) => total + block.specialCapacity, 0),
    specialDemand: blocks.reduce((total, block) => total + block.specialDemand, 0),
    walkUpSeats: blocks.reduce((total, block) => total + block.walkUpSeats, 0),
    turnedAwayFromGus: blocks.reduce((total, block) => total + block.turnedAwayFromGus, 0),
    scheduledAufguss: blocks.reduce((total, block) => total + block.scheduledAufguss, 0),
    staffCost: Math.round(blocks.reduce((total, block) => total + block.staffCost, 0) * 100) / 100,
    shopSales: blocks.reduce((total, block) => total + block.shopSales, 0),
    shopRevenue: Math.round(blocks.reduce((total, block) => total + block.shopRevenue, 0) * 100) / 100,
    shopProcurement: Math.round(blocks.reduce((total, block) => total + block.shopProcurement, 0) * 100) / 100,
    recoveryDemand: blocks.reduce((total, block) => total + block.recoveryDemand, 0),
    recoveryQueueLoss: blocks.reduce((total, block) => total + block.recoveryQueueLoss, 0),
  };
}
