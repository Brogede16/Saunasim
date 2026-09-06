# Sauna Sim Building Envelope Estimates v0.1

## Status

**Superseded as the authority by `src/content/spatialEnvelopes.ts`.** That file now holds the numbers; this document keeps the reasoning behind them, and a validated test suite fails if the two diverge in a way that matters.

One definition changed while reconciling this table with the Repair Workshop asset card. A building now declares a `footprint` (ground rectangle in tiles - the only thing that decides placement, collision and routes) and a separate `silhouetteHeight` (how tall the drawn 3/4 sprite is, i.e. ground depth plus roof and upper mass). The card's `21 x 19` and this table's `22 x 16` were never in conflict: they are the silhouette and the footprint of the same building.

**Provisional geometry for placeholder validation.** These are deliberately not final sprite dimensions. They are the maximum native-grid budget for a building base after all of its building-owned modules are installed.

The native production grid is `16 x 16 px` per tile. A rectangle such as `22 x 16` therefore means a maximum `352 x 256 px` construction envelope at 1x. Final art may use less space or have an irregular silhouette inside it.

These envelopes are **not scale factors**. A guest remains the same native size beside every building and facility. If an upgraded plunge, spa or sauna needs more room, it receives a wider/taller multi-tile art state at the same pixel density; it is never shrunk to fit the current location.

Adjustment rule: after the first real sprite composition, we may alter a side by up to `2 tiles` without reopening gameplay. A larger change requires re-running all compatible location profiles, because it can remove future upgrade space or break routes.

## What Counts Inside the Envelope

Included: the original building, every attached facade/roof/wing/sauna/shop module, building-owned deck or recovery niche, its entrances and a one-tile internal edge for believable walking.

Excluded: location-owned bridge, shore steps, water route, large spa pad, fire-safe pad, location Outdoor Gus Sauna field, public approach and all landscape fields. Those have their own reserved location envelopes.

Every building-owned slot has three visible art states: the bought facility plus two upgrades. The base building is a separate transparent layer, and each slot state uses that same full building canvas. `roof-material` is a visual roof/chimney/light family; it is distinct from `roof-or-upper`, which may only contain a usable upper feature where the building and scene provide a real stair, lift or door route.

## Estimates

| Building base | Max envelope | Native px | Shape/planning reason | Mandatory local slots |
| --- | ---: | ---: | --- | --- |
| Floating Sauna | `16 x 12` | `256 x 192` | Long, narrow moored unit plus entry/deck. Does not include gangway or Water Plot pontoons. | Pier-facing entrance, change pod, shower pod, panorama front, deck, flexible sauna pod, program pod, recovery niche, shell/screens. |
| Rooftop Sauna | `18 x 14` | `288 x 224` | Compact roof compound beside lift core, with enough width for up to three volumes. | Lift/sign, shop, sauna A/B/program/C, glass front, recovery room, lamella crown, screens, sky Gus alcove. |
| Saunatelt Camp | `20 x 16` | `320 x 256` | A small compound rather than one tent; open forecourt remains inside the budget. | Entry, floor/forecourt, changing tent, sauna tent A/B/C, shelter, small enclosed Gus tent, compact plunge, planting/recovery edges. |
| Container Compound | `22 x 16` | `352 x 256` | Three to five connected container volumes around a contained yard. | Gate, cladding overlay, deck, changing, sauna A/B/C, shop hatch, Gus unit, plunge, canopy/bench, roof stair/terrace. |
| Small Timber Cabin | `16 x 14` | `256 x 224` | Intimate footprint; loft is vertical visual volume, not a new ground parcel. | Entrance, shop wall, side sauna, loft marker, panorama wall, veranda, shower, plunge, chimney/cladding. |
| Pavilion | `22 x 16` | `352 x 256` | Wide low building with view side and attached recovery wing. | Arrival, shop, sauna A, program room, panorama front, veranda, shower, plunge, glass wing, roof stack/lantern. |
| Boathouse | `20 x 14` | `320 x 224` | Narrow water-facing building with land-facing expansion edge. | Restored port, shop, sauna A, program room, glass port, lamella front, shower, plunge, facade/drying edge. |
| Repair Workshop | `22 x 16` | `352 x 256` | Robust rectangular shell plus visible port/courtyard edge. | Port, shop, sauna A, program room, glass doors, roof material/light, port recovery, pipe shower, plunge, brick/light wall. |
| Small Depot | `18 x 14` | `288 x 224` | Low compact industrial box; attached yard use stays contained. | Port, shop, sauna A, program room, glass wall, covered yard, shower, plunge, facade/green wall. |
| Warehouse | `28 x 18` | `448 x 288` | Existing large hall is present from start; upgrades convert marked bays rather than adding outer mass. | Loading entrance/shop, sauna bay A/B, program hall bay, glass/roof sections, orangery, covered yard edge, cold basin edge, stair/roof field. |
| Fiskehus | `24 x 16` | `384 x 256` | Broad processing building with three independently converted existing rooms. | Loading entrance/shop, cold room A/B, machinery program room, window/skylight band, ramp recovery, shower, trough cold basin, facade/light. |
| Country Estate with Barn | `28 x 18` | `448 x 288` | Main house and barn are one compound. The internal yard remains useful visible space. | Gate/shop house, barn sauna bay A/B, barn Gus hall, orangery, veranda, loft gallery/stair, shower, cold plunge, recovery port. |
| Former Kursted / Badesanatorium | `32 x 20` | `512 x 320` | Landmark base with a main building and existing side wings; its mass exists from the start. | Historic entry/shop, bath wing A/B, hall Gus conversion, orangery, terrace, upper lounge/stair, shower, plunge, balcony, glass passage, ritual court. |

