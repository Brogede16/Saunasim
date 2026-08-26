# Sauna Sim Venue Composition v0.1

## Decision

We do not create a fixed "Canal Workshop" or any other pre-baked venue as the unit of design. A generated venue offer is a compatible combination of separate layers. This retains variety while keeping the art and simulation buildable.

## The Four Layers

### 1. Location

The larger zoomable outdoor setting: canal, harbour, lake, coast, forest edge, city block, industrial yard or rural field. It determines:

- landscape, water and surrounding activity
- property price and recurring cost tendencies
- local guest-pattern tendencies
- location-specific upgrade anchors

Examples of location-specific upgrades are a canal bathing bridge, a lake deck, harbour steps, or a city roof facility. These cannot be used where the physical setting makes no sense.

### 2. Plot

The usable part of that location. It sets the buildable footprint, access from road or water, usable outdoor space and which existing starter base is present.

The plot is always planned to fit every major compatible expansion before any art is made. It never shows artificial marked build slots.

### 3. Building Base

The actual starting form: repair workshop, boathouse, warehouse, small pavilion, container cluster, tent camp or floating sauna. It determines:

- exterior silhouette, entrance and chimney/steam points
- internal capacity and renovation requirements
- building-specific extension anchors
- compatible material and facade modules

A building base can appear only in locations where it is believable. A canal can support a repair workshop or boathouse; a forest-lake plot can support a pavilion, cabin, containers or tents. Tents and containers can also appear on industrial plots as intentionally modest temporary or modular starts, with no natural-water advantage.

The chosen building base is permanent for that venue. A depot grows through its own authored depot-compatible modules; it never silently becomes a warehouse. A warehouse is a distinct property offer that the player may acquire later. This keeps capacity, exterior identity and expansion limits legible.

Tent and container bases are the deliberate modular exception. A tent site may add compatible tent units; a container site may add compatible container units. The venue remains visibly a tent camp or container compound, retains that family's operational limits and never transforms into a conventional depot, warehouse or pavilion.

## Capacity Must Follow the Physical Place

Every building base has a credible operational envelope. A tent start cannot hold the volume of a warehouse, and a compact canal house cannot gain unlimited capacity just because the player has money. The hidden interior is represented by a small set of physical constraints:

- **sauna capacity:** how many guests can attend at the same time
- **arrival and changing flow:** how many guests can arrive, prepare and leave comfortably per opening hour
- **service capacity:** how much staff, shop and Aufguss activity the place can sustain
- **outdoor recovery capacity:** how many guests can use water, terrace, seating or plunge facilities without crowding

Visible expansions relieve specific constraints. An extra sauna volume increases sauna capacity; a service extension improves arrival flow; a terrace or bathing bridge improves recovery capacity. They do not erase all other constraints.

The building catalogue must define a believable starting range and a believable maximum range for each base before exact balance values are set. This prevents implausible outcomes such as a hundred simultaneous guests in a tent.

## Candidate: Former Kursted or Sanatorium

A former health retreat, badesanatorium or coastal convalescent home is a distinct large building base, suited to coast, forest-edge coast or a scenic rural setting. It is a premium destination with established garden/terrace potential and a dignified older main building. Its physical size supports more capacity and several program types than a pavilion, but restoration, operating cost and preservation-sensitive extensions are expensive.

It is not a hotel-management system: accommodation, restaurants and treatments can be represented as venue facilities and guest appeal, without introducing room bookings or a separate hotel simulation. Suitable visible upgrades include a restored bathing wing, garden pavilion, water deck and carefully integrated glass wellness wing.

### 4. Upgrades

There are two distinct upgrade sets:

- **Location upgrades:** attach to the site, such as bathing bridges, water steps, lakeside decks, forest paths or roof facilities on dense city plots.
- **Building upgrades:** attach to the selected house, such as a rear extension, glass wing, added sauna volume, facade/shop hatch, roof deck or service volume.

