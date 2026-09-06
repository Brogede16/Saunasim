/**
 * The single machine-readable source of truth for art production geometry.
 *
 * Everything an artist needs to size a file, and everything the renderer needs to place it, is
 * declared here rather than in prose. `docs/pixel-art-production-guide-v0.1.md` and
 * `docs/sprite-production-master-manifest-v0.1.md` remain the intent/style documents; when a
 * number in a document disagrees with this file, this file is the contract and the document is
 * stale.
 *
 * Hard rule this file exists to protect: nothing in the world is ever rescaled by the renderer to
 * solve a layout problem. Camera zoom scales the whole world uniformly. A facility that needs more
 * room gets a larger drawn multi-tile state at the same pixel density.
 */

export const TILE = 16;

export const tilesToPx = (tiles: number) => tiles * TILE;
export const pxToTiles = (px: number) => px / TILE;

/** Native px sizes for a rectangle expressed in tiles. */
export const envelopePx = (widthTiles: number, heightTiles: number) => ({ width: tilesToPx(widthTiles), height: tilesToPx(heightTiles) });

/**
 * Depth bands. The prototype renderer used a single `effect` layer at depth 12, which cannot
 * express shower water or plunge splash drawn *in front of* the guest using it. Effects are now
 * explicitly split into a behind band and a front band around the guest band.
 */
export const depthLayers = {
  terrain: 0,
  "field-ground": 2,
  route: 4,
  "effect-behind": 12,
  "building-behind": 14,
  marker: 18,
  staff: 22,
  overlay: 24,
  guest: 30,
  "building-foreground": 34,
  "effect-front": 36,
  ui: 40,
} as const satisfies Record<string, number>;

export type DepthLayer = keyof typeof depthLayers;

/**
 * Bearings, in the order a sheet's rows are packed.
 *
 * Only five of the eight are drawn. The three western bearings are the eastern ones mirrored at
 * runtime with `flipX`, which is legal here in a way runtime *rotation* never is: the pixel grid is
 * preserved exactly. See MIRRORING_RULES before drawing anything that relies on it.
 */
export const BEARINGS = ["s", "se", "e", "ne", "n", "nw", "w", "sw"] as const;
export type Bearing = (typeof BEARINGS)[number];

/** The bearings an artist actually draws. A sheet PNG contains exactly these rows, in this order. */
export const DRAWN_BEARINGS = ["s", "se", "e", "ne", "n"] as const;

/** Mirrored bearing -> the drawn row it is flipped from. */
export const MIRRORED_BEARINGS = { sw: "se", w: "e", nw: "ne" } as const satisfies Record<string, Bearing>;

/**
 * Four things must hold or mirroring breaks quietly:
 *
 * 1. The pivot sits on the mirror axis. A 32 px cell mirrors about x = 16, which is exactly
 *    `CHARACTER_FOOT_PIVOT.x`, so the foot anchor survives a flip unchanged. An odd cell width, or a
 *    pivot moved off centre, silently breaks every mirrored bearing.
 * 2. Only the image is mirrored, never the frame order. After a flip the cycle leads with the other
 *    leg, which is still a valid loop. Do not "correct" it.
 * 3. Characters are shaded ambient/top, never with a directional side light - a flipped figure would
 *    otherwise be lit from the wrong side. Buildings keep directional light; they are never mirrored.
 * 4. A tool or carried-item anchor is stored as an offset *from the pivot*, so its sign flips with
 *    the sprite. Stored as an absolute x, the Master's fan lands beside the hand in three bearings.
 *
 * A carried object that must stay on the same side of the body is the one case that needs its own
 * drawn western variant instead of a mirror.
 */
export const MIRRORING_RULES = { axisX: 16, flipsFrameOrder: false, shading: "ambient-top" } as const;

/**
 * Sheet families. `cell` is the fixed frame box every frame in the sheet uses; `pivot` is the
 * in-cell origin the renderer aligns to an anchor. A sheet may never be exported at a different
 * cell size "because the pose is bigger" - the pose is drawn inside the cell.
 *
 * Pivot rule, one principle instead of a list of exceptions:
 *
 *   contact with a surface -> foot pivot. No contact with a surface -> waterline pivot.
 *
 * So every enter/exit transition uses the foot pivot (the guest is standing on ground or on the
 * basin floor at both ends of the sequence), and only the stationary floating/seated water loops use
 * the waterline. Sibling actions previously disagreed on this, which made a guest jump 8 px on the
 * first frame of a plunge entry.
 */
