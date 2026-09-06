# Sauna Sim Asset Effect Model v0.1

## Rule

Every purchasable visible asset or upgrade receives one game-data card before it enters production. Art, guest routes and economics are approved together; no asset exists only because it looks good unless it is explicitly marked decorative. A functional upgrade may never exist only as a number or menu state: it requires a distinct completed-world graphic. If guests can use it, it also requires at least one authored guest action or triggered effect; purely structural upgrades still require their static transformation plus any appropriate shared ambient effect.

Every purchasable location improvement also has a bounded gameplay effect. Its card must name at least one of: physical capacity/flow, Gus/recovery capability, targeted local attraction, credible price acceptance or return/retention. Lights, planting, paths, view frames and similar scene-defining improvements usually contribute through visible promise and a narrow attraction or price-acceptance route; they may not become unqualified chain-wide income multipliers.

Approval order matters: before a player-facing first offer is chosen, a card locks the facility's function, ownership, compatible field class, route/effect requirements and asset workload, but not its final silhouette or material. The selected location + building base then defines the concrete variant. For example, an Expanded Plunge Basin may become a timber canal basin, a steel industrial trough or a sheltered roof basin while retaining the same capacity, entry anchors and shared water actions. This avoids designing a visually incompatible upgrade before the first purchased venue establishes the scene language.

Every concrete visual phrase in an approved card becomes a production requirement. For example, "spa behind a dune with bubbles, steam and timber screens" requires a beach spa base asset, dune/screen overlay assets, bubble and steam effect sheets, and the relevant guest entry/seated/exit anchors. Descriptive prose is not permission to omit those objects later.

A chosen venue starts with its location/plot and base building only. It does not arrive with a prescribed package of add-on facilities. The player buys compatible facilities in any sensible order, then may buy their approved second-layer upgrades. The authored scene reserves compatible fields from the start, but keeps them visually inactive until the player installs the relevant facility.

## Required Fields

Each asset card declares:

1. **Owner:** location module, building module or shared facility.
2. **Physical limit:** footprint/anchor, simultaneous guest positions and route requirement.
3. **Primary gameplay effect:** choose one clear main job.
4. **Appeal profile:** which guest motivations it supports and which it does not.
5. **Revenue effect:** direct guest spend, capacity to sell more visits, willingness to pay, or no direct revenue.
6. **Operating effect:** any agreed recurring cost or consumption caused by the facility.
7. **Visual/animation package:** required visible state, guest activities and effects.
8. **Compatibility:** eligible location and building tags.
9. **Condition and repair:** whether it can deteriorate, its plausible wear cause and its repair class; decorative assets are excluded.
10. **Construction state:** independent build field, temporary operational consequence and completion reveal.

`simulation-contract-v0.1.md` is the implementation-level version of this card. An asset with incomplete data is not valid content and must not enter art or code production.

## Allowed Primary Effects

An asset has one primary effect, with at most one small secondary effect:

| Primary effect | What it changes |
| --- | --- |
| Sauna capacity | More simultaneous session seats or additional sessions. |
| Aufguss capability | Enables a program type, stronger program fit or parallel program capacity. |
| Cold recovery | Enables or improves cold-water/cold-plunge route capacity. |
| Warm recovery | Enables or improves warm outdoor spa capacity. |
| Rest and social space | Adds seating/linger capacity and visible outdoor activity. |
| Shop | Enables shop sales or expands the small automatic shop assortment. |
| Arrival quality | Makes entering, first impression and early guest experience better. |
| Premium presentation | Raises willingness to pay for suitable guests without creating capacity. |

Do not introduce generic "operations", "storage" or "staff efficiency" bonuses until those systems are separately designed and approved.

## Appeal Profile

Appeal uses the existing visit motivations rather than arbitrary personality stereotypes:

- Recovery
- Ritual/tradition
- Social
- Routine/convenience
- Special premium

Each card has a small positive/neutral/negative profile against these motivations. The player sees qualitative feedback; the simulation uses the values internally.

## Revenue Model

Assets do not all add a flat income amount. Their revenue contribution must specify one of these mechanisms:

- **More sellable seats:** additional capacity creates more possible admissions/paid Aufguss seats.
- **Higher spend per guest:** shop, paid program or premium facility increases expected visit spend for attracted guests.
- **Higher willingness to pay:** premium presentation supports a higher entrance/program price when the market fit is present.
- **Retention and return:** a better complete visit raises repeat-visit probability.
- **No direct revenue:** decorative or route-only assets improve the scene without a financial number.

