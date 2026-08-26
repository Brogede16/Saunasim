# Sauna Sim Character Animation Contract v0.1

## Purpose

This is the complete action inventory for guests, Aufguss Masters, Service Hosts and Technicians. It is derived from the locked location, building and upgrade registers.

It defines reusable character actions and authored route/interaction anchors. A scene does not receive a bespoke animation merely because it has a different building; it selects the relevant shared action at its approved anchor.

## Rules

- A character only performs an action when the corresponding functional asset is built and operational.
- Every interaction has `approach -> activity -> exit/return`. Indoor use transitions at an entrance and is not rendered as an interior.
- Every land sprite has a common foot anchor. Water sprites use a common waterline. Tool overlays use fixed hand anchors.
- Guest and staff body variations share the same action timing and route system.
- Construction is a field effect with screen/material/steam and countdown, not a worker-character requirement. Technicians appear only for maintenance and repair.
- A static visual upgrade needs no character action if its visible result or persistent effect already fulfils the asset contract.

## 1. Shared Movement and Transition Library

| ID | Action | Used by | Required by |
| --- | --- | --- | --- |
| `walk-4dir` | Four-direction walk | All land characters | Every venue and route. |
| `idle-stand` | Short standing/looking loop | All characters | Arrival, queue, waiting and staff pauses. |
| `door-enter-exit` | Walk into/appear from doorway threshold | Guests, Masters, Hosts, Technicians | All building entry/exit and indoor facilities. |
| `queue-shift` | Small forward step/look loop | Guests | Reception, program and capacity queues. |
| `roof-lift-transition` | Enter/exit lift or stair threshold; no visible climbing across an unseen facade | Guests, Masters, Hosts, Technicians | Hotel Rooftop and any approved upper-deck/roof field. |
| `changing-pod-transition` | Enter canvas/pod, hidden apparel transition, exit | Guests | Water/shore/roof changing pods only. |

## 2. Guest Action Library

### Universal venue actions

| ID | Action | Asset/venue trigger |
| --- | --- |
| `arrival-read-sign` | Brief pause at sign/gate/window | Arrival sign, entrance court, pier, lift core. |
| `check-in` | Reception/shop-window handoff | Reception shop, service hatch or entry point. |
| `shop-browse-buy` | Short browse and handoff | Reception shop/service hatch only. |
| `refill-water` | Fill/drink pause | Water refill station only. |
| `indoor-sauna-transition` | Enter sauna building, later exit | All operational sauna rooms. |
| `bench-sit-stand` | Sit, towel/rest idle, stand | Terrace, deck, shelter, wind wall, fire circle and recovery seating. |
| `lounge-recline-rise` | Recline/lie, calm idle, rise | Beach lounge chairs and any explicit recliner field. |
| `fire-rest` | Seated fire-facing loop | Fire bowl/circle only. |
| `program-wait` | Queue/anticipation beside field or entrance | Scheduled Special Aufguss with real capacity pressure. |
| `outdoor-program-participate` | Assigned standing/seated heat-response loop | Outdoor Gus field only. |
| `program-exit-recover` | Exit/short warm reaction before chosen recovery route | Completed Special Aufguss. |

### Water and recovery actions

| ID | Action | Compatible assets |
| --- | --- | --- |
| `shower-rinse` | Step under water, brief rinse, exit | All outdoor shower/rain-shower rows. |
| `cold-plunge-enter-exit` | Step/ladder into small cold basin, short cold loop, exit | Cold plunge, roof plunge, compact basin. |
| `natural-water-entry` | Descend/step or jump at fixed safe point | Canal/harbour/lake/coast/beach/Water Plot eligible fields. |
| `water-idle-swim` | Bob or short bounded swim loop | Natural water, floating swim room and calm pool zone. |
| `ladder-return` | Fixed ladder ascent and return walk | Floating Sauna and any authored water ladder. |
| `warm-spa-enter-exit` | Step into basin, seated water loop, exit | Wild bath, sunken spa, rooftop spa and floating spa. |
| `spa-seated-idle` | Steam/bubble water idle | All warm-spa variants. |

