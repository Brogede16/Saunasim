# Sauna Sim Building Library v0.1

## Purpose

This is the single inventory for every building base in Sauna Sim. A new building idea must be added here as **Proposed** before it appears in a location list, receives upgrade design or enters art production.

Location families are locked separately. A generated venue is only created from a compatible building and location pair.

## Status Rules

- **Proposed:** discussed candidate; not yet a production commitment.
- **Locked:** approved building base; requires its own compatible upgrade map, capacity envelope, route anchors and asset package before implementation.
- **Produced:** final art, scene data and functional modules exist in the game.

## Building Bases

| Building base | Status | Compatible locations | Core identity | Capacity direction |
| --- | --- | --- | --- | --- |
| Saunatelt camp | Locked | Industrial, Forest Lake, Beach, Rural Plot, Urban Lot | Cheapest temporary start; may add tent modules | 6-18 |
| Container compound | Locked | Industrial, Harbour, Forest Lake, Beach, Rural Plot, Urban Lot | Modular raw start; may add container modules | 8-28 |
| Small timber cabin | Locked | Forest Lake, Coast, Beach, Rural Plot | Intimate, nature-led sauna | 12-40 |
| Pavilion | Locked | Forest Lake, Coast, Beach | Purpose-built light venue with outdoor connection | 20-60 |
| Country estate with barn | Locked | Rural Plot, selected Coast and Forest Lake | Main house and existing barn form one grand rural destination base | 30-80 |
| Boathouse | Locked | Canal, Harbour, Coast | Direct water relationship and compact footprint | 16-55 |
| Repair workshop | Locked | Canal, Industrial | Practical conversion with strong Aufguss potential | 18-60 |
| Small depot | Locked | Industrial | Modest practical building; remains a depot | 20-50 |
| Warehouse | Locked | Harbour, Industrial | Larger industrial volume; separate offer from a depot | 40-80 |
| Fiskehus | Locked | Harbour, Industrial | Robust former fish-processing conversion with distinctive material character | 25-70 |
| Floating sauna | Locked | Water Plot only | Small moored water-building on a dedicated water plot with direct bathing route | 8-28 |
| Rooftop sauna | Locked | Hotel Rooftop only | Compact city sauna on an existing hotel roof | 15-40 |
| Former kursted / badesanatorium | Locked | Coast, Forest Lake, Rural Plot | Large premium destination; not hotel simulation | 40-90 |

Capacity figures are direction only until the balance model is built. They represent simultaneous guest capacity and must remain physically plausible after all compatible upgrades.

### Floating Sauna Plot Rule

Floating Sauna is a standalone water-plot venue, not a land building with a decorative raft. Water Plot is almost entirely water, with only a small beach/shore landing and a fixed pier/bridge out to the sauna. Floating Sauna is the only building base this location can generate. Canal, Harbour and ordinary Beach retain their own land-building systems and do not generate this base.

Every floating-sauna scene requires a complete guest route: land arrival -> gangway/pier -> floating-sauna entrance -> floating-deck water entry -> short swim/idle -> fixed ladder exit -> gangway/pier -> land. The Floating Sauna deck has a direct jump/step-in anchor and a separate ladder-return anchor. Water Plot owns the safe bathing zone, depth/safety boundary and water animation field. The gangway and pier are part of the plot's base art and route data, not optional decoration.

## Locked Building Module Set: Floating Sauna

Floating Sauna is a fixed moored Water Plot base, not the later mobile/sailing sauna. It starts around 8-12 simultaneous guests and reaches roughly 20-28 while remaining intimate. Its modules are:

1. Arrival Sign at the Pier.
2. Attached Changing Pod.
3. Outdoor Shower Pod.
4. Water-Facing Panorama Front.
5. Expanded Floating Deck.
6. Second Flexible Sauna Pod.
7. Program Sauna Pod.
8. Covered Recovery Niche with Slatted Screens.
9. Wave-Form Timber Shell across the Existing Pods.
10. Lit Gangway with Planters.

Water Plot separately owns the Floating Recovery Pontoon and Floating Spa Pool. The pier/gangway has complete route and activity anchors from its base art.

### Approved Floating Sauna Revision

