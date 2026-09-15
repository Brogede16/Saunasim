# Sauna Empire Asset Specification

## Purpose

This is the technical contract for all production art used by the native game. The goal is that independently produced components can be combined without manual per-asset nudging.

This document consolidates the strongest existing repository rules, especially the pixel-art guide, character animation contracts and layered scene model.

## Global visual scale

- Perspective: top-down 3/4, not side-on and not isometric.
- Native world grid: **16 x 16 px tiles**.
- Base guest frame: **32 x 32 px**.
- Initial guest body height target: approximately **28 px** inside that frame.
- Pixel art: crisp integer pixels, no anti-aliasing, blur or gradients.
- Runtime scaling: nearest-neighbour only, uniform for the whole world.
- Retina/high-density displays do not change source art resolution.

No renderer may resize a person, bench or sauna independently merely to make a composition fit. Large objects must be authored as larger multi-tile assets at the same native scale.

## Coordinate system

All sprite and module metadata uses pixel coordinates in native asset space.

Recommended convention:

- origin `(0,0)` is top-left of the source frame/canvas;
- +X moves right;
- +Y moves down;
- anchor coordinates are integer pixel positions;
- scene metadata may convert these to SpriteKit coordinates at load time, but source metadata remains platform-neutral.

## Character anchor standard

Every land-character frame must expose the same `footAnchor` relative to its 32x32 frame.

Recommended canonical anchor for 32x32 frames:

```text
footAnchor = (16, 28)
```

This is the conceptual ground-contact point between the feet. If an approved current character contract uses a different exact coordinate, that existing reviewed value wins and this file must be updated. Agents must never silently create character-specific anchor exceptions.

Water/swimming frames use a fixed `waterlineAnchor` instead of the land foot anchor.

## Character layer stack

A modular character is assembled in a fixed 32x32 frame with identical frame count, action, direction and anchor across all layers.

Default draw order:

1. contact shadow (optional, separate effect layer)
2. body/base skin layer
3. towel/clothes layer
4. hair behind/body-dependent hair layer where needed
5. hair front layer
6. accessories
7. held equipment/props where action requires it
8. foreground effect, e.g. steam/splash, when appropriate

If hair needs front/back separation, both use the same frame/anchor contract. Do not enlarge the canvas for a hairstyle.

## Character variants

Preferred modular families:

```text
body/
hair/
towels/
clothes/
accessories/
props/
```

All variants for one rig must share:

- frame size;
- direction order;
- animation frame count per action;
- foot/water anchor;
- body proportion;
- action timing contract.

A hair/towel/accessory asset that only aligns after manual offset is rejected.

## Animation directions

The repository already explores 8-direction guests. The production contract should support:

- N
- NE
- E
- SE
- S
- SW
- W
- NW

Mirroring is allowed only if visually valid and explicitly declared in metadata. Do not assume every action can be mirrored.

## Animation actions

Minimum guest production set should be defined consistently across rigs. Likely actions:

- idle
- walk
- queue/stand
- sit/rest
- enter/exit sauna transition
- sauna seated
- shower
- cold plunge / water entry
- swim/water idle
- shop/service interaction
- changing transition

Gus Master/staff actions add role-specific animations such as performance, towel/fan use, service and repair.

Exact frame counts per action must be stored in metadata and standardized before mass production. Do not generate hundreds of variants until one full rig passes runtime QA.

## Naming convention

Use lower-case kebab-case with stable semantic names and version suffix.

Examples:

```text
assets/sprites/guests/body/guest-body-01-walk-s-v01.png
assets/sprites/guests/hair/guest-hair-03-walk-s-v01.png
assets/sprites/guests/towels/guest-towel-02-walk-s-v01.png
assets/sprites/staff/aufguss-master-01-performance-v01.png
assets/tiles/buildings/repair-workshop-base-v01.png
assets/tiles/upgrades/bathing-bridge-01-v01.png
assets/backgrounds/canal-01-day-v01.png
assets/effects/steam/chimney-steam-01-v01.png
assets/ui/icons/icon-finance-v01.png
```

Never overwrite an approved asset silently. Increment the version.

## Folder structure

Target platform-neutral source organization:

```text
Assets/
  Source/
    Characters/
      Bodies/
      Hair/
      Towels/
      Clothes/
      Accessories/
      Staff/
    Buildings/
    Facilities/
    Furniture/
    Environment/
    Maps/
    Effects/
    UI/
  Production/
    Sprites/
    Buildings/
    Facilities/
    Environment/
    Effects/
    UI/
  Metadata/
    Characters/
    Scenes/
    Modules/
    Atlases/
```

Xcode/SpriteKit atlases are generated/imported from production assets, not treated as the master source layout.

## Modular venue objects

Every buildable visual object has:

- stable `assetId`;
- native dimensions;
- footprint dimensions on 16px grid;
- `placementAnchor`;
- optional attachment anchors;
- route/activity anchors;
- effect anchors;
- draw layer/z-group;
- occlusion/mask metadata if needed;
- compatible parent/location tags;
- visual states such as construction, active, damaged, upgraded.

