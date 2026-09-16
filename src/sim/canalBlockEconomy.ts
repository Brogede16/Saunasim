import type { WeekReport } from "./canalBalance";
import type { CanalOperatingBlock } from "./canalOperatingBlocks";

export type CanalEconomyMode = "native-operating" | "legacy-allocation";

export type CanalBlockEconomy = CanalOperatingBlock & {
  revenue: {
    admissions: number;
    specialGus: number;
    shop: number;
    total: number;
  };
  costs: {
    venueBase: number;
    staff: number;
    utilitiesAndCleaning: number;
    programMaterials: number;
    shopProcurement: number;
    facilities: number;
    total: number;
  };
  operatingNet: number;
};

const VARIABLE_VENUE_COST_PER_OPEN_HOUR = 2;
const VARIABLE_UTILITIES_AND_CLEANING_PER_OPEN_HOUR = 2;

function allocateAmount<T>(items: T[], total: number, weightOf: (item: T) => number) {
  if (items.length === 0) return [] as number[];
  if (total === 0) return items.map(() => 0);
  const weights = items.map((item) => Math.max(0, weightOf(item)));
  const weightSum = weights.reduce((sum, value) => sum + value, 0);
  if (weightSum <= 0) return items.map((_, index) => index === 0 ? total : 0);

  const values = weights.map((weight) => (total * weight) / weightSum);
  const allocated = values.map((value) => Math.round(value * 100) / 100);
  const residual = Math.round((total - allocated.reduce((sum, value) => sum + value, 0)) * 100) / 100;
  allocated[allocated.length - 1] = Math.round((allocated[allocated.length - 1] + residual) * 100) / 100;
  return allocated;
}

/**
 * Places operating economy into the blocks that caused it. Native mode is completely independent
 * of a weekly ledger. A ledger is accepted only by explicit legacy-allocation tests.
 */
export function allocateCanalBlockEconomy(
  blocks: CanalOperatingBlock[],
  ledger?: Pick<WeekReport, "revenueBreakdown" | "costBreakdown">,
  mode: CanalEconomyMode = "native-operating",
): CanalBlockEconomy[] {
  if (mode === "legacy-allocation" && !ledger) {
    throw new Error("legacy-allocation requires a weekly ledger");
  }
  const legacy = ledger!;
  const admissionRevenue = mode === "legacy-allocation"
    ? allocateAmount(blocks, legacy.revenueBreakdown.admissions, (block) => block.admissions)
    : blocks.map((block) => Math.round(block.admissions * block.admissionPrice * 100) / 100);
  const specialRevenue = mode === "legacy-allocation"
    ? allocateAmount(blocks, legacy.revenueBreakdown.specialGus, (block) => block.specialSeats)
    : blocks.map((block) => Math.round(block.specialSeats * block.supplementPrice * 100) / 100);
  const shopRevenue = mode === "legacy-allocation"
    ? allocateAmount(blocks, legacy.revenueBreakdown.shop, (block) => block.admissions)
    : blocks.map((block) => block.shopRevenue);

  const venueBase = mode === "legacy-allocation"
    ? allocateAmount(blocks, legacy.costBreakdown.venueBase, (block) => block.openHours)
    : blocks.map((block) => Math.round(block.openHours * VARIABLE_VENUE_COST_PER_OPEN_HOUR * 100) / 100);
  const staff = mode === "legacy-allocation"
    ? allocateAmount(blocks, legacy.costBreakdown.staff, (block) => block.openHours + block.scheduledAufguss)
    : blocks.map((block) => block.staffCost);
  const utilities = mode === "legacy-allocation"
    ? allocateAmount(blocks, legacy.costBreakdown.utilitiesAndCleaning, (block) => block.openHours)
    : blocks.map((block) => Math.round(block.openHours * VARIABLE_UTILITIES_AND_CLEANING_PER_OPEN_HOUR * 100) / 100);
  const materials = mode === "legacy-allocation"
    ? allocateAmount(blocks, legacy.costBreakdown.programMaterials, (block) => block.scheduledAufguss)
    : blocks.map((block) => Math.round(block.scheduledAufguss * block.sessionMaterialCost * 100) / 100);
  const shopProcurement = mode === "legacy-allocation"
    ? allocateAmount(blocks, legacy.costBreakdown.shopProcurement, (block) => block.admissions)
    : blocks.map((block) => block.shopProcurement);
  const facilities = mode === "legacy-allocation"
    ? allocateAmount(blocks, legacy.costBreakdown.facilities, (block) => block.openHours)
    : blocks.map(() => 0);

  return blocks.map((block, index) => {
    const revenue = {
      admissions: admissionRevenue[index] ?? 0,
      specialGus: specialRevenue[index] ?? 0,
      shop: shopRevenue[index] ?? 0,
      total: 0,
    };
    revenue.total = Math.round((revenue.admissions + revenue.specialGus + revenue.shop) * 100) / 100;
    const costs = {
      venueBase: venueBase[index] ?? 0,
      staff: staff[index] ?? 0,
      utilitiesAndCleaning: utilities[index] ?? 0,
      programMaterials: materials[index] ?? 0,
      shopProcurement: shopProcurement[index] ?? 0,
      facilities: facilities[index] ?? 0,
      total: 0,
    };
    costs.total = Math.round((costs.venueBase + costs.staff + costs.utilitiesAndCleaning + costs.programMaterials + costs.shopProcurement + costs.facilities) * 100) / 100;
    return {
      ...block,
      revenue,
      costs,
      operatingNet: Math.round((revenue.total - costs.total) * 100) / 100,
    };
  });
}

export function summarizeCanalBlockEconomy(blocks: CanalBlockEconomy[]) {
  const sum = (pick: (block: CanalBlockEconomy) => number) => Math.round(blocks.reduce((total, block) => total + pick(block), 0) * 100) / 100;
  return {
    revenueBreakdown: {
      admissions: sum((block) => block.revenue.admissions),
      specialGus: sum((block) => block.revenue.specialGus),
      shop: sum((block) => block.revenue.shop),
    },
    costBreakdown: {
      venueBase: sum((block) => block.costs.venueBase),
      staff: sum((block) => block.costs.staff),
      utilitiesAndCleaning: sum((block) => block.costs.utilitiesAndCleaning),
      programMaterials: sum((block) => block.costs.programMaterials),
      shopProcurement: sum((block) => block.costs.shopProcurement),
      facilities: sum((block) => block.costs.facilities),
    },
    operatingNet: sum((block) => block.operatingNet),
  };
}