1. Water Plot owns the safe dip zone and safety boundary. The Floating Sauna's own deck owns a direct jump/step-in anchor and fixed ladder-return anchor, so guests visibly enter the sea from the sauna itself. The fixed gangway exists in base art; its lighting/planter layer remains a building-facing visual upgrade.
2. Wave-Form Timber Shell: a single exterior layer across the existing pods, creating sheltered sitting niches and a distinctive silhouette without more building volume.
3. Sliding Deck Screens on the Existing Floating Deck: visible open/closed wind/privacy state and sheltered recovery anchors.
4. Small Evening Outdoor Gus Sauna between Existing Pods: a quiet, small-group enclosed outdoor-sited sauna with steam/light effects; not an extra building volume.

Do not add more warm/cold bathing facilities to the Floating Sauna building. The Floating Spa Pool and Floating Recovery Pontoon belong to Water Plot.

At full development, Floating Sauna has its base sauna, a second flexible pod and a dedicated program pod. The second flexible pod can receive an Aufguss-ready conversion, allowing two Aufguss sessions to operate in parallel; it does not create a fourth building volume. Exact room capacities and staffing balance remain part of the later balance pass.

## Locked Building Module Set: Rooftop Sauna

Rooftop Sauna is the only base for Hotel Rooftop. It starts around 15-22 simultaneous guests and reaches roughly 35-40. Its modules are:

1. Lift-Core Entrance and Roof Sign.
2. Reception and Shop Niche at the Core.
3. Second Rooftop Sauna.
4. Program Sauna Pavilion.
5. Skyline-Facing Glass Front.
6. Glass Recovery Room.
7. Third Compact Sauna Volume on Structurally Suitable Roofs.
8. Timber Lamella Crown with Sheltered Sitting Niches and Integrated Warm Lighting.
9. Sliding Screens before the Skyline Glass Front.
10. Glowing Lift-Arrival Portal at the Existing Core.

Hotel Rooftop separately owns its viewing deck, shower, cold plunge, warm rooftop spa, pergola, planting, lighting and enclosed rooftop Outdoor Gus Sauna field.

### Approved Rooftop Sauna Revision

1. The Third Compact Sauna is available only on a separately authored structurally suitable roof field.
2. Small Connected Recovery Annex is removed because the Glass Recovery Room already fulfils its role.
3. Small Sky Outdoor Gus Sauna sits beside the Program Sauna Pavilion on its own fixed exterior field; it is a sheltered small-group sauna, not the larger location-owned rooftop Outdoor Gus Sauna.

Rooftop Sauna is deliberately exclusive: restrained dark timber, pale stone/concrete, bronze/dark metal details, large controlled glass surfaces and warm low evening light. Its luxury comes from precise materials, shelter and skyline composition, not scattered novelty props or generic coloured LEDs.

## Required Package Before Production

Each **Locked** base needs these entries before any final PNG is produced:

1. Compatible location tags and plot footprints.
2. Starting capacity and credible maximum capacity.
3. Building-owned upgrade set with authored anchors.
4. Required visible guest routes and activity anchors.
5. Base art, modular art, day/night layer and effect-anchor inventory.
6. Asset IDs and a production status for every required graphic.

Tent and container bases may grow by adding matching modules. All other building bases retain their building type permanently and expand only through their own compatible modules.

## Functional Modules Must Look Building-Specific

Names such as "Reception and Shop Module" describe gameplay function only. They must never become one generic copied asset. Each building base receives a credible architectural version: a service hatch in a depot port, a small window in a timber cabin, or a quay-facing hatch in a boathouse. The same rule applies to all recurring functions, including outdoor showers, cold-plunge enclosures and recovery rooms.

## Locked Building Module Set: Saunatelt Camp

The tent camp uses high-quality Nordic glamping/tipi forms: warm canvas, timber poles, clear stove/chimney silhouette and restrained premium details. It must not read as a festival camp.

1. Improved Entrance and Sign.
2. Timber Floor and Forecourt.
3. Changing Tent.
4. Second Sauna Tent.
5. Third Sauna Tent.
6. Covered Shelter and Recovery Seating.
7. Wood-Fired Outdoor Aufguss Deck with Wind Screens.
8. Portable Cold-Plunge Tub.
9. Large Potted Greenery.

The list intentionally has no purchasable service/storage tent. A small back-of-house canvas tent belongs to the base scene where needed, rather than pretending to be an undocumented upgrade. The cold-plunge tub is a compact building-owned facility, distinct from a location-owned natural-water route or built plunge installation. The Aufguss area and cold tub both require their own guest interaction anchors and animations where used.

### Approved Saunatelt Signature Additions

These are optional additions, not mandatory eleventh-through-fourteenth upgrades. They appear only where the compatible plot has the authored footprint and route:

