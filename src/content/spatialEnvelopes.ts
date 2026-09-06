import { camera, envelopePx, TILE } from "./artContract";

/**
 * Machine-readable geometry for every location, building base and reserved facility field.
 *
 * This replaces the hand-maintained tables in `docs/building-envelope-estimates-v0.1.md` and
 * `docs/location-envelope-estimates-v0.1.md` as the *authority*. Those documents keep the design
 * reasoning; the numbers below are what the placement board, the validator and the future scene
 * files read.
 *
 * Two definitions that the prose versions conflated, and which are now separate:
 *
 * - `footprint` is the ground rectangle in tiles. It is the only thing that decides placement,
 *   collision, routes and how much of a location a building consumes.
 * - `silhouetteHeight` is how tall the drawn 3/4 sprite is in tiles, i.e. footprint depth plus roof
 *   and upper-volume mass. It decides canvas size, occlusion and vertical clearance - never ground
 *   packing.
 *
 * The Repair Workshop card's "21 x 19 tiles" and the envelope table's "22 x 16" were read as the
 * same measurement and therefore looked like a contradiction. They are the silhouette and the
 * footprint of the same building.
 */

export type TileRect = { x: number; y: number; width: number; height: number };
export type TileSize = { width: number; height: number };

export type BuildingBaseId =
  | "saunatelt-camp" | "container-compound" | "small-timber-cabin" | "pavilion" | "country-estate-barn"
  | "boathouse" | "repair-workshop" | "small-depot" | "warehouse" | "fiskehus" | "floating-sauna"
  | "rooftop-sauna" | "kursted";

export type LocationId =
  | "canal" | "harbour" | "industrial" | "forest-lake" | "coast" | "beach" | "rural" | "water-plot"
  | "urban-lot" | "hotel-rooftop";

/** A building-owned upgrade slot. Reserved from day one even when the starter state leaves it empty. */
export type BuildingSlot = "arrival" | "service" | "sauna-a" | "sauna-b" | "program" | "facade" | "roof-or-upper" | "roof-material" | "attached-recovery";

/**
 * Building-owned facilities follow the locked purchase rule: the initial built state plus two
 * visible upgrades. The unbuilt state is transparent and therefore has no PNG of its own.
 */
export const BUILDING_SLOT_STATE_COUNT = {
  arrival: 3,
  service: 3,
  "sauna-a": 3,
  "sauna-b": 3,
  program: 3,
  facade: 3,
  "roof-or-upper": 3,
  "roof-material": 3,
  "attached-recovery": 3,
} as const satisfies Record<BuildingSlot, 3>;

export type BuildingBase = {
  id: BuildingBaseId;
  name: string;
  /** Ground rectangle after every building-owned module is installed. */
  footprint: TileSize;
  /** Ground rectangle of the day-one starter state, always inside `footprint`. */
  starterFootprint: TileSize;
  /** Total drawn sprite height in tiles, including roof and upper volumes at their highest state. */
  silhouetteHeight: number;
  slots: readonly BuildingSlot[];
  legalLocations: readonly LocationId[];
  note: string;
};

