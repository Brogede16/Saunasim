import { describe, expect, it } from "vitest";
import { simulateCanalWeek } from "./canalBalance";
import { elderPaceProfile, simulateGuestWeek } from "./guestWeek";
import { starterProgram } from "./program";

describe("Guest week sample", () => {
  it("is deterministic and gives named, actionable guest profiles", () => {
    const input = { cash: 3_350, built: [] as const, masterHired: true, admissionPrice: 24 };
    const report = simulateCanalWeek(input);
    const first = simulateGuestWeek(input, report, 1);
    expect(simulateGuestWeek(input, report, 1)).toEqual(first);
    expect(first.guestSnapshots[0]).toMatchObject({ name: expect.any(String), age: expect.any(Number), likes: expect.any(String) });
    expect(first.guestSnapshots[0].visitPath).toContain(first.guestSnapshots[0].currentStop);
    expect(first.guestSnapshots.some((guest) => guest.currentStop === "program")).toBe(true);
    expect(first.guestSnapshots.some((guest) => guest.programFit !== "Not their main reason today" && guest.currentStop === "program")).toBe(true);
    expect(first.guestSnapshots.some((guest) => guest.programFit === "Not their main reason today" && guest.currentStop === "basic-sauna")).toBe(true);
    expect(first.guestSnapshots).toHaveLength(6);
  });

  it("identifies cold recovery as a physical queue when the shower is missing", () => {
    const program = { ...starterProgram, recoveryFinish: "Cold Plunge" as const, requestedSessions: 1 };
    const input = { cash: 0, built: ["cold-plunge"] as const, masterHired: true, admissionPrice: 24, activeProgram: program };
    const result = simulateGuestWeek(input, simulateCanalWeek(input), 4, program);
    expect(result).toMatchObject({ bottleneck: "Cold recovery" });
    expect(result.queueLoss).toBeGreaterThan(0);
    expect(result.guestSnapshots.some((guest) => guest.outcome === "frustrated")).toBe(true);
  });

  it("does not invent a cold-recovery queue when the program did not promise one", () => {
    const input = { cash: 0, built: ["cold-plunge"] as const, masterHired: true, admissionPrice: 24, activeProgram: starterProgram };
    const result = simulateGuestWeek(input, simulateCanalWeek(input), 4, starterProgram);
    expect(result.bottleneck).toBeUndefined();
    expect(result.queueLoss).toBe(0);
  });

  it("lets the shower relieve a busy cold-finish route", () => {
    const program = { ...starterProgram, recoveryFinish: "Cold Plunge" as const, requestedSessions: 1 };
    const input = { cash: 0, built: ["cold-plunge", "shower"] as const, masterHired: true, admissionPrice: 24, activeProgram: program };
    const result = simulateGuestWeek(input, simulateCanalWeek(input), 4, program);
    expect(result.bottleneck).toBeUndefined();
    expect(result.queueLoss).toBe(0);
    expect(result.guestSnapshots.some((guest) => guest.visitPath.includes("shower") && guest.visitPath.includes("cold-plunge"))).toBe(true);
  });

  it("makes a degraded shower reduce real cold-recovery throughput", () => {
    const program = { ...starterProgram, recoveryFinish: "Cold Plunge" as const, requestedSessions: 1 };
    const healthyInput = { cash: 0, built: ["cold-plunge", "shower"] as const, masterHired: true, admissionPrice: 24, activeProgram: program };
    const wornInput = { ...healthyInput, condition: { shower: 35 } };
    expect(simulateGuestWeek(healthyInput, simulateCanalWeek(healthyInput), 4, program).queueLoss).toBe(0);
    expect(simulateGuestWeek(wornInput, simulateCanalWeek(wornInput), 4, program)).toMatchObject({ bottleneck: "Cold recovery", queueLoss: 1 });
  });

  it("still gives guests a varied story when no Master is hired at all, not one repeated line", () => {
    const input = { cash: 3_350, built: ["shop"] as const, masterHired: false, admissionPrice: 24 };
    const report = simulateCanalWeek(input);
    const allGuests = Array.from({ length: 30 }, (_, week) => simulateGuestWeek(input, report, week + 1))
      .flatMap((result) => result.guestSnapshots);

    expect(new Set(allGuests.map((guest) => guest.currentStop)).size).toBeGreaterThan(1);
    expect(allGuests.some((guest) => guest.currentStop === "shop")).toBe(true);
    expect(allGuests.every((guest) => guest.programFit === "Not their main reason today")).toBe(true);
  });

  it("shows some no-Master guests actually bathing, not only ones who have already left", () => {
    const input = { cash: 3_350, built: [] as const, masterHired: false, admissionPrice: 24 };
    const report = simulateCanalWeek(input);
    const allGuests = Array.from({ length: 10 }, (_, week) => simulateGuestWeek(input, report, week + 1))
      .flatMap((result) => result.guestSnapshots);

    const bathing = allGuests.filter((guest) => guest.currentStop === "basic-sauna");
    expect(bathing.length).toBeGreaterThan(0);
    for (const guest of bathing) {
      expect(guest.visitPath).toContain("basic-sauna");
      expect(guest.visitPath).not.toContain("exit");
    }
  });

  it("makes high entry pricing visible in guest outcomes", () => {
    const input = { cash: 0, built: [] as const, masterHired: true, admissionPrice: 32 };
    const result = simulateGuestWeek(input, simulateCanalWeek(input), 3);
    expect(result.guestSnapshots.some((guest) => guest.outcome === "aborted")).toBe(true);
  });

  it("varies truthful compact-Gus feedback across a visible guest sample", () => {
    const input = { cash: 0, built: [] as const, masterHired: true, admissionPrice: 24, activeProgram: starterProgram };
    const result = simulateGuestWeek(input, simulateCanalWeek(input), 1, starterProgram);
    expect(new Set(result.guestSnapshots.map((guest) => guest.reaction)).size).toBeGreaterThan(1);
  });

  it("skews guest age young without ever fully excluding an older guest", () => {
    const input = { cash: 3_350, built: [] as const, masterHired: true, admissionPrice: 24 };
    const report = simulateCanalWeek(input);
    const ages = Array.from({ length: 60 }, (_, week) => simulateGuestWeek(input, report, week + 1))
      .flatMap((result) => result.guestSnapshots.map((guest) => guest.age));

    const peakShare = ages.filter((age) => age >= 20 && age <= 35).length / ages.length;
    expect(peakShare).toBeGreaterThan(0.5);
    // Not a hard clamp: some older guests still show up across enough weeks.
    expect(ages.some((age) => age > 45)).toBe(true);
  });

  it("makes every canonical guest need occur, roughly matching the Canal need mix", () => {
    const input = { cash: 3_350, built: [] as const, masterHired: true, admissionPrice: 24 };
    const report = simulateCanalWeek(input);
    const visitGoals = Array.from({ length: 80 }, (_, week) => simulateGuestWeek(input, report, week + 1))
      .flatMap((result) => result.guestSnapshots.map((guest) => guest.visitGoal));

    // Every one of the six goal labels (covering all five canonical needs) must appear.
    const uniqueGoals = new Set(visitGoals);
    expect(uniqueGoals.size).toBe(6);
    // Special premium ("A new programme") is deliberately the rarest need - roughly 10%, well
    // under Routine/Social's roughly 25% each.
    const premiumShare = visitGoals.filter((goal) => goal === "A new programme").length / visitGoals.length;
    const routineShare = visitGoals.filter((goal) => goal === "A small treat").length / visitGoals.length;
    expect(premiumShare).toBeLessThan(routineShare);
  });

  it("gives a Routine guest arrival/reception-specific feedback, not programme feedback", () => {
    const input = { cash: 3_350, built: ["arrival", "shop"] as const, masterHired: true, admissionPrice: 24, serviceHostCount: 1 };
    const report = simulateCanalWeek(input);
    const routineGuest = Array.from({ length: 40 }, (_, week) => simulateGuestWeek(input, report, week + 1))
      .flatMap((result) => result.guestSnapshots)
      .find((guest) => guest.visitGoal === "A small treat");

    expect(routineGuest).toBeDefined();
    expect(routineGuest!.reaction).toMatch(/arrival|reception|door|counter|weekly stop|check-in/i);
  });

  it("gives the walk-up-fill guest a distinct story only when the ledger actually reports spare seats", () => {
    // Social Energy matches only "A social reset"/"A new programme" goals, so most weeks leave the
    // sample's designated "Open to it" guest genuinely not already wanting the programme - the real
    // condition a walk-up guest represents.
    const social = { ...starterProgram, intent: "Social Energy" as const };
    const input = { cash: 0, built: ["bench-refit"] as const, masterHired: true, admissionPrice: 24, activeProgram: social };
    const report = simulateCanalWeek(input);
    expect(report.walkUpSeats).toBeGreaterThan(0);
    const isWalkUpReaction = (guest: { reaction: string }) =>
      guest.reaction.includes("Master mentioned") || guest.reaction.includes("spare seat opened up") || guest.reaction.includes("too well to pass up");

    const withWalkUp = Array.from({ length: 60 }, (_, week) => simulateGuestWeek(input, report, week + 1, social))
      .flatMap((result) => result.guestSnapshots);
    expect(withWalkUp.some(isWalkUpReaction)).toBe(true);

    const noWalkUpReport = { ...report, walkUpSeats: undefined };
    const withoutWalkUp = Array.from({ length: 60 }, (_, week) => simulateGuestWeek(input, noWalkUpReport, week + 1, social))
      .flatMap((result) => result.guestSnapshots);
    expect(withoutWalkUp.some(isWalkUpReaction)).toBe(false);
  });

  it("keeps the sampled guest age within the 18-100 range", () => {
    const input = { cash: 3_350, built: [] as const, masterHired: true, admissionPrice: 24 };
    const report = simulateCanalWeek(input);
    const ages = Array.from({ length: 60 }, (_, week) => simulateGuestWeek(input, report, week + 1))
      .flatMap((result) => result.guestSnapshots.map((guest) => guest.age));
    expect(Math.min(...ages)).toBeGreaterThanOrEqual(18);
    expect(Math.max(...ages)).toBeLessThanOrEqual(100);
  });

  it("gives a small, balanced pace/spend trade-off only for genuinely old guests", () => {
    expect(elderPaceProfile(30)).toEqual({ paceFactor: 1, spendFactor: 1 });
    expect(elderPaceProfile(65)).toEqual({ paceFactor: 1, spendFactor: 1 });

    const veryOld = elderPaceProfile(100);
    expect(veryOld.paceFactor).toBeCloseTo(0.94, 5);
    expect(veryOld.spendFactor).toBeCloseTo(1.05, 5);
    // Within the documented 3-6% range for a realistically old (not maximum) guest.
    const oldEnough = elderPaceProfile(85);
    const slowdown = 1 - oldEnough.paceFactor;
    expect(slowdown).toBeGreaterThanOrEqual(0.03 - 1e-9);
    expect(slowdown).toBeLessThanOrEqual(0.06 + 1e-9);
    // Balanced: the spend/dwell gain is the same order of magnitude as the pace loss, not
    // dwarfing or ignoring it.
    const gain = oldEnough.spendFactor - 1;
    expect(gain).toBeGreaterThan(0);
    expect(gain).toBeLessThan(slowdown * 1.5);
  });
});
