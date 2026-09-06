# Sauna Sim Venue Placement Contract v0.1

## Decision

A location is not painted around one exact house position. It is a reusable exterior map with approved **placement profiles** for each compatible building base. A profile may put the same house in a different practical position, orientation or view relationship on another location.

The player owns one building base per venue. The scene may show many facilities and upgrades, but never several independent base houses competing for the same land.

This enables many credible offers without hand-painting a fully separate location for every offer.

## 1. Building Prefabs

Each building base is produced as a transparent prefab with a fixed local coordinate system. It declares:

```text
base id and legal location tags
native art bounds and maximum construction envelope
entry/exit and roof/upper-level transitions
building-owned module slots
required clear walking edge and service edge
front/view side and allowed mirror/rotation states
local route, effect and occlusion anchors
```

A building can be visually placed somewhere different on Canal than on Coast. Its own entrance, attached modules and internal slots move with it. It never relies on a painted-in location wall or path that happens to match one old mock-up.

## 2. Provisional Envelope Classes

The production grid remains `16 x 16 px` per native tile. These are maximum envelopes for the main building volume, including only facade, roof and attached-wing changes that visibly alter that building. Freestanding building-owned additions use their own location-layer fields, just like location-owned fields, but are selected from the building's module library.

| Class | Maximum envelope | Typical bases |
| --- | --- | --- |
| `floating` | `16 x 12` tiles | Floating Sauna only; includes its deck but not the shared pontoons. |
| `compact` | up to `18 x 14` tiles | Small Timber Cabin, Small Depot, Rooftop Sauna. |
| `medium` | up to `22 x 16` tiles | Saunatelt Camp, Container Compound, Pavilion, Boathouse, Repair Workshop, Fiskehus. |
| `large` | `28 x 18` tiles | Warehouse, Country Estate with Barn. |
| `landmark` | `32 x 20` tiles | Former Kursted / Badesanatorium. |

The art may occupy less than its envelope. The main building may not grow outside it when every integrated building change is installed. Freestanding building-owned additions have their own approved field and must never be hidden inside the main-building envelope. The current per-building estimates and slot list live in `building-envelope-estimates-v0.1.md`; they become exact only after placeholder profile review and before each final PNG is approved.

This is intentionally a maximum budget, not a claim that every building must look like a rectangle or fill the whole area. A tent camp and estate can have open ground inside their envelope; a boathouse can be narrow and long inside a medium envelope.

## 3. Building-Owned Slots

Every base reserves its own local slots from the start. Slots are named by function, not purchase order:

| Slot family | Examples |
| --- | --- |
| `arrival` | Sign, restored port, lift portal, gate treatment. |
| `service` | Shop hatch/window, foyer counter, changing volume. |
| `sauna-a`, `sauna-b`, `program` | Extra room, converted hall/barn/cold-room, dedicated program volume. |
| `facade` | Glass front, lamellas, cladding, panorama treatment, restored material. |
| `roof-or-upper` | Dome, lantern, gallery, balcony, roof terrace or stair, where legal. |
| `roof-material` | Visual roof finish, light or chimney treatment only; never a guest activity field. |
| `attached-recovery` | Veranda, port recovery, niche, drying area or small building-attached shower. |

If a purchase changes an existing module rather than adding one, it replaces only that module's sprite and its anchors. For example, timber cladding changes the container surfaces; a converted cold room changes only its matching loading-door field; a second sauna uses only `sauna-b`.

## 4. Location Placement Profiles

Every location base defines several **zones**, not several finished venue illustrations. A zone records maximum class, legal building tags, terrain treatment, route connection and reserved location fields.

```text
zone id
allowed building ids/classes
origin and allowed orientation/mirror state
build envelope polygon + mandatory clear edge
entry connection to the public arrival route
view/shore/roof relationship tags
reserved location-owned fields and their no-build polygons
camera framing and depth/occlusion information
```

A compatible building selects one profile. The profile supplies only placement and ground-facing trim; it never changes the building's function or silently grants a facility.

Building-specific modules must be visibly represented in every placement-profile review. Freestanding modules such as extra sauna containers, Gus saunas, changing pods, recovery buildings and detached wings occupy their own orange location-layer fields beside the selected building. They can vary in size and placement but may not overlap protected terrain, location-owned fields, the main building or arrival infrastructure. The entry/shop is always part of the main building base, including inside a starter tent; it is never a freestanding orange module. Only facade, roof and attached-wing changes render inside the main building envelope.

Location-owned fields have two classes. Fixed geography, such as bridge, quay, shore access, pontoon, cliff edge, swim net and roof safety structure, stays geographically stable within a base variant. Flexible venue fields, such as outdoor Gus, shower, spa, terrace, fire/recovery and planting, may move between approved patches when the selected building profile changes. This lets a tent and a kursted use the same location differently without moving a bridge through a lake by a few pixels.

The fallback placement rule is a collision-safe planning aid only. Before a location receives final art, every legal building profile must receive its own approved site composition: which additions form a compact cluster, which extend along a quay or path, and which deliberately sit apart as a destination. Canal establishes the required standard: Repair Workshop expands as a working canal-yard sequence, while Boathouse extends its sauna and recovery modules along the quay and water access. A profile must not read as one unchanged cluster translated to a different coordinate.

An asset's native envelope and visual scale are invariant. A profile may move a red building base, a purple location-owned asset or an orange building-owned asset to a compatible coordinate, but may not shrink, stretch or substitute it merely to make a layout fit. If a legal composition cannot fit with its original asset envelopes, the location needs more space or a different approved layout; the asset does not become smaller.

Every freestanding exterior asset reserves a minimum one-tile clear gutter on all sides for paths, depth sorting, character anchors and effect animation. Assets may touch only when the content model explicitly marks them as a direct architectural extension, such as connected extra containers or a genuinely attached second sauna volume. The default is separation, never a packed cluster.