Every card also records a one-off purchase cost. Recurring running cost is added only when the facility plausibly consumes energy, water, cleaning or paid service; it is not an automatic tax on every decorative object.

## Example: Wild Bath

```text
Owner: shared warm-recovery facility
Primary effect: warm recovery
Secondary effect: rest and social space
Appeal: recovery ++, social +, ritual +, premium neutral, routine neutral
Revenue: retention and return; supports higher spend from recovery-oriented guests
Capacity: 4 seated guest anchors
Costs: purchase + modest heat/water running cost
Visual: step-in, 4 seated loops, steam, bubbles, exit splash
Compatibility: tent, container, cabin, pavilion, boathouse, compact waterfront venues, rural estate
```

Exact numbers are set only after the first simulation/balance pass. The field structure is locked now so assets remain comparable.

## Core Asset Cards

### 1. Extra Sauna Room

| Field | Definition |
| --- | --- |
| Owner | Building module |
| Primary effect | Sauna capacity |
| Physical rule | Adds one authored sauna room/volume to the existing building; the room's seats depend on its building family. |
| Appeal | Ritual/tradition `+`; recovery `+`; special premium is neutral unless the room has a premium variant. |
| Revenue | More sellable admissions and more possible paid program seats. |
| Cost | High one-off build cost; recurring heat/cleaning cost. |
| Route/visual | New door/entry anchor, increased chimney/roof steam, more arrival/exit activity. |

### 2. Program Sauna

| Field | Definition |
| --- | --- |
| Owner | Building module |
| Primary effect | Aufguss capability |
| Physical rule | Adds one program-capable room with its own session seats; it can run in parallel with another sauna only when staffing/program settings support it. |
| Appeal | Ritual/tradition `++`; social `+`; special premium `+`; exact fit depends on the program and Master. |
| Revenue | Enables additional paid show/premium Aufguss seats; standard sessions can remain included. |
| Cost | High one-off build cost; recurring heat/consumables and Master time when a program runs. |
| Route/visual | Program entry/exit anchor, stronger timed steam effect and optional queue/arrival activity. |

### 3. Compact Cold Plunge

| Field | Definition |
| --- | --- |
| Owner | Building module/shared facility |
| Primary effect | Cold recovery |
| Physical rule | Compact basin with 2-4 guest anchors, depending on the art variant. |
| Appeal | Recovery `++`; ritual/tradition `+`; special premium `+`; social is neutral. |
| Revenue | Supports higher repeat visits and willingness to pay among guests seeking a complete heat/cold ritual; no flat fee by default. |
| Cost | Medium one-off cost; modest water/cleaning cost. |
| Route/visual | Approach, optional shower, step-in, cold-water loop, exit and return; ripple/splash effects. |

### 4. Natural-Water Bathing Bridge

| Field | Definition |
| --- | --- |
| Owner | Location module |
| Primary effect | Cold recovery |
| Physical rule | Requires a water-eligible location and connects sauna/terrace to a dedicated water-entry route; 4-8 activity anchors across bridge and water. |
| Appeal | Recovery `++`; ritual/tradition `++`; special premium `+`; social `+`. |
| Revenue | Improves destination appeal, retention and price tolerance; does not charge per water entry by default. |
| Cost | High one-off shore/quay cost; modest safety/cleaning upkeep. |
| Route/visual | Full bridge route, water descent, entry, swim/idle, exit, winter ice-opening state and water effects. |

### 5. Wild Bath

| Field | Definition |
| --- | --- |
| Owner | Shared warm-recovery facility |
| Primary effect | Warm recovery |
| Physical rule | Raised timber basin with 4-8 seated anchors. |
| Appeal | Recovery `++`; social `+`; ritual/tradition `+`; premium neutral. |
| Revenue | Raises return likelihood and spend from recovery-oriented guests. |
| Cost | Medium one-off cost; modest ongoing heat/water cost. |
| Route/visual | Step-in, seated water loop, exit; steam, bubbles, surface movement and splash effects. |

### 6. Sunken Spa Pool

