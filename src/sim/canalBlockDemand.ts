import type { GameState } from "./game";
import type { CanalOperatingPlan } from "./canalOperatingPlan";
import type { CanalDaypart } from "./canalOperatingBlocks";

export type CanalDemandBlockInput = {
  dayIndex: number;
  daypart: CanalDaypart;
  openHours: number;
};

export type CanalBlockDemand = CanalDemandBlockInput & {
  ordinaryPotential: number;
  ordinaryCapacity: number;
  admissions: number;
};

const CLASSIC_REFERENCE_WEIGHT = 1.035;

function daypartWeight(intent: GameState["activeProgram"]["intent"], daypart: CanalDaypart) {
  if (intent === "Quiet Recovery") {
    return daypart === "morning" ? 1.2 : daypart === "day" ? 1.15 : daypart === "evening" ? 0.85 : 0.45;
  }
  if (intent === "Social Energy" || intent === "Show Journey") {
    return daypart === "evening" ? 1.25 : daypart === "day" ? 0.95 : daypart === "morning" ? 0.7 : 0.5;
  }
  return daypart === "evening" ? 1.05 : daypart === "day" ? 1.05 : daypart === "morning" ? 0.9 : 0.55;
}

function baseDemandPerFiftyHours(snapshot: GameState) {
  const hasMaster = snapshot.masterHired;
  const hasSign = snapshot.built.includes("arrival");
  const hasPlunge = snapshot.built.includes("cold-plunge");
  const hasYard = snapshot.built.includes("aufguss-yard");
  const hasProgramSauna = snapshot.built.includes("program");

  if (!hasMaster) return 30 + (hasSign ? 3 : 0);
  return 70 + (hasSign ? 5 : 0) + (hasPlunge ? 6 : 0) + (hasYard ? 8 : 0) + (hasProgramSauna ? 8 : 0);
}

function credibleAdmissionPrice(snapshot: GameState) {
  const hasYard = snapshot.built.includes("aufguss-yard");
  const hasShower = snapshot.built.includes("shower");
  const hasPlunge = snapshot.built.includes("cold-plunge");
  const hasHost = snapshot.serviceHostCount > 0;
  const programmeReputation = snapshot.activeProgram.revealedTier === "Ultimate" || snapshot.activeProgram.revealedTier === "Iconic"
    ? 2
    : snapshot.activeProgram.revealedTier === "Rare"
      ? 1
      : 0;
  return 24 + (hasYard ? 2 : 0) + (hasShower ? 1 : 0) + (hasPlunge ? 1 : 0) + (hasHost ? 1 : 0) + programmeReputation;
}

function weeklyPriceResistance(snapshot: GameState) {
  const priceDelta = snapshot.admissionPrice - credibleAdmissionPrice(snapshot);
  return priceDelta < 0
    ? priceDelta * 4
    : priceDelta * 2 + Math.max(0, priceDelta - 6) * 2;
}

function allocateIntegerByWeight<T>(items: T[], total: number, weightOf: (item: T) => number) {
  if (items.length === 0 || total <= 0) return items.map(() => 0);
  const weights = items.map((item) => Math.max(0, weightOf(item)));
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) return items.map((_, index) => index === 0 ? total : 0);
  const raw = weights.map((weight) => (total * weight) / sum);
  const result = raw.map(Math.floor);
  let remaining = total - result.reduce((a, b) => a + b, 0);
  for (const entry of raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index)) {
    if (remaining <= 0) break;
    result[entry.index] += 1;
    remaining -= 1;
  }
  return result;
}

/**
 * Computes ordinary arrivals directly from the operating blocks rather than distributing a
 * precomputed weekly admissions total. The 50-hour demand references are inherited balance data,
 * but time-of-day, actual staffed opening hours and price resistance are resolved here.
 */
export function calculateNativeCanalBlockAdmissions(
  snapshot: GameState,
  operatingPlan: CanalOperatingPlan,
  blocks: CanalDemandBlockInput[],
): CanalBlockDemand[] {
  if (blocks.length === 0) return [];

  const basePerHour = baseDemandPerFiftyHours(snapshot) / 50;
  const rawPotential = blocks.map((block) =>
    basePerHour * block.openHours * (daypartWeight(snapshot.activeProgram.intent, block.daypart) / CLASSIC_REFERENCE_WEIGHT),
  );
  const totalRawPotential = rawPotential.reduce((sum, value) => sum + value, 0);
  const roundedPotential = Math.max(0, Math.round(totalRawPotential));

  const capacityPerFiftyHours = 82 / 50;
  const rawCapacity = blocks.map((block) => capacityPerFiftyHours * block.openHours);
  const totalCapacity = Math.max(0, Math.round(rawCapacity.reduce((sum, value) => sum + value, 0)));

  // Host arrival relief is already represented in the staffed effective schedule. Keep the native
  // block model causal: capacity scales with actual open time instead of receiving a second hidden
  // weekly host bonus here.
  const priceAdjustedTotal = Math.max(0, roundedPotential - weeklyPriceResistance(snapshot));
  const acceptedTotal = Math.min(totalCapacity, priceAdjustedTotal);
  const admissions = allocateIntegerByWeight(blocks, acceptedTotal, (block) =>
    block.openHours * daypartWeight(snapshot.activeProgram.intent, block.daypart),
  );
  const potentials = allocateIntegerByWeight(blocks, roundedPotential, (block) =>
    block.openHours * daypartWeight(snapshot.activeProgram.intent, block.daypart),
  );
  const capacities = allocateIntegerByWeight(blocks, totalCapacity, (block) => block.openHours);

  return blocks.map((block, index) => ({
    ...block,
    ordinaryPotential: potentials[index] ?? 0,
    ordinaryCapacity: capacities[index] ?? 0,
    admissions: admissions[index] ?? 0,
  }));
}
