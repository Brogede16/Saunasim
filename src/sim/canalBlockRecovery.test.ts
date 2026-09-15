import { describe, expect, it } from "vitest";
import { initialState } from "./game";
import { calculateCanalBlockRecovery } from "./canalBlockRecovery";

describe("native Canal block recovery", () => {
  it("creates no cold-recovery pressure without a plunge", () => {
    expect(calculateCanalBlockRecovery(initialState, { scheduledAufguss: 2, specialSeats: 14 })).toEqual({
      recoveryDemand: 0,
      plungeSlots: 0,
      showerSlots: 0,
      queueLoss: 0,
      bottleneck: undefined,
    });
  });

  it("uses actual Special Gus seats and actual block sessions", () => {
    const snapshot = {
      ...initialState,
      built: ["cold-plunge" as const, "shower" as const],
      condition: { "cold-plunge": 100, shower: 100 },
      activeProgram: { ...initialState.activeProgram, recoveryFinish: "Cold Plunge" as const },
    };
    const light = calculateCanalBlockRecovery(snapshot, { scheduledAufguss: 1, specialSeats: 4 });
    const busy = calculateCanalBlockRecovery(snapshot, { scheduledAufguss: 1, specialSeats: 14 });
    expect(busy.recoveryDemand).toBeGreaterThan(light.recoveryDemand);
    expect(busy.plungeSlots).toBe(light.plungeSlots);
    expect(busy.showerSlots).toBe(light.showerSlots);
  });

  it("reduces recovery throughput when technical condition degrades", () => {
    const healthy = {
      ...initialState,
      built: ["cold-plunge" as const, "shower" as const],
      condition: { "cold-plunge": 100, shower: 100 },
      activeProgram: { ...initialState.activeProgram, recoveryFinish: "Cold Plunge" as const },
    };
    const degraded = { ...healthy, condition: { "cold-plunge": 20, shower: 20 } };
    const healthyResult = calculateCanalBlockRecovery(healthy, { scheduledAufguss: 2, specialSeats: 20 });
    const degradedResult = calculateCanalBlockRecovery(degraded, { scheduledAufguss: 2, specialSeats: 20 });
    expect(degradedResult.plungeSlots + degradedResult.showerSlots).toBeLessThan(healthyResult.plungeSlots + healthyResult.showerSlots);
    expect(degradedResult.queueLoss).toBeGreaterThanOrEqual(healthyResult.queueLoss);
  });
});
