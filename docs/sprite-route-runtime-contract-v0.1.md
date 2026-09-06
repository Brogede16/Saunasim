# Sprite and Route Runtime Contract v0.1

## Purpose

This contract prevents the exterior game from treating people as generic dots that slide across a background. It defines how a guest visibly walks to a skewed 3/4 building, enters it through the actual door, disappears inside credibly and later returns to the exterior route.

The current Canal animation is a **scale-only composition test**. It does not satisfy this contract and must not be used as the implementation model for final sprites.

## Direction Standard

All land movement uses eight visual bearings: `N`, `NE`, `E`, `SE`, `S`, `SW`, `W`, `NW`.

- A path segment selects the nearest bearing from its direction of travel; a character never moonwalks sideways along a diagonal route.
- Each land rig has four walk phases per bearing: contact, passing, contact, passing. This is `32` walk frames per shared body rig.
- Idle, turn, queue shift and doorway actions reuse the same eight bearing anchors where visible.
- Mirroring is allowed only for deliberately symmetrical body/towel bases. Hair, tools, towel knots, bags and other asymmetric layers need their own correct side frame.
- The foot anchor is identical in every land frame. Direction changes alter pixels above the feet, never the point touching the path.

Eight bearings are required because the venue is 3/4 and its authored paths often approach buildings, decks, stairs, bridges and showers diagonally. Four cardinal frames would make correctly routed people visibly face the wrong way.

## Building Entry Contract

Every building base declares these anchors:

| Anchor | Meaning |
| --- | --- |
| `arrival` | Map-edge spawn into the owned location. |
| `door-approach` | Last exterior foot position before the threshold. |
| `door-threshold` | Exact point where the body starts to pass behind the doorway. |
| `interior-transition` | Non-rendered logical stop after entry. |
| `door-exit` | Exterior foot position used for the reverse transition. |
| `shop-stop` | Visible exterior check-in/shop position, if present. |

The entry sequence is always `route -> door-approach -> enter-door animation -> hidden interior-transition`. Exit is the reverse. A guest never slides through an opaque wall or teleports from an arbitrary facade pixel.

## Building Art Layers

A usable building is not one flat PNG. It has at least:

1. Ground/contact shadow and base paving.
2. Rear building pixels, roof and side walls behind passing guests.
3. Foreground threshold pixels, front wall/columns, planters, stairs and awnings that hide part of guests.
4. Door states: closed, entering/open and exit as required.
5. Separate chimney steam, light and construction effects.

Depth sorting starts from each character's foot `y`, then applies authored foreground masks at doors, planters, bridge rails, pool edges and equivalent obstructions. A full building PNG can be a source reference, but cannot be the final interaction layer model.

## Route Data

Each venue scene contains an authored walk graph, not a straight line between arbitrary points:

- walkable and blocked patches;
- map-edge arrival/departure points;
- doorway, shop, sauna, shower, seating, water-entry and activity anchors;
- ordered bends between anchors, including routes around the selected building;
- activity-specific approach, activity and exit sequences;
- depth and occlusion rules at every crossing.

The simulation chooses an activity; the scene graph chooses the visible route. Building modules add only their own legal anchors and route edges. No route may cross an unbuilt facility.

## First Repair Workshop Slice

Before more buildings or guest variants are produced, Canal + Repair Workshop must prove:

1. One guest walks from the map edge to the visible Workshop door using the right bearing on each path segment.
2. The guest passes behind the door/threshold foreground and becomes hidden inside.
3. The guest exits through that same doorway and rejoins the exterior path.
4. A shop guest uses the visible entry/shop frontage without clipping into brickwork.
5. A guest reaches an exterior shower by the side path and switches to the dedicated shower animation at its anchor.
6. A guest reaches Outdoor Gus without walking through the Workshop or another unbuilt module.

Only after this works do we make body variants, hairstyles, staff rigs, other buildings or other scenes. The shared rig then scales across the game rather than encoding a Canal shortcut.

## Production Rule

Generated art can be source material, but every production sheet is normalised to the exact frame grid, anchors, layers and action inventory above before runtime use. The renderer does not guess a door, invent an occlusion mask or compensate for inconsistent generated feet.
