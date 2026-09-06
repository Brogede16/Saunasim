# Sauna Sim Visual Production Manifest v0.1

## Purpose

This is the production order for the approved exterior-only game. It turns the design library into small, reviewable art packs without forcing all locations, buildings and animations to be made before the game can be played.

It does not alter gameplay. The canonical list of compatible buildings and upgrades remains in `building-library-v0.1.md`, `venue-composition-v0.1.md` and `asset-registry-v0.1.md`.

## Production Principle

Build one complete, believable venue first: **Canal + Repair Workshop**. It must show a guest arriving, entering, using an outdoor facility, taking part in Aufguss, and leaving. Every later scene then reuses its technical conventions, sprite scale, effects and interaction data.

The first venue is deliberately a Canal Workshop rather than the entire Canal family. The Boathouse stays a compatible second building layer on the same canal base but does not block the first playable venue.

## Shared Ground Kit

Make and approve these before location-specific production. They are the visual contract for all later assets.

| Group | First production assets | Required result |
| --- | --- | --- |
| Palette and scale | Master palette, shade ramps, 1x gameplay scale board | Every artist/asset uses the same outline, light and material colours. |
| Terrain tiles | Paving, timber deck, gravel, grass, soil, water edge, canal water, simple railing | Seamless base surfaces, including corners and transitions. |
| Shared props | Bench, planter, lamp, sign frame, towel rail, waste bin, simple fence, small tree/shrub | Props fit the fixed guest scale and never contain text. |
| Activity modules | Outdoor shower, cold plunge, wild bath, recovery seating, low fire bowl | Each exposes the route and effect anchors defined in the pixel-art guide. |
| Effects | Chimney steam, Aufguss steam, shower water, shower cascade, water ripple, splash, spa bubbles, warm light | Small reusable transparent sheets, layered independently from buildings. Ambient loops use seamless 3-6 frame sheets; the cascade is a triggered splash sheet rather than a loop. |
| Guests | Eight-bearing walk, idle, door-enter/exit, sit, lounge-recline-rise, shower, cascade-rinse, plunge/water, wild-bath frames | One neutral base sheet with palette-swappable hair, skin, towel and swimwear shade groups. `lounge-recline-rise` is shared by all explicit recliner fields; `cascade-rinse` is a reusable pull-chain, bucket-tip splash and recovery-pose action for every compatible Cold Cascade Bucket. |
| Staff | Owner walk/idle, simple reception idle, Aufguss Master walk/idle/preparation/performance | Lock the towel, fan and infusion-tool overlay set before drawing Master performance frames. Outdoor sessions must show the scheduled Master walking to the field before performance begins. |
| UI | Venue header, full-width sauna-name field, bottom action bar, simple stat card, build card | Text is game-rendered; the art contains icons and panel framing only. |

### Shared-kit Acceptance Gate

Do not make the next large pack until one small scene proves all of the following at real phone size:

1. A moving guest reads clearly without zooming in.
2. Steam, water and light remain visible but do not cover the venue.
3. An asset can be placed on its field without repainting the background.
4. The UI leaves the player most of the screen for the venue and shows a full sauna name.

## Pack 01: Canal Workshop Vertical Slice

### What it demonstrates

- A city-adjacent Canal location with direct, constrained water access.
- A permanent converted building, not an interior cutaway.
- Independent outdoor fields which may be bought in any order.
- One working paid Aufguss program and visible guest movement.
- A compact mobile management surface.

### Scene layers

| Layer | Assets in Pack 01 | Notes |
| --- | --- | --- |
| Canal base | Street edge, paved workshop parcel, promenade, canal wall, water, starting railings/stairs, neutral field surfaces | The base must already look finished before a single upgrade is purchased. |
| Workshop building | Repair Workshop base, entrance/loading port, chimney, roof, door, windows | Has fixed anchors for its own future building modules, even if those modules are not drawn yet. |
| First upgrades | Arrival sign, reception/shop port, extra sauna volume, program sauna, workshop-yard Outdoor Gus Sauna, rain shower, compact cold plunge, open-port recovery field, industrial greenery, warm wild bath, low lighting | These give a full revenue/recovery/program loop and visibly occupy separate fields. |
| Location upgrades | Canal terrace, Outdoor Shower, bathing bridge, quay lights, planting bays | Location-owned fields never alter the workshop itself. |
| Guests and effects | Guest route set, owner, Aufguss Master, chimney steam, program steam, shower, canal splash/ripple, evening lights | The route must connect entrance, sauna, shop, program, shower, water and exit as relevant to purchases. |

### Exact first playable scope

The first playable build only needs these six purchasable objects working in simulation and art:

1. Repair Workshop renovation/arrival sign.
2. Reception/shop port.
3. Program sauna.
4. Workshop-yard Aufguss space.
5. Outdoor rain shower.
6. Compact cold plunge.

