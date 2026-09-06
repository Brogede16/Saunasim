# Sauna Sim Asset Production Overview v0.1

## What This Is

This is the readable production map for the game's art. It separates static art from animation, so we can build venues and mechanics now while character production is paused.

The exact file-by-file source list is generated in [asset-production-checklist-generated.md](asset-production-checklist-generated.md). The composition and technical rules are in [sprite-production-master-manifest-v0.1.md](sprite-production-master-manifest-v0.1.md).

## Current Decision

- Continue: locations, buildings, upgrades, paths, menus, game systems and static/environment art.
- Paused: final guests, Masters, Hosts and Technicians.
- Temporary placeholder: `guest-placeholder-8dir-v01.gif` is usable only for prototype testing. Its licence must be confirmed before release.
- Rejected: the earlier generated walk strips. They are not a final animation source.

## Scope At A Glance

| Group | Planned source sheets/layers | Needs animation? | What it covers |
| --- | ---: | --- | --- |
| Characters | 43 | Yes | Guests, Aufguss Masters, Service Hosts, Technicians, tools and activity states. |
| Effects | 9 | Yes | Water, steam, showers, fire/light, foliage, construction and repair. |
| Buildings | 328 | No, except attached effects | 13 building bases plus visible upgrade layers and replacement patches. |
| Locations | 223 | Mostly no | 10 zoomable location bases, terrain patches and location-owned facility states. |
| Interface | 6 | No | Reusable frames, navigation, category, ingredient, tier and status icon atlases. |
| **Total** | **609** | Mixed | Full planned production inventory. |

## Static Art

These can be produced and integrated before any final character art exists.

### 1. Location Bases: 10

- Canal
- Harbour
- Industrial District
- Forest Lake
- Coast
- Beach
- Rural Plot
- Water Plot
- Urban Lot
- Hotel Rooftop

Each needs a large zoomable ground base, protected scenery, arrival edge, buildable fields, route/blocked patches and foreground masks. Water, foliage, lights and weather are separate overlays, not baked into the base.

### 2. Building Bases: 13

- Saunatelt Camp
- Container Compound
- Small Timber Cabin
- Pavilion
- Country Estate with Barn
- Boathouse
- Repair Workshop
- Small Depot
- Warehouse
- Fiskehus
- Floating Sauna
- Rooftop Sauna
- Former Kursted / Badesanatorium

Each building is one transparent base with a fixed entrance/shop door. It does **not** need a separate image for every upgrade combination.

### 3. Building Upgrade Layers: 328

These are static replacement patches or field modules, normally with three visible states: purchase, upgrade one and upgrade two.

- Shop/arrival frontage
- Extra sauna volumes and program-sauna conversions
- Facade, glass, roof, chimney and attached recovery wings
- Building-specific sauna, storage, deck, hatch, stair and service modules
- Shared outdoor facilities placed around the building: shower, cold plunge, warm spa, Outdoor Gus Sauna, terrace, fire/recovery and water route

The rule is: upgrades in the same family replace one another; different families are separate transparent layers. This prevents us from drawing hundreds of complete combined houses.

### 4. Location-Owned Fields: 223

These are static facility states that belong to the terrain rather than a house, for example:

- Quay, lake, cove and beach entry structures
- Decks, loungers, railings and wind screens
- Planting, lighting and fire areas
- Fixed water access, bridges, pontoons and ladders
- Location-specific spas, platforms, shelters and recovery areas

## Animated Art

All animation is a separate sheet or overlay. Nothing requires hand-redrawing an entire location or building for every frame.

### 1. Characters: 43 sheets, currently paused

| Family | Animation work required |
| --- | --- |
| Shared movement | Walk and idle across eight bearings (five drawn, three mirrored), door entry/exit and queue shift. |
| Guest actions | Check-in, browse/shop, refill water, sit, recline, shower, plunge, water idle/swim, ladder return, spa entry and spa seated. |
| Outdoor Gus guests | Wait, participate, exit and recover. |
| Aufguss Master | Arrive, prepare, 
towel work, fan, infusion, rain pour, vihta, rhythm, show and close. |
| Service Host | Guide, shop handoff, towel collect, seat reset and water service. |
| Technician | Arrive, inspect, ground/wall/roof repair and leave. |
| Tool overlays | Towel, fan, ladle, ice/herb kit, rain ladle and vihta: separate from the body. |

The final walk standard is eight frames per direction with a shared foot baseline. The temporary GIF does not replace this requirement.

### 2. Effects: 9 sheets

| Effect | Typical frames | Trigger |
| --- | ---: | --- |
| Water calm/wave | 3-6 | All eligible water and shore scenes. |
| Water entry/splash | 4-8 | Plunge, swim and water-route entry. |
| Steam | 3-6 | Chimneys, outdoor facilities and Gus sessions. |
| Shower/cascade | 3-6 | Shower and bucket/cascade upgrades. |
| Spa bubbles/steam | 3-6 | Wild baths and warm spas. |
| Fire/light | 3-6 | Fire bowls, lamps and evening windows. |
| Foliage/wind | 3-6 | Trees, reeds, dune grass and planting. |
| Construction | 4-8 | Only over the field being built. |
| Repair | 4-8 | Only over the facility being repaired. |

### 3. Building Animation: only selected overlays

Buildings stay static. Their life comes from separate effects at defined anchors:

- Chimney steam
- Warm windows and entrance light
- Doors/hatches when an entry is used
- Program steam during a Gus
- Water, shower and spa effects at exterior facilities
- Construction/repair overlay while work is active

## No Sprite Needed, But Data Is Required

These are essential for the game to look believable, but they are not standalone art files:

- Guest arrival, door, activity and return anchors
- Walkable, blocked and occlusion patches
- Foreground masks for guests passing behind buildings or in front of benches
- Waterline and ladder anchors
- Effect anchors for steam, bubbles, water and lights
- Building and field placement profiles

## Production Order

1. Finish the current simulation and location/building integration with placeholders.
2. Produce one full static vertical slice: Canal + Repair Workshop + its visible exterior upgrades.
3. Add environmental effects to that slice: water, chimney steam, shower and construction.
4. Return to characters only when a reliable animation source is chosen and one walk cycle is approved.
5. Apply the same layer system across the remaining locations and buildings.
6. Run the systematic asset, route, capacity and balance validation pass.

## Practical Rule

Do not make all 609 assets now. Each new art family must first prove it can coexist with routes, anchors, effects, depth ordering and phone-scale readability in one real playable scene.
