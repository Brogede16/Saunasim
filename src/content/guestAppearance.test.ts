import { describe, expect, it } from "vitest";
import {
  guestAccessories,
  guestBodyTypes,
  guestGenders,
  guestHairstyles,
  pickGuestAppearance,
  pickGuestAppearances,
} from "./guestAppearance";

describe("guest appearance mixing", () => {
  it("is fully deterministic for a given guest id", () => {
    const a = pickGuestAppearance("w1-g0-avery-bell");
    const b = pickGuestAppearance("w1-g0-avery-bell");
    expect(a).toEqual(b);
  });

  it("gives different guest ids independently varied appearances, not a repeating pattern", () => {
    const ids = Array.from({ length: 40 }, (_, index) => `w1-g${index}-guest`);
    const appearances = ids.map((id) => pickGuestAppearance(id));

    const genders = new Set(appearances.map((entry) => entry.gender));
    const bodyTypes = new Set(appearances.map((entry) => entry.bodyType));
    const hairstyles = new Set(appearances.map((entry) => entry.hairstyle));
    expect(genders.size).toBe(guestGenders.length);
    expect(bodyTypes.size).toBe(guestBodyTypes.length);
    // 40 draws over 10 hairstyles should realistically hit every hairstyle at least once.
    expect(hairstyles.size).toBe(guestHairstyles.length);
  });

  it("makes 'None' the dominant accessory, not an even split", () => {
    const ids = Array.from({ length: 300 }, (_, index) => `w2-g${index}-guest`);
    const counts = new Map<string, number>(guestAccessories.map((accessory) => [accessory, 0]));
    for (const id of ids) {
      const accessory = pickGuestAppearance(id).accessory;
      counts.set(accessory, (counts.get(accessory) ?? 0) + 1);
    }
    expect(counts.get("None")!).toBeGreaterThan(ids.length * 0.5);
    for (const accessory of guestAccessories) {
      expect(counts.get(accessory)).toBeGreaterThan(0);
    }
  });

  it("never gives one small visible batch two guests with the exact same silhouette", () => {
    const guests = Array.from({ length: 8 }, (_, index) => ({ id: `w3-g${index}-guest`, age: 20 + index * 5 }));
    const appearances = pickGuestAppearances(guests);
    const silhouettes = new Set(
      Array.from(appearances.values(), (entry) => `${entry.gender}-${entry.bodyType}-${entry.hairstyle}`),
    );
    expect(silhouettes.size).toBe(guests.length);
  });

  it("keeps batch results deterministic across repeated calls", () => {
    const guests = Array.from({ length: 8 }, (_, index) => ({ id: `w4-g${index}-guest`, age: 30 }));
    const first = pickGuestAppearances(guests);
    const second = pickGuestAppearances(guests);
    expect(Object.fromEntries(first)).toEqual(Object.fromEntries(second));
  });

  it("makes older guests more likely bald or grey/white-haired, without ever being a fixed rule", () => {
    const youngIds = Array.from({ length: 200 }, (_, index) => `w5-young-${index}`);
    const oldIds = Array.from({ length: 200 }, (_, index) => `w5-old-${index}`);
    const isGreyish = (colour: string) => colour === "Grey" || colour === "White";

    const youngBaldShare = youngIds.filter((id) => pickGuestAppearance(id, 22).hairstyle === "Bald").length / youngIds.length;
    const oldBaldShare = oldIds.filter((id) => pickGuestAppearance(id, 72).hairstyle === "Bald").length / oldIds.length;
    const youngGreyShare = youngIds.filter((id) => isGreyish(pickGuestAppearance(id, 22).hairColour)).length / youngIds.length;
    const oldGreyShare = oldIds.filter((id) => isGreyish(pickGuestAppearance(id, 72).hairColour)).length / oldIds.length;

    // Clearly more common with age...
    expect(oldBaldShare).toBeGreaterThan(youngBaldShare);
    expect(oldGreyShare).toBeGreaterThan(youngGreyShare);
    // ...but never zero for the young or a near-certainty for the old - a few young guests can
    // still be bald/grey, and most old guests are still neither, matching "not mega locked".
    expect(youngBaldShare).toBeGreaterThan(0);
    expect(oldBaldShare).toBeLessThan(0.5);
  });
});