The remaining Pack 01 objects are produced as placement-ready assets, but can be enabled in later prototype passes. This prevents the first build from becoming an art-only project while still locking their field boundaries.

### Required scene data

`canal-workshop-01.scene.json` must record:

- walkable and blocked patches
- entrance, exit, shop, sauna, Aufguss, shower, plunge, seating and canal anchors
- effect anchors for chimney, shower, Aufguss, canal ripple and lights
- draw order for people behind/in front of modules
- safe camera bounds and default phone framing

## Pack 02: Reusable Building Families

Once Pack 01 is visually and technically sound, produce building bases before their long-tail upgrades. Each base includes an entrance, one chimney/effect point, its fixed expansion anchors and a minimal location-compatible ground edge.

| Batch | Building bases |
| --- | --- |
| Waterfront | Boathouse, Warehouse, Fiskehus, Floating Sauna |
| Flexible starters | Saunatelt Camp, Container Compound, Small Timber Cabin |
| Destination venues | Pavilion, Estate/Landsted, Kursted/Refugium |
| Industrial and special | Small Depot, Rooftop Sauna |

Each building then receives its approved exterior modules in small batches: capacity/program first, recovery and water second, presentation/arrival third. No module is made until its parent base and fixed field are approved.

## Pack 03: Location Bases

Location bases are produced in this order because each adds one new visual/routing problem while retaining the shared kit.

| Order | Location base | New problem it proves |
| --- | --- | --- |
| 1 | Canal | Quay, promenade and constrained canal water entry. |
| 2 | Industrial District | Large non-water yard and building-scale variety. |
| 3 | Forest Lake | Natural shore, bridge and quiet destination atmosphere. |
| 4 | Harbour | Quay geometry and eligible bathing basin. |
| 5 | Beach | Dunes, boardwalk and calm-cove access. |
| 6 | Coast | Wind protection, exposed scenery and sheltered-cove water logic. |
| 7 | Rural Plot | Large open field and compound footprints. |
| 8 | Water Plot | Pontoon network, swim zone and direct deck jump/ladder return. |
| 9 | Urban Lot | Bounded city plot without pretending the player owns surrounding buildings. |
| 10 | Hotel Rooftop | Roof routes, rails and visible vertical transition. |

Each base must reserve all approved fields from day one. It only needs its neutral-state art until its location upgrade pack starts.

## Pack 04: Animation Library

Animation comes after the shared guest scale and first venue route work have been proven. It is deliberately modular: one action is reused across compatible locations rather than animated separately for every building.

`character-animation-contract-v0.1.md` is the canonical full action inventory. This manifest controls delivery order only.

`scene-composition-and-render-contract-v0.1.md` is required before any real module art is accepted: it supplies the field coordinates, route nodes, depth bands, water masks and effect anchors that keep characters and effects correctly layered.

| Priority | Animation | Shared use |
| --- | --- | --- |
| A | Walk, idle, enter/exit, sit | Every venue. |
| A | Shower, plunge, water entry/exit, swim/float | Shower, cold and natural-water facilities. |
| A | Steam, water, bubbles, light, fire and location-appropriate water movement | All effect anchors. Ambient water/reflection loops use 3-6 frames; activity effects remain separate. |
| B | Master preparation, towel/fan/infusion performance, guest heat/recovery reactions | Program Sauna and enclosed Outdoor Gus Saunas. Lock/test tool overlays first, then draw the tool-ready body base and performance variants. |
| B | Roof/loft ascent transition | Rooftop, loft and upper-deck assets. |
| C | Weather and world ambience: snow, rain, wind, birds, road traffic | Later seasonal/world pass; not required for the first playable build. |

For Aufguss, variation comes mainly from the effect and program layer: steam density, subtle scent colour, light level, rhythm and Master performance pose. It should not require an entirely new building animation for every program.

## Folder and Naming Contract

```text
assets/
  backgrounds/canal-01-base-day-v01.png
  buildings/repair-workshop-base-v01.png
  modules/workshop-yard-aufguss-v01.png
  modules/canal-bathing-bridge-v01.png
  props/shared-planter-01-v01.png
  sprites/guests/guest-base-walk-v01.png
  sprites/staff/aufguss-master-performance-v01.png
  effects/aufguss-steam-01-v01.png
  scenes/canal-workshop-01.scene.json
  ui/venue-header-frame-v01.png
```

All filenames are lower-case kebab-case. An approved asset is never overwritten: a changed image receives the next final version number and the scene file is updated in the same change.

## Review Rhythm

1. Approve one visual scale board and one guest sheet.
2. Approve the Canal base without a building.
3. Approve the Repair Workshop base on the Canal scene.
4. Add the six first-playable objects one at a time and verify routes at phone size.
5. Only then make Pack 02 and Pack 03 in parallel-sized batches.

This is the intended handoff point between design and implementation: art production can proceed systematically, while code begins with a real scene rather than placeholder rectangles.
