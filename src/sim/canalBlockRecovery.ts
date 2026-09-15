import type { GameState } from "./game";
import { conditionMultiplier } from "./maintenance";

export type CanalRecoveryBlockInput = {
  scheduledAufguss: number;
  specialSeats: number;
};

export type CanalBlockRecovery = {
  recoveryDemand: number;
  plungeSlots: number;
  showerSlots: number;
  queueLoss: number;
  bottleneck?: "Cold recovery";
};

function available(snapshot: GameState, id: "shower" | "cold-plunge") {
  return snapshot.built.includes(id)
    && snapshot.repairTask?.moduleId !== id
    && (snapshot.condition[id] ?? 100) > 0;
}

/**
 * Recovery pressure belongs to the block containing the Special Gus visitors. The calculation uses
 * actual seats and actual scheduled sessions rather than the old weekly requested-session count.
 * Shower/plunge condition changes throughput immediately when a new block plan is created.
 */
export function calculateCanalBlockRecovery(
  snapshot: GameState,
  block: CanalRecoveryBlockInput,
): CanalBlockRecovery {
  const hasPlunge = available(snapshot, "cold-plunge");
  const hasShower = available(snapshot, "shower");
  const usesPlungeFinish = snapshot.activeProgram.recoveryFinish === "Cold Plunge" && hasPlunge;
  const recoveryDemand = usesPlungeFinish
    ? Math.ceil(block.specialSeats * 0.45)
    : hasPlunge
      ? Math.ceil(block.specialSeats * 0.2)
      : 0;
  const plungeSlots = hasPlunge
    ? Math.floor(block.scheduledAufguss * 2 * conditionMultiplier(snapshot.condition["cold-plunge"] ?? 100))
    : 0;
  const showerSlots = hasShower
    ? Math.floor(block.scheduledAufguss * 2 * conditionMultiplier(snapshot.condition.shower ?? 100))
    : 0;
  const queueLoss = Math.min(5, Math.max(0, Math.ceil((recoveryDemand - plungeSlots - showerSlots) / 2)));

  return {
    recoveryDemand,
    plungeSlots,
    showerSlots,
    queueLoss,
    bottleneck: queueLoss > 0 ? "Cold recovery" : undefined,
  };
}