| Field | Definition |
| --- | --- |
| Owner | Location module/shared warm-recovery facility |
| Primary effect | Warm recovery |
| Physical rule | Large built pool with 6-12 seated anchors; only eligible on sufficiently large ground-level properties. |
| Appeal | Recovery `++`; social `+`; special premium `++`; ritual/tradition neutral. |
| Revenue | Supports higher willingness to pay and more premium/recovery guest spend. |
| Cost | Very high one-off build cost; meaningful heat, water and cleaning cost. |
| Route/visual | Multiple steps/seats, steam/bubbles, entry/exit splashes and evening-light state. |

### 7. Terrace or Recovery Deck

| Field | Definition |
| --- | --- |
| Owner | Location module or building-attached module |
| Primary effect | Rest and social space |
| Physical rule | Adds 4-12 seats/standing anchors depending on its footprint. |
| Appeal | Recovery `+`; social `+`; special premium `+` for high-quality variants. |
| Revenue | Improves visit completion and return likelihood; can support spending when directly connected to a shop, but does not create sales alone. |
| Cost | Medium one-off build cost; no inherent recurring cost. |
| Route/visual | Sit, stand, towel/idle and optional fire/steam anchors. |

### 8. Outdoor Shower

| Field | Definition |
| --- | --- |
| Owner | Location or building-attached module, depending on its physical placement |
| Primary effect | Cold recovery support |
| Physical rule | One or two rinse anchors; may be required as part of a water/spa route, but does not increase sauna seats. |
| Appeal | Recovery `+`; ritual/tradition `+`; all other motivations neutral. |
| Revenue | No direct income. It makes water/spa routes complete and raises their practical value. |
| Cost | Low-to-medium one-off cost; small water cost. |
| Route/visual | Walk, short rinse loop and departure; falling-water and splash effect anchors. |

### Outdoor Shower Multiplicity Rule

Outdoor showers are a shared repeatable facility family. Every compatible venue base may expose one or more separate authored shower fields; a player can buy each field independently in any order. Each field has its own physical frame, rinse anchor and effect anchor, adapted to the venue material (canvas, timber, copper pipe, steel, stone or roof screen).

An additional shower raises only the practical throughput of the linked cold/warm recovery route. It does not create a generic satisfaction or staff-efficiency bonus, and a small building may not receive an implausible shower row.

### 9. Reception Shop

| Field | Definition |
| --- | --- |
| Owner | Building module |
| Primary effect | Shop |
| Physical rule | One guest purchase-stop anchor; automatic small assortment of 3-5 products. |
| Appeal | Routine/convenience `+`; social `+`; premium can be `+` only for an appropriate venue/assortment. |
| Revenue | Direct per-guest product spend minus automatic purchasing cost. |
| Cost | Medium one-off build cost; product purchasing cost, not a generic staff/inventory stat. |
| Route/visual | Shop-stop/brief purchase loop, product display and optional service-window animation. |

### 10. Outdoor Changing Pod

| Field | Definition |
| --- | --- |
| Owner | Shared facility |
| Primary effect | Arrival quality |
| Physical rule | Adds a credible nearby change point for water/shore venues; 2-6 hidden transition anchors by pod size. It does not create a new generic efficiency stat. |
| Appeal | Routine/convenience `+`; recovery `+` where it completes a water route; premium neutral. |
| Revenue | No direct income. It lets the venue use its water/recovery capacity without an implausible guest route. |
| Cost | Low-to-medium one-off build cost; small cleaning cost only if the final operations model supports it. |
| Route/visual | Approach, enter threshold, short hidden change transition, exit in correct apparel state and continue. |

## Approved Upgrade Layers: Reception Shop

These are upgrades of an already-built Reception Shop, not independent facilities. Their primary effect is always stronger, more appropriate shop trade. Any recovery or identity benefit is secondary and must not become a generic revenue multiplier.

### Hydration Counter

| Field | Definition |
| --- | --- |
| Parent facility | Reception Shop |
| Primary effect | Expands drink range and raises shop conversion for recovery- and convenience-motivated guests. |
| Secondary effect | A brief water stop can complete part of an eligible post-Gus recovery journey. It does not replace an Outdoor Shower, Cold Plunge or Rest Deck. |
| Visual change | A chilled counter, refill point and readable drinks display added within the existing shop field. |
| Route/effect | Reuses the shop-stop anchor with a short refill/purchase hold; no new map route or character animation family. |

### Venue Goods Display

