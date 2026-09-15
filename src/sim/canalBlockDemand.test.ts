import { describe, expect, it } from "vitest";
import { initialState } from "./game";
import { planCanalOperations } from "./canalOperatingPlan";
import { calculateNativeCanalBlockAdmissions, calculateNativeCanalBlockSpecialSeats } from "./canalBlockDemand";
import type { CanalDemandBlockInput } from "./canalBlockDemand";

function blocksFor(schedule: { openDays: number; opensAt: number; closesAt: number }): CanalDemandBlockInput[] {
  const dayparts = [
    { id: "night" as const, from: 0, to: 7 },
    { id: "morning" as const, from: 7, to: 11 },
    { id: "day" as const, from: 11, to: 17 },
    { id: "evening" as const, from: 17, to: 24 },
  ];
  const result: CanalDemandBlockInput[] = [];
  for (let dayIndex = 0; dayIndex < schedule.openDays; dayIndex += 1) {
    for (const daypart of dayparts) {
      const openHours = Math.max(0, Math.min(schedule.closesAt, daypart.to) - Math.max(schedule.opensAt, daypart.from));
      if (openHours > 0) result.push({ dayIndex, daypart: daypart.id, openHours });
    }
  }
  return result;
}

const master = {
  name: "Demand Master",
  style: "Traditional" as const,
  heatCraft: 3,
  aromaCraft: 3,
  performanceCraft: 2,
  weeklyWage: 500,
  equipment: [],
};

function demandBlocksWithSessions(state: typeof initialState & { masterHired: boolean; master: typeof master }) {
  const plan = planCanalOperations(state);
  const ordinary = calculateNativeCanalBlockAdmissions(state, plan, blocksFor(plan.effectiveSchedule));
  const withSessions = ordinary.map((block) => ({
    ...block,
    scheduledAufguss: plan.aufguss.scheduled.filter((session) => {
      const from = block.daypart === "night" ? 0 : block.daypart === "morning" ? 7 : block.daypart === "day" ? 11 : 17;
      const to = block.daypart === "night" ? 7 : block.daypart === "morning" ? 11 : block.daypart === "day" ? 17 : 24;
      return session.dayIndex === block.dayIndex && session.startsAt >= from && session.startsAt < to;
    }).length,
  }));
  return { plan, blocks: withSessions };
}

describe("native Canal block demand", () => {
  it("reproduces the 70-admission starter reference without a weekly admissions input", () => {
    const state = { ...initialState, masterHired: true, master };
    const plan = planCanalOperations(state);
    const blocks = calculateNativeCanalBlockAdmissions(state, plan, blocksFor(plan.effectiveSchedule));
    expect(blocks.reduce((total, block) => total + block.admissions, 0)).toBe(70);
  });

  it("reproduces the 14-seat two-session starter Gus reference without a weekly special-seat input", () => {
    const state = { ...initialState, masterHired: true, master };
    const { plan, blocks } = demandBlocksWithSessions(state);
    const special = calculateNativeCanalBlockSpecialSeats(state, plan, blocks);
    expect(plan.aufguss.scheduled).toHaveLength(2);
    expect(special.reduce((total, seats) => total + seats, 0)).toBe(14);
    expect(special.every((seats, index) => blocks[index].scheduledAufguss > 0 || seats === 0)).toBe(true);
  });

  it("makes a higher unsupported admission price reduce actual block admissions", () => {
    const base = { ...initialState, masterHired: true, master };
    const expensive = { ...base, admissionPrice: 32 };
    const basePlan = planCanalOperations(base);
    const expensivePlan = planCanalOperations(expensive);
    const normalAdmissions = calculateNativeCanalBlockAdmissions(base, basePlan, blocksFor(basePlan.effectiveSchedule))
      .reduce((total, block) => total + block.admissions, 0);
    const expensiveAdmissions = calculateNativeCanalBlockAdmissions(expensive, expensivePlan, blocksFor(expensivePlan.effectiveSchedule))
      .reduce((total, block) => total + block.admissions, 0);
    expect(expensiveAdmissions).toBeLessThan(normalAdmissions);
  });

  it("makes a higher Gus supplement reduce native special demand", () => {
    const normal = { ...initialState, masterHired: true, master };
    const expensive = {
      ...normal,
      activeProgram: { ...normal.activeProgram, supplementPrice: 12 },
    };
    const normalData = demandBlocksWithSessions(normal);
    const expensiveData = demandBlocksWithSessions(expensive);
    const normalSeats = calculateNativeCanalBlockSpecialSeats(normal, normalData.plan, normalData.blocks).reduce((a, b) => a + b, 0);
    const expensiveSeats = calculateNativeCanalBlockSpecialSeats(expensive, expensiveData.plan, expensiveData.blocks).reduce((a, b) => a + b, 0);
    expect(expensiveSeats).toBeLessThan(normalSeats);
  });

  it("puts more social demand into evening blocks than quiet recovery", () => {
    const social = {
      ...initialState,
      masterHired: true,
      master,
      activeProgram: { ...initialState.activeProgram, intent: "Social Energy" as const },
    };
    const quiet = {
      ...social,
      activeProgram: { ...social.activeProgram, intent: "Quiet Recovery" as const },
    };
    const socialPlan = planCanalOperations(social);
    const quietPlan = planCanalOperations(quiet);
    const socialBlocks = calculateNativeCanalBlockAdmissions(social, socialPlan, blocksFor(socialPlan.effectiveSchedule));
    const quietBlocks = calculateNativeCanalBlockAdmissions(quiet, quietPlan, blocksFor(quietPlan.effectiveSchedule));
    const evening = (blocks: typeof socialBlocks) => blocks.filter((block) => block.daypart === "evening").reduce((sum, block) => sum + block.admissions, 0);
    expect(evening(socialBlocks)).toBeGreaterThan(evening(quietBlocks));
  });

  it("cannot create free 24-hour demand when staffing truncates the effective schedule", () => {
    const state = {
      ...initialState,
      schedule: { openDays: 7, opensAt: 0, closesAt: 24 },
      serviceHostCount: 0,
    };
    const plan = planCanalOperations(state);
    const requestedBlocks = blocksFor(state.schedule);
    const effectiveBlocks = blocksFor(plan.effectiveSchedule);
    expect(plan.effectiveSchedule.closesAt).toBeLessThan(24);
    expect(effectiveBlocks.reduce((sum, block) => sum + block.openHours, 0)).toBeLessThan(
      requestedBlocks.reduce((sum, block) => sum + block.openHours, 0),
    );
  });
});
