import { describe, expect, it } from "vitest";
import { initialState } from "./game";
import { planCanalOperations } from "./canalOperatingPlan";
import { buildCanalOperatingBlocks, summarizeCanalOperatingBlocks } from "./canalOperatingBlocks";

describe("Canal operating blocks", () => {
  it("preserves weekly admissions and Gus seats exactly in explicit legacy-allocation mode", () => {
    const snapshot = {
      ...initialState,
      masterHired: true,
      master: {
        name: "Test Master",
        style: "Traditional" as const,
        heatCraft: 3,
        aromaCraft: 3,
        performanceCraft: 2,
        weeklyWage: 500,
        equipment: [],
      },
      activeProgram: { ...initialState.activeProgram, requestedSessions: 4 },
    };
    const plan = planCanalOperations(snapshot);
    const blocks = buildCanalOperatingBlocks(snapshot, plan, { admissions: 70, specialSeats: 28 }, "legacy-allocation");
    const summary = summarizeCanalOperatingBlocks(blocks);

    expect(summary.admissions).toBe(70);
    expect(summary.specialSeats).toBe(28);
    expect(summary.scheduledAufguss).toBe(plan.aufguss.scheduled.length);
    expect(blocks.some((block) => block.specialSeats > 0 && block.scheduledAufguss > 0)).toBe(true);
    expect(blocks.filter((block) => block.scheduledAufguss === 0).every((block) => block.specialSeats === 0)).toBe(true);
  });

  it("puts social/show demand later than quiet recovery for the same fully covered opening window", () => {
    const master = {
      name: "Test Master",
      style: "Traditional" as const,
      heatCraft: 3,
      aromaCraft: 3,
      performanceCraft: 2,
      weeklyWage: 500,
      equipment: [],
    };
    const social = {
      ...initialState,
      masterHired: true,
      master,
      serviceHostCount: 1,
      hostHired: true,
      built: ["shop" as const],
      schedule: { openDays: 5, opensAt: 8, closesAt: 22 },
      activeProgram: { ...initialState.activeProgram, intent: "Social Energy" as const, requestedSessions: 3 },
    };
    const quiet = {
      ...social,
      activeProgram: { ...social.activeProgram, intent: "Quiet Recovery" as const },
    };

    const socialBlocks = buildCanalOperatingBlocks(social, planCanalOperations(social), { admissions: 100, specialSeats: 18 }, "legacy-allocation");
    const quietBlocks = buildCanalOperatingBlocks(quiet, planCanalOperations(quiet), { admissions: 100, specialSeats: 18 }, "legacy-allocation");
    const eveningAdmissions = (blocks: typeof socialBlocks) => blocks.filter((b) => b.daypart === "evening").reduce((t, b) => t + b.admissions, 0);

    expect(eveningAdmissions(socialBlocks)).toBeGreaterThan(eveningAdmissions(quietBlocks));
  });

  it("uses native admissions by default and remains deterministic", () => {
    const plan = planCanalOperations(initialState);
    const first = buildCanalOperatingBlocks(initialState, plan, { admissions: 31, specialSeats: 0 });
    const second = buildCanalOperatingBlocks(initialState, plan, { admissions: 999, specialSeats: 0 });
    expect(second).toEqual(first);
    expect(summarizeCanalOperatingBlocks(first).admissions).not.toBe(31);
    expect(summarizeCanalOperatingBlocks(second).admissions).not.toBe(999);
  });
});