Guests never freely roam open water. Every water action is bounded by the specific field's entry, activity and exit anchors.

## 3. Aufguss Master Action Library

| ID | Action | Notes |
| --- | --- | --- |
| `master-walk` / `master-idle` | Tool-ready movement/idle | Uses shared body base. |
| `master-field-arrive` | Enter the outdoor Gus field and take position | Required before every visible outdoor session. |
| `master-prepare` | Short bucket/towel setup loop | Shared preparation pose at the field anchor. |
| `master-towel-classic` | Classic towelwork delivery | Supports Classic Towelwork and Quiet Ritual. |
| `master-fan-heat` | Fan-assisted heat distribution | Supports Steady Heat, Rhythmic Pulses and High-Heat Finale. |
| `master-infusion` | Ladle/ice/herb infusion delivery | Supports aroma rounds and heat transitions. |
| `master-rain-pour` | Rain-ladle delivery with broad, controlled steam release | Supports Rain Pour; uses the approved rain-ladle overlay. |
| `master-vihta` | Fresh-bundle ritual pose | Supports Birch, Maple or Juniper Vihta where the guest-consent presentation is approved. |
| `master-rhythm` | Rhythmic towel/fan performance | Supports Rhythmic Flow. |
| `master-show` | Choreographed/story-led broad performance pose | Supports Choreographed Show and Story-led Performance. |
| `master-close` | Finish/acknowledge then leave field | Triggers guest exit/recovery routing. |

The actual equipped towel set, hand fan or infusion kit is a transparent overlay on these loops. Indoor sessions use the same simulation and effects but do not render the Master inside the building.

## 4. Service Host Action Library

| ID | Action | Asset/venue trigger |
| --- | --- | --- |
| `host-arrival-guide` | Brief welcoming/queue-guidance gesture | Entry/reception when a Host is scheduled. |
| `host-shop-handoff` | Visible sale/towel/product handoff | Reception shop or exterior service hatch. |
| `host-towel-collect` | Pick up/fold visible towel prop | Authored recovery/seating field only. |
| `host-seat-reset` | Short straighten/reset loop | Bench, lounge, fire or recovery field after use. |
| `host-water-service` | Refill/refreshment handoff | Water-service or eligible recovery field only. |

Hosts do not walk endlessly to fake activity. The simulation samples one useful visible task where it reflects actual entry, shop or guest-comfort work.

## 5. Technician Action Library

| ID | Action | Eligible target |
| --- | --- | --- |
| `tech-arrive` | Enters scene with tool bag, walks to assigned field | Any active repair. |
| `tech-inspect` | Brief inspection/check loop | Sauna heater/program equipment, shower, cold/warm recovery, shop equipment or water-system asset. |
| `tech-repair-ground` | Kneel/tool loop | Ground-level technical asset. |
| `tech-repair-wall` | Standing panel/pipe loop | Shower wall, shop equipment, water wall or service panel. |
| `tech-repair-roof` | Safe roof-field tool loop | Hotel Rooftop or authored roof upgrade only. |
| `tech-complete-leave` | Pack tools, restored-state cue, return route | All repaired assets. |

Technicians do not maintain planters, benches, facade paint, fire pits or decorative lights. A technician task has one assigned field and does not create a visible permanent repair queue.

## 6. Asset-to-Action Matrix