Small shared outdoor assets, including benches, planters, lights, guests and steam, are reused only where the tags allow them.

### Ownership Rule for Upgrades

Location and building upgrades must never be confused:

- A **location** owns only changes to its terrain, water, shore, quay, beach, forest edge or location-specific outdoor access. A lake therefore owns only lake-related modules such as a deck, bathing bridge, shore shower or water platform.
- A **building** owns changes to the building itself: entrance, shop hatch, service volume, extra sauna volume, facade transformation, roof facilities and attached wing.
- A building module may require a location tag to use a variant. For example, a water-facing glass facade belongs to the building but is only available when its building anchor faces suitable water.

The player sees the compatible combined list for a venue, but the content system keeps the two sets separate. This prevents a lake from incorrectly granting generic building extensions and prevents a house from creating a bathing bridge without water.

### Route Requirement

Any visible facility that guests are meant to use must define its route before it can be approved as content. A location module therefore includes authored entry/exit anchors and a compatible path from the building entrance or terrace. Water modules also define the full route: approach, shower if present, descent/entry, water idle/swim, exit and return. A deck, shower, program space or seating area similarly defines a stop/interaction anchor. The scene is never allowed to add a bathing bridge or outdoor facility as a decorative object with no guest path.

## Generated Offer Formula

```text
location + compatible plot + compatible building base + market/economy variation
```

The player sees the resulting complete place. The game never produces absurd pairings such as an industrial warehouse in a forest without an explicit plausible rationale.

## Art and Camera Consequence

Each location is built as a large, zoomable exterior base. Its compatible plot and building are placed at authored anchors. The camera can zoom between a whole-place view and a close activity view, while the full potential footprint remains physically available for all compatible upgrades.

## Current Status

Location families and building families are a working library, not a locked final catalogue. Before producing a location base, we must define the complete compatible building and upgrade set for that location family.

### Water Plot

Water Plot is a special location family: predominantly water with a deliberately small shore/strand landing and a fixed pier/bridge. It exists solely for the Floating Sauna building base; no land house, tent, container, cabin or pavilion can be generated there. Its scene is therefore unusually efficient to produce while giving the floating sauna a clear physical identity and guest route.

### Urban Lot

Urban Lot is an owned, bounded city plot with surrounding city buildings only as static backdrop. It always starts with either a tent camp or container compound; it never starts empty and cannot generate a conventional house. All expansion stays inside the visible plot, avoiding construction against unowned neighbouring buildings.

Urban Lot owns these site modules:

1. Arrival Gate and Street Sign.
2. Paved Internal Paths.
3. Warm Overhead and Perimeter Lighting.
4. Large Potted Greenery and Palms.
5. Compact Timber Social Deck.
6. Covered Recovery Pergola.
7. Outdoor Urban Shower.
8. Compact Built Cold Plunge.
9. Outdoor Program Deck.
10. Boundary Wall Treatment or Mural.

### Approved Urban Lot Revision

The base scene includes the gate and usable internal route. Evening lighting is a separate authored layer, never a prerequisite for access.

1. Replace the generic recovery pergola with a Low Urban Canopy and Long Benches, following the bounded plot geometry.
2. Add a Steel-and-Brick Fire Courtyard on a Separate Owned Yard Field.
3. Add a Compact Urban Wild-Bath Alcove behind Fixed Screens on Its Own Field.
4. Add a Water Refill Station with Benches by the Program Deck.
5. Add an Integrated Evening Edge-Light Layer along the Existing Wall, Deck and Walking Fields.
6. Add a Small Street-Facing Sitting Window in the Owned Wall/Gate Field, with visible arrival/waiting anchors entirely inside the player's plot.

Tent Camp and Container Compound retain their own building modules on top of this location set.

### Hotel Rooftop

Hotel Rooftop is a bounded roof lease on a larger existing hotel. The hotel and skyline are static background; the player owns only the roof surface. It always starts with a small Rooftop Sauna beside the lift/stair core and never has a land-level building.

