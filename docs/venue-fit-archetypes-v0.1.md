# Sauna Sim Venue Fit Archetypes v0.1

## Purpose

This is the first balance catalogue for `Venue Fit`: the fit between a specific Aufguss and its full physical place.

It does not prescribe recipes or decide Composition Tier. It identifies at least three credible routes through which every locked building base can reach `Rare` or `Iconic` Venue Fit when paired with a compatible location, required visible upgrades and a matching local market. Exact score values are deferred to the balance pass.

## How to Read a Route

Each route names a program promise, not a mandatory ingredient list. The player can reach it through many material, music and performance combinations. `Required physical support` is non-negotiable: a route cannot score strongly if the visible room, field or recovery facility is absent.

| Field | Meaning |
| --- | --- |
| `Place strength` | What the building + location plausibly offer before an Aufguss is designed. |
| `Strong route` | The kind of program that can use that strength well. |
| `Required physical support` | Concrete existing room, location condition or upgrade needed for the route. |
| `Balance counterweight` | Why the route does not make the base universally strongest. |

## Building-Base Routes

### Saunatelt Camp

| Place strength | Strong route | Required physical support | Balance counterweight |
| --- | --- | --- |
| Intimate, direct outdoor ritual | `Small Gathering`: close social or folk-led Gus | Campfire/rest area or compact deck; modest outdoor recovery | Low throughput and limited weather shelter. |
| Low-cost, simple nature reset | `Dawn Recovery`: quiet, short or standard recovery Gus | Shower or cold basin; calm seating | Cannot sustain a large premium show. |
| Temporary event character | `Pop-Up Pulse`: lively urban/industrial evening Gus | Outdoor program field and arrival flow | Higher crowd pressure and limited parallel capacity. |

### Container Compound

| Place strength | Strong route | Required physical support | Balance counterweight |
| --- | --- | --- |
| Modular raw identity | `Yard Heat`: rhythmic, metal, electronic or industrial Gus | Yard program field and safe recovery route | Smaller rooms limit big shows. |
| Repeatable small format | `Modular Routine`: reliable included Gus with clear turnaround | Extra container sauna or service/recovery module | Does not get destination pull without concept investment. |
| Contrast between hard shell and soft recovery | `Warm Yard Reset`: craft-led recovery Gus | Timber cladding/planting plus shower, basin or deck | Visual transformation costs money and space. |

### Small Timber Cabin

| Place strength | Strong route | Required physical support | Balance counterweight |
| --- | --- | --- |
| Intimate nature setting | `Forest or Lake Ritual`: classic, birch, wood or herb-led Gus | Deck, shore path or outdoor recovery | Limited simultaneous capacity. |
| Calm retreat | `Cabin Recovery`: quiet, ambient or acoustic program | Rest deck and sheltered seating | Less credible for loud, high-volume events. |
| Heat/cold contrast | `Cabin Plunge`: deliberate finale and water recovery | Cold plunge or compatible natural-water access | Queue risk if recovery capacity is not expanded. |

### Pavilion

| Place strength | Strong route | Required physical support | Balance counterweight |
| --- | --- | --- |
| Light, purpose-built connection to landscape | `Panorama Ritual`: refined classic or quiet premium Gus | Glass/front-facing view plus rest deck | Higher build and upkeep than a cabin. |
| Broad outdoor connection | `Open-Air Flow`: rhythmic or social program | Outdoor Gus field and shower/recovery route | Wind and recovery flow constrain session size. |
| Premium recovery setting | `Long Landing`: slower program with a strong rest finish | Lounge/deck and sufficient seating | Not the strongest low-cost routine base. |

### Country Estate with Barn

| Place strength | Strong route | Required physical support | Balance counterweight |
| --- | --- | --- |
| Garden, barn and destination scale | `Garden Classic`: layered traditional or premium ritual | Garden deck, water/shower route and enough recovery space | Restoration and operating costs are high. |
| Existing barn volume | `Barn Gathering`: social or show-led Gus | Large program sauna or field and crowd flow | Requires staff and Masters to avoid poor execution. |
| Slow rural escape | `Orchard Recovery`: long, calm, premium recovery Gus | Orchard/rest field, warm spa or water route | Lower convenience demand than urban venues. |

### Boathouse

| Place strength | Strong route | Required physical support | Balance counterweight |
| Direct water relationship | `Water Ritual`: classic, progressive or recovery Gus | Bathing bridge, calm eligible water access or deck | Water access must be physically safe and has recovery limits. |
| Compact waterfront identity | `Harbour Social`: folk, beer/hops or after-work social Gus | Quay terrace, shop/water service and enough arrival flow | Smaller footprint limits parallel programs. |
| Weathered maritime intimacy | `Storm Watch`: quiet, wood, tea or evening program | Sheltered deck and warm recovery seating | Not a default high-capacity event space. |

### Repair Workshop

Repair Workshop is the Canal Workshop reference venue's building base - the one location with actual runtime code (`src/sim/canalBalance.ts`). Its three routes are the first to be explicitly tagged with the canonical guest need they serve, from `guest-behaviour-model-v0.1.md`'s five visit motivations (Recovery, Ritual, Social, Routine, Special premium). The other twelve building bases below remain untagged for now - do this same pass on them only when their location is actually being implemented, not ahead of it.