export const buildingBases = [
  {
    id: "saunatelt-camp", name: "Saunatelt Camp", footprint: { width: 20, height: 16 }, starterFootprint: { width: 8, height: 6 }, silhouetteHeight: 18,
    slots: ["arrival", "service", "sauna-a", "sauna-b", "program", "facade", "attached-recovery"],
    legalLocations: ["industrial", "forest-lake", "beach", "rural", "urban-lot"],
    note: "A compound of separate tents, not one building. Grows outward inside its own budget.",
  },
  {
    id: "container-compound", name: "Container Compound", footprint: { width: 22, height: 16 }, starterFootprint: { width: 10, height: 6 }, silhouetteHeight: 19,
    slots: ["arrival", "service", "sauna-a", "sauna-b", "program", "facade", "roof-or-upper", "roof-material", "attached-recovery"],
    legalLocations: ["industrial", "harbour", "forest-lake", "beach", "rural", "urban-lot"],
    note: "Three to five linked container volumes around a contained yard; roof stair adds upper mass.",
  },
  {
    id: "small-timber-cabin", name: "Small Timber Cabin", footprint: { width: 16, height: 14 }, starterFootprint: { width: 10, height: 8 }, silhouetteHeight: 18,
    slots: ["arrival", "service", "sauna-a", "sauna-b", "facade", "roof-or-upper", "roof-material", "attached-recovery"],
    legalLocations: ["forest-lake", "coast", "beach", "rural"],
    note: "The loft is vertical volume only; it never claims new ground.",
  },
  {
    id: "pavilion", name: "Pavilion", footprint: { width: 22, height: 16 }, starterFootprint: { width: 14, height: 10 }, silhouetteHeight: 19,
    slots: ["arrival", "service", "sauna-a", "program", "facade", "roof-or-upper", "roof-material", "attached-recovery"],
    legalLocations: ["forest-lake", "coast", "beach"],
    note: "Wide, low, view-facing building with an attached recovery wing.",
  },
  {
    id: "country-estate-barn", name: "Country Estate with Barn", footprint: { width: 28, height: 18 }, starterFootprint: { width: 24, height: 16 }, silhouetteHeight: 24,
    slots: ["arrival", "service", "sauna-a", "sauna-b", "program", "facade", "roof-or-upper", "roof-material", "attached-recovery"],
    legalLocations: ["rural", "coast", "forest-lake"],
    note: "House and barn are one compound present from day one; upgrades convert existing bays.",
  },
  {
    id: "boathouse", name: "Boathouse", footprint: { width: 20, height: 14 }, starterFootprint: { width: 13, height: 10 }, silhouetteHeight: 18,
    slots: ["arrival", "service", "sauna-a", "program", "facade", "roof-material", "attached-recovery"],
    legalLocations: ["canal", "harbour", "coast"],
    note: "Narrow water-facing shed with a land-facing expansion edge.",
  },
  {
    id: "repair-workshop", name: "Repair Workshop", footprint: { width: 22, height: 16 }, starterFootprint: { width: 18, height: 13 }, silhouetteHeight: 19,
    // The Workshop roof is permanent mass. It can receive a visual material/light treatment, but
    // it never becomes an upper guest facility or a roof activity field.
    slots: ["arrival", "service", "sauna-a", "program", "facade", "roof-material", "attached-recovery"],
    legalLocations: ["canal", "industrial"],
    note: "Substantial brick landmark: dense mass, dark slate roof, loading port and lit entry.",
  },
  {
    id: "small-depot", name: "Small Depot", footprint: { width: 18, height: 14 }, starterFootprint: { width: 12, height: 9 }, silhouetteHeight: 17,
    slots: ["arrival", "service", "sauna-a", "program", "facade", "roof-or-upper", "roof-material", "attached-recovery"],
    legalLocations: ["industrial"],
    note: "Low compact industrial box; attached yard use stays inside the envelope.",
  },
  {
    id: "warehouse", name: "Warehouse", footprint: { width: 28, height: 18 }, starterFootprint: { width: 24, height: 16 }, silhouetteHeight: 24,
    slots: ["arrival", "service", "sauna-a", "sauna-b", "program", "facade", "roof-or-upper", "roof-material", "attached-recovery"],
    legalLocations: ["harbour", "industrial"],
    note: "The hall exists from the start; conversions change bay states, not outer mass.",
  },
  {
    id: "fiskehus", name: "Fiskehus", footprint: { width: 24, height: 16 }, starterFootprint: { width: 20, height: 14 }, silhouetteHeight: 21,
    slots: ["arrival", "service", "sauna-a", "sauna-b", "program", "facade", "roof-or-upper", "roof-material", "attached-recovery"],
    legalLocations: ["harbour", "industrial"],
    note: "Broad processing building with three independently converted existing rooms.",
  },
  {
    id: "floating-sauna", name: "Floating Sauna", footprint: { width: 16, height: 12 }, starterFootprint: { width: 10, height: 8 }, silhouetteHeight: 15,
    slots: ["arrival", "service", "sauna-a", "program", "facade", "attached-recovery"],
    legalLocations: ["water-plot"],
    note: "Moored unit only. The gangway and every pontoon are location-owned water fields.",
  },
  {
    id: "rooftop-sauna", name: "Rooftop Sauna", footprint: { width: 18, height: 14 }, starterFootprint: { width: 10, height: 8 }, silhouetteHeight: 18,
    slots: ["arrival", "service", "sauna-a", "sauna-b", "program", "facade", "roof-or-upper", "roof-material", "attached-recovery"],
    legalLocations: ["hotel-rooftop"],
    note: "Compact roof compound beside the fixed lift core.",
  },
  {
    id: "kursted", name: "Former Kursted / Badesanatorium", footprint: { width: 32, height: 20 }, starterFootprint: { width: 28, height: 18 }, silhouetteHeight: 28,
    slots: ["arrival", "service", "sauna-a", "sauna-b", "program", "facade", "roof-or-upper", "roof-material", "attached-recovery"],
    legalLocations: ["coast", "forest-lake", "rural"],
    note: "Landmark base with existing side wings; its mass is present from day one.",
  },
] as const satisfies readonly BuildingBase[];

