import type { CanonicalCanalEnvelope } from "./canalRealtime";
import { applyCanalWorldChange } from "./canalCommands";
import type { ModuleId } from "./game";
import { modules } from "./game";

export type CanalConstructionCommandError =
  | "unknown-module"
  | "already-built"
  | "project-already-active"
  | "insufficient-cash"
  | "no-matching-project";

export type ConstructionCommandResult =
  | { ok: true; envelope: CanonicalCanalEnvelope }
  | { ok: false; error: CanalConstructionCommandError };

export function startCanalConstruction(
  envelope: CanonicalCanalEnvelope,
  moduleId: ModuleId,
): ConstructionCommandResult {
  const spec = modules.find((entry) => entry.id === moduleId);
  if (!spec) return { ok: false, error: "unknown-module" };
  if (envelope.world.built.includes(moduleId)) return { ok: false, error: "already-built" };
  if (envelope.world.construction.length > 0) return { ok: false, error: "project-already-active" };
  if (envelope.world.cash < spec.economy.price) return { ok: false, error: "insufficient-cash" };

  return {
    ok: true,
    envelope: applyCanalWorldChange(envelope, (world) => ({
      ...world,
      cash: world.cash - spec.economy.price,
      construction: [{
        moduleId,
        completesAt: envelope.lastSimulatedAt + spec.economy.buildHours * 60 * 60 * 1000,
      }],
    })),
  };
}

export function rushCanalConstruction(
  envelope: CanonicalCanalEnvelope,
  moduleId: ModuleId,
): ConstructionCommandResult {
  const spec = modules.find((entry) => entry.id === moduleId);
  if (!spec) return { ok: false, error: "unknown-module" };
  if (!envelope.world.construction.some((project) => project.moduleId === moduleId)) {
    return { ok: false, error: "no-matching-project" };
  }
  const rushCost = Math.ceil(spec.economy.price * 0.25);
  if (envelope.world.cash < rushCost) return { ok: false, error: "insufficient-cash" };

  return {
    ok: true,
    envelope: applyCanalWorldChange(envelope, (world) => ({
      ...world,
      cash: world.cash - rushCost,
      built: [...world.built, moduleId],
      construction: world.construction.filter((project) => project.moduleId !== moduleId),
    })),
  };
}