| Place strength | Strong route | Required physical support | Balance counterweight |
| Honest industrial conversion | `Forge & Steam`: rock/metal, rhythmic or heat-forward Gus **(Social)** | Program yard or added program volume; outdoor shower/basin | Needs investment to soften recovery flow. |
| Adaptable existing volume | `Workshop Classic`: strong towelwork in a renovated program sauna **(Ritual)** | Added sauna volume and reception/service support | Industrial context alone does not create premium value. |
| City/canal contrast | `Canal Reset`: quiet craft Gus against a raw urban setting **(Recovery)** | Canal recovery access or compact terrace/plunge | Limited exterior space on canal parcels. |

Two of the five canonical needs are deliberately not a `Strong route` above, because they are not primarily about the Aufguss program at all:

- **Special premium** is not a fixed fourth route here - it is Workshop Classic or Forge & Steam delivered at a price the venue's actual visible support (Master craft/style, revealed programme tier) can credibly sustain, per `physicalProgramDemandFit()`'s existing Show Journey handling in `canalBalance.ts`. Adding a dedicated premium route would double-count the same physical support under a different name.
- **Routine** has no program-flavour route at all: a Routine guest's need is served by arrival and reception speed (Entrance Sign, Service Team), not by which Gus is running. See `canalBalance.ts` and `guestWeek.ts` for the implemented version of this.

### Small Depot

| Place strength | Strong route | Required physical support | Balance counterweight |
| Compact practical operation | `Reliable Heat`: short, included routine Gus | Efficient basic sauna and arrival/service flow | Less destination appeal without upgrades. |
| Small industrial social space | `Depot Pulse`: focused rhythmic evening Gus | Yard deck, compact program field and recovery canopy | Strict capacity ceiling. |
| Low-key craft contrast | `Green Edge`: quiet craft Gus that uses planting and sheltered rest | Industrial planting and rest/shower field | Cannot mimic warehouse-scale show capacity. |

### Warehouse

| Place strength | Strong route | Required physical support | Balance counterweight |
| Large existing volume | `Hall Show`: choreographed or story-led large Gus | Large program sauna, crowd-safe flow and enough Masters | Large wage, energy and maintenance burden. |
| Parallel program potential | `Program Night`: several contrasting Gus options in one opening window | Extra sauna room, service volume and recovery capacity | Complexity creates execution and queue risk. |
| Industrial event identity | `Warehouse Ritual`: metal/electronic or unusual Event Essence program | Yard/indoor program support and clear marketing promise | Needs a coherent concept, not just scale. |

### Fiskehus

| Place strength | Strong route | Required physical support | Balance counterweight |
| Robust maritime material character | `Salt & Steam`: coast/harbour special program | Quay/shore recovery and sheltered seating | Not every Fiskehus has safe natural-water access. |
| Honest working-building conversion | `Dockside Social`: folk, beer/hops or social evening Gus | Service hatch, terrace and guest flow | Requires recovery investment to handle social demand. |
| Compact coastal refuge | `Harbour Recovery`: quiet wood, herb or tea-led Gus | Shower, rest deck or warm spa | Limited elegance without renovation investment. |

### Floating Sauna

| Place strength | Strong route | Required physical support | Balance counterweight |
| Direct immersion ritual | `Float & Dip`: classic or recovery Gus with natural-water finish | Fixed deck entry, safe swim zone and ladder return | Small capacity and weather exposure. |
| Rare destination identity | `Waterborne Night`: intimate premium evening Gus | Covered deck/rest point and safe lighting layer | Cannot run high-volume or many parallel sessions. |
| Deliberate event novelty | `Pontoon Pulse`: small social program with a clear maritime promise | Deck crowd limit, return route and recovery timing | Water platform limits both size and equipment scope. |

### Rooftop Sauna

| Place strength | Strong route | Required physical support | Balance counterweight |
| Skyline and city separation | `Skyline Reset`: refined quiet premium Gus | Viewing deck, wind shelter and rest seating | Roof structure and wind limit expansion. |
| Evening urban energy | `High City Pulse`: electronic, pop/disco or rhythmic program | Outdoor rooftop program deck, recovery flow and neighbour-safe sound profile | No natural-water advantage; premium cost must be earned. |
| Exclusive compact occasion | `Above the City`: story-led or high-value small group Gus | Enclosed recovery room, shower/plunge and strong service | Lower capacity than a major hall. |

### Former Kursted / Badesanatorium

| Place strength | Strong route | Required physical support | Balance counterweight |
| Established historic destination | `Restoration Ritual`: classic, herbal or refined premium Gus | Restored program hall and garden/recovery route | Expensive acquisition, restoration and staffing. |
| Large recovery landscape | `Full Recovery Circuit`: slower program with water, shower and rest finish | Multiple recovery facilities with separate routes | Requires flow management; scale can create queues. |
| Grand event potential | `Sanatorium Journey`: story-led, music-led or seasonal special program | Large program room/field, service and crowd support | Not automatically attractive to convenience guests. |

## Cross-Location Guardrails

- A route is available only when the building and location are an already approved compatible pair.
- A water-based route requires actual authored water access. It is never granted by a building name alone.
- Nature, maritime and industrial language are program framing, not material locks. Any material family can contribute if the full concept is coherent.
- A building's high capacity is a trade-off, not a Venue Fit bonus on its own. Flow, staff and recovery must keep up.
- Each route must later be tested at low, mid and high investment to ensure the base has a viable route before its expensive modules are purchased.
- Every proposed `Iconic` Venue Fit route needs an alternative of comparable value on every other compatible building family, though not the same guest count, price or program style.

## Next Balance Pass

For each actual generated offer, the data card must declare:

1. its available archetype routes;
2. required upgrades and their investment band;
3. which of the six Venue Fit evidence families the route uses;
4. the route's capacity, cost and recovery trade-off; and
5. at least one lower-cost route that remains commercially viable.