1. Fire Circle with Timber Benches: an evening social/ritual feature.
2. Outdoor Rain Shower in a Timber Frame: a visible rinse route before cold water or warm recovery.
3. Raised Viewing Deck: a premium recovery deck only on terrain or waterfront settings where a view is credible.
4. Large Wood-Fired Wild Bath: a warm-recovery facility with visible steam and seated guests.
5. Low Covered Robe/Drying Rail at the Recovery Shelter: visual route credibility only, with no hidden statistic.
6. Narrow Timber Bathing Path: only on authored waterfront settings; it connects the tent recovery area to an existing location-owned water access, without creating water access itself.

Potted planting is location-specific: palms on Beach and Urban Lot, and large grasses, ferns or small pines on Forest Lake and Rural Plot. The graphic footprint is shared, but the plant art must match the location.

## Locked Building Module Set: Container Compound

Container Compound is a fixed modular venue rather than movable inventory. It starts around 8-14 simultaneous guests and reaches roughly 22-28, remaining cheaper and physically more limited than a conventional building. It may grow only with compatible container volumes and its contained outdoor yard.

1. Entrance Gate and Sign.
2. Timber Cladding on the Existing Containers.
3. Shared Courtyard Deck.
4. Changing Container.
5. Second Sauna Container.
6. Third Sauna Container.
7. Reception and Shop Hatch.
8. Small Outdoor Aufguss Deck.
9. Compact Cold-Plunge Tub.
10. Pergola, Benches and Large Planters.

The compound keeps a deliberately coherent container-yard silhouette at every stage. **Timber Cladding is a compound-wide upgrade:** it re-skins every currently visible container and establishes the material treatment that all later added sauna/changing containers inherit. Its gameplay effect is Premium Presentation and stronger arrival/comfort appeal, not an invented operations bonus. Sauna containers are fixed after installation; neither they nor the base containers become movable items.

### Approved Container Compound Signature Additions

These additions retain the compound's visible container-yard identity and require authored footprints:

1. Reinforced Roof Terrace with Visible Stair: a premium recovery/viewing space on the compound's authored container-roof anchor. It is available wherever the Container Compound appears; the backdrop determines whether its view is city, harbour, forest, beach or yard.
2. Panoramic Glass-Front Sauna Container: a premium sauna/program variation.
3. Covered Rain-Shower Portal: a visible recovery-route facility.
4. Fire Courtyard with Steel Fire Bowl and Long Benches: evening social/ritual space.
5. Wood-Fired Wild Bath on the Courtyard Deck: the same shared Wild Bath mechanic used by other eligible venues, with a container-yard art variant.

### Approved Container Compound Revision

1. Replace the generic pergola with a low Courtyard Canopy and Long Benches that follows the container geometry.
2. Fire Courtyard and Courtyard-Deck Wild Bath may coexist; the compound base always reserves authored anchors for both.
3. The Outdoor Aufguss Deck includes fixed timber/steel wind and privacy screens.
4. Integrated Evening Edge Lighting is part of the compound: light under steps, at the roof stair and around the shop hatch. It is a visible evening orientation/presentation layer rather than an isolated lamp bonus.

## Locked Building Module Set: Small Timber Cabin

Small Timber Cabin is an existing, characterful building that is renovated rather than constructed by the player. It starts around 12-20 simultaneous guests and reaches roughly 30-45 while retaining an intimate scale. Its modules are:

1. Renovated Entrance and Sign.
2. Reception and Shop Window.
3. Small Side Sauna.
4. Loft Sauna.
5. Location-compatible Panorama Window.
6. Covered Veranda.
7. Fixed Outdoor Shower.
8. Compact Cold-Plunge Tub.
9. Warm Timber Cladding and Chimney treatment.

This family may use a simple cabin or a slightly larger old forest-lodge visual variant. They share the same building identity and module system rather than creating a near-duplicate asset family.

The same family may also use a fisher/coastal-cottage visual variant on Coast. It shares the cabin's capacity and modules rather than becoming a separate building base.

### Approved Small Timber Cabin Signature Additions

These additions remain small and setting-dependent:

1. Rock-Built Spring Plunge: a natural-feeling cold facility for sites without direct water access.
2. Raised Timber Platform: a premium recovery/viewing space only on an authored forest or coast footprint.
3. Wood-Fired Wild Bath: the shared warm-recovery facility in a cabin-specific timber/stone art variant.

### Approved Small Timber Cabin Revision

