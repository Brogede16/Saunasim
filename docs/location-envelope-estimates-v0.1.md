# Sauna Sim Location Envelope Estimates v0.1

## Status

**Superseded as the authority by `src/content/spatialEnvelopes.ts`.** The world sizes, protected zones, arrival fields and reserved facility fields below are now declared in code and checked automatically: every location must keep at least the contracted 20% unclaimed buildable land after its largest legal building, its circulation band, its arrival field and every location-owned field at maximum state.

**Provisional geometry for placeholder validation.** These are not final painted map sizes. They establish enough room for one compatible building at its maximum envelope, all approved location-owned fields, their upgraded states and credible routes.

World sizes use the same `16 x 16 px` grid as the buildings. A larger world is desirable because the game is zoomable and pannable; the portrait camera shows a whole-venue framing and a closer activity framing rather than forcing all detail onto one phone screen. Every estimate below includes a deliberately unclaimed planning margin of roughly `20%` around the known fields.

## Space Budget Rules

1. A scene contains one base building only, using one legal placement profile.
2. Every compatible building profile is tested against its **fully expanded** envelope, not its starter state.
3. Location-owned fields reserve their maximum upgraded state from the start. A bridge reserves its widest steps and rail; a spa reserves its largest seat/screen state.
4. A route/circulation band of at least `2 tiles` is preserved where guests visibly move; water and roof safety strips are never consumed by building growth.
5. Decorative one-step upgrades use their own small edge/presentation strips and must not consume a future functional field.
6. If placeholder review exposes a genuine space conflict, enlarge the location world/placement zone first. Do not shrink an approved building, remove a future upgrade field or stack objects unrealistically merely to preserve an early map size.
7. The camera may zoom and pan across a larger location, but individual houses, pools, props and characters retain their locked native proportions. A large facility gets a larger multi-tile state, never a local renderer scale-down.

## Location Estimates

| Location | Provisional world | Largest building envelope it must host | Permanent/reserved location zones | Why this is sufficient before art |
| --- | ---: | --- | --- | --- |
| Canal | `72 x 52` (`1152 x 832 px`) | `22 x 16` Repair Workshop | Arrival/parcels, quay circulation, terrace `14 x 8`, shower `6 x 6`, bridge/wide-step/dip zone `12 x 14`, light/plant edge strips. | Canal hosts only Boathouse and Workshop; the water route stays independent of both profiles. |
| Harbour | `80 x 56` (`1280 x 896 px`) | `28 x 18` Warehouse | Arrival/quay parcel, terrace `14 x 8`, enclosed Gus `12 x 10`, bathing steps/dip/pontoon `16 x 16`, shower row `10 x 6`, fire/net/lounge pockets and edge strips. | Enough depth behind the quay for Warehouse without occupying calm-basin access. |
| Industrial District | `80 x 56` (`1280 x 896 px`) | `28 x 18` Warehouse | Gate/arrival, yard program/Gus `14 x 10`, shower row `10 x 6`, cold basin `12 x 8`, spa `14 x 10`, recovery canopy `14 x 8`, social port/fire and green-wall/light strips. | Industrial has the greatest set of non-water outdoor assets, all in separate yard fields. |
| Forest Lake | `80 x 64` (`1280 x 1024 px`) | `32 x 20` Kursted | Clearing/build zone, shore path, terrace `14 x 8`, bridge `12 x 14`, shower `6 x 6`, floating rest platform, Gus `12 x 10`, spa `14 x 10`, fire/shelter/view/path pockets. | Landmark building remains at clearing edge; lake access and forest features preserve their own route. |
| Coast | `80 x 64` (`1280 x 1024 px`) | `32 x 20` Kursted | Protected building terrace, cove steps `12 x 14`, outlook `14 x 8`, shower/changing `12 x 8`, Gus `12 x 10`, spa `14 x 10`, wind/niche/light/plant strips. | Large buildings stay back from the exposed edge; only the cove owns water access. |
| Beach | `80 x 64` (`1280 x 1024 px`) | `22 x 16` Pavilion/Container | Boardwalk and behind-dune building zone, deck `14 x 8`, bridge/cove `12 x 14`, shower/changing `12 x 8`, Gus `12 x 10`, spa `14 x 10`, sun/fire/lounge/refill/dune strips. | Compatible buildings are medium or smaller, leaving clear sand and cove activity space. |
| Rural Plot | `80 x 64` (`1280 x 1024 px`) | `32 x 20` Estate or Kursted | Gate/property yard, meadow terrace `14 x 8`, shower `10 x 6`, cold plunge `10 x 8`, Gus `12 x 10`, spa `14 x 10`, fire/recovery/orchard/windbreak/path zones. | Large rural bases use their compound zone; all cold recovery remains constructed. |
| Water Plot | `72 x 60` (`1152 x 960 px`) | `16 x 12` Floating Sauna | Fixed shore landing/gangway, floating building zone, recovery pontoon `10 x 8`, spa `12 x 10`, swim net `14 x 12`, changing/shower/deck/fire/Gus pontoons. | Only Floating Sauna is legal; spare water area is for safe bounded routes and modules. |
| Urban Lot | `72 x 52` (`1152 x 832 px`) | `22 x 16` Container Compound | Owned gate/loop, compact building zone, deck/canopy `12 x 8`, shower `6 x 6`, plunge `10 x 8`, Gus `12 x 10`, wild bath/fire/refill/window and boundary strips. | The bounded plot supports only tent/container families and never grows into static city backdrop. |
| Hotel Rooftop | `72 x 52` (`1152 x 832 px`) | `18 x 14` Rooftop Sauna | Fixed lift core/roof loop, building zone, skyline deck `12 x 8`, shower `8 x 6`, plunge `10 x 8`, spa `12 x 10`, Gus `12 x 10`, fire/refill/plant/light/wind-screen pads. | One building and fixed roof pads make safety, lift route and mobile framing controllable. |