/** A location-owned facility field, reserved at its highest approved state from day one. */
export type LocationField = {
  id: string;
  name: string;
  size: TileSize;
  /** How many drawn states this field needs: `base` plus its approved upgrades. */
  states: 1 | 2 | 3 | 4;
  /** `water-edge` fields legitimately reach into the protected water body. */
  terrain: "land" | "water-edge";
};

export type ProtectedZone = TileRect & { id: string; kind: "water" | "structure" | "nature" };

export type LocationBase = {
  id: LocationId;
  name: string;
  world: TileSize;
  /** Fixed visible guest entry/return field on the usable map edge. */
  arrival: TileRect;
  protectedZones: readonly ProtectedZone[];
  fields: readonly LocationField[];
  /** Water Plot builds on water; everywhere else water is protected geography. */
  waterIsBuildable: boolean;
};

const f = (id: string, name: string, width: number, height: number, states: LocationField["states"], terrain: LocationField["terrain"] = "land"): LocationField =>
  ({ id, name, size: { width, height }, states, terrain });

export const locationBases = [
  {
    id: "canal", name: "Canal", world: { width: 72, height: 52 }, waterIsBuildable: false,
    arrival: { x: 0, y: 17, width: 5, height: 4 },
    protectedZones: [
      { id: "canal-water", kind: "water", x: 0, y: 35, width: 72, height: 17 },
      { id: "canal-street", kind: "structure", x: 0, y: 0, width: 72, height: 7 },
    ],
    fields: [
      f("terrace", "Quay Terrace", 14, 8, 3),
      f("shower", "Outdoor Shower", 6, 6, 3),
      f("bathing-bridge", "Bathing Bridge", 12, 14, 3, "water-edge"),
      f("quay-lights", "Quay Lights", 16, 4, 1),
      f("planting", "Quay Planting", 16, 6, 1),
    ],
  },
  {
    id: "harbour", name: "Harbour", world: { width: 80, height: 56 }, waterIsBuildable: false,
    arrival: { x: 0, y: 20, width: 5, height: 4 },
    protectedZones: [
      { id: "harbour-basin", kind: "water", x: 0, y: 38, width: 80, height: 18 },
      { id: "harbour-quay-edge", kind: "structure", x: 0, y: 34, width: 80, height: 4 },
    ],
    fields: [
      f("terrace", "Quay Terrace", 14, 8, 3),
      f("outdoor-gus", "Quay Outdoor Gus Sauna", 12, 10, 3),
      f("bathing-steps", "Harbour Bathing Steps", 16, 16, 4, "water-edge"),
      f("shower-row", "Shower Row", 10, 6, 3),
      f("cargo-net-loungers", "Cargo-Net Loungers", 10, 6, 2),
      f("fire-bowl", "Dockside Fire Bowl", 8, 8, 2),
      f("lanterns", "Quay Lanterns", 14, 4, 1),
      f("salt-planting", "Salt Planting", 12, 5, 1),
    ],
  },
  {
    id: "industrial", name: "Industrial District", world: { width: 80, height: 56 }, waterIsBuildable: false,
    arrival: { x: 2, y: 27, width: 5, height: 4 },
    protectedZones: [
      { id: "industrial-road", kind: "structure", x: 0, y: 0, width: 80, height: 7 },
      { id: "industrial-rear-works", kind: "structure", x: 64, y: 7, width: 16, height: 27 },
    ],
    fields: [
      f("shower-row", "Covered Shower Row", 10, 6, 3),
      f("cold-basin", "Long Cold Basin", 12, 8, 3),
      f("sunken-spa", "Sunken Yard Spa", 14, 10, 3),
      f("recovery-canopy", "Recovery Canopy", 14, 8, 3),
      f("outdoor-gus", "Yard Outdoor Gus Sauna", 14, 10, 3),
      f("social-port", "Social Port", 14, 8, 3),
      f("green-wall", "Green Wall", 16, 4, 1),
      f("event-lights", "Event Lights", 16, 4, 1),
    ],
  },
  {
    id: "forest-lake", name: "Forest Lake", world: { width: 80, height: 64 }, waterIsBuildable: false,
    arrival: { x: 16, y: 0, width: 5, height: 4 },
    protectedZones: [
      { id: "lake", kind: "water", x: 48, y: 22, width: 32, height: 42 },
      { id: "forest-west", kind: "nature", x: 0, y: 7, width: 15, height: 50 },
      { id: "forest-south", kind: "nature", x: 15, y: 50, width: 33, height: 14 },
    ],
    fields: [
      f("terrace", "Clearing Terrace", 14, 8, 3),
      f("lake-bridge", "Lake Bridge", 12, 14, 3, "water-edge"),
      f("shower", "Outdoor Shower", 6, 6, 3),
      f("rest-platform", "Floating Rest Platform", 12, 10, 3, "water-edge"),
      f("outdoor-gus", "Lakeside Outdoor Gus Sauna", 12, 10, 3),
      f("rock-spa", "Rock Spa", 14, 10, 3),
      f("fire-clearing", "Fire Clearing", 12, 10, 3),
      f("shelter", "Lakeside Shelter", 10, 8, 1),
      f("stone-circle", "Stone Bench Circle", 8, 8, 1),
      f("view-frame", "View Frame", 6, 5, 1),
      f("ritual-path", "Ritual Path", 14, 4, 1),
    ],
  },
  {
    id: "coast", name: "Coast", world: { width: 80, height: 64 }, waterIsBuildable: false,
    arrival: { x: 3, y: 26, width: 5, height: 4 },
    protectedZones: [
      { id: "sea", kind: "water", x: 48, y: 0, width: 32, height: 64 },
      { id: "cliff", kind: "nature", x: 40, y: 0, width: 8, height: 64 },
      { id: "coast-road", kind: "structure", x: 0, y: 0, width: 40, height: 7 },
    ],
    fields: [
      f("outlook-deck", "Outlook Deck", 14, 8, 3),
      f("cove-steps", "Cove Steps", 12, 14, 3, "water-edge"),
      f("shower-changing", "Shower and Changing", 12, 8, 3),
      f("outdoor-gus", "Screened Outdoor Gus Sauna", 12, 10, 3),
      f("rock-spa", "Rock Spa", 14, 10, 3),
      f("cliff-niche", "Cliff Niche", 8, 6, 1),
      f("lanterns", "Coastal Lanterns", 14, 4, 1),
      f("planting", "Wind Planting", 12, 5, 1),
      f("wind-screens", "Wind Screens", 10, 4, 1),
    ],
  },
  {
    id: "beach", name: "Beach", world: { width: 80, height: 64 }, waterIsBuildable: false,
    arrival: { x: 54, y: 7, width: 5, height: 4 },
    protectedZones: [
      { id: "sea", kind: "water", x: 0, y: 44, width: 80, height: 20 },
      { id: "dunes", kind: "nature", x: 0, y: 32, width: 80, height: 8 },
      { id: "boardwalk", kind: "structure", x: 0, y: 7, width: 80, height: 5 },
    ],
    fields: [
      f("deck", "Boardwalk Deck", 14, 8, 3),
      f("cove-bridge", "Cove Bridge", 12, 14, 3, "water-edge"),
      f("shower-changing", "Shower and Changing", 12, 8, 3),
      f("outdoor-gus", "Dune Outdoor Gus Sauna", 12, 10, 3),
      f("beach-spa", "Beach Spa", 14, 10, 3),
      f("sun-zone", "Sun and Recovery Zone", 18, 9, 3),
      f("recovery-platform", "Floating Recovery Platform", 12, 10, 2, "water-edge"),
      f("fire", "Beach Fire", 8, 8, 2),
      f("dune-niches", "Dune Niches", 10, 6, 1),
      f("lights", "Boardwalk Lights", 14, 4, 1),
      f("planting", "Dune Planting", 12, 5, 1),
      f("refill", "Refill Station", 6, 4, 1),
    ],
  },
  {
    id: "rural", name: "Rural Plot", world: { width: 80, height: 64 }, waterIsBuildable: false,
    arrival: { x: 3, y: 29, width: 5, height: 4 },
    protectedZones: [
      { id: "rural-road", kind: "structure", x: 0, y: 0, width: 80, height: 7 },
      { id: "orchard", kind: "nature", x: 61, y: 8, width: 19, height: 28 },
      { id: "woods", kind: "nature", x: 0, y: 45, width: 22, height: 19 },
    ],
    fields: [
      f("meadow-terrace", "Meadow Terrace", 14, 8, 3),
      f("shower", "Outdoor Shower", 10, 6, 3),
      f("cold-plunge", "Built Cold Plunge", 10, 8, 3),
      f("outdoor-gus", "Field-Edge Outdoor Gus Sauna", 12, 10, 3),
      f("garden-spa", "Garden Spa", 14, 10, 3),
      f("fire-circle", "Fire Circle", 12, 10, 3),
      f("covered-recovery", "Covered Recovery", 14, 8, 3),
      f("orchard-benches", "Orchard Benches", 14, 8, 1),
      f("windbreak", "Windbreak Planting", 16, 5, 1),
      f("ritual-path", "Ritual Path", 14, 4, 1),
    ],
  },
  {
    id: "water-plot", name: "Water Plot", world: { width: 72, height: 60 }, waterIsBuildable: true,
    arrival: { x: 3, y: 6, width: 5, height: 4 },
    protectedZones: [
      { id: "open-water", kind: "water", x: 0, y: 0, width: 72, height: 60 },
    ],
    fields: [
      f("shore-deck", "Shore Deck", 12, 12, 3),
      f("changing-cabin", "Changing Cabin", 8, 6, 2),
      f("recovery-pontoon", "Recovery Pontoon", 10, 8, 3, "water-edge"),
      f("floating-spa", "Floating Spa", 12, 10, 3, "water-edge"),
      f("swim-net", "Bounded Swim Room", 14, 12, 3, "water-edge"),
      f("gangway-shower", "Gangway Shower", 6, 6, 2, "water-edge"),
      f("fire-pontoon", "Floating Fire Bowl", 8, 8, 2, "water-edge"),
      f("pontoon-gus", "Pontoon Outdoor Gus Sauna", 12, 10, 3, "water-edge"),
    ],
  },
  {
    id: "urban-lot", name: "Urban Lot", world: { width: 72, height: 52 }, waterIsBuildable: false,
    arrival: { x: 8, y: 7, width: 5, height: 4 },
    protectedZones: [
      { id: "street", kind: "structure", x: 0, y: 0, width: 72, height: 7 },
      { id: "neighbour-west", kind: "structure", x: 0, y: 7, width: 7, height: 45 },
      { id: "neighbour-east", kind: "structure", x: 65, y: 7, width: 7, height: 45 },
      { id: "back-wall", kind: "structure", x: 7, y: 45, width: 58, height: 7 },
    ],
    fields: [
      f("social-deck", "Social Deck", 12, 8, 3),
      f("canopy", "Low Canopy", 12, 8, 3),
      f("shower", "Yard Shower", 6, 6, 3),
      f("plunge", "Compact Plunge", 10, 8, 3),
      f("outdoor-gus", "Courtyard Outdoor Gus Sauna", 12, 10, 3),
      f("wild-bath", "Screened Wild Bath", 10, 8, 2),
      f("fire-courtyard", "Fire Courtyard", 10, 8, 2),
      f("mural-wall", "Wall / Mural", 16, 4, 1),
      f("greenery", "Potted Greenery", 12, 4, 1),
      f("lights", "Yard Lights", 12, 4, 1),
      f("refill-bench", "Refill Bench", 6, 4, 1),
      f("sitting-window", "Street-Facing Sitting Window", 8, 4, 1),
    ],
  },
  {
    id: "hotel-rooftop", name: "Hotel Rooftop", world: { width: 72, height: 52 }, waterIsBuildable: false,
    arrival: { x: 7, y: 14, width: 5, height: 4 },
    protectedZones: [
      { id: "hotel-structure", kind: "structure", x: 0, y: 0, width: 72, height: 9 },
      { id: "roof-edge", kind: "structure", x: 0, y: 45, width: 72, height: 7 },
      { id: "lift-core", kind: "structure", x: 5, y: 10, width: 13, height: 14 },
    ],
    fields: [
      f("skyline-deck", "Skyline Deck", 12, 8, 3),
      f("wind-canopy", "Wind Canopy", 12, 8, 3),
      f("shower", "Roof Shower", 8, 6, 3),
      f("plunge", "Roof Cold Plunge", 10, 8, 3),
      f("spa", "Roof Spa", 12, 10, 3),
      f("outdoor-gus", "Rooftop Outdoor Gus Sauna", 12, 10, 3),
      f("fire-bowl", "Roof Fire Bowl", 8, 8, 3),
      f("planted-corners", "Planted Corners", 10, 4, 1),
      f("roof-lights", "Roof Lights", 12, 4, 1),
      f("lift-refill", "Lift-Core Refill", 6, 4, 1),
    ],
  },
] as const satisfies readonly LocationBase[];