The Glass Veranda for Recovery is removed. It made the compact cabin read as a small resort rather than an intimate conversion. The panorama treatment is only produced on an authored view-facing wall toward a real lake, coast or forest outlook. The fixed outdoor shower is a functional part of a specific cold/water route, never an isolated luxury object. Any nature or water path belongs to the location layer, not the cabin.

## Locked Building Module Set: Pavilion

Pavilion is an existing low, outward-facing building suited to Forest Lake, Coast and Beach. It starts around 20-30 simultaneous guests and reaches roughly 45-60. Its modules are:

1. Renovated Arrival Facade.
2. Reception and Shop Module.
3. Extra Sauna Room.
4. Program Sauna.
5. Location-compatible Panorama Front.
6. Covered Veranda.
7. Fixed Outdoor Shower.
8. Compact Cold-Plunge Tub.
9. Glass Recovery Wing.
10. Roof Lantern and Stronger Chimney treatment.

### Approved Pavilion Signature Additions

These additions use the pavilion's outward-facing form and only appear where the setting supports them:

1. Enclosed Outdoor Gus Sauna beneath a Broad Canopy: a visible social program space.
2. Folding Panorama Facades: a premium opening facade toward credible lake, coast or beach views.
3. Sunken Fire Circle: a contained evening recovery/social area.
4. Integrated Deck Wild Bath: the shared warm-recovery facility built into the pavilion terrace.
5. Timber Lamella Cloak with Sheltered Sitting Niches and a Low Viewing Plateau: a single architecture layer replacing the ordinary veranda and roof-lantern treatment.
6. Cold Ritual Shower with Pull Cord and Bucket at the Existing Shower Field.
7. Narrow Outdoor Meditation Sauna: only on pavilion bases with a separately authored large-site field; it is a quiet premium program room rather than a show facility.

Broad Bathing Steps with Sitting Edges move to the eligible location layer, because water entry belongs to the shore/quay/beach rather than the building.

## Locked Building Module Set: Boathouse

Boathouse is a compact water-building base for Canal, Harbour and Coast. It starts around 16-25 simultaneous guests and reaches roughly 40-55. Its modules are:

1. Restored Port and Entrance.
2. Reception and Shop Window.
3. Extra Land-Facing Sauna Room.
4. Program Sauna.
5. Water-Facing Glass Port.
6. Boathouse Front with Timber Lamellas and Sheltered Cooling Niches.
7. Fixed Outdoor Shower.
8. Compact Cold-Plunge Tub.
9. Restored Timber Facade.

Chimney smoke/steam is base ambient animation for applicable sauna buildings. It increases visually as more sauna volume is built, but is never a standalone upgrade.

### Approved Boathouse Signature Additions

1. Outdoor Aufguss Deck on the Quay: only available where the compatible Canal, Harbour or Coast scene includes an authored fixed quay from the start. It is not created by the building upgrade.
2. Wild Bath Integrated into the Quay Deck: the shared warm-recovery facility in a robust maritime timber/metal art variant.
3. Sliding Timber Lamellas before the Water-Facing Glass Port: an open/closed premium privacy, wind and evening-light state on the existing facade field.
4. Maritime Drying Area beneath an Existing Eave: visual/recovery-route detail with robes, towels and benches; no hidden statistical bonus.

All bathing steps, swim ladders, water platforms and quay edges belong to the location layer. The Loft Recovery Room is removed because it had no exterior-visible, independently valid route or field.

## Locked Building Module Set: Repair Workshop

Repair Workshop is a compact former handcraft base for Canal and Industrial District. It starts around 18-28 simultaneous guests and reaches roughly 45-60. Its modules are:

1. Restored Entrance and Workshop Port.
2. Reception and Shop Module.
3. Extra Sauna Room.
4. Program Sauna.
5. Glass Doors in the Original Port.
6. Roof Material and Lantern Treatment on the Existing Workshop Shell.
7. Open Workshop-Port Recovery Field.
8. Copper-Pipe Rain Shower.
9. Compact Cold-Plunge Tub.
10. Restored Brickwork and Evening Lighting.

### Approved Repair Workshop Signature Additions

Each addition uses either the workshop's visible yard, port or facade/roof-material layer; it never creates a new undefined industrial area:

1. Existing Workshop Courtyard as Outdoor Aufguss Space.
2. Copper-Pipe Rain Shower attached to the existing workshop exterior.
3. Warm Wild Bath in the Existing Workshop Courtyard.
4. Roof Material and Lantern Treatment: a stronger dark-slate, chimney and warm-light state on the permanent roof silhouette. It has no guest route or activity anchor.
5. Open Workshop-Port Recovery Field: existing port opened/activated as a covered recovery zone with benches and steam.
6. Restored Workshop Oven/Chimney at an Existing Wall or Roof Anchor: a stronger visible heat/steam identity, without a production bonus.
7. Industrial Water Wall at an Existing Courtyard Wall: a narrow cold-recovery route with water-flow effect.
8. Industrial Greenery Field: large planters, climbers or tough grasses only on authored courtyard/wall fields; it improves presentation and recovery atmosphere without a hidden operations stat.

The Roof Terrace and generic Glass Recovery Wing are removed. They require an unapproved catwalk route or duplicate a valid exterior recovery field.

## Locked Building Module Set: Small Depot

Small Depot is a low, compact Industrial District base. It starts around 20-30 simultaneous guests and reaches roughly 40-50 without becoming a warehouse. Its modules are:

1. New Entrance in the Original Port.
2. Building-Specific Reception and Shop Module.
3. Compact Extra Sauna Volume.
4. Program Sauna.
5. Facade Glass Section.
6. Attached Covered Yard Module.
7. Rain Shower at the Existing Port.
8. Compact Cold-Plunge Tub.
9. Softened Industrial Facade and Greenery Fields.

### Approved Small Depot Signature Additions

Each addition uses an existing, authored depot feature and keeps the low building permanently legible as a depot:

1. Existing Loading Ramp as a Screened Recovery Deck.
2. Restored Shed Roof with Skylights.
3. Rain Shower at the Existing Port.
4. Wild Bath on the Existing Depot Yard Field, only where that field exists in the base scene.
5. Narrow Glass Recovery Box along the Existing Gable.
6. Small Covered Aufguss Field in the Existing Yard.
7. Long Cold-Water Trough along an Existing Yard Wall.
8. Open Port and Bench Zone on the Existing Port Field.

The Roof Terrace is removed. The former generic outdoor shower is merged into the building-specific Rain Shower at the Existing Port. Any further shower requires its own authored field under the Outdoor Shower Multiplicity Rule.

## Locked Building Module Set: Warehouse

Warehouse is a distinct larger base for Harbour and Industrial District. Its full hall volume is visible from the beginning; upgrades convert or activate existing bays rather than making new halls appear. It starts around 40-55 simultaneous guests and reaches roughly 70-80. Its modules are:

1. Restored Loading Facade and Main Entrance.
2. Building-Specific Reception at the Loading Port.
3. Converted First Existing Hall Bay for Sauna Capacity.
4. Converted Second Existing Hall Bay for Sauna Capacity.
5. Converted Existing Bay as Large Aufguss Hall.
6. Large Facade or Roof Glass Sections.
7. Sawtooth Glass Orangery along an Existing Side Bay.
8. Large Outdoor Aufguss Yard in the Existing Covered Industrial Yard.
9. Long Cold-Water Basin beneath the Existing Loading Edge.
10. Roof Terrace with Shower and Visible External Stair.

Each converted bay changes visible exterior cues: lit windows/doors, a changed loading port, relevant roof ventilation and chimney/steam output, route anchors and increased guest activity. The unseen interior remains managed through the UI.

### Approved Warehouse Signature Additions

1. The Existing Covered Industrial Yard becomes a large outdoor Aufguss yard with wind screens, multiple authored outdoor-shower fields and visible guest capacity.
2. Warm Pool in an Existing Open Loading Bay: an expensive premium warm-recovery field with steam, seats and entry/exit anchors.
3. High Recovery Gallery on an Existing Gable: only on base scenes that include the authored gable field and its visible external stair.
4. Industrial Greenery along Existing Yard Walls: large planters, climbers and grasses that soften the yard without hiding the warehouse identity.

## Locked Building Module Set: Fiskehus

Fiskehus is a robust former fish-processing building for Harbour and Industrial District. It starts around 25-35 simultaneous guests and reaches roughly 55-70. Its full volume is present from the start; upgrades convert existing rooms and loading features rather than creating a new warehouse. Its modules are:

1. Restored Loading Entrance.
2. Building-Specific Reception and Shop Hatch.
3. Converted First Former Cold Room to Sauna.
4. Converted Second Former Cold Room to Sauna.
5. Converted Machinery Room to Program Sauna.
6. New Facade Windows and Skylights.
7. Existing Covered Loading Ramp as Recovery Zone.
8. Fixed Outdoor Shower.
9. Former Ice/Sorting Trough as Long Cold Basin.
10. Restored Materials and Evening Lighting.

