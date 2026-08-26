import { describe, expect, it } from "vitest";
import { evaluateComposition, starterProgram, type ActiveProgram } from "./program";

const ultimatePrograms: ActiveProgram[] = [
  { ...starterProgram, intent: "Classic Ritual", heat: "Progressive Rounds", format: "Standard", aromaRounds: [{ material: "Nordic Birch", delivery: "Water Pour" }, { material: "Green Tea", delivery: "Botanical Water" }], performance: "Classic Towelwork", music: "Acoustic & Folk", recoveryFinish: "Natural Water Dip" },
  { ...starterProgram, intent: "Social Energy", heat: "Rhythmic Pulses", format: "Standard", aromaRounds: [{ material: "Lemon", delivery: "Scented Ice Round" }, { material: "Orange", delivery: "Water Pour" }], performance: "Rhythmic Flow", music: "Pop & Disco", recoveryFinish: "Cold Plunge" },
  { ...starterProgram, intent: "Quiet Recovery", heat: "Gentle Build", format: "Standard", aromaRounds: [{ material: "Hinoki", delivery: "Water Pour" }, { material: "Cedarwood", delivery: "Scented Ice Round" }], performance: "Quiet Ritual", music: "Ambient", recoveryFinish: "Rest Deck" },
  { ...starterProgram, intent: "Show Journey", heat: "High-Heat Finale", format: "Long", aromaRounds: [{ material: "Seaweed", delivery: "Botanical Water" }, { material: "Beer & Hops", delivery: "Water Pour" }, { material: "Chilli Orange", delivery: "Scented Ice Round" }], performance: "Story-led Performance", music: "Rock & Metal", recoveryFinish: "Natural Water Dip" },
  { ...starterProgram, intent: "Quiet Recovery", heat: "Progressive Rounds", format: "Long", aromaRounds: [{ material: "Fir", delivery: "Herbal Infusion" }, { material: "Sage", delivery: "Botanical Water" }, { material: "Lavender", delivery: "Water Pour" }], performance: "Quiet Ritual", music: "Silence & Natural Sound", recoveryFinish: "Rest Deck" },
  { ...starterProgram, intent: "Classic Ritual", heat: "High-Heat Finale", format: "Long", aromaRounds: [{ material: "Scots Pine", delivery: "Herbal Infusion" }, { material: "Juniper", delivery: "Water Pour" }, { material: "Birch Tar", delivery: "Water Pour" }], performance: "Classic Towelwork", music: "Ritual Percussion", recoveryFinish: "Outdoor Shower" },
];

describe("Aufguss composition discovery", () => {
  it("recognises every authored Ultimate pattern", () => {
    expect(ultimatePrograms.map(evaluateComposition)).toEqual(["Ultimate", "Ultimate", "Ultimate", "Ultimate", "Ultimate", "Ultimate"]);
  });

  it("requires every ordered component instead of treating a near-match as Ultimate", () => {
    const nearMatch = { ...ultimatePrograms[1], aromaRounds: [...ultimatePrograms[1].aromaRounds].reverse() };
    expect(evaluateComposition(nearMatch)).not.toBe("Ultimate");
  });

  it("keeps the actual starter Gus as a valid Normal discovery", () => {
    expect(evaluateComposition(starterProgram)).toBe("Normal");
  });
});