Hotel Rooftop owns these site modules:

1. Lift/Service-Core Arrival Point.
2. Roof Walkways and Level Changes.
3. Safety Rails and Wind Screens.
4. Skyline Viewing Deck.
5. Rooftop Outdoor Shower.
6. Rooftop Cold Plunge.
7. Covered Recovery Pergola.
8. Planted Roof Corners and Large Planters.
9. Evening Roof Lighting.
10. Outdoor Rooftop Program Deck.

### Approved Hotel Rooftop Revision

The lift/service core, required roof walkways/level changes and safety rails are base-scene infrastructure, not purchases. Each remaining facility occupies its own authored roof field.

1. Skyline Viewing Deck.
2. Rooftop Outdoor Shower and Separate Rain-Shower Row behind Screens.
3. Rooftop Cold Plunge.
4. Warm Rooftop Spa.
5. Low Exclusive Wind Canopy in Timber/Bronze with Long Benches, replacing the generic pergola.
6. Extra Wind Screens for Additional Sheltered Niches.
7. Planted Roof Corners and Large Planters.
8. Evening Roof Lighting.
9. Outdoor Rooftop Program Deck.
10. Skyline Lounge with a Small Number of Lounge Chairs and Architectural Parasols.
11. Gas Fire Bowl with Stone Sitting Edges on a Separate Fire-Safe Roof Field.
12. Water Refill Station at the Lift Core with Low Bench and Robe/Towel Detail.

Rooftop Sauna owns these building modules:

1. Lift-Core Entrance and Sign.
2. Compact Reception and Shop Counter.
3. Second Rooftop Sauna Pavilion.
4. Program Sauna Pavilion.
5. Water/City-Facing Glass Front.
6. Enclosed Glass Recovery Room.
7. Compact Third Sauna Volume on structurally suitable roofs.
8. Timber Facade and Material Upgrade.
9. Roof Lantern and Chimney Treatment.
10. Connected Small Recovery Annex.

All roof routes use the vertical route rule: guests enter at the visible lift/stair core, complete a short transition, then appear on the roof walk patch. No guest teleports between street and roof.

Rural Plot represents a broader rural-property family rather than only an empty piece of land. An offer may be an existing tent camp, container compound or country estate with its existing barn/driftsbygning. Every offer starts with a visible physical base; no player builds the first structure from nothing.

## Retired Mixed Canal Reference (Do Not Use For Production)

This early combined list is retained only as conversation history. The approved Canal Location Revision and the building library supersede it.

The following ten-item list is a **combined venue reference** for a compatible canal building. It is not a single location-owned catalogue. It demonstrates how compact building and canal modules can combine without requiring a huge plot.

1. Improved Entrance: new entry surround, lighting and sign; improves first impression.
2. Reception and Shop Window: facade overlay with a modest sales point; enables shop and improves arrival flow.
3. Changing and Service Wing: small side/rear module; improves guest flow without increasing sauna capacity.
4. Extra Sauna Volume: compact rear or loft module; supports more simultaneous sessions.
5. Canal Glass Front: water-facing facade/roof change; a premium appeal improvement.
6. Canal Terrace: narrow timber deck with seating and planters; adds recovery capacity and visible activity.
7. Canal Shower and Cooling Point: small terrace module; improves ritual and cold-water flow.
8. Bathing Bridge: stairs and compact platform into the canal; enables the real cold-water route.
9. Floating Recovery Platform: late, expensive compact water module; high appeal and recovery potential. This is not a floating sauna building.
10. Roof Plunge or Roof Terrace: expensive upward expansion for constrained city plots.

The player may choose among these based on space, cash and fit; they are not a mandatory sequence and are not all required in one venue. Of these, Canal itself owns only the canal terrace, canal shower/cooling point, bathing bridge and floating sauna platform. The remaining items are building modules or building modules requiring a canal-facing variant.

### Approved Canal Location Revision