| Asset family | Guest actions | Master actions | Host actions | Technician actions |
| --- | --- | --- | --- | --- |
| Arrival sign/gate/lift core | `arrival-read-sign`, `door-enter-exit`, roof transition where needed | walk/door or roof transition | arrival guide | none |
| Reception shop/service hatch | check-in, shop-browse-buy | none | shop handoff | inspect/repair wall or equipment when eligible |
| Sauna room/extra sauna volume | indoor-sauna transition | indoor simulation only | none | inspect/ground repair heater/program equipment |
| Program Sauna | indoor-sauna transition, program wait/exit | indoor simulation only | optional queue guide | inspect/repair program equipment |
| Outdoor Gus field/stage | program wait, outdoor-program-participate, program-exit-recover | full outdoor sequence | optional queue guide | inspect/repair field equipment when eligible |
| Bench/terrace/deck/shelter/wind wall | bench-sit-stand | none | seat reset/towel collect | none |
| Lounge chairs | lounge-recline-rise | none | seat reset | none |
| Fire bowl/circle | fire-rest | none | seat reset | none |
| Shower row/pod/rain shower | shower-rinse | none | none | inspect/repair wall/pipe |
| Cold plunge/roof plunge | cold-plunge-enter-exit | none | none | inspect/ground/roof repair |
| Natural-water bridge/steps/descent | natural-water-entry, water-idle-swim, exit | optional recovery route after outdoor Gus | none | only infrastructure repair if the asset has an eligible technical condition rule |
| Floating Sauna deck/ladder | natural-water-entry, water-idle-swim, ladder-return | walk/door; outdoor Gus only if its field exists | none | inspect/repair deck-side equipment |
| Warm spa/wild bath | warm-spa-enter-exit, spa-seated-idle | optional recovery route | towel collect/seat reset nearby | inspect/ground/roof/pontoon repair |
| Changing tent/pod | changing-pod-transition | none | none | none |
| Water refill station | refill-water | none | water service where asset permits | none |
| Planting, facade, screens, lights | route/ambient only | none | none | none unless a separately approved technical asset exists |

## 7. Location-Specific Route Requirements

| Location | Additional required actions/transition | Why it is distinct |
| --- | --- | --- |
| Canal | Natural-water descent/entry/swim/return | Quay, bridge and canal descent are fixed fields. |
| Harbour | Eligible basin steps and bounded swim | Only calm approved basin variants permit bathing. |
| Industrial District | No natural-water action | Recovery is shower, cold/warm basin, seating and program yard. |
| Forest Lake | Shore/bridge entry, lake idle and return | Natural lake route through forest clearing. |
| Coast | Sheltered-cove entry only | No exposed open-sea swimming route. |
| Beach | Boardwalk/sand approach, calm-cove entry, lounge recline | Adds sand/deck and beach-chair actions. |
| Rural Plot | Meadow/garden route and fire/recovery use | No special water action unless the approved asset supplies it. |
| Water Plot | Gangway, floating deck jump/entry, bounded swim and ladder return | Floating Sauna's mandatory water loop. |
| Urban Lot | Owned-plot-only routing | No guest crosses surrounding city property. |
| Hotel Rooftop | Lift/stair transition and safe roof-pad routing | No visible unexplained roof climbing. |

## 8. Production Dependency Order

1. Lock tool silhouette catalogue and hand anchors: towel, fan, infusion kit.
2. Draw shared land movement, doorway and queue transitions for guest/staff bodies.
3. Draw water/recovery actions: shower, plunge, natural water, ladder and warm spa.
4. Draw guest seating, lounge, fire, shop and refill actions.
5. Draw Master outdoor preparation and tool-aware performance loops.
6. Draw Host actions and Technician repair loops using shared route/body standards.
7. Build effect sheets: steam, aroma accents, shower, splash, ripples, bubbles, fire and lights.
8. Produce location-specific route maps and only then attach actions to every approved field.

## First-Playable Minimum

Canal + Repair Workshop proves: walk, door transition, check-in/shop, indoor sauna transition, outdoor Gus with Master preparation/towel/fan/infusion, outdoor shower, compact cold plunge, seating, technician repair and canal-water effects. Natural canal-water entry is added only with its approved bridge/descent field.

## Production Gate

Before any location moves from neutral base art into asset production, its scene data must list every selected action ID, route anchor, effect anchor, depth layer and optional staff role. An asset without this mapping remains unproduced.
