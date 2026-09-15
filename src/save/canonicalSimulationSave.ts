import { z } from "zod";
import { importSave, exportSave } from "./savegame";
import { advanceCanalSimulation, type CanonicalCanalEnvelope } from "../sim/canalRealtime";
import { createRngState } from "../sim/deterministicRng";

export const CANONICAL_SIMULATION_SAVE_VERSION = 1;

const envelopeSchema = z.object({
  schemaVersion: z.literal(CANONICAL_SIMULATION_SAVE_VERSION),
  startedAt: z.number().finite(),
  lastSimulatedAt: z.number().finite(),
  rng: z.object({ seed: z.number().int().nonnegative(), state: z.number().int().nonnegative() }),
  legacyGameSave: z.string(),
});

/**
 * Portable bridge format for Wave 1 and the future Swift parity suite.
 *
 * The nested legacy save intentionally reuses the existing validated GameState serializer while
 * canonical time/RNG live in an explicit outer envelope. This avoids silently changing IndexedDB
 * compatibility before the canonical engine is fully wired into the application runtime.
 */
export function exportCanonicalSimulationSave(envelope: CanonicalCanalEnvelope) {
  return JSON.stringify(
    {
      schemaVersion: CANONICAL_SIMULATION_SAVE_VERSION,
      startedAt: envelope.startedAt,
      lastSimulatedAt: envelope.lastSimulatedAt,
      rng: envelope.rng,
      legacyGameSave: exportSave(envelope.world),
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
    return {
      startedAt: parsed.data.startedAt,
      lastSimulatedAt: parsed.data.lastSimulatedAt,
      rng: parsed.data.rng,
      world,
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
