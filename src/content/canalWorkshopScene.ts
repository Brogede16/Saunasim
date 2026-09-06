import type { VenueModuleId } from "./venueModules";

export type ScenePoint = { x: number; y: number; layer: "ground" | "behind-guest" | "guest" | "front-guest" | "effect" };
export type SceneField = { id: string; x: number; y: number; width: number; height: number; module?: VenueModuleId };

export const canalWorkshopScene = {
  id: "canal-workshop-01",
  tileSize: 16,
  world: { width: 960, height: 640 },
  camera: { defaultZoom: 1, minimumZoom: 0.75, maximumZoom: 1.4 },
  fields: [
    { id: "ws-arrival", x: 224, y: 388, width: 72, height: 48, module: "arrival" },
    { id: "ws-shop", x: 390, y: 308, width: 76, height: 56, module: "shop" },
    { id: "ws-capacity", x: 472, y: 252, width: 112, height: 88 },
    { id: "ws-program", x: 520, y: 152, width: 136, height: 96, module: "program" },
    { id: "ws-gus-yard", x: 492, y: 348, width: 128, height: 112, module: "aufguss-yard" },
    { id: "ws-shower", x: 640, y: 344, width: 48, height: 96, module: "shower" },
    { id: "ws-cold", x: 592, y: 468, width: 96, height: 88, module: "cold-plunge" },
    { id: "canal-terrace", x: 624, y: 160, width: 80, height: 144 },
    { id: "canal-bridge", x: 688, y: 400, width: 144, height: 96 },
  ] as const satisfies readonly SceneField[],
  anchors: {
    "arrival-street": { x: 88, y: 440, layer: "guest" },
    "workshop-door": { x: 256, y: 412, layer: "guest" },
    "shop-stop": { x: 292, y: 416, layer: "guest" },
    "workshop-side-walk": { x: 492, y: 432, layer: "guest" },
    "program-door": { x: 576, y: 244, layer: "guest" },
    "gus-master-yard": { x: 558, y: 400, layer: "guest" },
    "gus-guest-yard-a": { x: 524, y: 424, layer: "guest" },
    "gus-guest-yard-b": { x: 588, y: 424, layer: "guest" },
    "shower-workshop": { x: 664, y: 400, layer: "guest" },
    "cold-plunge-a": { x: 624, y: 508, layer: "guest" },
    "cold-plunge-b": { x: 662, y: 508, layer: "guest" },
    "cold-plunge-queue": { x: 592, y: 508, layer: "guest" },
    "yard-to-shower": { x: 620, y: 416, layer: "guest" },
    "shower-to-plunge": { x: 650, y: 456, layer: "guest" },
    "canal-bridge-entry": { x: 744, y: 440, layer: "guest" },
    "canal-water-idle": { x: 808, y: 464, layer: "behind-guest" },
    "canal-bridge-exit": { x: 744, y: 472, layer: "guest" },
    "quay-seat-a": { x: 648, y: 232, layer: "guest" },
    "quay-seat-b": { x: 680, y: 264, layer: "guest" },
    "workshop-chimney": { x: 300, y: 198, layer: "effect" },
    "aufguss-steam-yard": { x: 558, y: 368, layer: "effect" },
    "canal-ripple-a": { x: 824, y: 440, layer: "behind-guest" },
    "evening-light-01": { x: 696, y: 200, layer: "effect" },
    "evening-light-02": { x: 696, y: 504, layer: "effect" },
  } as const satisfies Record<string, ScenePoint>,
  routes: {
    arrival: ["arrival-street"],
    entrance: ["arrival-street", "workshop-door"],
    shop: ["workshop-door", "shop-stop", "workshop-door"],
    // The side walk is a real bend in the route, not a decorative anchor. These paths keep guests
    // outside the Workshop footprint until the final production walk graph replaces this study.
    program: ["workshop-door", "workshop-side-walk", "program-door"],
    outdoorGus: ["workshop-door", "workshop-side-walk", "gus-master-yard"],
    shower: ["yard-to-shower", "shower-workshop", "shower-to-plunge"],
    coldPlunge: ["shower-to-plunge", "cold-plunge-a", "shower-to-plunge"],
    canalWater: ["canal-bridge-entry", "canal-water-idle", "canal-bridge-exit"],
    exit: ["workshop-door", "arrival-street"],
  } as const,
} as const;

export type CanalAnchorId = keyof typeof canalWorkshopScene.anchors;

export function canalAnchor(id: CanalAnchorId) {
  return canalWorkshopScene.anchors[id];
}