### Sauna module example

```text
base sauna
+ bench variant
+ stove variant
+ lighting layer
+ decoration layer
+ operational effects
```

The base asset defines named anchors, for example:

- `bench-main`
- `stove-main`
- `light-ceiling-a`
- `decor-wall-a`
- `door-entry`
- `steam-origin`

Child modules attach only to named anchors. Their source image anchor `(0,0)` or declared attachment point snaps exactly to the parent's named anchor.

No child may encode a one-off hardcoded scene coordinate.

### Character example

```text
body
+ hair
+ towel/clothes
+ accessories
+ held prop
```

Every layer uses the same frame rectangle and global body rig anchor.

## Buildings and facilities

Buildings are transparent-background modules, not whole scenes. Their scale must match the 16px grid.

They may expose:

- entrance anchors;
- expansion anchors;
- roof access anchors;
- facility/activity points;
- behind/in-front occlusion regions;
- effect anchors.

Building-specific upgrades attach to named building anchors. Location-specific upgrades attach to named location anchors.

## Furniture

Furniture uses the same world grid and declares:

- footprint;
- placement anchor;
- interaction points;
- facing/orientation options;
- collision/blocked footprint;
- layer group.

If furniture is purely decorative, declare it non-interactive explicitly.

## Environment and maps

The game should not use one giant painted map containing all progression states.

A location scene consists of:

1. environment/background base;
2. buildable/venue footprint;
3. chosen building base;
4. compatible upgrades/facilities;
5. shared props/furniture;
6. route/activity metadata;
7. ambient/gameplay effects;
8. characters.

Environment art must extend beyond the default camera framing enough to support zoom without exposing a hard edge.

## Map production

World/empire map is primarily a data/UI surface rather than a free-roaming pixel world.

Each location requires stable map metadata:

- location ID;
- world/region position;
- display label handled by UI, not baked into art;
- status/unlock state;
- optional icon/thumbnail asset.

Do not bake location names into generated map images.

## Route and activity metadata

Behavior does not live in pixels. Scene metadata must define:

- walkable patches/polygons;
- blocked patches;
- route nodes/anchors;
- activity points;
- entry/exit transitions;
- water entry/return;
- roof transitions;
- shop/service positions;
- seating positions;
- effect anchors.

SpriteKit reads this metadata to place/animate entities. The simulation decides the guest's logical activity; scene routing decides how that activity is visualized.

## Layer groups

Suggested global z-groups from back to front:

1. far environment
2. terrain/water base
3. ground decals
4. building rear/low structure
5. fixed props behind characters
6. characters/guests
7. foreground building/roof/occlusion layers
8. character-held foreground props
9. world effects
10. world-space labels/selection indicators
11. SwiftUI overlay/HUD

Within a group, Y-sorting may be used where appropriate, but fixed architecture/occlusion rules take precedence.

## Shadows

Characters may use a small standardized contact shadow. Buildings/furniture may have authored shadows that are part of their art or separate layers, but shadow direction and light assumptions must remain consistent.

Do not use dynamic soft/blurred shadows that break the pixel-art style unless a later rendering decision explicitly changes the art direction.

## Effects

Effects are transparent animated sprite sheets with explicit anchors and layer order.

Examples:

- chimney steam
- Aufguss steam
- shower water
- spa steam/bubbles
- water ripple
- entry splash
- door transition
- light flicker

Ambient loops should generally remain short, approximately 3-6 frames, and visually restrained.

## UI icons

UI icons are separate from world art. They must:

- be readable at iPhone sizes;
- avoid baked-in text;
- use stable semantic IDs;
- provide selected/disabled states through tint/state where possible instead of duplicate arbitrary art;
- follow one pixel-density/export standard chosen for SwiftUI.

## Asset metadata example

Platform-neutral conceptual schema:

```json
{
  "assetId": "guest-body-01-walk-s-v01",
  "frameSize": [32, 32],
  "frames": 6,
  "anchor": [16, 28],
  "direction": "S",
  "action": "walk",
  "layer": "body",
  "rig": "guest-rig-01"
}
```

Module schema:

```json
{
  "assetId": "repair-workshop-base-v01",
  "size": [192, 128],
  "grid": 16,
  "placementAnchor": [96, 112],
  "attachments": {
    "rear-extension": [96, 24],
    "deck-east": [176, 88]
  },
  "activities": {
    "entrance": [104, 104]
  },
  "effects": {
    "chimney-steam": [72, 24]
  }
}
```

Exact coordinates must come from approved production art, not this example.

## Production approval checklist

An asset is not production-ready until:

- correct perspective;
- correct native scale;
- true alpha where required;
- no anti-aliasing/blur;
- correct global anchor;
- correct modular attachment points;
- correct frame dimensions/order;
- metadata validated;
- tested in runtime at native scale and common zooms;
- compatible layers align without manual offsets;
- status recorded as approved.

## Rule for AI-generated graphics

Generated images are drafts until they pass the same technical checks as hand-authored assets. A visually attractive sprite that violates frame, anchor, transparency or scale rules is rejected rather than patched with runtime offsets.