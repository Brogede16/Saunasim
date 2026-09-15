import type { WeekReport } from "./canalBalance";
import type { CanalOperatingBlock } from "./canalOperatingBlocks";

export type CanalEconomyMode = "native-admissions" | "legacy-allocation";

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
 * Places operating economy into the blocks that caused it.
 *
 * Native ordinary admission revenue is canonical: each block owns admissions x the ticket price
 * captured in that block. Remaining categories still conserve the weekly reference while they
 * await their own migration slices. Explicit legacy-allocation mode exists only for parity tests.
 */
export function allocateCanalBlockEconomy(
  blocks: CanalOperatingBlock[],
  ledger: Pick<WeekReport, "revenueBreakdown" | "costBreakdown">,
  mode: CanalEconomyMode = "native-admissions",
): CanalBlockEconomy[] {
  const admissionRevenue = mode === "legacy-allocation"
    ? allocateAmount(blocks, ledger.revenueBreakdown.admissions, (block) => block.admissions)
    : blocks.map((block) => Math.round(block.admissions * block.admissionPrice * 100) / 100);
  const specialRevenue = allocateAmount(blocks, ledger.revenueBreakdown.specialGus, (block) => block.specialSeats);
  const shopRevenue = allocateAmount(blocks, ledger.revenueBreakdown.shop, (block) => block.admissions);

  const venueBase = allocateAmount(blocks, ledger.costBreakdown.venueBase, (block) => block.openHours);
  const staff = allocateAmount(blocks, ledger.costBreakdown.staff, (block) => block.openHours + block.scheduledAufguss);
  const utilities = allocateAmount(blocks, ledger.costBreakdown.utilitiesAndCleaning, (block) => block.openHours);
  const materials = allocateAmount(blocks, ledger.costBreakdown.programMaterials, (block) => block.scheduledAufguss);
  const shopProcurement = allocateAmount(blocks, ledger.costBreakdown.shopProcurement, (block) => block.admissions);
  const facilities = allocateAmount(blocks, ledger.costBreakdown.facilities, (block) => block.openHours);

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
