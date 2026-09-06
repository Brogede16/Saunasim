# Sauna Sim Scene Composition and Render Contract v0.1

## Purpose

Exterior scenes must remain correct as buildings and upgrades are bought in any order. This is solved with authored scene data, not by manually guessing from final artwork.

Every location has one reusable base-scene file plus placement profiles for every compatible building base. Art layers, module fields, routes, collision, character depth and effect anchors are all recorded in the same coordinate space. A profile may place the same compatible building in a different sensible position; it does not require a separately painted location.

## 1. Scene Coordinate System

- Every scene uses a fixed tile grid and pixel coordinate system. The Canal Workshop specification's `60 x 40` grid is the reference implementation.
- A location base defines the world bounds, camera bounds, water/ground regions, protected location-owned fields and all possible upgrade fields before final art is produced.
- A placement profile selects an approved build zone for one compatible building base, with a fixed origin, maximum envelope, orientation, route connection and draw order.
- A building base and every building-owned upgrade attach only to its approved local slot; location-owned upgrades attach only to their separate reserved field.
- World sprites are placed at native scale only. The renderer may translate, depth-sort or use an approved mirror state, but it may not individually scale a building, prop or character to resolve a layout conflict. Camera zoom is the only scene-scale transform and applies uniformly to every world layer.
- No code or artist is allowed to move an upgrade by eye after a field has been approved. A corrected position changes the scene data and is reviewed as a layout change.

## 2. Required Data Per Field

Each base, building and upgrade field contains:

| Data | Why it exists |
| --- | --- |
| `fieldId`, owner and compatible tags | Prevents wrong location/building combinations. |
| Feature class and base/module/foreground layers | Keeps trees, rocks, dunes, walls, water edges and other existing art protected or credibly integrated. |
| Rectangle/polygon footprint and maximum envelope | Prevents building and upgrade overlap, including later building-owned modules. |
| Native tile dimensions and fixed pivot | Keeps every object at the same guest-relative scale; a larger facility requires a larger authored state, not a renderer scale factor. |
| Walkable, blocked and water patches | Prevents paths through walls or unsupported water. |
| Building/prop draw baseline | Keeps the object in a stable depth layer. |
| Entry, activity and exit anchors | Makes guest/staff actions use a real place. |
| Effect anchors | Places chimney steam, bubbles, water, fire, lights and construction at an exact pixel. |
| Occlusion masks/bands | Decides whether a character/effect is behind or in front of the asset. |
| Towel/service anchors where relevant | Keeps service props out of paths and water. |

## 3. Depth and Occlusion Rules

The renderer uses named depth bands, then a shared foot-position sort inside the character band:

1. `backdrop`: distant terrain, sky, far trees and far city silhouette.
2. `water-back` and `ground`: base water, shore, paving, sand and grass.
3. `rear-objects`: rear walls, trees, quay edges and objects that should cover only distant ground.
4. `world-objects`: buildings, modules, decks, basins, furniture and route props at their approved draw baselines.
5. `characters`: guests and staff sorted by their foot `y` coordinate.
6. `foreground-occluders`: shore lip, water foreground, roof edge, tall grass, railings and other authored masks that may partially cover a character.
7. `effects-back` / `effects-front`: an effect anchor explicitly chooses whether it sits behind a body, in front of it, behind a roof, or in front of a water mask.
8. `ui`: never part of world sorting.

An object never relies on a vague global “always in front” rule. Its field records its baseline and any local occlusion mask. A guest can therefore walk in front of a building facade, behind a tree crown where allowed, and appear waist-deep in water without manually drawn scene-specific versions.

## 4. Water Contract

- Water fields have a safe entry anchor, a bounded activity region, an exit/ladder anchor and a waterline mask.
- On entry, a land character switches to the shared water frame at the correct waterline; `water-entry` plays at the anchor.
- The water foreground mask covers the intended lower body area while keeping the head/upper body visible. It is never simulated with free placement.
- Canal, harbour, lake, coast, beach and Water Plot each provide their own water art and mask shape but use the shared entry, idle/swim, splash and return actions.
- Water Plot's floating deck uses a direct entry anchor and a separate fixed ladder return. Coast only exposes a sheltered-cove region.

## 5. Routes

- Scenes use authored route graphs, never free navigation around arbitrary building art.
- A route node has an ID, position, allowed roles, action type and depth/transition instructions.
- Every functional module adds only its declared compatible nodes and edges. An inactive/unbuilt module contributes no route.
- A visit action is a selected route: `arrival -> entrance -> activity -> return/exit`. The same applies to Master outdoor Gus and technician repair visits.
- Roof/lift, changing-pod and indoor-door transitions are explicit nodes that hide the transition rather than pretending a sprite can climb or walk through a facade.

## 6. Effect Anchors

Every loop is placed through data, not image intuition:

```text
effectId: spa-steam
x/y: exact world pixel
depth: effects-back | effects-front
attach: field | building | water
clip: none | waterline-mask | roof-mask
variant: low | medium | high
```

Examples:

- chimney steam attaches above the approved roof/chimney point and renders behind nearby foreground roof detail;
- wild-bath steam attaches inside its basin and may render behind seated guests but in front of water surface;
- canal ripples attach within the water activity zone, under the waterline mask;
- birds, leaves or road traffic are authored ambient anchors with a permitted route/area, never random sprites crossing roofs or water;
- construction work replaces only the purchased field and inherits its exact effect/depth anchors.

## 7. Automated Validation

Before a scene/module is accepted, development checks:

1. No two compatible module footprints overlap, including the full envelope of the selected building profile.
2. A module stays within its building slot or location-owned field and camera bounds; a protected feature is never consumed by its footprint.
3. Every functional asset has entry, activity and exit/return anchors.
4. Every route uses walkable patches and does not cross blocked structure or unsupported water.
5. Water facilities have entry, activity, exit and waterline-mask data.
6. Every required effect has an existing anchor, valid depth band and matching effect asset.
7. Towel props only appear on compatible authored anchors and never block a route.
8. A Technician target is an eligible technical asset with a valid work position.
9. An integrated module has its required base, module and foreground/occlusion layers, so it cannot visually cover a tree, rock, dune, wall or water edge by accident.

Validation catches structural errors. It does not replace visual review.

## 8. Visual QA

Each module is visually tested in:

- neutral base scene;
- only that module built;
- every directly adjacent compatible module built;
- day and evening;
- with guest route, Master route and technician route if relevant;
- with the effect at every supported intensity/variant;
- mobile portrait framing and high-density device rendering.

The scene-editor debug view shows field borders, collisions, route nodes, depth baselines, water masks and effect anchors. A screenshot review is required before a module is called final.

## 9. Production Sequence

1. Approve the scene grid, base layers and field polygons.
2. Add route graphs and depth/occlusion masks using placeholder art.
3. Add shared character/effect test sprites and validate routes.
4. Add neutral base art, then one module at a time with its real anchors.
5. Run automated validation and screenshot QA for isolated and adjacent combinations.
6. Only then produce visual variants, ambient extras and final polish.

## Guarantee Boundary

This process can reliably prevent geometry, route, depth and anchor mistakes. It cannot honestly guarantee that untested final art will look perfect. The safeguard is that every real asset is placed and reviewed in this exact scene-data system before it is accepted, so issues are caught when one module is cheap to correct rather than after an entire location is painted.
