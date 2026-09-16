import { z } from "zod";
import { importSave, exportSave } from "./savegame";
import { advanceCanalSimulation, type CanonicalCanalEnvelope } from "../sim/canalRealtime";
import { canalSessionSeatCapacity } from "../sim/canalBlockDemand";
import { createRngState } from "../sim/deterministicRng";
import { previewProgram, programSignature } from "../sim/program";
import { defaultShopRange, resolveShopLines } from "../sim/shop";
import { operatingBlockKey, type OperatingWeekRuntime } from "../sim/canalWeekRuntime";

export const CANONICAL_SIMULATION_SAVE_VERSION = 2;

const breakdownSchema = z.object({
  admissions: z.number().finite(),
  specialGus: z.number().finite(),
  shop: z.number().finite(),
});
const costBreakdownSchema = z.object({
  venueBase: z.number().finite(),
  staff: z.number().finite(),
  utilitiesAndCleaning: z.number().finite(),
  programMaterials: z.number().finite(),
  shopProcurement: z.number().finite(),
  facilities: z.number().finite(),
});
const shopLineSchema = z.object({
  itemId: z.enum(["cold-water", "herbal-tea", "towel-rental", "sauna-towel", "house-blend", "signature-towel", "fruit-snack"]),
  name: z.string(),
  units: z.number().int().nonnegative(),
  revenue: z.number().finite().nonnegative(),
  procurement: z.number().finite().nonnegative(),
});
const runtimeBlockSchema = z.object({
  dayIndex: z.number().int().min(0).max(6),
  daypart: z.enum(["night", "morning", "day", "evening"]),
  startsAt: z.number().min(0).max(24),
  endsAt: z.number().min(0).max(24),
  openHours: z.number().nonnegative(),
  scheduledAufguss: z.number().int().nonnegative(),
  specialCapacity: z.number().int().nonnegative().optional(),
  specialDemand: z.number().int().nonnegative().optional(),
  walkUpSeats: z.number().int().nonnegative().optional(),
  turnedAwayFromGus: z.number().int().nonnegative().optional(),
  programSignature: z.string().optional(),
  demandWeight: z.number().nonnegative(),
  admissionPrice: z.number().finite().nonnegative().optional(),
  supplementPrice: z.number().finite().nonnegative().optional(),
  sessionMaterialCost: z.number().finite().nonnegative().optional(),
  staffCost: z.number().finite().nonnegative().optional(),
  admissions: z.number().int().nonnegative(),
  specialSeats: z.number().int().nonnegative(),
  shopSales: z.number().int().nonnegative().optional(),
  shopRevenue: z.number().finite().nonnegative().optional(),
  shopProcurement: z.number().finite().nonnegative().optional(),
  shopLines: z.array(shopLineSchema).optional(),
  recoveryDemand: z.number().int().nonnegative().optional(),
  recoveryQueueLoss: z.number().int().nonnegative().optional(),
  recoveryBottleneck: z.literal("Cold recovery").optional(),
  revenue: z.object({ admissions: z.number(), specialGus: z.number(), shop: z.number(), total: z.number() }),
  costs: z.object({
    venueBase: z.number(),
    staff: z.number(),
    utilitiesAndCleaning: z.number(),
    programMaterials: z.number(),
    shopProcurement: z.number(),
    facilities: z.number(),
    total: z.number(),
  }),
  operatingNet: z.number(),
  wear: z.object({ program: z.number().nonnegative().optional(), shower: z.number().nonnegative().optional(), "cold-plunge": z.number().nonnegative().optional() }),
});
const operatingRuntimeSchema = z.object({
  week: z.number().int().positive(),
  // Kept optional only to read early v2 saves. Canonical runtime no longer stores/uses it.
  plannedReport: z.unknown().optional(),
  plannedBlocks: z.array(runtimeBlockSchema),
  settledBlockKeys: z.array(z.string()),
  accruedAdmissions: z.number().int().nonnegative(),
  accruedSpecialSeats: z.number().int().nonnegative(),
  accruedSpecialCapacity: z.number().int().nonnegative().optional(),
  accruedShopSales: z.number().int().nonnegative().optional(),
  accruedRecoveryDemand: z.number().int().nonnegative().optional(),
  accruedRecoveryQueueLoss: z.number().int().nonnegative().optional(),
  accruedRevenueBreakdown: breakdownSchema,
  accruedCostBreakdown: costBreakdownSchema,
  accruedOperatingNet: z.number().finite(),
});

const envelopeSchema = z.object({
  schemaVersion: z.union([z.literal(1), z.literal(CANONICAL_SIMULATION_SAVE_VERSION)]),
  startedAt: z.number().finite(),
  lastSimulatedAt: z.number().finite(),
  rng: z.object({ seed: z.number().int().nonnegative(), state: z.number().int().nonnegative() }),
  legacyGameSave: z.string(),
  operatingRuntime: operatingRuntimeSchema.optional(),
});