export type SheetFamily = {
  id: string;
  cell: { width: number; height: number };
  pivot: { x: number; y: number };
  frames: number;
  /** 8 means the eight bearings above, of which only DRAWN_BEARINGS are exported. */
  directions: 1 | 8;
  frameRate: number;
  loop: "loop" | "once" | "once-hold" | "ping-pong";
  depth: DepthLayer;
  purpose: string;
};

/** Rows actually present in the exported PNG: five for an eight-bearing sheet, one otherwise. */
export function drawnRows(family: Pick<SheetFamily, "directions">) {
  return family.directions === 8 ? DRAWN_BEARINGS.length : 1;
}

/** A land character is 28 px tall inside a 32 px cell, so a guest is 1.75 tiles - the locked world scale. */
export const CHARACTER_CELL = { width: 32, height: 32 } as const;
export const CHARACTER_BODY_HEIGHT = 28;
/** Bottom-centre foot anchor, one row above the cell floor so a 1 px contact shadow still fits. */
export const CHARACTER_FOOT_PIVOT = { x: 16, y: 30 } as const;
/** Shared waterline for every in-water pose, so a guest never bobs when the action sheet changes. */
export const CHARACTER_WATERLINE_PIVOT = { x: 16, y: 22 } as const;

const character = (id: string, frames: number, directions: 1 | 8, frameRate: number, loop: SheetFamily["loop"], purpose: string, pivot: SheetFamily["pivot"] = CHARACTER_FOOT_PIVOT): SheetFamily =>
  ({ id, cell: CHARACTER_CELL, pivot, frames, directions, frameRate, loop, depth: "guest", purpose });

const effect = (id: string, cell: { width: number; height: number }, frames: number, frameRate: number, loop: SheetFamily["loop"], depth: DepthLayer, purpose: string): SheetFamily =>
  ({ id, cell, pivot: { x: cell.width / 2, y: cell.height }, frames, directions: 1, frameRate, loop, depth, purpose });

const ui = (id: string, cell: { width: number; height: number }, frames: number, purpose: string): SheetFamily =>
  ({ id, cell, pivot: { x: 0, y: 0 }, frames, directions: 1, frameRate: 0, loop: "once", depth: "ui", purpose });

/** Effect canvases. Four sizes only, so effect sheets stay batchable and reusable across venues. */
export const EFFECT_CELLS = {
  small: { width: 32, height: 32 },
  column: { width: 32, height: 48 },
  wide: { width: 64, height: 32 },
  field: { width: 96, height: 64 },
} as const;

