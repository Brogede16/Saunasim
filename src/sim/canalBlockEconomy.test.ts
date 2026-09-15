import { describe, expect, it } from "vitest";
import { initialState } from "./game";
import { planCanalOperations } from "./canalOperatingPlan";
import { buildCanalOperatingBlocks } from "./canalOperatingBlocks";
import { allocateCanalBlockEconomy, summarizeCanalBlockEconomy } from "./canalBlockEconomy";

describe("Canal block economy", () => {
  it("conserves every weekly revenue and cost category exactly in explicit legacy-allocation mode", () => {
    const plan = planCanalOperations(initialState);
    const blocks = buildCanalOperatingBlocks(initialState, plan, { admissions: 30, specialSeats: 0 }, "legacy-allocation");
    const ledger = {
      revenueBreakdown: { admissions: 720, specialGus: 0, shop: 0 },
      costBreakdown: {
        venueBase: 400,
        staff: 0,
        utilitiesAndCleaning: 312,
        programMaterials: 0,
        shopProcurement: 0,
        facilities: 0,
      },
    };

    const allocated = allocateCanalBlockEconomy(blocks, ledger, "legacy-allocation");
    const summary = summarizeCanalBlockEconomy(allocated);

    expect(summary.revenueBreakdown).toEqual(ledger.revenueBreakdown);
    expect(summary.costBreakdown).toEqual(ledger.costBreakdown);
    expect(summary.operatingNet).toBe(8);
  });

  it("calculates canonical admission revenue directly from block admissions and ticket price", () => {
    const snapshot = { ...initialState, admissionPrice: 29 };
    const plan = planCanalOperations(snapshot);
    const blocks = buildCanalOperatingBlocks(snapshot, plan, { specialSeats: 0 });
    const allocated = allocateCanalBlockEconomy(blocks, {
      revenueBreakdown: { admissions: 999_999, specialGus: 0, shop: 0 },
      costBreakdown: {
        venueBase: 0,
        staff: 0,
        utilitiesAndCleaning: 0,
        programMaterials: 0,
        shopProcurement: 0,
        facilities: 0,
      },
    });
    const expected = blocks.reduce((total, block) => total + block.admissions * snapshot.admissionPrice, 0);
    expect(summarizeCanalBlockEconomy(allocated).revenueBreakdown.admissions).toBe(expected);
    expect(summarizeCanalBlockEconomy(allocated).revenueBreakdown.admissions).not.toBe(999_999);
  });

  it("places Gus revenue and material cost only in blocks with scheduled Gus when such blocks exist", () => {
    const master = {
      name: "Test Master",
      style: "Traditional" as const,
      heatCraft: 3,
      aromaCraft: 3,
      performanceCraft: 2,
      weeklyWage: 500,
      equipment: [],
    };
    const snapshot = {
      ...initialState,
      masterHired: true,
      master,
      activeProgram: { ...initialState.activeProgram, requestedSessions: 3 },
    };
    const plan = planCanalOperations(snapshot);
    const blocks = buildCanalOperatingBlocks(snapshot, plan, { specialSeats: 18 });
    const allocated = allocateCanalBlockEconomy(blocks, {
      revenueBreakdown: { admissions: 1_440, specialGus: 126, shop: 0 },
      costBreakdown: {
        venueBase: 400,
        staff: 45,
        utilitiesAndCleaning: 312,
        programMaterials: 75,
        shopProcurement: 0,
        facilities: 0,
      },
    });

    expect(allocated.filter((block) => block.scheduledAufguss === 0).every((block) => block.revenue.specialGus === 0 && block.costs.programMaterials === 0)).toBe(true);
  });
});