## Location-Owned Upgrade Inventory

The zone column reserves all current approved location upgrades, including their later state. This is the readable cross-check of what must fit:

| Location | Facilities that need full maximum-space reservation |
| --- | --- |
| Canal | Terrace/loungers/heat bench; shower/twin rinse/cascade; bathing bridge/wide steps/dip rail; quay lights; planting. |
| Harbour | Terrace chain; Outdoor Gus Sauna/benches/ritual station; bathing steps/widened steps/dip zone/recovery pontoon; shower row; lanterns; planting; cargo-net loungers; fire bowl. |
| Industrial | Shower chain; cold basin chain; sunken spa chain; recovery canopy chain; Outdoor Gus Sauna chain; social port/tables/fire; greenery; event lights. |
| Forest Lake | Terrace chain; lake bridge chain; shower chain; floating rest platform/seats/hammocks; Outdoor Gus Sauna chain; spa chain; fire ring/store/rain hood; shelter; stone circle; view frame; ritual path. |
| Coast | Outlook chain; cove steps chain; shower chain; changing/wind shelter/pods/dry bench; Outdoor Gus Sauna chain; rock spa chain; cliff niche; lanterns/planting; rare matching-base spring route only. |
| Beach | Deck chain; cove bridge chain; shower chain; changing chain; sun zone/loungers/parasols; Outdoor Gus Sauna chain; recovery platform; spa chain; fire/niches/lights/planting/refill. |
| Rural | Meadow chain; shower chain; built plunge chain; Outdoor Gus Sauna chain; garden spa chain; fire chain; covered recovery chain; orchard benches/hammocks; windbreak/planting/ritual path. |
| Water Plot | Recovery pontoon chain; spa chain; swim-net chain; shore deck chain; changing cabin chain; gangway shower chain; fire pontoon chain; pontoon Outdoor Gus Sauna chain. |
| Urban | Social deck chain; canopy chain; shower chain; plunge chain; Outdoor Gus Sauna chain; wild-bath chain; fire chain; mural/greenery/lights/refill/sitting window. |
| Hotel Rooftop | Skyline deck chain; wind canopy chain; shower chain; plunge chain; spa chain; Outdoor Gus Sauna chain; fire chain; planted corners/roof lights/lift refill. |

## Next Step

Create a simple placeholder layout for each location at the stated world size. It must include every row above as a labelled colour box plus each compatible building's maximum envelope and every protected/integrated feature zone. If a box collision occurs, enlarge the location first; only move a profile when the alternative placement is equally credible. Only those validated boxes become final map and sprite coordinates.
