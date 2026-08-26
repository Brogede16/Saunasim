# Sauna Sim Venue Offer Card Contract v0.1

## Purpose

A venue offer is the unit the player evaluates and eventually buys. This contract turns the locked location/building library into reviewable content without requiring scene art, coordinates or final numbers.

```text
location + authored plot + compatible building base + market/economy variation = venue offer
```

The prototype may begin at the Canal reference venue for testing. The production game begins with three affordable viable offers generated from this contract.

## Mandatory Offer Card

Every offer must include the following fields before it can enter implementation.

| Field | Requirement |
| --- | --- |
| `offer_id` | Stable content ID, never derived from player text. |
| `location_id` / `building_base_id` | Must be a locked compatible pair. |
| `property_card_copy` | Two truthful strengths, one real pressure, one physical/market clue. |
| `purchase_or_lease_terms` | Whole-dollar price/rent direction, renovation condition and recurring obligation. |
| `starting_capacity_envelope` | Arrival/changing, sauna, special Gus, recovery/rest and shop channels. |
| `initial_facilities` | Only facilities that actually exist at acquisition. |
| `available_location_upgrades` | Site-owned fields compatible with this specific plot variant. |
| `available_building_upgrades` | Base-owned modules compatible with this building variant. |
| `venue_fit_routes` | One viable low-investment route and 2-3 possible Rare/Iconic routes. |
| `market_profile` | Six internal directions, three context values and approved clue roots. |
| `economic_profile` | Acquisition, renovation, operating-pressure and first-loan direction. |
| `route_commitment` | Text list of every guest-visible activity that will need an authored route later. |
| `balance_counterweights` | Why this offer cannot become universally strongest. |

An offer does not need final prices, coordinates, animation sheets or polished copy at this stage. It does need enough information to decide whether it is believable, balanced and worth producing.

## Offer Validity Rules

1. Every offer has an existing physical starter base. There are no empty plots or free first-structure construction.
2. A building base is permanent. Only tent and container families can add matching units, and they remain that family.
3. A water route is only listed if the exact location variant has an eligible authored water field.
4. Every offer has one affordable low-investment route that can operate at `Normal` Venue Fit.
5. Every offer has a real pressure: cost, access, weather exposure, capacity, flow, recovery, service or market conversion. “It is different” is not a pressure.
6. Every expensive strength has a comparable alternative strength on other compatible venue families, though not necessarily the same seats, price or guest count.
7. Every player-facing clue must be true but incomplete. It must not state the correct program or expose hidden scores.

## First-Offer Generation Rules

When a player needs a first venue, the generator presents three offers:

- all three are financially reachable through starter cash and/or the approved first borrowing room;
- no offer has an impossible initial capacity/operating cost mismatch;
- the set contains contrasting physical opportunities rather than three versions of the same idea;
- natural water may appear, but cannot be the sole economically sensible choice;
- one offer may be more expensive or aspirational, but it cannot crowd out two viable modest options;
- the player may search again using the already approved search cost/time model, with no hidden penalty for rejecting the set.

The first production pool should draw from Canal, Industrial District, Forest Lake, Rural Plot, Beach, Urban Lot and selected Harbour variants. Coast, Water Plot, Hotel Rooftop, Warehouse and Kursted offers normally enter after the player has established enough value, cash flow or borrowing room to make their pressures legible rather than punitive.

## Canal + Repair Workshop Reference Offer

This is the canonical technical/balance reference, not the only future Canal offer.

| Field | Reference content |
| --- | --- |
| `offer_id` | `canal_repair_workshop_reference` |
| Location / base | Canal + Repair Workshop |
| Player-facing promise | Compact city ritual beside a designated bathing canal. |
| Visible strengths | “A reliable after-work rhythm.” “The water can become part of a real recovery route.” |
| Pressure | “The parcel is tight: every added facility has to earn its space.” |
| Starting facilities | Basic sauna conversion, basic arrival handling, one ordinary/special Gus room, entrance sign and canal-side service edge. |
| Starting limits | Intimate special-Gus seats; no dedicated recovery route, shop or parallel program lane. |
| Low-investment route | Fairly priced `Classic Ritual` or `Quiet Recovery` in the compact room, with a competent Master and sensible evening/daytime schedule. |
| Possible high-fit routes | `Canal Reset` with terrace/shower/bridge; `Forge & Steam` with a suitable program field/room and recovery support; `Workshop Classic` with Program Sauna and clear service/arrival support. |
| Market direction | Moderate routine access and after-work rhythm; meaningful recovery and social potential; medium premium acceptance with high value sensitivity. |
| Counterweights | Tight exterior space, high recurring cost, small initial room and recovery bottlenecks. |
| Future route commitment | Street arrival/exit, entrance, shop, terrace, shower, bridge/water, program field/room and recovery return routes when purchased. |

## Review Sequence

Before a content card is considered locked, it receives three reviews:

1. **Plausibility:** compatible building, physical fields, water/safety and capacity envelope make sense.
2. **Player choice:** the property card gives a readable promise, real pressure and at least two non-identical strategic directions.
3. **Balance:** low/mid/high investment routes have comparable opportunity/counterweight against other offers.

Only then does the venue move to later scene layout, routes, sprite/animation or asset work.

## Deferred Production Information

The following must remain absent until this text/data contract is approved for a specific offer:

- base-map image and sprite keys;
- exact pixel coordinates and masks;
- final hair/body/outfit variation choices;
- effect frame counts and animation sheets;
- final purchase prices and construction durations.

This protects the agreed order: content and balance first, graphics afterwards.