const area = (size: TileSize) => size.width * size.height;
const rectArea = (rect: TileRect) => rect.width * rect.height;

export const buildingById = (id: BuildingBaseId) => buildingBases.find((base) => base.id === id)!;
export const locationById = (id: LocationId) => locationBases.find((base) => base.id === id)!;

/** Every legal location x building pair. This is the complete set of layouts art must support. */
export const placementProfiles = locationBases.flatMap((location) =>
  buildingBases.filter((building) => (building.legalLocations as readonly LocationId[]).includes(location.id))
    .map((building) => ({ id: `${location.id}:${building.id}`, location: location.id, building: building.id })),
);

/**
 * The ground a building actually consumes: its full footprint plus the circulation band guests
 * need on every side. This, not the raw footprint, is what a location must be able to give up.
 */
export function occupiedFootprint(building: BuildingBase) {
  const band = camera.circulationBandTiles * 2;
  return { width: building.footprint.width + band, height: building.footprint.height + band };
}

export type LocationBudget = {
  location: LocationId;
  worldArea: number;
  buildableArea: number;
  landDemand: number;
  waterDemand: number;
  waterArea: number;
  largestBuilding: BuildingBaseId | null;
  /** Share of buildable land left unclaimed. Must stay at or above `camera.planningMarginRatio`. */
  freeMargin: number;
};

