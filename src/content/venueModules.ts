export type VenueModuleOwner = "location" | "building";
export type CapacityChannel = "arrival" | "program" | "recovery" | "shop";
export type ConditionRule = "none" | "technical";

export type VenueModuleDefinition = {
  id: string;
  name: string;
  owner: VenueModuleOwner;
  ownerTags: readonly string[];
  requiresTags: readonly string[];
  capacityChannels: readonly CapacityChannel[];
  routeAnchors: readonly string[];
  economy: { price: number; buildHours: number; operatingChannel: string };
  condition: ConditionRule;
  visual: { fieldId: string; package: string; visible: boolean };
  shortEffect: string;
};

/**
 * The first data-card catalogue. Later venues derive their buildable choices by matching a
 * selected location and permanent building base against these ownership and compatibility tags.
 */
export const venueModules = [
  {
    id: "arrival", name: "Renovated Entrance Sign", owner: "building", ownerTags: ["repair-workshop"], requiresTags: ["canal"],
    capacityChannels: ["arrival"], routeAnchors: ["arrival-street", "workshop-door"],
    economy: { price: 1_200, buildHours: 1, operatingChannel: "arrival" }, condition: "none", visual: { fieldId: "ws-arrival", package: "workshop-arrival-sign", visible: true }, shortEffect: "More accepted arrivals",
  },
  {
    id: "shop", name: "Reception Shop Port", owner: "building", ownerTags: ["repair-workshop"], requiresTags: ["canal"],
    capacityChannels: ["arrival", "shop"], routeAnchors: ["workshop-door", "shop-stop"],
    economy: { price: 4_000, buildHours: 3, operatingChannel: "shop" }, condition: "none", visual: { fieldId: "ws-shop", package: "workshop-shop-port", visible: true }, shortEffect: "Guest purchases",
  },
  {
    id: "program", name: "Program Sauna Volume", owner: "building", ownerTags: ["repair-workshop"], requiresTags: ["canal"],
    capacityChannels: ["program"], routeAnchors: ["workshop-door", "program-door"],
    economy: { price: 32_000, buildHours: 8, operatingChannel: "program" }, condition: "technical", visual: { fieldId: "ws-program", package: "workshop-program-volume", visible: true }, shortEffect: "More programme seats",
  },
  {
    id: "aufguss-yard", name: "Outdoor Gus Yard", owner: "location", ownerTags: ["canal"], requiresTags: ["outdoor-program-space"],
    capacityChannels: ["program"], routeAnchors: ["workshop-door", "gus-master-yard", "gus-guest-yard-a"],
    economy: { price: 16_000, buildHours: 6, operatingChannel: "program" }, condition: "none", visual: { fieldId: "ws-gus-yard", package: "canal-outdoor-gus-yard", visible: true }, shortEffect: "Outdoor event Gus",
  },
  {
    id: "shower", name: "Copper Rain Shower", owner: "location", ownerTags: ["canal"], requiresTags: ["outdoor-recovery-space"],
    capacityChannels: ["recovery"], routeAnchors: ["yard-to-shower", "shower-workshop", "shower-to-plunge"],
    economy: { price: 3_000, buildHours: 2, operatingChannel: "recovery" }, condition: "technical", visual: { fieldId: "ws-shower", package: "canal-rain-shower", visible: true }, shortEffect: "Outdoor Shower finish",
  },
  {
    id: "cold-plunge", name: "Compact Cold Plunge", owner: "location", ownerTags: ["canal"], requiresTags: ["outdoor-recovery-space"],
    capacityChannels: ["recovery"], routeAnchors: ["shower-to-plunge", "cold-plunge-a", "cold-plunge-b", "cold-plunge-queue"],
    economy: { price: 9_500, buildHours: 5, operatingChannel: "recovery" }, condition: "technical", visual: { fieldId: "ws-cold", package: "canal-cold-plunge", visible: true }, shortEffect: "Cold recovery",
  },
  {
    id: "bench-refit", name: "Bench Refit", owner: "building", ownerTags: ["repair-workshop"], requiresTags: ["canal"],
    capacityChannels: ["program"], routeAnchors: ["workshop-door"],
    economy: { price: 2_500, buildHours: 2, operatingChannel: "program" }, condition: "none", visual: { fieldId: "ws-capacity", package: "workshop-bench-refit", visible: false }, shortEffect: "+3 seats in the current sauna",
  },
] as const satisfies readonly VenueModuleDefinition[];

export const venueModuleIds = venueModules.map((module) => module.id) as unknown as readonly [VenueModuleId, ...VenueModuleId[]];
export type VenueModuleId = (typeof venueModules)[number]["id"];

export type VenueCompatibility = { locationTags: readonly string[]; buildingTags: readonly string[]; tags: readonly string[] };

export const canalWorkshopVenue: VenueCompatibility = {
  locationTags: ["canal"],
  buildingTags: ["repair-workshop"],
  tags: ["canal", "outdoor-program-space", "outdoor-recovery-space"],
};

export function compatibleVenueModules(context: VenueCompatibility) {
  const hasAll = (tags: readonly string[], available: readonly string[]) => tags.every((tag) => available.includes(tag));
  return venueModules.filter((module) =>
    hasAll(module.requiresTags, context.tags)
    && hasAll(module.ownerTags, module.owner === "location" ? context.locationTags : context.buildingTags),
  );
}

export function validateVenueModules(modules = venueModules) {
  const seen = new Set<string>();
  for (const module of modules) {
    if (seen.has(module.id)) throw new Error(`Duplicate venue module: ${module.id}`);
    seen.add(module.id);
    if (!module.ownerTags.length || !module.capacityChannels.length || !module.routeAnchors.length) throw new Error(`Incomplete venue module card: ${module.id}`);
    if (module.economy.price <= 0 || module.economy.buildHours <= 0 || !module.visual.fieldId || !module.visual.package) throw new Error(`Invalid venue module card: ${module.id}`);
    if (module.condition === "technical" && !module.capacityChannels.some((channel) => channel === "program" || channel === "recovery")) throw new Error(`Technical module lacks a physical channel: ${module.id}`);
  }
  return true;
}
