import { describe, expect, it } from "vitest";
import { planWeeklyAufguss } from "./aufgussScheduler";
import { starterProgram } from "./program";
import type { MasterProfile } from "./game";

const master: MasterProfile = {
  name: "Test Master",
  style: "Traditional",
  heatCraft: 3,
  aromaCraft: 3,
  performanceCraft: 3,
  weeklyWage: 500,
  equipment: [],
};

describe("automatic Aufguss scheduler", () => {
  it("schedules the requested weekly frequency without manual clock placement", () => {
    const plan = planWeeklyAufguss({
      schedule: { openDays: 5, opensAt: 10, closesAt: 20 },
      program: { ...starterProgram, requestedSessions: 4 },
      master,
      hasProgramSauna: false,
      hasOutdoorYard: false,
    });
    expect(plan.scheduled).toHaveLength(4);
    expect(plan.unfilled).toBe(0);
    expect(new Set(plan.scheduled.map((session) => session.dayIndex)).size).toBe(4);
  });

  it("never double-books one Master", () => {
    const plan = planWeeklyAufguss({
      schedule: { openDays: 1, opensAt: 10, closesAt: 20 },
      program: { ...starterProgram, requestedSessions: 8 },
      master,
      hasProgramSauna: true,
      hasOutdoorYard: true,
    });
    const sorted = [...plan.scheduled].sort((a, b) => a.startsAt - b.startsAt);
    for (let index = 1; index < sorted.length; index += 1) {
      expect(sorted[index]!.startsAt).toBeGreaterThanOrEqual(sorted[index - 1]!.endsAt);
    }
  });

  it("returns a concrete reason when no Master exists", () => {
    const plan = planWeeklyAufguss({
      schedule: { openDays: 5, opensAt: 10, closesAt: 20 },
      program: { ...starterProgram, requestedSessions: 3 },
      master: undefined,
      hasProgramSauna: false,
      hasOutdoorYard: false,
    });
    expect(plan.scheduled).toEqual([]);
    expect(plan.unfilled).toBe(3);
    expect(plan.unfilledReasons[0]).toMatch(/Master/);
  });

  it("pays a Master through short gaps but not an all-day gap", () => {
    const plan = planWeeklyAufguss({
      schedule: { openDays: 1, opensAt: 10, closesAt: 24 },
      program: { ...starterProgram, requestedSessions: 3, intent: "Social Energy" },
      master,
      hasProgramSauna: false,
      hasOutdoorYard: false,
    });
    expect(plan.masterPaidHours).toBeGreaterThan(0);
    expect(plan.masterPaidHours).toBeLessThan(14);
    expect(plan.masterWage).toBe(Math.round(plan.masterPaidHours * 10));
  });
});
