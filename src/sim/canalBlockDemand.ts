import { canalProgramCapacity } from "../content/canalCapacity";
import { evaluateScheduleFit } from "./canalBalance";
import type { GameState } from "./game";
import { conditionMultiplier } from "./maintenance";
import type { CanalOperatingPlan } from "./canalOperatingPlan";
import type { CanalDaypart } from "./canalOperatingBlocks";

export type CanalDemandBlockInput = {
  dayIndex: number;
  daypart: CanalDaypart;
  openHours: number;
};

export type CanalSpecialDemandBlockInput = CanalDemandBlockInput & {
  scheduledAufguss: number;
  admissions: number;
};

export type CanalBlockDemand = CanalDemandBlockInput & {
  ordinaryPotential: number;
  ordinaryCapacity: number;
  admissions: number;
};

export type CanalSpecialDemandOutcome = {
  seats: number[];
  programmeDemand: number;
  specialCapacity: number;
  walkUpSeats: number;
  turnedAway: number;
};

const CLASSIC_REFERENCE_WEIGHT = 1.035;
const WALK_UP_SPARE_FILL_SHARE = 0.25;

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

function physicalProgramDemandFit(snapshot: GameState) {
  const program = snapshot.activeProgram;
  const has = (id: GameState["built"][number]) => snapshot.built.includes(id);
  if (program.intent === "Quiet Recovery" && (has("shower") || has("cold-plunge"))) return { multiplier: 1.1, priceSensitivity: 0.85 };
  if (program.intent === "Social Energy" && has("aufguss-yard")) return { multiplier: 1.15, priceSensitivity: 0.85 };
  if (program.intent === "Show Journey" && (has("program") || has("aufguss-yard"))) return { multiplier: 1.15, priceSensitivity: 0.8 };
  if (program.intent === "Classic Ritual" && has("program")) return { multiplier: 1.08, priceSensitivity: 0.9 };
  return { multiplier: 1, priceSensitivity: 1 };
}

/** Canonical guest places for one actually scheduled Gus session in the current physical venue state. */
export function canalSessionSeatCapacity(snapshot: GameState) {
  const hasProgramSauna = snapshot.built.includes("program");
  const hasYard = snapshot.built.includes("aufguss-yard");
  const hasBenchRefit = snapshot.built.includes("bench-refit");
  if (hasProgramSauna) {
    return Math.max(1, Math.floor(canalProgramCapacity.programSauna * conditionMultiplier(snapshot.condition.program ?? 100)));
  }
  if (hasYard) return canalProgramCapacity.outdoorGusYard;
  return canalProgramCapacity.compactRoom + (hasBenchRefit ? canalProgramCapacity.benchRefitBonus : 0);
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

export function calculateNativeCanalBlockAdmissions(
  snapshot: GameState,
  _operatingPlan: CanalOperatingPlan,
  blocks: CanalDemandBlockInput[],
): CanalBlockDemand[] {
  if (blocks.length === 0) return [];

  const basePerHour = baseDemandPerFiftyHours(snapshot) / 50;
  const rawPotential = blocks.map((block) =>
    basePerHour * block.openHours * (daypartWeight(snapshot.activeProgram.intent, block.daypart) / CLASSIC_REFERENCE_WEIGHT),
  );
  const roundedPotential = Math.max(0, Math.round(rawPotential.reduce((sum, value) => sum + value, 0)));

  const capacityPerFiftyHours = 82 / 50;
  const totalCapacity = Math.max(0, Math.round(blocks.reduce((sum, block) => sum + capacityPerFiftyHours * block.openHours, 0)));
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

/** Rich canonical Gus demand outcome used for factual reporting and per-block allocation. */
export function calculateNativeCanalSpecialDemand(
  snapshot: GameState,
  operatingPlan: CanalOperatingPlan,
  blocks: CanalSpecialDemandBlockInput[],
): CanalSpecialDemandOutcome {
  const scheduledSessions = blocks.reduce((sum, block) => sum + block.scheduledAufguss, 0);
  if (!snapshot.masterHired || scheduledSessions <= 0) {
    return { seats: blocks.map(() => 0), programmeDemand: 0, specialCapacity: 0, walkUpSeats: 0, turnedAway: 0 };
  }

  const fit = physicalProgramDemandFit(snapshot);
  const basePerSession = Math.max(
    0,
    7
      + (snapshot.activeProgram.intent === "Social Energy" ? 2.5 : snapshot.activeProgram.intent === "Show Journey" ? 2 : 0)
      - Math.max(0, snapshot.activeProgram.supplementPrice - 7) * 2 * fit.priceSensitivity,
  );
  const scheduleTiming = evaluateScheduleFit(operatingPlan.effectiveSchedule, snapshot.activeProgram).programTiming;
  const programmeDemand = Math.max(0, Math.round(scheduledSessions * fit.multiplier * basePerSession * scheduleTiming));
  const specialCapacity = scheduledSessions * canalSessionSeatCapacity(snapshot);
  const totalAdmissions = blocks.reduce((sum, block) => sum + block.admissions, 0);
  const hasCapacityUpgrade = snapshot.built.includes("bench-refit") || snapshot.built.includes("program") || snapshot.built.includes("aufguss-yard");
  const spareCapacity = hasCapacityUpgrade ? Math.max(0, Math.min(totalAdmissions, specialCapacity) - programmeDemand) : 0;
  const potentialWalkUp = Math.round(spareCapacity * WALK_UP_SPARE_FILL_SHARE);
  const accepted = Math.min(totalAdmissions, specialCapacity, programmeDemand + potentialWalkUp);
  const walkUpSeats = Math.max(0, accepted - Math.min(programmeDemand, accepted));
  const turnedAway = Math.max(0, programmeDemand - Math.min(totalAdmissions, specialCapacity));
  const seats = allocateIntegerByWeight(
    blocks,
    accepted,
    (block) => block.scheduledAufguss > 0
      ? block.scheduledAufguss * Math.max(0.25, daypartWeight(snapshot.activeProgram.intent, block.daypart))
      : 0,
  );
  return { seats, programmeDemand, specialCapacity, walkUpSeats, turnedAway };
}

export function calculateNativeCanalBlockSpecialSeats(
  snapshot: GameState,
  operatingPlan: CanalOperatingPlan,
  blocks: CanalSpecialDemandBlockInput[],
) {
  return calculateNativeCanalSpecialDemand(snapshot, operatingPlan, blocks).seats;
}