export const sheetFamilies = [
  character("guest-walk-8dir", 8, 8, 8, "loop", "Eight-phase planted-foot land movement for every guest route."),
  character("guest-idle-stand", 4, 8, 4, "loop", "Standing hold at any visible land stop; also the fallback pose."),
  character("guest-door-enter-exit", 6, 1, 10, "once", "Doorway approach, threshold and disappear/appear."),
  character("guest-queue-shift", 6, 1, 6, "loop", "Small waiting shuffle in a queue line."),
  character("guest-arrival-read-sign", 4, 1, 5, "loop", "Brief arrival pause at a sign, gate or lift portal."),
  character("guest-bench-sit-stand", 6, 1, 8, "once-hold", "Sit down, hold, and rise on reverse."),
  character("guest-lounge-recline-rise", 8, 1, 6, "once-hold", "Recline at an explicit lounger, hold, and rise on reverse."),
  character("guest-fire-rest", 6, 1, 5, "loop", "Seated recovery loop facing an authored fire field."),
  character("guest-shop-browse-buy", 6, 1, 8, "loop", "Shop stop and purchase gesture."),
  character("guest-refill-water", 6, 1, 8, "loop", "Refill and drink pause at a water station."),
  character("guest-shower-rinse", 6, 1, 8, "loop", "Under any shower field; pairs with fx-shower-water."),
  character("guest-cascade-rinse", 6, 1, 8, "loop", "Bucket/cascade rinse; pairs with a triggered splash effect."),
  character("guest-cold-plunge-enter-exit", 8, 1, 8, "once-hold", "Step in, submerge, hold, exit. Feet are on the basin floor throughout, so this is a foot-pivot sheet."),
  character("guest-natural-water-entry", 8, 1, 8, "once-hold", "Fixed safe natural-water entry and exit at a shore, ladder or bridge."),
  character("guest-water-idle", 6, 1, 6, "loop", "Bounded water idle at a natural water route.", CHARACTER_WATERLINE_PIVOT),
  character("guest-ladder-return", 6, 1, 8, "once", "Fixed ladder ascent from an authored water route."),
  character("guest-warm-spa-enter-exit", 8, 1, 8, "once-hold", "Step into a warm spa, hold, and exit. Feet stay on the basin floor, so this is a foot-pivot sheet."),
  character("guest-spa-seated-idle", 6, 1, 6, "loop", "Seated warm-spa idle; pairs with bubble and steam effects.", CHARACTER_WATERLINE_PIVOT),
  character("guest-program-participate", 6, 1, 6, "loop", "Seated participation inside an outdoor Gus field."),
  character("guest-program-exit-recover", 6, 1, 8, "once", "Short warm recovery reaction before the chosen exit route."),
  character("master-walk-8dir", 8, 8, 8, "loop", "Eight-phase Master movement with planted feet and a fixed tool hand anchor."),
  character("master-idle-stand", 4, 8, 4, "loop", "Tool-ready Master idle at an outdoor program field."),
  character("master-prepare", 6, 1, 8, "loop", "Bucket and towel preparation at a Master Ritual Station."),
  character("master-towel-classic", 8, 1, 10, "loop", "Master body action; the tool is a separate aligned overlay."),
  character("master-fan-heat", 8, 1, 10, "loop", "Master body action for fan-driven heat distribution."),
  character("master-infusion", 8, 1, 8, "once", "Ladle/infusion pour onto the stones."),
  character("master-rain-pour", 8, 1, 8, "once", "Broad rain-ladle delivery; pairs with a controlled steam effect."),
  character("master-vihta", 8, 1, 8, "loop", "Fresh-bundle ritual pose with a separate vihta overlay."),
  character("master-rhythm", 8, 1, 10, "loop", "Rhythmic towel or fan performance body action."),
  character("master-show", 8, 1, 10, "loop", "Choreographed broad performance body action."),
  character("master-close", 6, 1, 8, "once", "Finish acknowledgement before the Master leaves the field."),
  character("staff-walk-8dir", 8, 8, 8, "loop", "Eight-phase shared movement for Hosts and Technicians."),
  character("staff-idle-stand", 4, 8, 4, "loop", "Shared staff pause at an authored work or service anchor."),
  character("staff-host-arrival-guide", 6, 1, 8, "loop", "Welcome and queue-guidance gesture at an entry."),
  character("staff-host-shop-handoff", 6, 1, 8, "loop", "Visible shop, towel or product handoff."),
  character("staff-host-towel-collect", 6, 1, 8, "loop", "Pick-up and fold loop at an authored towel prop."),
  character("staff-host-seat-reset", 6, 1, 8, "loop", "Short bench, lounger or recovery-seat reset."),
  character("staff-host-water-service", 6, 1, 8, "loop", "Water or refreshment handoff at an eligible recovery field."),
  character("staff-tech-inspect", 6, 1, 8, "loop", "Inspection loop at a technical asset."),
  character("staff-tech-repair-ground", 6, 1, 8, "loop", "Kneeling tool repair at a ground-level asset."),
  character("staff-tech-repair-wall", 6, 1, 8, "loop", "Standing panel or pipe repair at a wall asset."),
  character("staff-tech-repair-roof", 6, 1, 8, "loop", "Safe repair loop at an authored accessible upper field."),
  character("staff-tech-complete-leave", 6, 1, 8, "once", "Pack tools and leave after a completed repair."),
  effect("fx-water-calm", EFFECT_CELLS.wide, 4, 5, "loop", "effect-behind", "Ambient ripple over any calm water tile."),
  effect("fx-steam-chimney", EFFECT_CELLS.column, 6, 6, "loop", "effect-behind", "Low chimney plume behind the roofline."),
  effect("fx-steam-program", EFFECT_CELLS.field, 6, 8, "loop", "effect-front", "Timed dense Gus steam over a program field."),
  effect("fx-shower-water", EFFECT_CELLS.column, 4, 12, "loop", "effect-front", "Falling water drawn in front of the rinsing guest."),
  effect("fx-plunge-splash", EFFECT_CELLS.wide, 6, 12, "once", "effect-front", "Triggered entry splash at a cold basin."),
  effect("fx-fire-flicker", EFFECT_CELLS.small, 4, 8, "loop", "effect-front", "Fire bowl and fire circle flame."),
  effect("fx-light-warm", EFFECT_CELLS.small, 3, 3, "loop", "effect-front", "Evening lamp and window glow."),
  effect("fx-foliage-wind", EFFECT_CELLS.small, 4, 4, "loop", "effect-behind", "Planting, reeds and grass movement."),
  effect("fx-construction-work", EFFECT_CELLS.small, 4, 6, "loop", "effect-front", "Work screen dust over a field under construction."),
  ui("ui-venue-management-kit", { width: 456, height: 128 }, 1, "Portrait venue header, panel framing and bottom action-bar art; game text remains rendered."),
  ui("ui-action-icons", { width: 32, height: 32 }, 16, "Shared navigation and venue-management action icon atlas."),
  ui("ui-program-category-icons", { width: 32, height: 32 }, 32, "Reusable Gus editor icon atlas for intent, heat, format, delivery, performance, music and recovery."),
  ui("ui-material-marks", { width: 32, height: 32 }, 16, "Ingredient-mark atlas for the approved Aufguss material library."),
  ui("ui-tier-marks", { width: 32, height: 32 }, 5, "Composition-tier marks: Bad, Normal, Rare, Iconic and Ultimate."),
  ui("ui-role-status-icons", { width: 32, height: 32 }, 16, "Shared staff role, condition, capacity, finance and alert icon atlas."),
] as const satisfies readonly SheetFamily[];