Canal owns only its water, quay and promenade fields. The compatible building owns facade and program upgrades.

1. Narrow Canal Terrace on an Authored Quay Field: recovery seating and activity anchors.
2. Canal Shower/Cooling Point: a visible rinse route on its own terrace/quay field.
3. Canal Bathing Bridge: primary full water route with descent, entry, swim/idle, exit and winter state where appropriate.
4. Small Canal Descent with Broad Sitting Edges: a second, independent water-entry field that works without the bathing bridge.
5. Low Quay-Light Line along an Existing Promenade Field: evening wayfinding and water-reflection effects.
6. Canal Planting Beds: robust grasses and plants on existing edge fields without obscuring the quay.

The Floating Recovery Platform is removed. No wind-screened canal loggia is added.

## Retired Mixed Harbour Reference (Do Not Use For Production)

This early combined list is retained only as conversation history. The approved Harbour Location Revision and the building library supersede it.

Harbour supports a larger, more industrial waterfront path than Canal. Its compatible building bases are smaller warehouses, boathouses, harbour service buildings, boat/motor workshops, former cold/fish houses and container modules. Active or polluted harbour basins do not generate water-entry upgrades; clean, calm bathing basins may do so. This is a combined venue reference: Harbour itself owns quay terrace, outdoor Aufguss yard, eligible harbour steps and floating sauna raft. Other listed items belong to the building layer.

1. Restored Loading Doors: warm, recognisable entrance transformation.
2. Quay Shop and Service Window: compact facade module for shop and guest flow.
3. Larger Sauna Hall: high-volume conversion or compact side wing for sauna capacity.
4. Changing and Service Volume: robust rear module for arrival and operations.
5. Water-Facing Glass Front: premium harbour facade transformation.
6. Quay Terrace: deck, durable seating and wind shelter for recovery capacity.
7. Outdoor Aufguss Yard: small covered outdoor program space.
8. Harbour Steps: broad fixed water access, only at eligible bathing basins.
9. Floating Recovery Raft: late, expensive water module with strong identity. This is not a floating sauna building.
10. Roof Deck with Plunge: compact roof recovery and view facility.

### Approved Harbour Location Revision

Harbour owns only fixed quay, basin and promenade fields. Water features appear only on base variants with a calm, eligible bathing basin.

1. Quay Terrace: robust recovery/social space on an authored quay field.
2. Quay Aufguss Stage with Fixed Wind Screens: a location-owned exterior program field that compatible buildings may operate.
3. Harbour Steps: a complete water-entry route only at eligible bathing basins.
4. Harbour Shower Row: multiple independent outdoor-shower fields on a defined quay area.
5. Low Quay Lantern Line: authored evening-light and reflection layer.
6. Salt-Tolerant Planting Fields: large planters with grasses/small pines on existing quay edges.
7. Small Bounded Harbour Dip Zone: a separate independent water field with float boundary, direct steps/ladder, swim/idle and exit anchors.

The Floating Recovery Raft and the sheltered seating stand between bollards/rails are removed.

### Approved Industrial District Location Set

Industrial District has no natural-water route. Every facility uses a separate authored yard, wall, port or walkway field and stays physically plausible beside the selected base building.

1. Industrial Arrival Court with Gate, Sign and Fixed Walking Route.
2. Large Shared Program Yard on an Authored Open Yard Field.
3. Outdoor Shower Row beneath a Steel Canopy.
4. Long Constructed Cold Basin in Concrete/Steel.
5. Sunken Warm Spa Pool in the Industrial Yard, only on large base variants.
6. Long Recovery Canopy with Benches and Wind Screens.
7. Industrial Greenery Fields on Existing Walls and Yard Edges.
8. Low Evening Light along Walkways, Gate and Basin Edges.
9. Open Port Social Field with Communal Tables, using an existing industrial port anchor.

## Locked Forest Lake Location Set