## Slot Design Rules

1. A building base reserves every listed slot from the beginning, even when it looks unused in the starter state.
2. Slots may overlap visually only when an upgrade explicitly replaces the same component, such as cladding over containers or a glass front over a facade.
3. Extra sauna rooms, converted bays and program rooms always have their own exterior cue, door/vent/chimney anchor and route anchor.
4. A roof, balcony or gallery slot includes its visible stair/lift/door transition inside the envelope. No route appears from nowhere.
5. Building-owned shower, plunge or wild-bath variants stay within the building envelope only when the approved building module says so. The larger location-owned equivalent remains a separate field.
6. Tents and containers may add matching modules within their envelope. They never expand into an unreserved space and never turn into another building family.

## Complete Building-Owned Upgrade Inventory

This section expands the slot shorthand above. Every named item below needs either its own completed visual state or an explicitly declared replacement state on its parent slot. Items marked `location field` consume a compatible external field rather than hidden building space.

| Building base | Complete base and upgrade list mapped to local slots |
| --- | --- |
| Floating Sauna | Pier sign `arrival`; attached changing pod `service`; shower pod `attached-recovery`; panorama front and wave timber shell `facade`; expanded floating deck, sliding screens and covered recovery niche `attached-recovery`; second flexible sauna pod and program sauna pod `sauna-a/program`; lit gangway planters `arrival`; small evening Outdoor Gus Sauna between pods `program`. |
| Rooftop Sauna | Lift-core sign/portal `arrival`; shop niche `service`; second sauna, program pavilion and third compact sauna `sauna-a/program/sauna-b`; skyline glass and sliding screens `facade`; glass recovery room `attached-recovery`; lamella crown/warm light `roof-or-upper`; small Sky Outdoor Gus Sauna `program`. |
| Saunatelt Camp | Entrance/sign and timber forecourt `arrival`; changing tent `service`; second and third sauna tent `sauna-a/sauna-b`; covered shelter and robe/drying rail `attached-recovery`; enclosed wood-fired Outdoor Gus tent `program`; compact plunge, rain shower, fire circle, raised viewing deck and wild bath `attached-recovery` where the compatible plot provides its authored subfield; large planting `facade/edge`; narrow bathing path is a connection to a `location field`, never independent water access. |
| Container Compound | Gate/sign `arrival`; compound-wide timber cladding, glass-front sauna and edge lighting `facade`; courtyard deck, low canopy/benches, roof terrace/stair, fire courtyard and wild bath `attached-recovery`; changing container and shop hatch `service`; second/third sauna containers `sauna-a/sauna-b`; enclosed Outdoor Gus container `program`; plunge and rain-shower portal `attached-recovery`. |
| Small Timber Cabin | Renovated entrance `arrival`; shop window `service`; side and loft sauna `sauna-a/sauna-b`; panorama window and cladding/chimney `facade`; veranda, shower and compact plunge `attached-recovery`; rock-built spring plunge, raised platform and wild bath use their approved attached fields only. |
| Pavilion | Arrival facade `arrival`; shop `service`; extra sauna and program sauna `sauna-a/program`; panorama front, folding panorama facade, lamella cloak and roof lantern/chimney `facade/roof-or-upper`; veranda and glass recovery wing `attached-recovery`; shower, plunge, cold ritual bucket, deck wild bath and fire circle `attached-recovery`; enclosed broad-canopy Outdoor Gus Sauna and meditation sauna use `program` plus their approved external/large-site field. |
| Boathouse | Restored port `arrival`; shop window `service`; land-facing sauna and program sauna `sauna-a/program`; water glass port, restored facade and sliding lamellas `facade`; cooling niches, shower, plunge, quay wild bath and maritime drying area `attached-recovery`; enclosed quay Outdoor Gus Sauna needs the compatible fixed quay `location field` but uses the building's Master/entry route. |
| Repair Workshop | Restored port `arrival`; shop `service`; extra and program sauna `sauna-a/program`; glass doors and brickwork/evening lights `facade`; dark slate, roof lights and chimney finish `roof-material`; open port recovery, copper shower, plunge, courtyard wild bath, water wall and greenery `attached-recovery`; courtyard Outdoor Gus Sauna `program` on the pre-authored courtyard edge; oven/chimney replaces an existing `facade/roof` state. No roof activity or guest anchor. |
| Small Depot | Original-port entrance `arrival`; shop `service`; compact extra sauna and program sauna `sauna-a/program`; facade glass, softened facade/greenery and shed skylights `facade/roof-or-upper`; covered yard, rain shower, plunge, ramp deck, wild bath, gable recovery box, cold trough and open port/bench zone `attached-recovery`; enclosed yard Outdoor Gus Sauna uses the depot's fixed yard program field. |
| Warehouse | Loading facade/shop `arrival/service`; converted hall bays one and two `sauna-a/sauna-b`; converted large Aufguss hall `program`; facade/roof glass and sawtooth orangery `facade/roof-or-upper`; covered-yard Outdoor Gus Sauna, loading-edge cold basin, roof terrace/external stair, warm loading-bay pool, recovery gallery/stair and wall greenery use declared building-edge fields inside the large envelope. Each converted bay replaces only its own visible door/vent/light state. |
| Fiskehus | Loading entrance and shop hatch `arrival/service`; first and second former cold rooms `sauna-a/sauna-b`; machinery room `program`; windows/skylights and restored materials/lights `facade/roof-or-upper`; ramp recovery, fixed shower, sorting-trough cold basin, salt-air terrace, wild bath, lamella/net screens and planting `attached-recovery`; enclosed loading-edge Outdoor Gus Sauna uses the existing loading-edge field. |
| Country Estate with Barn | Gate/sign and main-house shop `arrival/service`; first/second barn sauna bays `sauna-a/sauna-b`; barn Aufguss hall `program`; orangery, veranda and sun balcony `facade/attached-recovery`; loft gallery with stair `roof-or-upper`; shower, built plunge, open barn recovery, water-wall shower and small barn-port Outdoor Gus Sauna use compound-owned edge fields; historic garden spa is a compatible `location field` with an estate material variant. |
| Former Kursted / Badesanatorium | Historic entry and foyer/Kurshop `arrival/service`; first/second bath wings `sauna-a/sauna-b`; historic hall Aufguss conversion `program`; orangery/winter garden, veranda, sun balcony and glass passage `facade/attached-recovery`; upper lounge/belvedere with stair `roof-or-upper`; shower, cold plunge, bathing colonnade, Kur terrace and ritual court use declared wing/terrace fields; historic spa is a compatible `location field` with Kursted stone/stair variant. |

## Inventory Check

There are exactly 13 locked building bases above. Every building-library item is represented either as a local slot state or explicitly as a required compatible location field. A later asset card will split a compound line into individual PNG/sheet files; this table prevents any approved item from disappearing between design and art.

## Location Planning Input

When the location profiles are laid out, reserve these envelopes plus a `2-tile` external circulation/visual-clearance band on the guest-facing sides. A location may offer several legal profiles for a base, but each profile must fit the building's maximum envelope, not merely its starter graphic.

The first placeholder scene should use solid colour boxes for:

- base envelope;
- every building-owned slot;
- every location-owned facility field;
- approach/return routes and water masks;
- the portrait camera's whole-venue and close-activity frames.

Only after those boxes pass together do we produce final sprites. This is the practical escape hatch: if an estate feels too dominant, or a tent camp feels too cramped, we adjust the budget while boxes are cheap rather than redraw a finished location.

## Next Review

The next document should assign location placement profiles using these estimates: exact allowed base, origin, permitted orientation, clear edge, route connection and reserved location fields. Review those profiles visually with placeholders before beginning final Canal art.