export type SheetFamilyId = (typeof sheetFamilies)[number]["id"];

/**
 * Upgrade tiers. A field is drawn as independent complete states, never as a repaint of the scene.
 * The renderer draws the highest owned tier of a family and nothing below it.
 */
export const UPGRADE_TIERS = ["base", "l1", "l2", "l3"] as const;
export type UpgradeTier = (typeof UPGRADE_TIERS)[number];

/**
 * File naming. One shape for every runtime PNG, so a file's owner, subject and state are readable
 * without opening the asset registry.
 *
 *   <domain>-<subject>[-<state>]-v<NN>.png
 *
 * domain: `loc` (location field), `bld` (building layer), `guest`/`master`/`staff` (character
 * sheet), `fx` (effect sheet), `env` (whole-location environment base), `ui` (interface atlas).
 *
 * Host and Technician sheets live under `staff-` rather than their own prefixes: they share the
 * movement and idle rigs with every other staff role, and a domain per job title would grow with
 * every future role.
 */
export const ASSET_FILENAME = /^(env|loc|bld|guest|master|staff|fx|ui)-[a-z0-9]+(-[a-z0-9]+)*-v\d{2}\.png$/;

export function isValidAssetFilename(name: string) {
  return ASSET_FILENAME.test(name);
}

/**
 * Portrait framing. The phone viewport is a window into a much larger world; these are the values
 * a location layout must stay readable inside at both ends of the zoom range.
 */
export const camera = {
  portraitViewport: { width: 456, height: 640 },
  minimumZoom: 0.75,
  defaultZoom: 1,
  maximumZoom: 2,
  /** Clear tiles kept around any guest-facing side of a building envelope. */
  circulationBandTiles: 2,
  /** Unclaimed planning margin every location world keeps beyond its known reserved fields. */
  planningMarginRatio: 0.2,
} as const;

export function validateArtContract() {
  const seen = new Set<string>();
  for (const family of sheetFamilies) {
    if (seen.has(family.id)) throw new Error(`Duplicate sheet family: ${family.id}`);
    seen.add(family.id);
    if (family.depth !== "ui" && (family.frames < 3 || family.frames > 8)) throw new Error(`Sheet family outside the 3-8 frame standard: ${family.id}`);
    if (family.cell.width % 8 !== 0 || family.cell.height % 8 !== 0) throw new Error(`Sheet cell is off the 8 px sub-grid: ${family.id}`);
    if (family.pivot.x > family.cell.width || family.pivot.y > family.cell.height) throw new Error(`Pivot outside its cell: ${family.id}`);
    // A mirrored bearing is only free while the pivot sits exactly on the flip axis.
    if (family.directions === 8 && family.pivot.x !== family.cell.width / 2) throw new Error(`Mirrored sheet pivot is off the flip axis: ${family.id}`);
  }
  const covered = new Set<string>([...DRAWN_BEARINGS, ...Object.keys(MIRRORED_BEARINGS)]);
  for (const bearing of BEARINGS) if (!covered.has(bearing)) throw new Error(`Bearing ${bearing} is neither drawn nor mirrored`);
  for (const [mirrored, source] of Object.entries(MIRRORED_BEARINGS)) {
    if (!(DRAWN_BEARINGS as readonly string[]).includes(source)) throw new Error(`${mirrored} mirrors ${source}, which is not drawn`);
  }
  if (CHARACTER_BODY_HEIGHT >= CHARACTER_CELL.height) throw new Error("Character body must leave headroom inside its cell");
  return true;
}