export function exportCanonicalSimulationSave(envelope: CanonicalCanalEnvelope) {
  return JSON.stringify(
    {
      schemaVersion: CANONICAL_SIMULATION_SAVE_VERSION,
      startedAt: envelope.startedAt,
      lastSimulatedAt: envelope.lastSimulatedAt,
      rng: envelope.rng,
      legacyGameSave: exportSave(envelope.world),
      operatingRuntime: envelope.operatingRuntime,
    },
    null,
    2,
  );
}

export function importCanonicalSimulationSave(serialized: string): CanonicalCanalEnvelope | undefined {
  try {
    const parsed = envelopeSchema.safeParse(JSON.parse(serialized));
    if (!parsed.success || parsed.data.lastSimulatedAt < parsed.data.startedAt) return undefined;
    const world = importSave(parsed.data.legacyGameSave);
    if (!world) return undefined;
    const currentMaterialCost = previewProgram(world.activeProgram).materialCost;
    const currentProgramSignature = programSignature(world.activeProgram);
    const sessionCapacity = canalSessionSeatCapacity(world);
    const operatingRuntime = parsed.data.operatingRuntime
      ? (() => {
          const source = parsed.data.operatingRuntime!;
          const plannedBlocks = source.plannedBlocks.map((block) => {
            const shopSales = block.shopSales ?? 0;
            const inferredLines = block.shopLines ?? resolveShopLines(
              world.shopRange ?? defaultShopRange,
              shopSales,
              undefined,
              world.repertoire.length > 0,
            );
            return {
              ...block,
              specialCapacity: block.specialCapacity ?? block.scheduledAufguss * sessionCapacity,
              specialDemand: block.specialDemand ?? block.specialSeats,
              walkUpSeats: block.walkUpSeats ?? 0,
              turnedAwayFromGus: block.turnedAwayFromGus ?? 0,
              programSignature: block.programSignature ?? currentProgramSignature,
              admissionPrice: block.admissionPrice ?? world.admissionPrice,
              supplementPrice: block.supplementPrice ?? world.activeProgram.supplementPrice,
              sessionMaterialCost: block.sessionMaterialCost ?? currentMaterialCost,
              staffCost: block.staffCost ?? block.costs.staff,
              shopSales,
              shopRevenue: block.shopRevenue ?? block.revenue.shop,
              shopProcurement: block.shopProcurement ?? block.costs.shopProcurement,
              shopLines: inferredLines,
              recoveryDemand: block.recoveryDemand ?? 0,
              recoveryQueueLoss: block.recoveryQueueLoss ?? 0,
              recoveryBottleneck: block.recoveryBottleneck,
            };
          });
          const settledKeys = source.settledBlockKeys;
          const inferredSettledCapacity = plannedBlocks
            .filter((block) => settledKeys.includes(operatingBlockKey(block)))
            .reduce((total, block) => total + block.specialCapacity, 0);
          return {
            week: source.week,
            plannedBlocks,
            settledBlockKeys: source.settledBlockKeys,
            accruedAdmissions: source.accruedAdmissions,
            accruedSpecialSeats: source.accruedSpecialSeats,
            accruedSpecialCapacity: source.accruedSpecialCapacity ?? inferredSettledCapacity,
            accruedShopSales: source.accruedShopSales ?? 0,
            accruedRecoveryDemand: source.accruedRecoveryDemand ?? 0,
            accruedRecoveryQueueLoss: source.accruedRecoveryQueueLoss ?? 0,
            accruedRevenueBreakdown: source.accruedRevenueBreakdown,
            accruedCostBreakdown: source.accruedCostBreakdown,
            accruedOperatingNet: source.accruedOperatingNet,
          } as OperatingWeekRuntime;
        })()
      : undefined;
    return {
      startedAt: parsed.data.startedAt,
      lastSimulatedAt: parsed.data.lastSimulatedAt,
      rng: parsed.data.rng,
      world,
      operatingRuntime,
    };
  } catch {
    return undefined;
  }
}

export function resumeCanonicalSimulationSave(serialized: string, now: number) {
  const envelope = importCanonicalSimulationSave(serialized);
  if (!envelope) return undefined;
  return advanceCanalSimulation(envelope, now);
}

export function migrateLegacyGameSaveToCanonical(serializedLegacySave: string, at: number, seed = 0x5a17) {
  const world = importSave(serializedLegacySave);
  if (!world || !Number.isFinite(at)) return undefined;
  return {
    startedAt: at,
    lastSimulatedAt: at,
    rng: createRngState(seed),
    world,
  } satisfies CanonicalCanalEnvelope;
}