| Field | Definition |
| --- | --- |
| Parent facility | Reception Shop |
| Primary effect | Expands towel, robe and wellness-product trade, particularly for premium- and destination-motivated guests. |
| Secondary effect | Enables venue-name merchandise once the later venue-identity gate is met; it provides a modest visible first-impression contribution, not a standalone appeal multiplier. |
| Visual change | A fuller lit window/display with folded textiles and selected goods, integrated into the existing shop facade. |
| Route/effect | Reuses the shop-stop anchor and existing purchase animation; branded stock needs only a display-state variant, not a new character animation. |

## Approved Upgrade Layers: Outdoor Shower

These upgrades remain part of one Outdoor Shower facility. They first improve its recovery-route function; any Gus-language support is secondary.

### Twin Rinse Rail

| Field | Definition |
| --- | --- |
| Parent facility | Outdoor Shower |
| Primary effect | Adds one usable rinse bay and increases linked recovery-route throughput. |
| Secondary effect | Reduces shower-related queue pressure before a compatible Cold Plunge or natural-water route. |
| Visual change | A second shower head and drain detail added to the existing shower field. |
| Route/effect | A second authored rinse anchor using the shared guest rinse loop and `shower-water` effect. |

### Cold Cascade Bucket

| Field | Definition |
| --- | --- |
| Parent facility | Outdoor Shower |
| Primary effect | Strengthens the shower's cold-recovery moment for programs with `Fresh`, `Ritual` or energetic contrast. It does not add a second recovery facility. |
| Secondary effect | Provides specific Venue Fit evidence for compatible Gus delivery, without raising generic admission demand or shower throughput. |
| Visual change | A timber tipping bucket, pull chain and splash apron fitted above the existing shower field. |
| Route/effect | Requires a dedicated `cascade-rinse` guest action: reach/pull, brief bucket-tip splash, recovery pose and exit. The bucket-tip sprite and a stronger reusable splash effect are required production assets. |

## Approved Upgrade Layers: Cold Plunge

The exact finished basin and deck materials remain deferred until the first location + building offer is selected. Their capacity, route and animation requirements are locked now.

### Expanded Plunge Basin

| Field | Definition |
| --- | --- |
| Parent facility | Cold Plunge |
| Primary effect | Increases the number of usable plunge anchors and reduces linked cold-recovery queue pressure. |
| Secondary effect | Makes a higher-volume cold-finish Gus operationally credible; it does not raise sauna seats. |
| Visual requirement | A visibly larger basin variant with extra entry point(s), cold-surface loop and separate entry/exit splash anchors. |
| Route/effect | Reuses shared plunge entry/exit actions at additional anchors; no unique character-body animation is needed. |

### Ritual Entry Deck

| Field | Definition |
| --- | --- |
| Parent facility | Cold Plunge |
| Primary effect | Improves the plunge approach, exit and short recovery hold around the existing facility. |
| Secondary effect | Supplies clear `Fresh`/`Ritual` Venue Fit evidence for compatible Gus programs; it is not a separate rest-deck facility. |
| Visual requirement | A compact entry platform with handrail, hooks and a sit/dry edge wrapped around the existing plunge field. |
| Route/effect | Adds short sit/dry anchors, reusing the shared sit/stand and towel-prop actions. |

## Approved Upgrade Layers: Outdoor Gus Sauna

`Outdoor Gus Sauna` is a small enclosed sauna or pavilion placed outdoors. Guests and the Master enter it for the actual Gus; exterior art communicates capacity and activity through its building silhouette, door, steam and preparation sequence rather than showing the interior.

### Tiered Interior Benches

| Field | Definition |
| --- | --- |
| Parent facility | Outdoor Gus Sauna |
| Primary effect | Increases that sauna's dedicated Gus seats. |
| Secondary effect | Supports higher-volume shared programs, but does not replace recovery capacity, Master availability or a suitable program. |
| Visual requirement | A visibly wider/taller pavilion variant with changed roofline, window/door treatment and stronger roof/chimney steam. |
| Route/effect | More guests use the same exterior door transition before a session; exterior steam and arrival density communicate the larger interior. No interior cutaway is produced. |

### Master Ritual Station

