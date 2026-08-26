# Sauna Sim Asset Effect Model v0.1

## Rule

Every purchasable visible asset or upgrade receives one game-data card before it enters production. Art, guest routes and economics are approved together; no asset exists only because it looks good unless it is explicitly marked decorative.

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