export function locationBudget(location: LocationBase): LocationBudget {
  const worldArea = area(location.world);
  const protectedArea = location.protectedZones
    .filter((zone) => !(location.waterIsBuildable && zone.kind === "water"))
    .reduce((total, zone) => total + rectArea(zone), 0);
  const waterArea = location.protectedZones.filter((zone) => zone.kind === "water").reduce((total, zone) => total + rectArea(zone), 0);
  const buildableArea = worldArea - protectedArea;

  const compatible = buildingBases.filter((building) => (building.legalLocations as readonly LocationId[]).includes(location.id));
  const largest = compatible.reduce<BuildingBase | null>((worst, building) => (!worst || area(occupiedFootprint(building)) > area(occupiedFootprint(worst)) ? building : worst), null);

  const landFields = location.fields.filter((field) => field.terrain === "land").reduce((total, field) => total + area(field.size), 0);
  const waterDemand = location.fields.filter((field) => field.terrain === "water-edge").reduce((total, field) => total + area(field.size), 0);
  const landDemand = landFields + rectArea(location.arrival) + (largest ? area(occupiedFootprint(largest)) : 0);

  return {
    location: location.id, worldArea, buildableArea, landDemand, waterDemand, waterArea,
    largestBuilding: largest?.id ?? null,
    freeMargin: (buildableArea - landDemand) / buildableArea,
  };
}

