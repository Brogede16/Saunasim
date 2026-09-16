import type { WeekReport } from "./canalBalance";
import type { CanalBlockEconomy } from "./canalBlockEconomy";
import type { MaintainableModuleId } from "./maintenance";

export type RuntimeOperatingBlock = CanalBlockEconomy & {
  wear: Partial<Record<MaintainableModuleId, number>>;
};

export type OperatingWeekRuntime = {
  week: number;
  plannedReport: WeekReport;
  plannedBlocks: RuntimeOperatingBlock[];
  settledBlockKeys: string[];
  accruedAdmissions: number;
  accruedSpecialSeats: number;
  accruedSpecialCapacity: number;
  accruedShopSales: number;
  accruedRecoveryDemand: number;
  accruedRecoveryQueueLoss: number;
  accruedRevenueBreakdown: WeekReport["revenueBreakdown"];
  accruedCostBreakdown: WeekReport["costBreakdown"];
  accruedOperatingNet: number;
};

export function operatingBlockKey(block: Pick<RuntimeOperatingBlock, "dayIndex" | "startsAt" | "endsAt">) {
  return `${block.dayIndex}:${block.startsAt}:${block.endsAt}`;
}

export function emptyOperatingWeekRuntime(
  week: number,
  plannedReport: WeekReport,
  plannedBlocks: RuntimeOperatingBlock[],
): OperatingWeekRuntime {
  return {
    week,
    plannedReport,
    plannedBlocks,
    settledBlockKeys: [],
    accruedAdmissions: 0,
    accruedSpecialSeats: 0,
    accruedSpecialCapacity: 0,
    accruedShopSales: 0,
    accruedRecoveryDemand: 0,
    accruedRecoveryQueueLoss: 0,
    accruedRevenueBreakdown: { admissions: 0, specialGus: 0, shop: 0 },
    accruedCostBreakdown: {
      venueBase: 0,
      staff: 0,
      utilitiesAndCleaning: 0,
      programMaterials: 0,
      shopProcurement: 0,
      facilities: 0,
    },
    accruedOperatingNet: 0,
  };
}

function money(value: number) {
  return Math.round(value * 100) / 100;
}

export function settleOperatingBlock(runtime: OperatingWeekRuntime, block: RuntimeOperatingBlock): OperatingWeekRuntime {
  const key = operatingBlockKey(block);
  if (runtime.settledBlockKeys.includes(key)) return runtime;

  return {
    ...runtime,
    settledBlockKeys: [...runtime.settledBlockKeys, key],
    accruedAdmissions: runtime.accruedAdmissions + block.admissions,
    accruedSpecialSeats: runtime.accruedSpecialSeats + block.specialSeats,
    accruedSpecialCapacity: runtime.accruedSpecialCapacity + block.specialCapacity,
    accruedShopSales: runtime.accruedShopSales + block.shopSales,
    accruedRecoveryDemand: runtime.accruedRecoveryDemand + block.recoveryDemand,
    accruedRecoveryQueueLoss: runtime.accruedRecoveryQueueLoss + block.recoveryQueueLoss,
    accruedRevenueBreakdown: {
      admissions: money(runtime.accruedRevenueBreakdown.admissions + block.revenue.admissions),
      specialGus: money(runtime.accruedRevenueBreakdown.specialGus + block.revenue.specialGus),
      shop: money(runtime.accruedRevenueBreakdown.shop + block.revenue.shop),
    },
    accruedCostBreakdown: {
      venueBase: money(runtime.accruedCostBreakdown.venueBase + block.costs.venueBase),
      staff: money(runtime.accruedCostBreakdown.staff + block.costs.staff),
      utilitiesAndCleaning: money(runtime.accruedCostBreakdown.utilitiesAndCleaning + block.costs.utilitiesAndCleaning),
      programMaterials: money(runtime.accruedCostBreakdown.programMaterials + block.costs.programMaterials),
      shopProcurement: money(runtime.accruedCostBreakdown.shopProcurement + block.costs.shopProcurement),
      facilities: money(runtime.accruedCostBreakdown.facilities + block.costs.facilities),
    },
    accruedOperatingNet: money(runtime.accruedOperatingNet + block.operatingNet),
  };
}