Forest Lake is a quiet destination location with low spontaneous traffic and strong recovery/natural-water appeal. Compatible bases are tents, containers, small timber cabins, lake pavilions, forest cabins/lodges and smaller retreat buildings. The location owns these ten terrain and water modules:

1. Arrival Path and Discreet Lighting.
2. Forest Terrace at the building/forest edge.
3. Lake Deck at the shore.
4. Lake Bathing Bridge.
5. Lake Shower on the water route.
6. Floating Rest Platform.
7. Cooling Path between sauna, shower and lake.
8. Forest Clearing with benches and fire circle.
9. Covered Lakeside Shelter.
10. Outdoor Program Space by the Lake.

Forest Lake excludes broad halls, hard urban paving and visually intrusive expansion. Its water advantage still needs real access, flow and recovery facilities to perform well.

### Approved Forest Lake Revision

The base scene always includes a usable arrival/water path. The purchasable Forest Ritual Path is a separate authored decorative/recovery field of stepping stones and low lights; no bridge, shower or water route depends on buying it.

1. Retain the forest terrace, lake deck, bathing bridge, lake shower, floating rest platform, fire clearing, covered lakeside shelter and outdoor program space.
2. Add a Rock-Edged Warm Spa Pool on an authored larger forest-clearing field only.
3. Add a Forest Shower Row beneath an Existing Long Timber Eave.
4. Add a Quiet Stone/Bench Circle at the Water on a fixed shore field, with no fire.
5. Add a Dark Timber View Frame and Shelter around an Existing Lakeside Sitting Field, without blocking water access or view.

The raised viewing platform between trees is removed.

### Approved Coast Location Set

Coast base scenes have a usable coastal path from the start. The purchasable Evening Coast Path is a separate authored lighting/sitting field; no facility access depends on purchasing it.

1. Outlook Deck.
2. Protected Coastal Terrace.
3. Sea Steps only in an Authored Sheltered Cove/Calm Coastal Pocket.
4. Coastal Shower Row under a Low Timber Roof.
5. Wind/Changing Shelter.
6. Cliff/Rock Sitting Niche.
7. Outdoor Program Deck behind Fixed Wind Screens.
8. Low Coastal Lantern Line.
9. Rock/Stone-Integrated Warm Spa Pool on a Fixed, Sheltered Terrace Field.
10. Low Stone/Timber Wind Wall around an Existing Sitting Field.
11. Coastal Planting Fields with Marram Grass, Robust Grasses and Low Pines.

Some Coast base variants may also contain a Natural Spring or Stream-Mouth Cooling Point. It is a separate, complete cold-recovery field only where visibly present in the base geography; it is never generated on ordinary exposed coast scenes.

The generic bathing platform is removed because it would be implausible on exposed coast scenes.

### Approved Beach Location Set

Beach base scenes include a usable boardwalk from the beginning. The purchasable Evening Boardwalk is a separate authored light/sitting field and does not gate any facility access.

1. Beach Deck.
2. Water Bridge.
3. Beach Shower Row beneath a Timber Eave.
4. Changing/Wind Shelter.
5. Sun and Recovery Zone.
6. Dune Sitting Niches.
7. Outdoor Program Deck.
8. Floating Platform only in an Authored Calm Beach Cove with Short Fixed Access.
9. Evening Beach Light Layer.
10. Freestanding Warm Spa Pool on a Fixed Sheltered Beach Field behind the Dune.
11. Low Timber-Screen Recovery Yard.
12. Beach Fire Circle with Sitting Logs on a Separate Safe Sand Field.
13. Dune Planting Fields with Marram Grass and Robust Grasses.
14. Beach Lounge Chairs on an Existing Sun/Recovery Field.
15. Small Water Refill Station on an Existing Recovery/Arrival Field.

### Approved Rural Plot Location Set

Rural Plot base scenes include an arrival route. The purchasable Nature/Ritual Path is a separate authored stepping-stone/light/sitting field and never gates a facility route.

