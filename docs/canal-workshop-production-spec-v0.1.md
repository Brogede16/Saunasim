# Canal Workshop Production Spec v0.1

## Purpose

This is the build sheet for the first playable exterior scene. It converts the approved Canal layout into a fixed pixel-art map, stable placement fields and route data. It is a production decision, not a new player-facing design choice.

The scene is **Canal + Repair Workshop**, a compact first venue. The Canal Boathouse will use the same waterfront family later but gets its own parcel file and is not placed on this map.

## Fixed Scene Scale

| Item | Decision |
| --- | --- |
| Native tile | `16 x 16 px` |
| World size | `72 x 52 tiles` (`1152 x 832 px`) for final production, as declared in `src/content/spatialEnvelopes.ts`. The current `960 x 640` (`60 x 40`) primitive prototype is a temporary layout study; expanding it to the production world must be additive so no authored anchor moves. |
| Camera | Portrait-safe; default zoom frames the active venue, one step out shows street and canal context. |
| Perspective | 3/4 top-down, aligned to the shared pixel-art production guide. |
| Coordinate origin | Top-left tile is `0,0`. Every anchor uses tile coordinates. |
| Depth | World objects sort by their foot tile (`y`); effects declare whether they sit behind or in front of guests. |

The map must be built as layers, not a single exported illustration. The world dimensions and field rectangles are fixed once the Canal base is approved.

## Base Geography

| Zone | Tile area | Base state |
| --- | --- | --- |
| Street and arrival | `x: 0-10, y: 0-49` | Sidewalk, street edge, entry route, limited city ambience. No player-owned expansion. |
| Workshop parcel | `x: 11-42, y: 10-38` | Large brick workshop base, paved circulation and stable building-owned fields. |
| Promenade | `x: 43-57, y: 4-45` | Complete walkable stone route from street side to every future field. |
| Canal edge | `x: 58-61, y: 0-49` | Stone quay, railings and neutral expansion bays. |
| Canal water | `x: 62-79, y: 0-49` | Water, reflections and distant opposite-bank context. |
| Green/context edges | `x: 11-57, y: 0-9 and 39-49` | Trees, low planting, walls and quiet city context. Never blocks the main loop. |

## Building Base

`repair-workshop-base-v01.png` sits on approximately `x: 13-34, y: 14-33`. It is a large, detailed landmark building. Its final transparent crop and exact integer placement come from `assets/production/canal/repair-workshop-base-v01.md`.

Its visible base contains the original entrance, one loading port, one chimney, warm windows, a canal-side service wall and enough roof/yard structure that later fields look credible. The player starts with a basic operational sauna inside, but no visible shop, terrace, bath or event crowd.

### Permanent Building Fields

| ID | Field tiles | Neutral base state | Purchased module family |
| --- | --- | --- | --- |
| `ws-arrival` | `13-19, 28-34` | Existing entrance apron and blank sign mount | Arrival sign / renovated entrance |
| `ws-shop` | visible frontage at `workshop-shop-frontage` | Existing service hatch/port | Reception/shop frontage overlay |
| `ws-capacity` | `34-41, 21-31` | Side/rear service edge | Extra sauna volume |
| `ws-program` | `35-47, 8-18` | Separate paved side plot | Program sauna volume |
| `ws-glass` | visible side facade at `x: 28-34, y: 16-25` | Existing side wall | Glass door/facade section |
| `ws-dome` | `20-31, 34-40` | Retained rear courtyard slab | Glass-dome recovery field |
| `ws-gus-yard` | `43-52, 25-35` | Paved yard pocket with fixed boundary | Outdoor Aufguss field |
| `ws-port-rest` | `43-52, 18-24` | Original sheltered port edge | Open-port recovery field |
| `ws-shower` | `53-56, 25-31` | Service recess with drain | Copper rain shower |
| `ws-cold` | `53-58, 32-38` | Paved recessed corner | Compact cold plunge |
| `ws-warm` | `42-51, 36-44` | Retained courtyard slab | Workshop-courtyard wild bath |
| `ws-water-wall` | `43-48, 9-16` | Existing courtyard wall | Industrial water wall |
| `ws-greenery` | `11-13, 11-20` and `34-37, 12-17` | Narrow planting strips | Industrial greenery fields |
| `ws-light` | facade/chimney anchors | Standard exterior lamps/windows | Restored oven/chimney and evening identity |

All fields are independent. Shared boundaries are paving, wall or planted edging already present in the base scene. No field is a roof activity: the roof remains part of the permanent building silhouette, except for a deliberately authored facade/roof material overlay that does not host guests.

## Canal-Owned Fields

| ID | Field tiles | Neutral base state | Purchased module family |
| --- | --- | --- | --- |
| `canal-terrace` | `39-43, 10-18` | Stone quay pocket | Terrace, benches and planters |
| `canal-shower` | `40-43, 20-24` | Paved utility recess | Canal-side outdoor shower |
| `canal-bridge` | `43-51, 25-30` | Retained stone quay edge | Bathing bridge, descent, swim entry and return ladder |
| `canal-descent` | `43-48, 4-9` | Separate unused quay bay | Broad sitting steps and water entry |
| `canal-lights` | `43-47, 0-39` | Standard sparse street lamps | Low warm quay lights |
| `canal-plants` | `39-43, 0-8`, `39-43, 31-39` | Soil/stone edge | Grasses and planting beds |

