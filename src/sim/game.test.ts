import { beforeEach, describe, expect, it } from "vitest";
import { borrowingLimit, borrowingRoom, gameStore, hasAvailableLoan, initialState, loanOffers, masterCourseCost, modules, outstandingDebt, projectFor } from "./game";

describe("Canal management state", () => {
  beforeEach(() => gameStore.reset());

  it("keeps store commands safe when consumers destructure them", () => {
    const { hireStarterMaster, startConstruction, resolveConstruction, advanceWeek } = gameStore;
    const now = 1_000_000;

    hireStarterMaster();
    startConstruction("arrival", now);
    resolveConstruction(now + 60 * 60 * 1000);
    advanceWeek();

    expect(gameStore.getState()).toMatchObject({ week: 2, masterHired: true, built: ["arrival"] });
  });

  it("keeps a module inactive until its real-time project completes", () => {
    const now = Date.now();
    gameStore.startConstruction("arrival", now);
    expect(gameStore.getState().cash).toBe(2_800);
    expect(gameStore.getState().built).not.toContain("arrival");
    expect(projectFor(gameStore.getState(), "arrival")).toBeDefined();

    gameStore.resolveConstruction(now + 60 * 60 * 1000);
    expect(gameStore.getState().built).toContain("arrival");
    expect(projectFor(gameStore.getState(), "arrival")).toBeUndefined();
  });

  it("applies the selected loan repayment every simulation week", () => {
    gameStore.takeLoan("small");
    expect(gameStore.getState().cash).toBe(11_500);
    expect(outstandingDebt(gameStore.getState())).toBe(8_250);

    gameStore.advanceWeek();
    expect(gameStore.getState().lastReport?.loanRepayment).toBe(375);
    expect(gameStore.getState().loans).toMatchObject([{ id: "small", remainingWeeks: 21 }]);
    expect(gameStore.getState().cash).toBe(11_133);
  });

  it("does not let a new upgrade unlock a second large loan without earnings", () => {
    const now = 1_000_000;
    gameStore.takeLoan("small");
    gameStore.startConstruction("cold-plunge", now);
    gameStore.resolveConstruction(now + 5 * 60 * 60 * 1000);
    gameStore.advanceWeek();
    expect(borrowingRoom(gameStore.getState())).toBeLessThan(22_500);
  });

  it("makes every published loan band available at a reachable venue stage", () => {
    expect(borrowingLimit(initialState)).toBeGreaterThanOrEqual(loanOffers.small.weeklyPayment * loanOffers.small.weeks);
    expect(borrowingLimit(initialState)).toBeGreaterThanOrEqual(loanOffers.standard.weeklyPayment * loanOffers.standard.weeks);

    gameStore.hydrate({ ...initialState, built: modules.map((module) => module.id), profitableWeeks: 20 });
    expect(borrowingLimit(gameStore.getState())).toBeGreaterThanOrEqual(loanOffers.large.weeklyPayment * loanOffers.large.weeks);
    gameStore.takeLoan("large");
    expect(gameStore.getState().loans).toMatchObject([{ id: "large", remainingWeeks: 36 }]);
  });

  it("ends the negative-cash grace period once no realistic loan remains", () => {
    gameStore.hydrate({
      ...initialState,
      venueName: "Steam & Stone",
      cash: -500,
      financialDecisionPending: true,
      loans: [
        { id: "small", weeklyPayment: 375, remainingWeeks: 22 },
        { id: "standard", weeklyPayment: 750, remainingWeeks: 30 },
      ],
    });
    expect(borrowingRoom(gameStore.getState())).toBe(0);

    gameStore.continueAtRisk();
    expect(gameStore.getState().financialDecisionPending).toBe(true);

    gameStore.declareBankruptcy();
    const after = gameStore.getState();
    expect(after.financialDecisionPending).toBe(false);
    expect(after.cash).toBe(initialState.cash);
    expect(after.loans).toEqual([]);
    expect(after.venueName).toBe("Steam & Stone");
  });

  it("does not treat unusable leftover credit as a real negative-cash option", () => {
    gameStore.hydrate({ ...initialState, cash: -100, financialDecisionPending: true, loans: [{ id: "standard", weeklyPayment: 750, remainingWeeks: 30 }] });
    expect(borrowingRoom(gameStore.getState())).toBe(500);
    expect(hasAvailableLoan(gameStore.getState())).toBe(false);
    gameStore.continueAtRisk();
    expect(gameStore.getState().financialDecisionPending).toBe(true);
  });

  it("lets the player wait out negative cash while real borrowing room remains", () => {
    gameStore.hydrate({ ...initialState, cash: -100, financialDecisionPending: true });
    expect(borrowingRoom(gameStore.getState())).toBeGreaterThan(0);

    gameStore.continueAtRisk();
    expect(gameStore.getState().financialDecisionPending).toBe(false);
  });

  it("keeps a selected, inspectable guest after a completed week", () => {
    gameStore.hireStarterMaster();
    gameStore.advanceWeek();
    const guest = gameStore.getState().lastReport?.guestSnapshots?.[0];
    expect(guest?.name).toBeTruthy();
    expect(gameStore.getState().selectedGuestId).toBe(guest?.id);
    gameStore.selectGuest(undefined);
    expect(gameStore.getState().selectedGuestId).toBeUndefined();
  });

  it("only selects an upgrade that is visibly built in the Canal scene", () => {
    gameStore.selectModule("shop");
    expect(gameStore.getState().selectedModuleId).toBeUndefined();
    gameStore.startConstruction("arrival", 1_000_000);
    gameStore.resolveConstruction(1_000_000 + 60 * 60 * 1000);
    gameStore.selectModule("arrival");
    expect(gameStore.getState().selectedModuleId).toBe("arrival");
  });

  it("reveals a Gus composition only after a Master has run it", () => {
    expect(gameStore.getState().activeProgram.revealedTier).toBeUndefined();
    gameStore.hireStarterMaster();
    gameStore.advanceWeek();
    expect(gameStore.getState().activeProgram.revealedTier).toBe("Normal");
    gameStore.updateProgram({ ...gameStore.getState().activeProgram, heat: "Gentle Build" });
    expect(gameStore.getState().activeProgram.revealedTier).toBeUndefined();
  });

  it("keeps a discovered Gus tier when only operating choices change", () => {
    gameStore.hireStarterMaster();
    gameStore.advanceWeek();
    expect(gameStore.getState().activeProgram.revealedTier).toBe("Normal");

    gameStore.updateProgram({
      ...gameStore.getState().activeProgram,
      name: "Late Canal Ritual",
      requestedSessions: 5,
      supplementPrice: 12,
    });

    expect(gameStore.getState().activeProgram).toMatchObject({
      name: "Late Canal Ritual",
      requestedSessions: 5,
      supplementPrice: 12,
      revealedTier: "Normal",
    });
  });

  it("repairs only the selected technical module after the technician arrives", () => {
    gameStore.takeLoan("small");
    const now = 1_000_000;
    gameStore.startConstruction("shower", now);
    gameStore.resolveConstruction(now + 2 * 60 * 60 * 1000);
    gameStore.hireTechnician();
    const beforeRepair = gameStore.getState();
    gameStore.hydrate({ ...beforeRepair, condition: { ...beforeRepair.condition, shower: 42 } });
    gameStore.dispatchRepair("shower", now);
    expect(gameStore.getState().condition.shower).toBe(42);
    gameStore.resolveRepair(now + 20 * 60 * 1000);
    expect(gameStore.getState().condition.shower).toBe(100);
  });

  it("keeps a facility's actual condition while its repair is still pending", () => {
    gameStore.takeLoan("small");
    const now = Date.now();
    gameStore.startConstruction("shower", now);
    gameStore.resolveConstruction(now + 2 * 60 * 60 * 1000);
    gameStore.hireTechnician();
    gameStore.hydrate({ ...gameStore.getState(), condition: { shower: 12 } });
    gameStore.dispatchRepair("shower", now);
    gameStore.advanceWeek();
    expect(gameStore.getState()).toMatchObject({ repairTask: { moduleId: "shower" }, condition: { shower: 12 } });
  });

  it("wears active recovery facilities through recovery use rather than calendar weeks", () => {
    gameStore.hydrate({
      ...gameStore.getState(),
      built: ["shower", "cold-plunge"],
      masterHired: true,
      activeProgram: { ...gameStore.getState().activeProgram, recoveryFinish: "Cold Plunge", requestedSessions: 1 },
      condition: { shower: 100, "cold-plunge": 100 },
    });

    gameStore.advanceWeek();
    expect(gameStore.getState().condition).toMatchObject({ shower: 96, "cold-plunge": 96 });
  });

  it("builds a three-person Service Team only after the visible shop exists", () => {
    gameStore.hireServiceHost();
    expect(gameStore.getState().serviceHostCount).toBe(0);

    gameStore.takeLoan("small");
    const now = 1_000_000;
    gameStore.startConstruction("shop", now);
    gameStore.resolveConstruction(now + 3 * 60 * 60 * 1000);
    gameStore.hireServiceHost();
    expect(gameStore.getState()).toMatchObject({ hostHired: true, serviceHostCount: 1, cash: 7_050 });
    gameStore.hireServiceHost();
    gameStore.hireServiceHost();
    gameStore.hireServiceHost();
    expect(gameStore.getState()).toMatchObject({ serviceHostCount: 3, cash: 4_650 });
  });

  it("trains one Master craft at a time with escalating cost and a hard cap", () => {
    gameStore.hireStarterMaster();
    const master = gameStore.getState().master!;
    expect(masterCourseCost(master, "heatCraft")).toBe(600);
    gameStore.trainMaster("heatCraft");
    expect(gameStore.getState().master?.heatCraft).toBe(4);
    expect(masterCourseCost(gameStore.getState().master!, "heatCraft")).toBeGreaterThan(600);
    gameStore.hydrate({ ...gameStore.getState(), cash: 20_000, master: { ...gameStore.getState().master!, heatCraft: 10 } });
    gameStore.trainMaster("heatCraft");
    expect(gameStore.getState().master?.heatCraft).toBe(10);
  });

  it("gives a Master each equipment tool only once", () => {
    gameStore.hireStarterMaster();
    gameStore.equipMaster("hand-fan");
    expect(gameStore.getState().master?.equipment).toEqual(["hand-fan"]);
    expect(gameStore.getState().cash).toBe(2_900);
    gameStore.equipMaster("hand-fan");
    expect(gameStore.getState().master?.equipment).toEqual(["hand-fan"]);
  });

  it("uses a timed search to replace the starter with a transparent Master shortlist", () => {
    const now = 1_000_000;
    gameStore.startMasterSearch("patient", now);
    expect(gameStore.getState().masterSearch).toBeDefined();
    expect(gameStore.getState().masterCandidates).toHaveLength(1);

    gameStore.resolveMasterSearch(now + 60 * 60 * 1000);
    expect(gameStore.getState().masterSearch).toBeUndefined();
    expect(gameStore.getState().masterCandidates).toHaveLength(2);
    expect(gameStore.getState().masterCandidates[0]?.name).not.toBe("Starter Master");
  });

  it("charges the chosen Master's stated wage in the weekly result", () => {
    gameStore.hydrate({ ...initialState, cash: 5_000, masterCandidates: [{ id: "test", name: "Test Master", style: "Energetic", heatCraft: 4, aromaCraft: 2, performanceCraft: 3, hiringFee: 1_000, weeklyWage: 650, note: "Test candidate" }] });
    gameStore.hireMaster("test");
    gameStore.advanceWeek();
    expect(gameStore.getState().lastReport?.operatingCosts).toBe(1_370);
  });

  it("saves a discovered Gus once and restores its exact composition without re-rolling it", () => {
    gameStore.hireStarterMaster();
    gameStore.advanceWeek();
    expect(gameStore.getState().activeProgram.revealedTier).toBe("Normal");

    gameStore.saveActiveProgram();
    gameStore.saveActiveProgram();
    const saved = gameStore.getState().repertoire[0]!;
    expect(gameStore.getState().repertoire).toHaveLength(1);
    expect(saved).toMatchObject({ composition: "Normal", program: { name: "Canal Ritual", revealedTier: "Normal" } });

    gameStore.updateProgram({ ...gameStore.getState().activeProgram, name: "Edited Draft", heat: "Gentle Build" });
    gameStore.loadSavedProgram(saved.id);
    expect(gameStore.getState().activeProgram).toMatchObject({ name: "Canal Ritual", heat: "Steady Heat", revealedTier: "Normal" });
  });

  it("keeps the shop assortment to three concrete items", () => {
    gameStore.setShopRange(["cold-water", "herbal-tea", "sauna-towel", "house-blend"]);
    expect(gameStore.getState().shopRange).toEqual(["cold-water", "herbal-tea", "sauna-towel"]);
    gameStore.setShopRange(["signature-towel", "signature-towel"]);
    expect(gameStore.getState().shopRange).toEqual([]);
    gameStore.hydrate({ ...gameStore.getState(), repertoire: [{ id: "saved-1", savedAtWeek: 1, composition: "Rare", program: { ...initialState.activeProgram, revealedTier: "Rare" } }] });
    gameStore.setShopRange(["signature-towel", "signature-towel"]);
    expect(gameStore.getState().shopRange).toEqual(["signature-towel"]);
  });
});
