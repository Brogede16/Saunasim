import { describe, expect, it } from "vitest";
import { camera, isValidAssetFilename, sheetFamilies, validateArtContract } from "./artContract";
import { canalWorkshopScene } from "./canalWorkshopScene";
import {
  buildingBases, buildingById, locationBases, locationBudget, locationById, locationFieldStateCount,
  occupiedFootprint, placementProfiles, validateSpatialModel,
} from "./spatialEnvelopes";

describe("art contract", () => {
  it("keeps every sheet family inside the production standard", () => {
    expect(validateArtContract()).toBe(true);
  });

  it("splits effects into a behind band and a front band around guests", () => {
    // A shower or plunge splash must be able to draw in front of the guest using it. The prototype
    // renderer had a single effect layer below guests, which cannot express that.
    const behind = sheetFamilies.filter((family) => family.depth === "effect-behind").map((family) => family.id);
    const front = sheetFamilies.filter((family) => family.depth === "effect-front").map((family) => family.id);
    expect(behind).toContain("fx-water-calm");
    expect(front).toContain("fx-shower-water");
    expect(front).toContain("fx-plunge-splash");
  });

  it("accepts contract file names and rejects ad-hoc ones", () => {
    expect(isValidAssetFilename("guest-walk-8dir-v01.png")).toBe(true);
    expect(isValidAssetFilename("loc-canal-terrace-l2-v01.png")).toBe(true);
    expect(isValidAssetFilename("repair-workshop-base-draft-v02.png")).toBe(false);
    expect(isValidAssetFilename("guest-walk-8dir.png")).toBe(false);
  });
});

describe("spatial model", () => {
  it("validates every building, location and legal pairing", () => {
    expect(validateSpatialModel()).toBe(true);
  });

  it("covers exactly the 36 approved location x building profiles", () => {
    expect(placementProfiles).toHaveLength(36);
    expect(new Set(placementProfiles.map((profile) => profile.id)).size).toBe(36);
    expect(placementProfiles.filter((profile) => profile.location === "canal").map((profile) => profile.building))
      .toEqual(["boathouse", "repair-workshop"]);
    expect(placementProfiles.filter((profile) => profile.location === "water-plot").map((profile) => profile.building))
      .toEqual(["floating-sauna"]);
  });

  it("leaves every location at least the required unclaimed planning margin", () => {
    for (const location of locationBases) {
      const budget = locationBudget(location);
      expect(budget.freeMargin, `${location.id} margin`).toBeGreaterThanOrEqual(camera.planningMarginRatio);
      expect(budget.waterDemand, `${location.id} water`).toBeLessThanOrEqual(budget.waterArea);
    }
  });

  it("sizes each location against the largest building it must legally host", () => {
    expect(locationBudget(locationById("canal")).largestBuilding).toBe("repair-workshop");
    expect(locationBudget(locationById("harbour")).largestBuilding).toBe("warehouse");
    expect(locationBudget(locationById("coast")).largestBuilding).toBe("kursted");
    // The circulation band is part of what a building costs a location, not an afterthought.
    expect(occupiedFootprint(buildingById("kursted"))).toEqual({ width: 36, height: 24 });
  });

  it("keeps a building silhouette taller than its own ground depth", () => {
    // The 3/4 view means roof mass is drawn above the footprint. Reading the two as one number is
    // what made the Repair Workshop card and the envelope table look contradictory.
    for (const building of buildingBases) {
      expect(building.silhouetteHeight, building.id).toBeGreaterThan(building.footprint.height);
    }
    expect(buildingById("repair-workshop").footprint).toEqual({ width: 22, height: 16 });
    expect(buildingById("repair-workshop").silhouetteHeight).toBe(19);
  });

  it("gives every permanent roof a separate visible material path", () => {
    const roofedBases = buildingBases.filter((building) => !["saunatelt-camp", "floating-sauna"].includes(building.id));
    for (const building of roofedBases) expect(building.slots, building.id).toContain("roof-material");
    // Workshop roof art can evolve, but it never turns into a guest-accessible upper activity.
    expect(buildingById("repair-workshop").slots).not.toContain("roof-or-upper");
  });

  it("keeps the Canal prototype scene inside the canonical Canal world", () => {
    // The runtime scene is still the 60 x 40 prototype. Expanding it to the canonical world must be
    // additive, so no authored anchor has to move.
    const canal = locationById("canal");
    expect(canalWorkshopScene.tileSize).toBe(16);
    expect(canalWorkshopScene.world.width).toBeLessThanOrEqual(canal.world.width * 16);
    expect(canalWorkshopScene.world.height).toBeLessThanOrEqual(canal.world.height * 16);
  });

  it("reports the static field-state workload each location carries", () => {
    // The count is the number of distinct completed-state PNGs the location owes, before buildings,
    // characters and effects. It is the honest scope number for planning an art batch.
    const counts = Object.fromEntries(locationBases.map((location) => [location.id, locationFieldStateCount(location)]));
    expect(counts.canal).toBe(11);
    expect(Object.values(counts).every((count) => count > 0)).toBe(true);
  });
});