The bridge and descent are complete, separate water routes. Neither can occupy the other or require it.

## Required Route Graph

### Base

```text
street-arrival -> workshop-entrance -> interior-transition -> workshop-exit -> street-departure
workshop-entrance -> promenade-loop -> every neutral field -> workshop-entrance
```

### Purchased Activities

```text
shop: entrance -> ws-shop -> entrance
Aufguss: interior-transition -> ws-program OR ws-gus-yard -> interior/return
shower: entrance/promenade -> ws-shower OR canal-shower -> return
cold plunge: promenade -> ws-cold -> return
canal bath: promenade -> canal-bridge OR canal-descent -> water-entry -> swim -> ladder/steps -> promenade
warm bath/recovery: promenade -> ws-warm OR ws-port-rest -> return
```

No guest needs to walk through an unpurchased facility to reach another activity.

## Anchor IDs

These names are the required entries in `canal-workshop-01.scene.json`. Exact pixel offsets inside each tile are chosen when the final art is placed, but the field ownership may not move.

| ID | Tile | Kind | Notes |
| --- | --- | --- | --- |
| `arrival-street` | `5,27` | route | Guest spawn and departure. |
| `workshop-door` | `14,27` | route/activity | Door enter/exit and owner start. |
| `workshop-chimney` | `23,13` | effect | `chimney-steam`, behind foreground roof pixels. |
| `shop-stop` | `15,18` | activity | One brief purchase position. |
| `program-door` | `23,11` | route | Indoor program transition. |
| `gus-master-yard` | `33,25` | activity | Outdoor Master performance position. |
| `gus-guest-yard-a` | `31,26` | activity | First outdoor program guest. |
| `gus-guest-yard-b` | `35,26` | activity | Second outdoor program guest. |
| `aufguss-steam-yard` | `33,23` | effect | Timed, layered behind people and in front of deck. |
| `shower-workshop` | `39,25` | activity/effect | Rinse position and falling water. |
| `cold-plunge-a` | `39,31` | activity | Step-in/idle/exit. |
| `cold-plunge-b` | `41,31` | activity | Step-in/idle/exit. |
| `canal-bridge-entry` | `48,27` | route | Water entry splash. |
| `canal-swim-a` | `51,27` | activity | Short water idle/swim loop. |
| `canal-swim-b` | `54,29` | activity | Short water idle/swim loop. |
| `canal-ladder-return` | `49,30` | route | Water exit. |
| `quay-seat-a` | `40,14` | activity | Terrace seated position. |
| `quay-seat-b` | `42,16` | activity | Terrace seated position. |
| `evening-light-01` | `43,12` | effect | Quay-light glow/reflection. |
| `evening-light-02` | `43,31` | effect | Quay-light glow/reflection. |

## Initial Art Deliverables

| Filename | Type | Pack 01 role |
| --- | --- | --- |
| `backgrounds/canal-01-base-day-v01.png` | base layers | Tileable/sectioned scene geography with neutral fields. |
| `buildings/repair-workshop-base-v01.png` | building | Initial operating workshop shell. |
| `modules/workshop-arrival-sign-v01.png` | module | First-playable purchase. |
| `modules/workshop-shop-port-v01.png` | module | First-playable purchase. |
| `modules/workshop-program-sauna-v01.png` | module | First-playable purchase. |
| `modules/workshop-yard-aufguss-v01.png` | module | First-playable purchase. |
| `modules/workshop-copper-shower-v01.png` | module | First-playable purchase. |
| `modules/workshop-cold-plunge-v01.png` | module | First-playable purchase. |
| `sprites/guests/guest-base-actions-v01.png` | sprite sheet | Walk, idle, sit, shower, plunge, water entry/exit. |
| `sprites/staff/aufguss-master-actions-v01.png` | sprite sheet | Walk, idle and first performance cycle. |
| `effects/core-venue-effects-v01.png` | sprite sheet | Steam, shower, ripple, splash, low lamp glow. |
| `ui/venue-management-kit-v01.png` | UI atlas | Header, build card, action icons and stat-card framing. |
| `scenes/canal-workshop-01.scene.json` | scene data | Patches, anchors, depth, camera and field IDs. |

## Review Order

1. Approve a cropped Canal base at native pixels and at phone scale.
2. Place the workshop base and verify the entrance/promenade loop.
3. Place the six first-playable modules individually; each must work alone.
4. Add the guest and effect sheets, then run a route-only scene test.
5. Add management UI only after the venue remains readable beneath it.

The next production action is to redraw the approved Workshop source as a native-scale, layered base using `assets/production/canal/repair-workshop-base-v01.md`, then align the final `.scene.json` anchors to its real door and frontage. The existing primitive `src/content/canalWorkshopScene.ts` is not the final coordinate authority and must not be used to shrink the building or place activities on its roof.