| Field | Definition |
| --- | --- |
| Parent facility | Outdoor Gus Sauna |
| Primary effect | Improves outdoor-Gus delivery readiness for programs that use several rounds or deliberate tools. |
| Secondary effect | Provides visible program identity and narrow execution support only for the outdoor facility; it is not a universal Master-stat bonus. |
| Visual requirement | A compact covered preparation station beside the sauna entry, with storage for bucket, ice, herbs and compatible tool props. |
| Route/effect | Requires a Master `approach -> prepare at station -> enter sauna` sequence. Tool overlays are selected from the scheduled program; timed roof/chimney steam begins after the Master enters. |

## Approved Upgrade Layers: Program Sauna

Program Sauna upgrades improve only the dedicated indoor Gus room. Exterior-only presentation uses the enlarged building volume, entrance transition and timed steam rather than a room cutaway.

### Bench Gallery

| Field | Definition |
| --- | --- |
| Parent facility | Program Sauna |
| Primary effect | Increases dedicated Program Sauna Gus seats. |
| Secondary effect | Supports larger scheduled sessions, but does not supply demand, a Master or recovery capacity. |
| Visual requirement | An enlarged room volume with modified roofline, additional door/window treatment and stronger timed steam. |
| Route/effect | More guests use the existing program-door transition; denser arrival/exit and steam communicate capacity without showing indoor benches. |

### Heat & Vent Stack

| Field | Definition |
| --- | --- |
| Parent facility | Program Sauna |
| Primary effect | Reduces Program Sauna reset time between Gus sessions, increasing feasible session frequency only when Master availability and opening hours also support it. |
| Secondary effect | Makes longer/higher-intensity program scheduling more reliable in this room; it is not a general venue efficiency bonus. |
| Visual requirement | A distinct larger chimney and vent assembly attached to the Program Sauna volume. |
| Route/effect | Uses a stronger, timed post-session steam/release effect. No guest-body animation beyond the existing program entry/exit transitions. |

## Approved Upgrade Layers: Terrace / Recovery Deck

These upgrades improve the existing rest facility. They do not become a second shop, cold facility or generic appeal source.

### Recovery Loungers

| Field | Definition |
| --- | --- |
| Parent facility | Terrace / Recovery Deck |
| Primary effect | Adds explicit recovery-rest capacity after Gus. |
| Secondary effect | Gives slower `Calm` and recovery-oriented visits a stronger complete journey, without raising sauna or program seats. |
| Visual requirement | Two to four visible loungers integrated into the existing deck field. |
| Route/effect | Requires the reusable `lounge-recline-rise` guest action: settle, calm recline idle and rise. |

### Sheltered Heat Bench

| Field | Definition |
| --- | --- |
| Parent facility | Terrace / Recovery Deck |
| Primary effect | Improves the quality of existing seated recovery space through a fixed bench, wind screen and restrained warm-light/heat detail. |
| Secondary effect | Supplies clear `Calm`/`Warm` Venue Fit evidence for a compatible recovery program; it does not add a weather-management system or generic demand bonus. |
| Visual requirement | A visibly changed bench zone with a screen and evening warm-light state within the original terrace field. |
| Route/effect | Adds dedicated seating anchors using the shared `bench-sit-stand` action and `light-warm` effect. |

## Approved Upgrade Layers: Base Sauna

These upgrades belong to the venue's ordinary existing sauna function, not to the dedicated Program Sauna or Outdoor Gus Sauna. The final building material is derived from the chosen base, while capacity and heat rules remain consistent.

### Expanded Sauna Chamber

| Field | Definition |
| --- | --- |
| Parent facility | Base Sauna |
| Primary effect | Increases ordinary sauna capacity. |
| Secondary effect | Supports higher overall visit throughput, but does not independently create more dedicated Gus sessions. |
| Visual requirement | An attached or widened sauna volume appropriate to the base building, with extra door/window treatment and a chimney/roof change. |
| Route/effect | Adds exterior door-transition density and shared chimney-steam anchors. No interior cutaway or new guest-body action is required. |

### Stone Stove Refit

| Field | Definition |
| --- | --- |
| Parent facility | Base Sauna |
| Primary effect | Makes higher-heat and longer Gus delivery more reliable in the ordinary sauna room. It adds no seats. |
| Secondary effect | Provides narrow physical readiness evidence for programs that actually use the supported heat profile; it is not a venue-wide quality multiplier. |
| Visual requirement | A visibly upgraded chimney/vent or stove expression on the existing sauna volume, adapted to the selected building material. |
| Route/effect | Uses a fuller timed chimney-steam/release effect during an eligible session. Existing door transitions remain sufficient. |
