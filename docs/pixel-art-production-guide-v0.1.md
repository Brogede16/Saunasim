# Sauna Sim Pixel Art Production Guide v0.1

## Purpose

This document is the single style source for generated and hand-finished game art. Use the locked base prompt for every asset. Only the asset-specific brief may change.

The target is a readable, original 16-bit top-down sauna management game: warm, tactile and lively, with the approved guest-test level of character detail. It is not fantasy, painterly concept art, a realistic illustration or a copy of another game.

## Locked Visual Rules

- Perspective: top-down 3/4 handheld-RPG perspective, never side-on or isometric.
- Pixel treatment: deliberate pixel clusters, crisp 1px dark outline, limited shading ramps, no blur, no anti-aliasing and no gradients.
- Screen density: assets are authored at the fixed native game scale and enlarged with nearest-neighbour sampling. Retina/high-density displays do not require higher-detail replacement sprites or anti-aliased art; device-specific canvas tuning is a renderer QA concern, not a second art pipeline.
- Readability: clear silhouettes and broad colour areas at normal gameplay size; detail should support, not obscure, the shape.
- Character scale: all land-character frames share one fixed foot anchor; all water frames share one fixed waterline.
- World-scale lock: the first guest base is `28 px` tall inside a `32 x 32 px` frame and every world asset is authored against the same native `16 x 16 px` tile grid. A bench, pool, bridge and building may never be individually scaled smaller or larger in the renderer to make it fit a scene. A larger facility is a separately drawn multi-tile state/variant at the same character scale.
- Scene scale: each venue is a larger exterior location with a controlled, mobile-friendly zoom range. Buildings, props and guests are composed in layers; the default view frames the whole active venue and its current upgrades.
- Camera scale: zoom scales the **entire world** uniformly with nearest-neighbour sampling. It changes what the player can see, never the proportion of a person relative to a pool, bench or building.
- Scene construction: build a reusable, larger environment base first, with the venue footprint and fixed upgrade anchors left clear. Place the selected building and its compatible modules on top; do not paint every site as one indivisible illustration.
- Materials: natural timber, brick, painted metal, glass, stone, water and soft vegetation. Use restrained texture.
- Light: daylight, evening and night are palette/light layers on the same art, not separate illustrations.
- Ambient motion: every location gets a small number of quiet 3-6-frame loops tied to authored effect anchors. Water uses ripples, wavelets or reflections appropriate to the location; vegetation, smoke, steam and selected world details may move subtly. These loops must make the scene feel alive without competing with guests, Aufguss or interface feedback.
- Text: no generated text, signage lettering or watermark. In-game text is rendered separately by the game.
- Interface tone: cool off-white or light-stone surfaces with blue-grey borders. Use warmth for the venue, active states and small highlights, never as a yellow parchment or sepia overlay.
- Ownership: create original art. References may guide mood, proportion or category only; do not imitate a named game, artist or third-party asset pack.

## Palette Direction

- Outline: very dark warm navy/brown, never pure black unless a tiny high-contrast detail requires it.
- Sauna warmth: cedar, rust, muted terracotta, amber window light.
- Water: clear medium blue with light cyan highlights and controlled white sparkle.
- Nature: soft pine, sage and moss greens; avoid neon green.
- Guest apparel: restrained teal, ochre, coral, navy and muted cream.
- Snow and winter water: cool blue-grey with warm steam and window light for contrast.

Exact palette values are chosen once the first playable scene is built. New assets must use those values or documented shade ramps.

## Master Prompt

Use this paragraph unchanged in all asset-generation prompts:

```text
Style/medium: original 16-bit pixel art for a top-down sauna management game. Classic handheld-RPG clarity in a 3/4 top-down view; warm Nordic bathhouse atmosphere; readable silhouettes, broad colour areas, controlled texture, crisp deliberate pixel clusters and a 1px dark warm-navy/brown outline. Use a limited cohesive palette with cedar, muted terracotta, teal-blue water, soft sage/pine greens, amber light and restrained cream highlights. Preserve a fixed gameplay-scale proportion and anchor. No blur, gradients, anti-aliasing, painterly rendering, fantasy motifs, text, labels, UI or watermark. Create original art; do not copy or imitate a named game, artist or asset pack.
```

## Asset Prompt Templates

### Character Sprite Sheet

```text
Use case: stylized-concept
Asset type: production sprite sheet
Primary request: [CHARACTER TYPE, OUTFIT AND ACTIONS]
Scene/backdrop: genuinely transparent background only.
Composition: [GRID SIZE] equal cells with clear transparent spacing. Fixed foot anchor for every land frame and fixed waterline for every water frame.
Constraints: consistent body proportions, same silhouette and palette across frames; no scenery, floor, shadows outside the character's small optional contact shadow, text or watermark.
[MASTER PROMPT]
```

