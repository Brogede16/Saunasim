import { describe, expect, it } from "vitest";
import { canalWorkshopScene } from "./canalWorkshopScene";
import { canalWorkshopVenue, compatibleVenueModules, validateVenueModules, venueModuleIds, venueModules } from "./venueModules";

describe("Canal Workshop scene contract", () => {
  it("keeps every authored field inside the fixed 60 by 40 tile world", () => {
    for (const field of canalWorkshopScene.fields) {
      expect(field.x).toBeGreaterThanOrEqual(0);
      expect(field.y).toBeGreaterThanOrEqual(0);
      expect(field.x + field.width).toBeLessThanOrEqual(canalWorkshopScene.world.width);
      expect(field.y + field.height).toBeLessThanOrEqual(canalWorkshopScene.world.height);
    }
  });

  it("gives every current visible module a dedicated field and activity anchor", () => {
    const implementedModules = canalWorkshopScene.fields.flatMap((field) => "module" in field ? [field.module] : []);
    expect(implementedModules).toEqual(["arrival", "shop", "program", "aufguss-yard", "shower", "cold-plunge"]);
    expect(canalWorkshopScene.routes.program).toEqual(["workshop-door", "workshop-side-walk", "program-door"]);
    expect(canalWorkshopScene.routes.outdoorGus).toEqual(["workshop-door", "workshop-side-walk", "gus-master-yard"]);
    expect(canalWorkshopScene.routes.shower).toContain("shower-workshop");
    expect(canalWorkshopScene.routes.coldPlunge).toContain("cold-plunge-a");
    expect(canalWorkshopScene.routes.canalWater).toEqual(["canal-bridge-entry", "canal-water-idle", "canal-bridge-exit"]);
  });

  it("uses complete module cards and derives Canal's catalogue by owner compatibility", () => {
    expect(validateVenueModules()).toBe(true);
    expect(compatibleVenueModules(canalWorkshopVenue).map((module) => module.id)).toEqual(venueModuleIds);
    for (const module of venueModules) {
      expect(canalWorkshopScene.fields.some((field) => field.id === module.visual.fieldId)).toBe(true);
      for (const anchor of module.routeAnchors) expect(canalWorkshopScene.anchors).toHaveProperty(anchor);
    }
  });
});