## Incremental Path Network

Paths are not painted as one finished venue illustration. Each location owns a walkable tile graph with blocked terrain, protected geography, a fixed edge-arrival node and the main building's entry/shop door anchor. Every freestanding asset supplies one or more path anchors: approach, activity and return.

When the player builds an asset, the simulation finds the shortest valid route from that asset's approach anchor to the existing path network, then adds only that route's tiles to the canonical path graph. It may cross buildable ground but never protected terrain, water without an approved water route, another asset's envelope or its required clear gutter. The visual layer chooses the correct straight, corner, end, T-junction or crossing tile from the resulting graph.

This means build order is safe. A distant wild bath may be built before a nearer shower: it receives a complete path back to entry/shop immediately. When the shower is built later, it joins the existing path at its nearest valid point rather than forcing a painted route through the bath. Existing paths persist; only an approved rebuild may remove or reroute them.

The later placement editor previews this route while an asset is dragged. It rejects invalid drops, shows the resulting path and writes the approved anchor coordinate plus generated path tiles into the profile data. Guests navigate the same graph that renders the visible paths.

Every shop upgrade must change the visible main-building art at the entry/shop anchor: a clearer service hatch or counter, branded sign, larger display window, awning, stock display or similar architecture appropriate to that base. The simulation may grant the economic bonus only together with this visual state. A shop upgrade never appears as an unrelated orange field elsewhere on the venue.

Every location has one fixed, visible guest-arrival field at the edge of its usable map outside every legal building envelope. Guests are generated off-screen beyond this edge and walk in through it; it is also their final return/exit point. The field is a street gate, quay arrival, forest gate, boardwalk entrance or shore landing. Hotel Rooftop's lift core is the edge of its player-controlled roof area. A visible walk route from this field directly to the selected building's entry/shop is mandatory. It is base infrastructure, not an upgrade.

### Examples

- A **Canal** base can place a compact Boathouse nearer the quay or a medium Repair Workshop deeper on the parcel. The bridge, terrace and shower fields remain in their independently reserved quay zones.
- An **Industrial** base can place a Compact Depot or Medium Warehouse in different yard positions while preserving the same separate cold-basin, spa and Outdoor Gus fields.
- A **Beach** base can give a Cabin, Pavilion, Tent Camp or Container Compound different behind-dune placement profiles while retaining the cove, bridge and dune modules.
- **Water Plot** and **Hotel Rooftop** are deliberately constrained special cases: their sole building base has one or two authored profile states, because gangway/lift safety makes free placement implausible.

## 5. Location-Owned Fields Always Win Their Space

Location-owned fields have their own fixed envelope before any building is placed: water access, cove steps, bridge, quay, spa pad, outdoor Gus field, fire-safe pad, roof safety pad, dune zone, planting edge and so on.

The build-zone solver rejects a profile when it overlaps a required location field, blocks an arrival route, removes a shore safety strip or makes a future approved module impossible. This is why locations need their full maximum field plan before final background art.

An unbuilt field is still visible neutral terrain. It is not empty undefined space and may not later be taken by a house just because that house looks convenient.

## 5.1 Existing-Feature Classification

Every visible part of a location is classified before art. Nothing is treated as generic empty ground merely because it is not currently an upgrade.

| Class | Meaning | Examples |
| --- | --- | --- |
| `protected` | Cannot receive a building or upgrade. It stays as base geography/background. | Water outside a safe route, mature trees, cliff edge, road, neighbouring property, hotel structure, safety rail. |
| `buildable` | Clear authored ground that may host a building placement profile or a compatible location field. | Yard, clearing, dune-back parcel, roof pad, paved owned plot. |
| `integrated` | A feature remains visible but has an approved module designed around/through it. | Forest shelter between trees, deck around a rock, spa behind dunes, planter added to a yard wall, lights along an existing quay. |
| `replaceable-field` | Neutral prepared surface that may visibly transform only into its named approved facility. | Empty spa pad, reserved shower wall, unopened workshop port, unbuilt pontoon bay. |

An `integrated` module has a base layer, module layer and foreground/occlusion layer. The tree, rock, dune, wall or water edge stays readable around it; the module never looks pasted over it. A `protected` feature can overlap only an approved foreground mask or effect, never building geometry.

## 6. Required Validation

For every legal `location x building` profile, automated checks must prove:

1. The whole maximum main-building envelope is inside a valid build zone.
2. Every freestanding building-owned field fits in a valid build zone and does not overlap protected terrain, fixed location fields, arrival infrastructure or another building-owned field.
3. No installed building module overlaps a reserved location field.
4. A complete walk route exists from arrival to entrance, each built activity and exit.
5. Water, roof and upper-level transitions remain credible.
6. Protected features stay unobstructed; integrated modules retain their required base and foreground layers.
7. The camera can frame both the whole venue and a close activity view in portrait mode.
8. The base plus every compatible upgrade state passes depth/occlusion and effect-anchor validation.

Visual review then checks that the profile looks intentional. It is acceptable, and expected, that the same building sits somewhere else on another location; it is not acceptable that a route looks improvised or a bridge points into a wall.

## 7. Production Order

1. Assign every locked building base its exact class, maximum envelope and local module-slot diagram.
2. Create small placeholder rectangles for every class and slot.
3. Lay out every location's permanent terrain, protected routes and location-owned maximum fields.
4. Define enough compatible placement profiles to cover every approved building/location pair.
5. Run the placeholder geometry/route validation for all profiles.
6. Only then produce final location bases, building sprites and upgrade art.

This is the next graphics-preparation step. It is design/data work first, not drawing work. Once it passes, new offers are combinations of approved data and reusable art rather than manual scenes.