1. Meadow Terrace.
2. Planting and Living Windbreak Fields.
3. Outdoor Shower Field and Long Shower Row under Timber Eave.
4. Constructed Cold Plunge.
5. Outdoor Program Field.
6. Fire Circle.
7. Covered Outdoor Recovery Area.
8. Sunken Warm Spa Pool on a Fixed Garden/Terrace Field.
9. Small Orchard Recovery Zone with Long Benches and Lounge Chairs.
10. Open Barn/Field-Edge Program Yard on an Authored Field.
11. Stone-Edged Spring/Cold-Water Pocket only on rare base variants with a visibly present spring or stream.
12. Rural Planting Fields with Fruit Trees, Tall Grasses and Wildflowers on Existing Edges.

### Approved Water Plot Location Set

Water Plot starts with its small shore landing, fixed gangway, safe bathing zone and the Floating Sauna's direct deck jump/ladder route. These are never gated behind upgrades.

1. Floating Recovery Pontoon.
2. Floating Warm Spa Pool on Its Own Pontoon Field.
3. Bounded Swim Room/Floating Net: a larger calm-water swim field with buoy/net boundary and more simultaneous swim anchors.
4. Sun and Recovery Deck at the Shore Landing.
5. Small Shore Changing Cabin at the Landing.
6. Shore Shower at the Gangway Root.
7. Floating Fire Bowl with Sitting Edges on a Separate Authored Pontoon Field.
8. Outdoor Aufguss Platform on the Pontoon: larger than the Floating Sauna's small inter-pod alcove, with its own guest/program anchors.

The elevated shore outlook platform and evening buoy/underwater-light layer are removed.

## Shared Outdoor Effects and Facilities

Outdoor steam and outdoor showers are shared compatible assets, not one-off art for each venue. A small reusable steam-effect library will cover chimney, outdoor sauna, hot shower and cold-weather breath/heat contrast. Outdoor shower modules can be used beside suitable terraces, bridges, beach decks, forest decks and harbour facilities; their visual housing adapts to the location material set.

Guests use a real shared shower route where a shower is present: walk to shower, enter a short rinse loop, then continue to water, terrace or entrance. The character needs only one reusable shower pose/loop per supported body base; the falling water and splash are separate effects layered above it. This gives visible activity without drawing a unique shower animation for every guest variation.

Outdoor changing tents and small changing pods are shared compatible facilities. They are used on water/shore routes where a permanent building does not plausibly provide a nearby change point. Their material varies by place: canvas at beach/forest, timber at lake/coast, and compact metal/wood at urban sites.

Slatted timber wind/privacy screens are shared exterior modules for Coast, Beach, Hotel Rooftop and Urban Lot. They create visible shelter, privacy and seating niches while reusing a small asset family with location-specific materials.

Water Plot may add a late Floating Recovery Pontoon with seating and a water-entry anchor. It is not a second sauna building. The Floating Sauna building may later add a second small connected sauna pod as its major capacity expansion.

## Locked Warm Outdoor Spa Facility

Warm outdoor spa is one functional facility with four location/building-specific visual variants. It is distinct from cold plunge and natural-water bathing:

1. **Wild Bath:** raised timber tub for tent camps, container compounds, cabins, pavilions, boathouses, compact waterfront buildings and rural properties.
2. **Sunken Spa Pool:** built into terrace, yard or garden for country estates, kursteds, Forest Lake, Coast, Beach and larger industrial venues.
3. **Rooftop Spa:** a contained roof basin for Hotel Rooftop only.
4. **Floating Spa Pool:** a warm basin on the Floating Recovery Pontoon for Water Plot only.

Compact Canal, Harbour, workshop, depot and fish-house venues may use the raised wild-bath/quay-spa variation but not a large sunken pool. Every variation uses the shared guest route and animation contract: approach, step into the basin, seated water loop, stand/exit and return. Provide 2-4 compatible seated positions plus separate steam, bubble, water-surface and entry/exit-splash effects.
