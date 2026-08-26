import type { VenueModuleId } from "./venueModules";

export type ScenePoint = { x: number; y: number; layer: "ground" | "behind-guest" | "guest" | "front-guest" | "effect" };
export type SceneField = { id: string; x: number; y: number; width: number; height: number; module?: VenueModuleId };

export const canalWorkshopScene = {
  id: "canal-workshop-01",
  tileSize: 16,
  world: { width: 960, height: 640 },
  camera: { defaultZoom: 1, minimumZoom: 0.75, maximumZoom: 1.4 },
  fields: [
    { id: "ws-arrival", x: 192, y: 400, width: 96, height: 80, module: "arrival" },
    { id: "ws-shop", x: 192, y: 256, width: 96, height: 80, module: "shop" },
    { id: "ws-capacity", x: 288, y: 432, width: 192, height: 80 },
    { id: "ws-program", x: 288, y: 128, width: 192, height: 64, module: "program" },
    { id: "ws-gus-yard", x: 480, y: 352, width: 112, height: 128, module: "aufguss-yard" },
    { id: "ws-shower", x: 592, y: 368, width: 64, height: 96, module: "shower" },
    { id: "ws-cold", x: 592, y: 464, width: 96, height: 96, module: "cold-plunge" },
    { id: "canal-terrace", x: 624, y: 160, width: 80, height: 144 },
    { id: "canal-bridge", x: 688, y: 400, width: 144, height: 96 },
  ] as const satisfies readonly SceneField[],
  anchors: {
    "arrival-street": { x: 88, y: 440, layer: "guest" },
    "workshop-door": { x: 232, y: 440, layer: "guest" },
    "shop-stop": { x: 248, y: 296, layer: "guest" },
    "program-door": { x: 376, y: 184, layer: "guest" },
    "gus-master-yard": { x: 536, y: 408, layer: "guest" },
    "gus-guest-yard-a": { x: 504, y: 424, layer: "guest" },
    "gus-guest-yard-b": { x: 568, y: 424, layer: "guest" },
    "shower-workshop": { x: 632, y: 408, layer: "guest" },
    "cold-plunge-a": { x: 632, y: 504, layer: "guest" },
    "cold-plunge-b": { x: 664, y: 504, layer: "guest" },
    "cold-plunge-queue": { x: 592, y: 504, layer: "guest" },
    "yard-to-shower": { x: 568, y: 408, layer: "guest" },
    "shower-to-plunge": { x: 632, y: 456, layer: "guest" },
    "canal-bridge-entry": { x: 744, y: 440, layer: "guest" },
    "canal-water-idle": { x: 808, y: 464, layer: "behind-guest" },
    "canal-bridge-exit": { x: 744, y: 472, layer: "guest" },
    "quay-seat-a": { x: 648, y: 232, layer: "guest" },
    "quay-seat-b": { x: 680, y: 264, layer: "guest" },
    "workshop-chimney": { x: 376, y: 216, layer: "effect" },
    "aufguss-steam-yard": { x: 536, y: 376, layer: "effect" },
    "canal-ripple-a": { x: 824, y: 440, layer: "behind-guest" },
    "evening-light-01": { x: 696, y: 200, layer: "effect" },
    "evening-light-02": { x: 696, y: 504, layer: "effect" },
  } as const satisfies Record<string, ScenePoint>,
  routes: {
    arrival: ["arrival-street"],
    entrance: ["arrival-street", "workshop-door"],
    shop: ["workshop-door", "shop-stop", "workshop-door"],
    program: ["workshop-door", "program-door", "workshop-door"],
    outdoorGus: ["workshop-door", "gus-master-yard", "workshop-door"],
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