Each former cold room has its own visible exterior field from the base scene: a loading/cold-room door, exterior equipment/vent detail and a dedicated roof/wall effect anchor. When converted into a sauna, that exact field changes independently: its former cold equipment is removed or altered, warm light appears at the door/window, a sauna vent/chimney steam anchor activates, and guest route activity reaches that door. The unseen room is still managed in UI; its conversion is never invisible.

### Approved Fiskehus Signature Additions

1. Salt-Air Recovery Terrace on the Existing Covered Loading Ramp: robust benches, wind screens and multiple authored outdoor-shower fields.
2. Small Outdoor Aufguss Field at the Existing Loading Edge: an intimate industrial program space with timed steam.
3. Warm Wild Bath in an Existing Yard/Sorting Field, only where the base scene includes that field.
4. Net and Timber-Lamella Screens on a Fixed Facade/Terrace Edge: shelter, privacy and maritime recovery character.
5. Coastal-Grass Planter Fields at the Existing Ramp and Wall Anchors.

## Locked Building Module Set: Country Estate with Barn

Country Estate with Barn is a single rural compound: the main house and existing barn are both visible from the start and are developed as one destination. It starts around 30-40 simultaneous guests and reaches roughly 65-80. Its modules are:

1. Restored Arrival, Gate and Sign.
2. Reception and Shop in the Main House.
3. Converted First Barn Bay to Sauna.
4. Converted Second Barn Bay to Sauna.
5. Converted Barn Bay to Large Aufguss Hall.
6. Glass Orangery at the Main House.
7. Restored Veranda.
8. Barn Loft Recovery Gallery with visible stair access.
9. Fixed Outdoor Shower at the Property.
10. Larger Built Cold Plunge where natural water is absent.

### Approved Country Estate with Barn Signature Additions

1. Open Barn Port as a Covered Recovery Field: an existing barn field with benches, warm light, steam and guest anchors.
2. Historic Sun Balcony on an Existing Main-House Gable: only on a base variant with the authored gable and visible exterior stair.
3. Small Outdoor Aufguss Yard at an Existing Barn Port: a social exterior complement to the large barn hall.
4. Limestone Water Wall with Multiple Outdoor Showers on an Existing Barn/Stable Wall: a clear ritual route with water-flow effects.
5. Warm Spa Pool on a Fixed Garden/Terrace Field: the pool's terrain/anchor belongs to the selected location layer, while Country Estate supplies a historic stone/terrace art variant. It is available only when that compatible location field exists.

## Locked Building Module Set: Former Kursted / Badesanatorium

Former Kursted / Badesanatorium is a rare, historic premium destination for Coast, Forest Lake and Rural Plot. It is still a sauna/wellness venue rather than a hotel-management system. Its full main building and existing side wings are visible from the start; upgrades restore and activate them. It starts around 40-55 simultaneous guests and reaches roughly 80-95. Its modules are:

1. Restored Main Entrance and Historic Sign.
2. Reception and Kurshop in an Existing Foyer or Salon.
3. Converted First Old Bath Wing to Sauna Area.
4. Converted Second Old Bath Wing to Sauna Area.
5. Converted Historic Hall to Large Aufguss Hall.
6. Glass Orangery or Winter Garden.
7. Restored Terrace and Veranda.
8. Upper Lounge or Roof Belvedere with Visible Vertical Guest Route.
9. Fixed Outdoor Shower.
10. Larger Built Cold Plunge where natural water is absent.

### Approved Former Kursted / Badesanatorium Signature Additions

1. Restored Sun Balcony on an Existing Bath Wing: a visible exterior stair and premium recovery/viewing field.
2. Bathing Colonnade with Multiple Outdoor Showers along an Existing Facade: a water/ritual route with repeated rinse anchors.
3. Open Kur Terrace at the Historic Hall: a visible pause/arrival space for large Aufguss sessions.
4. Warm Spa Pool on a Fixed Garden/Terrace Field: location-owned terrain with a Kursted-specific historic stone, stair and detail variant.
5. Glowing Glass Passage between Existing Wings: a warm visible route and evening-light transformation.
6. Small Sheltered Outdoor Ritual Court beside an Existing Side Wing: quiet premium Aufguss programs, not a second large event scene.
