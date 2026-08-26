import { describe, expect, it } from "vitest";
import { coldRecoveryQueueLoss, evaluateScheduleFit, simulateCanalWeek } from "./canalBalance";
import { starterProgram } from "./program";

describe("Canal balance reference", () => {
  it("keeps the legacy ledger stable when no editable program is supplied", () => {
    expect(simulateCanalWeek({ cash: 3_350, built: [], masterHired: true, admissionPrice: 24 })).toMatchObject({
      admissions: 70,
      specialSeats: 14,
      shopSales: 0,
      revenue: 1_778,
      operatingCosts: 1_235,
      netResult: 543,
    });
  });

  it("keeps an owner-only workshop close to break-even", () => {
    expect(simulateCanalWeek({ cash: 4_000, built: [], masterHired: false, admissionPrice: 24 }).netResult).toBe(8);
  });

  it("makes a high entry price reduce accepted admissions", () => {
    const healthy = simulateCanalWeek({ cash: 3_350, built: [], masterHired: true, admissionPrice: 24 });
    const overpriced = simulateCanalWeek({ cash: 3_350, built: [], masterHired: true, admissionPrice: 32 });
    expect(overpriced.admissions).toBeLessThan(healthy.admissions);
    expect(overpriced.signal).toContain("price");
  });

  it("charges extra staffing coverage for longer opening schedules", () => {
    const defaultWeek = simulateCanalWeek({ cash: 0, built: ["program"], masterHired: true, admissionPrice: 24, schedule: { openDays: 5, opensAt: 10, closesAt: 20 } });
    const extendedWeek = simulateCanalWeek({ cash: 0, built: ["program"], masterHired: true, admissionPrice: 24, schedule: { openDays: 6, opensAt: 8, closesAt: 22 } });
    expect(extendedWeek.costBreakdown.staff).toBeGreaterThan(defaultWeek.costBreakdown.staff);
  });

  it("caps a single venue schedule at sixteen hours per day", () => {
    const longDay = simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24, schedule: { openDays: 7, opensAt: 0, closesAt: 24 } });
    const sixteenHourDay = simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24, schedule: { openDays: 7, opensAt: 6, closesAt: 22 } });
    expect(longDay.admissions).toBe(sixteenHourDay.admissions);
    expect(longDay.costBreakdown.staff).toBe(sixteenHourDay.costBreakdown.staff);
  });

  it("lets a lower entry price buy visibly more ordinary visits", () => {
    const lower = simulateCanalWeek({ cash: 3_350, built: ["program", "bench-refit"], masterHired: true, admissionPrice: 20 });
    const standard = simulateCanalWeek({ cash: 3_350, built: ["program", "bench-refit"], masterHired: true, admissionPrice: 24 });
    expect(lower.admissions).toBeGreaterThan(standard.admissions);
  });

  it("lets a stronger visible venue sustain a higher admission price", () => {
    const compact = simulateCanalWeek({ cash: 3_350, built: [], masterHired: true, admissionPrice: 30 });
    const upgraded = simulateCanalWeek({ cash: 3_350, built: ["program", "aufguss-yard", "shower", "cold-plunge"], masterHired: true, admissionPrice: 30 });
    expect(upgraded.admissions).toBeGreaterThan(compact.admissions);
  });

  it("gives shop and outdoor Gus separate revenue paths", () => {
    const shop = simulateCanalWeek({ cash: 0, built: ["shop"], masterHired: true, admissionPrice: 24 });
    const yard = simulateCanalWeek({ cash: 0, built: ["aufguss-yard"], masterHired: true, admissionPrice: 24 });
    expect(shop.shopSales).toBeGreaterThan(0);
    expect(yard.specialSeats).toBeGreaterThan(14);
    expect(yard.revenue).toBeGreaterThan(shop.revenue);
    expect(shop.shopLines.reduce((total, line) => total + line.units, 0)).toBe(shop.shopSales);
  });

  it("keeps the entrance-sign contribution inside its documented range", () => {
    const base = simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24 });
    const withSign = simulateCanalWeek({ cash: 0, built: ["arrival"], masterHired: true, admissionPrice: 24 });
    expect(withSign.netResult - base.netResult).toBe(120);
  });

  it("reduces Program Sauna capacity in visible condition bands before failure", () => {
    const activeProgram = { ...starterProgram, requestedSessions: 1 };
    const healthy = simulateCanalWeek({ cash: 0, built: ["program"], masterHired: true, admissionPrice: 24, activeProgram });
    const degraded = simulateCanalWeek({ cash: 0, built: ["program"], masterHired: true, admissionPrice: 24, activeProgram, condition: { program: 35 } });
    expect(healthy.specialCapacity).toBe(24);
    expect(degraded.specialCapacity).toBe(18);
    expect(degraded.signal).toContain("degraded");
  });

  it("turns an unsupported cold finish into a real operating loss", () => {
    const activeProgram = { ...starterProgram, recoveryFinish: "Cold Plunge" as const, requestedSessions: 1 };
    const plungeOnly = simulateCanalWeek({ cash: 0, built: ["cold-plunge"], masterHired: true, admissionPrice: 24, activeProgram });
    const withShower = simulateCanalWeek({ cash: 0, built: ["cold-plunge", "shower"], masterHired: true, admissionPrice: 24, activeProgram });
    expect(plungeOnly).toMatchObject({ bottleneck: "Cold recovery", queueLoss: 1 });
    expect(plungeOnly.admissions).toBeLessThan(withShower.admissions);
    expect(plungeOnly.netResult).toBeLessThan(withShower.netResult);
  });

  it("exposes coldRecoveryQueueLoss so the program builder can preview recovery pressure before running the week", () => {
    const activeProgram = { ...starterProgram, recoveryFinish: "Cold Plunge" as const, requestedSessions: 1 };
    const plungeOnly = { cash: 0, built: ["cold-plunge"] as const, masterHired: true, admissionPrice: 24, activeProgram };
    expect(coldRecoveryQueueLoss(plungeOnly, 20, activeProgram)).toMatchObject({ bottleneck: "Cold recovery" });
    expect(coldRecoveryQueueLoss(plungeOnly, 0, activeProgram).bottleneck).toBeUndefined();
  });

  it("only offers a bounded walk-up top-up once the venue has real spare capacity to offer", () => {
    const withoutUpgrade = simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24, activeProgram: starterProgram });
    const withUpgrade = simulateCanalWeek({ cash: 0, built: ["bench-refit"], masterHired: true, admissionPrice: 24, activeProgram: starterProgram });
    // No capacity upgrade: no walk-up seats reported at all, not even zero-but-present.
    expect(withoutUpgrade.walkUpSeats).toBeUndefined();
    // With one: a real but modest top-up, well short of filling all the spare room outright.
    expect(withUpgrade.walkUpSeats).toBeGreaterThan(0);
    expect(withUpgrade.walkUpSeats!).toBeLessThan((withUpgrade.specialCapacity ?? 0) - (withUpgrade.specialSeats - (withUpgrade.walkUpSeats ?? 0)));
  });

  it("never lets walk-up fill alone make Program Sauna pay for itself before real demand exists", () => {
    // The exact regression this project already fixed once (rettelser-fra-claude.md, 2026-08-25):
    // Program Sauna's own physical-fit bonus must never let it outperform a plain healthy starter
    // week on its own. Walk-up fill (2026-08-26) must not quietly reopen that gap either.
    const healthy = simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24, activeProgram: starterProgram });
    const programOnly = simulateCanalWeek({ cash: 0, built: ["program"], masterHired: true, admissionPrice: 24, activeProgram: starterProgram });
    expect(programOnly.netResult).toBeLessThan(healthy.netResult);
  });

  it("connects the opening window to programme intent without using demographic assumptions", () => {
    const quiet = { ...starterProgram, intent: "Quiet Recovery" as const };
    const social = { ...starterProgram, intent: "Social Energy" as const };
    const daytime = { openDays: 5, opensAt: 9, closesAt: 19 };
    const late = { openDays: 5, opensAt: 16, closesAt: 24 };
    expect(evaluateScheduleFit(daytime, quiet)).toMatchObject({ fit: "Natural" });
    expect(evaluateScheduleFit(late, quiet)).toMatchObject({ fit: "Mixed" });
    expect(evaluateScheduleFit(late, social)).toMatchObject({ fit: "Natural" });
    expect(simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24, activeProgram: quiet, schedule: daytime }).specialSeats)
      .toBeGreaterThan(simulateCanalWeek({ cash: 0, built: [], masterHired: true, admissionPrice: 24, activeProgram: quiet, schedule: late }).specialSeats);
  });
});
