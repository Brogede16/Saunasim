# Sauna Sim Venue Fit Data Contract v0.1

## Purpose

`Venue Fit` answers one narrow question: **does this particular Aufguss belong in this particular visible place, at this scale, for this local audience?**

It is not a universal quality score, a building rarity score or a reward for owning expensive upgrades. It is the third independent part of an Aufguss result:

```text
Composition Tier + Execution Tier + Venue Fit Tier -> whole-star result
```

This document makes the existing location, building and upgrade library usable as one consistent data model before any final scene art is produced. It supersedes no locked compatibility or route rule; it only gives those rules a shared simulation language.

## The Six Evidence Families

Venue Fit may only use these six families. Each program checks for **supporting evidence**, not a hidden total property score.

| Family | Question | Typical evidence |
| --- | --- | --- |
| `landscape_connection` | Does the setting make the program promise more believable? | calm water, forest outlook, skyline, industrial yard, sheltered coast |
| `building_character_scale` | Does the permanent base credibly support the program's tone and size? | intimate cabin, adaptable workshop, grand bathhouse, compact floating venue |
| `physical_program_facilities` | Are the visible program and recovery facilities actually present? | program sauna, outdoor stage, shower, natural-water route, rest deck |
| `flow_fit` | Can arrivals, sessions and recovery move comfortably at the chosen size? | seats, changing/arrival support, parallel rooms, recovery capacity |
| `local_market_fit` | Does the offer make sense for the local rhythm and discovered demand? | access, price acceptance, quiet/social/event interest, destination willingness |
| `visible_promise` | Does the guest see a coherent, truthful concept before and during the visit? | sign, material treatment, program frame, lighting, planted recovery, water-facing facade |

No family is automatically worth more than the others. A small cabin can score strongly through intimate scale, nature, recovery and a clear promise. A warehouse can score strongly through program scale, flow and event identity. Neither can borrow the other's strengths without visible physical support.

## Shared Tag Vocabulary

The tags below are internal data labels. Player-facing copy uses ordinary language rather than exposing tag arithmetic.

### Landscape Tags

| Tag | Meaning |
| --- | --- |
| `calm_water` | Eligible lake, canal, harbour basin or protected beach water route. |
| `open_sea` | Exposed coast or beach atmosphere; water access needs a protected authored field. |
| `forest_outlook` | Trees, clearing or quiet woodland edge. |
| `rural_landscape` | Orchard, meadow, garden, barnyard or field-edge setting. |
| `industrial_context` | Yard, workshop, warehouse or working-quay character. |
| `urban_access` | Dense footfall, transit or city-neighbourhood convenience. |
| `skyline_view` | Controlled city-height outlook from an eligible roof. |
| `weather_exposed` | Wind, rain or open-water exposure; a strength only when shelter and scale support it. |

### Building Character and Scale Tags

| Tag | Meaning |
| --- | --- |
| `intimate` | Small groups, close ritual and premium scarcity. |
| `modular` | Small repeatable units; flexible but limited in comfort and show scale. |
| `craft_conversion` | Honest adapted working building with material character. |
| `purpose_built` | Clear outward-facing sauna architecture and controlled guest experience. |
| `heritage_destination` | Historic or grand setting with premium expectation and high upkeep. |
| `waterborne` | Direct floating-water identity with strict size and weather limits. |
| `exclusive_roof` | Elevated city occasion with premium service expectation. |
| `event_scale` | Credible larger program volume or several parallel rooms. |

### Facility and Flow Tags

| Tag | Meaning |
| --- | --- |
| `program_room` | Dedicated or suitably upgraded sauna room for scheduled Aufguss. |
| `outdoor_program` | Authored exterior Gus field with safe guest route. |
| `natural_water_finish` | Complete eligible water route, not decorative water nearby. |
| `cold_finish` | Built cold plunge, basin or equivalent complete cold route. |
| `warm_recovery` | Wild bath, spa pool or equivalent complete warm route. |
| `shower_finish` | Outdoor shower route that supports rinse/recovery. |
| `rest_finish` | Seating, deck, lounge or sheltered recovery field with capacity. |
| `parallel_programs` | More than one usable sauna/program lane. |
| `arrival_support` | Enough entry/changing/service capacity for the active guest volume. |
| `service_support` | Shop, host/service space or other visible service capacity appropriate to price. |
| `wind_shelter` | Fixed, credible shelter for exposed outdoor recovery or program use. |

### Market and Promise Tags