/** Total distinct static PNG states a location needs for its own fields, across all upgrade levels. */
export function locationFieldStateCount(location: LocationBase) {
  return location.fields.reduce((total, field) => total + field.states, 0);
}

export function validateSpatialModel() {
  const buildingIds = new Set<string>();
  for (const building of buildingBases) {
    if (buildingIds.has(building.id)) throw new Error(`Duplicate building base: ${building.id}`);
    buildingIds.add(building.id);
    if (building.starterFootprint.width > building.footprint.width || building.starterFootprint.height > building.footprint.height) {
      throw new Error(`Starter state larger than the maximum envelope: ${building.id}`);
    }
    if (building.silhouetteHeight < building.footprint.height) throw new Error(`Silhouette shorter than its own ground depth: ${building.id}`);
    if (!building.legalLocations.length || !building.slots.length) throw new Error(`Incomplete building base: ${building.id}`);
  }

  const locationIds = new Set<string>();
  for (const location of locationBases) {
    if (locationIds.has(location.id)) throw new Error(`Duplicate location base: ${location.id}`);
    locationIds.add(location.id);
    const fieldIds = new Set<string>();
    for (const field of location.fields) {
      if (fieldIds.has(field.id)) throw new Error(`Duplicate field ${field.id} in ${location.id}`);
      fieldIds.add(field.id);
      if (field.size.width > location.world.width || field.size.height > location.world.height) throw new Error(`Field larger than its world: ${location.id}/${field.id}`);
    }
    for (const zone of location.protectedZones) {
      if (zone.x + zone.width > location.world.width || zone.y + zone.height > location.world.height) throw new Error(`Protected zone leaves the world: ${location.id}/${zone.id}`);
    }
    if (location.arrival.x + location.arrival.width > location.world.width || location.arrival.y + location.arrival.height > location.world.height) {
      throw new Error(`Arrival field leaves the world: ${location.id}`);
    }

    const budget = locationBudget(location);
    if (budget.freeMargin < camera.planningMarginRatio) {
      throw new Error(`${location.id} keeps only ${(budget.freeMargin * 100).toFixed(1)}% unclaimed land; the contract requires ${camera.planningMarginRatio * 100}%`);
    }
    if (budget.waterDemand > budget.waterArea) throw new Error(`${location.id} reserves more water-edge field area than it has water`);
  }

  for (const building of buildingBases) {
    for (const locationId of building.legalLocations) {
      const location = locationBases.find((base) => base.id === locationId);
      if (!location) throw new Error(`${building.id} names an unknown location: ${locationId}`);
      const occupied = occupiedFootprint(building);
      if (occupied.width > location.world.width || occupied.height > location.world.height) throw new Error(`${building.id} cannot fit in ${locationId}`);
    }
  }
  return true;
}

/** Native pixel geometry, for the asset cards and the export checks. */
export function buildingCanvas(building: BuildingBase) {
  return envelopePx(building.footprint.width, building.silhouetteHeight);
}

export function locationCanvas(location: LocationBase) {
  return envelopePx(location.world.width, location.world.height);
}

export const GRID_PX = TILE;