### Building or Upgrade Module

```text
Use case: stylized-concept
Asset type: exterior venue module for a layered top-down game scene
Primary request: [BUILDING OR UPGRADE], designed to attach at the specified fixed scene anchor: [ANCHOR].
Scene/backdrop: transparent background only; no full environment.
Composition: clear top-down 3/4 exterior silhouette; show only the module and its necessary attached ground edge.
Constraints: no people, text, UI, watermark, interior cutaway or arbitrary alternate placement. Match the documented module footprint and palette.
Scale: draw at the locked native tile scale. Do not shrink the module to fit a smaller imagined scene and do not draw oversized people as a scale reference; final placement is handled by the documented envelope and camera system.
[MASTER PROMPT]
```

### Luxury Tipi / Tent Module

```text
Use case: stylized-concept
Asset type: exterior venue module for a layered top-down game scene
Primary request: premium Nordic glamping sauna tipi with warm canvas, timber poles, compact stove/chimney and restrained potted greenery; [SPECIFIC MODULE].
Scene/backdrop: transparent background only; no full environment.
Constraints: credible small-scale sauna structure, no festival styling, no people, text, UI, watermark or interior cutaway. Match the documented module footprint and palette.
[MASTER PROMPT]
```

### Environment Backdrop

```text
Use case: stylized-concept
Asset type: fixed exterior venue backdrop for a layered top-down game scene
Primary request: [ENVIRONMENT FAMILY AND SITE DETAILS]. Leave the documented venue footprint clear: [FOOTPRINT].
Composition: one fixed 16:9 top-down scene with foreground, venue zone and background context; no building in the reserved venue footprint.
Constraints: no people, text, UI, watermark, interior cutaway or perspective change. Include only props compatible with the environment tags: [TAGS].
[MASTER PROMPT]
```

**Zoom and multi-building requirements (apply to every environment backdrop, not only Canal):**

- The location supports a camera zoom range, not a single fixed framing (see `venue-composition-v0.1.md`, `canal-workshop-reference-venue-v0.1.md`). The backdrop must therefore extend visibly beyond the venue's own working area on every side, with believable surrounding context (street, further canal/shore, neighbouring plots), so zooming out never reveals a hard edge or empty canvas.
- The reserved venue footprint must stay a generic, unshaped clear pad, not a silhouette pre-fitted to one specific building. The same footprint has to accept every building base approved for that location family (see `building-library-v0.1.md`), so it must not include partial walls, a matching roofline notch or any other detail that only suits one candidate building.
- Both of the rejected Canal drafts in `assets/source/backgrounds/README.md` failed on exactly this: their pixel density/scale did not match the locked 16 px tile grid, and their footprints were closer to a single fitted illustration than an open, reusable buildable pad. Check both before treating a new draft as ready to promote.

## Production Method

1. Make a small concept test and approve its visual direction.
2. Create the master asset with a stable filename and documented dimensions.
3. Verify the exported file is a true alpha PNG before any other review: open it and confirm the transparent area is real alpha, not a baked-in checkerboard or solid background rendered as opaque RGB. `repair-workshop-base-draft-v01.png` was rejected for exactly this and the mistake is easy to miss at a glance (see `assets/source/buildings/README.md`). A quick command-line check also catches it: `python3 -c "from PIL import Image; im = Image.open('FILE.png'); print(im.mode, im.getchannel('A').getextrema() if 'A' in im.getbands() else 'NO ALPHA CHANNEL')"` — an alpha extrema of `(255, 255)` means nothing is actually transparent.
4. Inspect it at native size and gameplay scale for silhouette, anchors, palette and transparency.
5. Produce one action or module set at a time; do not batch unrelated asset types before the first is approved.
6. Place accepted PNG sheets in `assets/sprites/` or `assets/tiles/`, with matching frame metadata and an entry in the asset inventory.
7. Treat generated output as a draft when frames do not align. Correct or redraw individual pixels before calling it production-ready.

## Layered Venue Kit

Each venue is assembled from four compatible asset groups:

1. **Environment base:** water, terrain, paving, vegetation, street edge and atmosphere. It establishes the location family and leaves a natural-looking clear footprint.
2. **Building base:** the selected house, workshop, boathouse, container cluster or tent start. It carries its own entrance, roofline and any building-specific expansion anchors.
3. **Upgrade modules:** visible additions attached at authored anchors. A glass wing, roof plunge or rear extension is building-specific; a canal bridge is location-specific.
4. **Shared outdoor kit:** benches, planters, small terrace elements, lights, shop details, guests and effects. These are reused where their environment tags permit them.