| Tag | Meaning |
| --- | --- |
| `quiet_destination` | Guests will travel for calm, recovery and setting. |
| `social_evening` | Stronger evening/social opportunity. |
| `event_interest` | Audience can support unusual, musical or show-led programming. |
| `convenience_demand` | Guests value access, reliable timing and simple service. |
| `premium_acceptance` | A well-delivered premium experience can command a higher price. |
| `value_sensitive` | Price and visible value are especially important. |
| `clear_arrival` | Signage and entrance make the offer understandable before entry. |
| `material_coherence` | Facade, planting, light and exterior treatment reinforce the concept. |
| `program_visibility` | A program frame, stage, steam or visible activity makes the Gus promise legible. |
| `recovery_visibility` | Guests can see that the venue genuinely supports the promised landing/recovery. |

## Location Family Baselines

Location tags describe opportunities and pressures, not guaranteed success. A generated offer adds its own market variation later.

| Location | Baseline strengths | Baseline pressures | Initial market direction |
| --- | --- | --- | --- |
| Canal | `calm_water`, `urban_access`, limited `industrial_context` | tight outdoor footprint, high cost | convenience, after-work social, compact premium |
| Harbour | `industrial_context`, potential `calm_water`, `social_evening` | wind, variable water eligibility, high upkeep | social, event, waterfront destination |
| Industrial District | `industrial_context`, large yards, `event_interest` | no natural water, recovery must be built | value, social evening, event |
| Forest Lake | `forest_outlook`, `calm_water`, `quiet_destination` | low walk-in demand, travel dependence | quiet recovery, premium destination |
| Coast | `open_sea`, `weather_exposed`, destination outlook | exposed water, remote access, costly construction | premium destination, ritual, seasonal social |
| Beach | `open_sea`, broad recovery space, summer social potential | exposure, seasonality, premium water facilities need shelter | social, recovery, destination |
| Rural Plot | `rural_landscape`, expansion room, lower land pressure | no guaranteed water, low casual demand | quiet recovery, group destination, value |
| Water Plot | `calm_water`, `waterborne`, direct immersion ritual | extreme footprint/capacity limit, weather | intimate premium, destination |
| Urban Lot | `urban_access`, bounded modular growth, `social_evening` | no natural water, neighbour/sound constraints | convenience, social, value-sensitive |
| Hotel Rooftop | `skyline_view`, `urban_access`, `exclusive_roof` | wind, structural limits, high cost | premium, evening occasion, convenience |

## Building Base Baselines

These tags are permanent. Building modules can add evidence, but never erase a base's intended capacity or identity limits.

| Building base | Character tags | Default strengths | Non-negotiable limits |
| --- | --- | --- | --- |
| Saunatelt Camp | `intimate`, `modular` | direct ritual, low entry cost, outdoor connection | low weather shelter and throughput |
| Container Compound | `modular`, `craft_conversion` | compact repeatable format, industrial contrast | limited room scale and recovery comfort |
| Small Timber Cabin | `intimate`, `craft_conversion` | calm, traditional, personal recovery | limited simultaneous capacity |
| Pavilion | `purpose_built` | landscape connection, controlled recovery, flexible mid-scale | investment/upkeep and exposure at outdoor scale |
| Country Estate with Barn | `heritage_destination`, `event_scale` | rural destination, garden recovery, large programs | high restoration, staffing and operating cost |
| Boathouse | `craft_conversion`, `intimate` | water ritual, maritime social, compact identity | small footprint and water-flow limits |
| Repair Workshop | `craft_conversion` | industrial/program contrast, adaptable conversion | recovery and service need investment |
| Small Depot | `craft_conversion`, `intimate` | efficient accessible routine, modest social format | strict capacity and weak destination pull at base |
| Warehouse | `craft_conversion`, `event_scale` | high program scale, parallel formats, event identity | high wage, energy, maintenance and queue risk |
| Fiskehus | `craft_conversion`, `intimate` | maritime material identity, compact coastal refuge | water eligibility and premium finish need work |
| Floating Sauna | `waterborne`, `intimate` | immersion ritual, rare setting, scarcity | very limited capacity, weather and equipment scope |
| Rooftop Sauna | `exclusive_roof`, `intimate` | skyline occasion, refined city energy | structural/wind limits and premium service expectation |
| Former Kursted / Badesanatorium | `heritage_destination`, `event_scale` | established recovery landscape, grand program potential | expensive purchase, restoration, flow complexity |

## Upgrade Evidence Rules

An upgrade adds only the evidence it visibly and physically provides. It never grants a generic Venue Fit boost.

