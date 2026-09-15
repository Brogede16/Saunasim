import { z } from "zod";
import { importSave, exportSave } from "./savegame";
import { advanceCanalSimulation, type CanonicalCanalEnvelope } from "../sim/canalRealtime";
import { createRngState } from "../sim/deterministicRng";
import type { OperatingWeekRuntime } from "../sim/canalWeekRuntime";

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
const runtimeBlockSchema = z.object({
  dayIndex: z.number().int().min(0).max(6),
  daypart: z.enum(["night", "morning", "day", "evening"]),
  startsAt: z.number().min(0).max(24),
  endsAt: z.number().min(0).max(24),
  openHours: z.number().nonnegative(),
  scheduledAufguss: z.number().int().nonnegative(),
  demandWeight: z.number().nonnegative(),
  // Optional only for reading early v2 saves created before guest revenue became block-owned.
  // Import normalises missing values from the saved world configuration before runtime resumes.
  admissionPrice: z.number().finite().nonnegative().optional(),
  supplementPrice: z.number().finite().nonnegative().optional(),
  admissions: z.number().int().nonnegative(),
  specialSeats: z.number().int().nonnegative(),
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
  plannedReport: z.unknown(),
  plannedBlocks: z.array(runtimeBlockSchema),
  settledBlockKeys: z.array(z.string()),
  accruedAdmissions: z.number().int().nonnegative(),
  accruedSpecialSeats: z.number().int().nonnegative(),
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
    const operatingRuntime = parsed.data.operatingRuntime
      ? {
          ...parsed.data.operatingRuntime,
          plannedBlocks: parsed.data.operatingRuntime.plannedBlocks.map((block) => ({
            ...block,
            admissionPrice: block.admissionPrice ?? world.admissionPrice,
            supplementPrice: block.supplementPrice ?? world.activeProgram.supplementPrice,
          })),
        } as OperatingWeekRuntime
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