This gives us variety without requiring every venue to have entirely unique outdoor art. The base and building determine the identity; shared modules supply efficient progression. Every composed scene must still look intentionally planned, not like loose furniture was dropped on a map.

## Interaction Patches and Activity Points

Every final location image is accompanied by a small non-visual scene-data file. It records named patches on top of the art rather than baking behaviour into pixels:

- **walk patches:** where guests may walk
- **blocked patches:** walls, water edges, vegetation and other impassable art
- **route anchors:** entrance, exit, terrace, shop, shower, bridge, water entry and return points
- **activity points:** exact standing/sitting/swimming positions and direction
- **effect anchors:** chimney steam, shower water, water ripple, door, lighting and other loop positions

When the simulation decides a guest wants cold water, it selects the venue's compatible water route. The guest follows the authored walk patches to the shower or bridge, switches to the relevant activity animation at its anchor, then returns through the same graph. Water tiles retain their own ripple, reflection and entry-splash effects, so the action is visible in the world. The same system drives shop stops, seating, outdoor Aufguss and all later visible facilities.

Roof facilities require the same explicit treatment. Each compatible building art set provides either a visible exterior stair or a roof-access doorway/hatch. Guests use a short ascending/descending transition at that anchor, then appear at the corresponding roof walk patch. The game never teleports a guest directly from ground level to a visible roof activity.

Outdoor changing pods use a shared activity loop: approach, enter behind a canvas/door threshold, short hidden transition, then exit in the correct apparel state and continue on the route. Slatted-screen and changing-pod art provide any needed seating and entry anchors.

Warm outdoor spa uses a shared activity library: approach, step into basin, seated water loop, stand/exit and return. Each spa art module exposes 2-4 seated anchor positions. Steam, bubbles, surface movement and entry/exit splash are separate reusable effects, allowing wild baths, sunken pools, roof pools and floating pools to use the same character frames.

The graphical image remains clean and reusable. The patch data is versioned with it and must be reviewed whenever a building or location module changes the usable scene.

### Effect Anchor Contract

Every approved module declares exact anchor coordinates for its visible effects, with a layer order and optional scale/intensity variants. Typical IDs include `chimney-steam`, `aufguss-steam`, `outdoor-shower-water`, `spa-steam`, `water-ripple` and `door-open`. The renderer reads these anchors and places transparent animated effect sheets at the correct point behind or in front of guests and structures. A future effect pass therefore needs no manual guessing or image editing.

### Ambient Animation Budget

Ambient loops are authored as short, seamless `3-6` frame sheets. They are shared where possible and rendered at a restrained cadence, rather than all running at maximum speed.

| Environment | Required low-cost loop | Optional sparse loop |
| --- | --- | --- |
| Canal, Harbour, Water Plot | Water wavelets/reflection shift against the fixed edge | Duck/boat wake only where the base scene supports it |
| Forest Lake, Coast, Beach | Surface ripple or small shore wave | Reed, grass or dune-grass sway |
| Industrial, Urban Lot | Chimney steam and warm window/light flicker | Small distant road movement on an authored street only |
| Rural Plot | Grass/leaf movement and chimney steam | Sparse bird pass or hanging-towel movement |
| Hotel Rooftop | Wind-sensitive plant movement and light flicker | Very small distant city movement only |

Water entry, shower, spa and Aufguss effects remain gameplay feedback rather than ambience. They have their own frames and appear only when an activity occurs.

### Construction State

An upgrade under construction temporarily replaces only its own fixed field. Use a shared visual language of a compact work screen or material stack, restrained steam/dust and one subtle `3-6` frame activity loop. A player who taps the field sees the remaining real-time countdown in the game UI; the art itself never contains generated text. Construction completes while offline and reveals the finished module automatically, without a claim action.

## Interface Art

Use icon-first HUD and management panels. The artwork itself contains no lettering: labels, values and venue names are rendered by the game so they stay readable, localisable and change with the player's data. The preferred reference is the cool-grey framed panel with simple status bars, a venue card at left and compact action icons. The venue card or panel header must reserve enough width for the player's full sauna name; never silently truncate a name in the primary view. The playfield remains dominant.

## Naming Convention

```text
assets/sprites/guests/guest-base-01-walk-v01.png
assets/sprites/guests/guest-base-01-water-v01.png
assets/sprites/guests/guest-base-01-shower-v01.png
assets/sprites/staff/aufguss-master-01-performance-v01.png
assets/tiles/buildings/warehouse-base-01-v01.png
assets/tiles/upgrades/bathing-bridge-01-v01.png
assets/backgrounds/harbour-canal-01-day-v01.png
```

Use lower-case kebab-case. Increment the final version only when a new image supersedes a reviewed asset. Do not overwrite an approved sheet silently.