| Upgrade family | Evidence it may add | Cannot add |
| --- | --- | --- |
| Extra sauna room, sauna wing, sauna pod or bench refit | `program_room`; sometimes `parallel_programs` | recovery, premium promise or market demand by itself |
| Outdoor Gus field, stage or alcove | `outdoor_program`, `program_visibility`; `wind_shelter` if designed in | indoor capacity or water access |
| Bathing bridge, steps, protected dip zone | `natural_water_finish`, `recovery_visibility` | water eligibility on unsafe/exposed scenes |
| Cold plunge/basin/spring pocket | `cold_finish`, `recovery_visibility` | natural-water identity |
| Wild bath/spa pool | `warm_recovery`, `rest_finish`, `recovery_visibility` | higher Aufguss room capacity |
| Shower row, rain shower or shower pod | `shower_finish` | a complete water finish without its own water route |
| Terrace, deck, seating, lounge or shelter | `rest_finish`; sometimes `wind_shelter` | a premium program without delivery quality |
| Entry pavilion, changing module, service wing | `arrival_support` | program quality or destination appeal by itself |
| Shop/reception hatch and water station | `service_support`; sometimes `clear_arrival` | capacity or recovery access |
| Sign, program frame and concept-led light layer | `clear_arrival`, `program_visibility`, `material_coherence` | a false premium promise when the visit cannot deliver |
| Timber cladding, glass front, planting and facade treatment | `material_coherence`; setting-specific `recovery_visibility` | operating capacity or water access |
| Wind screens and covered canopies | `wind_shelter`, sometimes `rest_finish` | a weather-proof high-volume event venue |

## Route Evaluation Rules

For every saved Aufguss, Venue Fit first selects one or more eligible **routes** from `venue-fit-archetypes-v0.1.md`. A route is eligible only when its required physical tags are present.

Then the model evaluates six bounded evidence readings:

1. **Landscape Connection:** Does the location strengthen the intended feeling or finish?
2. **Building Character & Scale:** Is the selected program's tone and group size credible for this base?
3. **Physical Program Facilities:** Are required sauna, outdoor, water, shower, warm/cold and rest facilities present?
4. **Flow Fit:** Can the chosen frequency and guest count pass through arrival, room and recovery without undue pressure?
5. **Local Market Fit:** Does the generated local market have reason to value this offer at its price and time?
6. **Visible Promise:** Do entry, exterior treatment and visible activity truthfully signal what guests will receive?

### Tier Boundaries

| Tier | Requirement |
| --- | --- |
| `Bad` | A claimed route lacks essential physical support, or program scale severely exceeds flow/venue plausibility. |
| `Normal` | The program is credible at the venue, but uses few distinctive strengths or has unresolved pressure. |
| `Rare` | A coherent program makes meaningful use of at least three evidence families, with no major contradiction. |
| `Iconic` | A coherent program makes distinctive use of at least four evidence families, including physical facilities and flow, while matching a credible local market/visible promise. |

`Venue Fit` is capped at `Normal` if the session execution is `Bad`. It may influence targeted attendance, price acceptance, retention and word of mouth only when execution is at least `Normal`.

## Balance Safeguards

1. Every compatible building base must have at least one commercially viable low-investment `Normal` route.
2. Every base must have two or three credible `Rare`/`Iconic` routes at comparable investment value, never necessarily the same capacity or price.
3. Natural water is a strong route enabler, not a universal bonus. A rooftop, depot or rural venue must be able to reach comparable high fit through another coherent route.
4. Large capacity raises possible revenue and possible queue/service failure together. It is never a direct fit bonus.
5. Expensive upgrades must improve a specific observable pressure, route or promise. They cannot become hidden global multipliers.
6. Local-market tags influence attendance and value only. They never forbid a player from offering a different concept; a strong, visible, well-executed concept can broaden demand over time.

## Required Offer Card Fields

Before a generated offer or a later venue enters implementation, its content card must declare:

```text
location_id
building_base_id
compatible_location_fields[]
building_fields[]
available_upgrade_ids[]
initial_facility_tags[]
capacity_envelope
market_direction_tags[]
visible_clue_pool[]
eligible_venue_fit_routes[]
low_investment_route
rare_or_iconic_routes[]
```

This is deliberately sufficient for balancing and content review. Coordinates, sprite packages and effects are separate later production work.

## Next Content Pass

1. Create the first offer cards using this schema, beginning with the Canal reference combination.
2. Define generated market directions and the player-facing clue pool.
3. Validate one low-, mid- and high-investment route for every compatible building family.
4. Only after those are approved, create scene layouts, route maps and final art packages.
