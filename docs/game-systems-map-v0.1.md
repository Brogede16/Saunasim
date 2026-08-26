# Sauna Sim Game Systems Map v0.1

## Purpose

This is the integrated explanation of Sauna Sim. It describes what the player controls, how the major types connect, and which documents define each detailed rule. It does not replace the dedicated source documents; it prevents the project being understood as disconnected lists.

## Implementation Status

This map, like most of `docs/`, describes the full intended game. Only a fraction of it exists in `src/`
today, and only for one location (`Canal Workshop`). Check this table before assuming a described system
is live; it is the fastest way to tell design intent from what actually runs.

| System | Status | Where |
| --- | --- | --- |
| Canal venue economics (one location) | Implemented | `src/sim/canalBalance.ts`, `src/sim/canalScenarioMatrix.ts` |
| Aufguss program builder + composition reveal | Implemented | `src/sim/program.ts`, `src/sim/programEvaluation.ts` |
| Weekly guest samples + visit routing | Implemented | `src/sim/guestWeek.ts` |
| Maintenance / condition / repair | Implemented | `src/sim/maintenance.ts` |
| Service Team (reception/shop) | Implemented | `src/sim/serviceTeam.ts` |
| Shop assortment | Implemented | `src/sim/shop.ts` |
| Construction, loans, Master recruitment | Implemented | `src/sim/game.ts` |
| Local save / export / import | Implemented | `src/save/savegame.ts` |
| Placeholder scene rendering (no final art) | Implemented, placeholder only | `src/game/CanalScene.ts`, `src/content/canalWorkshopScene.ts` |
| Venue Fit | Partial: a small fixed 4-branch function, not the data-driven archetype schema the docs describe | `physicalProgramDemandFit()` in `canalBalance.ts` vs. `venue-fit-data-contract-v0.1.md`, `venue-fit-archetypes-v0.1.md` |
| Opening schedule / demand fit | Partial: Canal only, no seasonal layer | `evaluateScheduleFit()` in `canalBalance.ts` vs. `seasons-and-operating-calendar-contract-v0.1.md` |
| Real-time simulation clock, offline catch-up | Not started (deliberately deferred) | `simulation-contract-v0.1.md` |
| Multiple locations / building bases beyond Canal | Not started | `location-scene-layouts-v0.1.md`, `venue-composition-v0.1.md`, `site-library-v0.1.md`, `site-market-generator-v0.1.md` |
| Multi-venue chain, Brand Value, rank | Not started | `finance-property-model-v0.1.md`, `brand-and-ranking-model-v0.1.md` |
| Guest memory / regulars | Not started | `guest-memory-and-regulars-contract-v0.1.md` |
| Trends / novelty / saturation | Not started | `trends-and-novelty-contract-v0.1.md` |
| Real character sprites / animation | Not started (rejected drafts only) | `character-animation-contract-v0.1.md`, `assets/source/sprites/README.md` |
| Final production art (any location) | Not started (rejected drafts only) | `visual-production-manifest-v0.1.md`, `assets/source/*/README.md` |

## The Game In One Sentence

The player builds a chain of exterior-only sauna venues, creates and runs distinctive Aufguss programs, learns what each local guest market values, and grows through delivered experience rather than passive automation.

## The Core Loop

1. A site offer provides a **Location** with physical fields, market context, land/water access and price.
2. The player selects or builds a compatible **Building Base**.
3. The player adds visible **Assets** and a small number of technical upgrades.
4. The player hires **Staff**, sets price/opening/program choices and creates reusable **Aufguss Programs**.
5. **Guests** decide whether to visit, then use a route through arrival, sauna, Gus, recovery, shop and exit.
6. Delivered experience creates revenue, costs, feedback, local reputation and future demand.
7. The player improves the venue, opens another one, or changes the concept. The chain gains Brand Value and rank, but each new venue must work locally.

## Type Hierarchy

```text
Chain
  └─ Venue (one owned sauna business)
       ├─ Location / Site
       │    └─ location-owned fields: shore, quay, water, forest, roof, road access
       ├─ Building Base
       │    └─ building-owned fields: facade, sauna room, roof, attached extension
       ├─ Assets / Upgrades
       │    ├─ visible facilities: sauna rooms, plunge, shower, deck, shop, yard
       │    └─ technical exception: Bench Refit in the existing sauna
       ├─ Staff
       ├─ Operating settings
       ├─ Aufguss Programs
       └─ Guest visits and local reputation
```

## Location And Building

### Locations

The locked families are Canal, Harbour, Industrial, Forest Lake, Coast, Beach, Rural Plot, Water Plot, Urban Lot and Hotel Rooftop. A location does not itself decide whether a venue is good; it supplies credible physical opportunities and trade-offs.

- Water can enable a bridge, natural-water recovery or floating sauna where the authored site permits it.
- Dense city/roof locations trade space for stronger access and expensive premium potential.
- Rural/forest sites trade access volume for atmosphere, land and lower-cost expansion routes.
- Industrial sites support raw/event/social identity but still need recovery and flow to work.

### Building Bases

Building Bases turn a location into an operating venue. Examples include Saunatelt Camp, Container Compound, Timber Cabin, Pavilion, Country Estate with Barn, Boathouse, Repair Workshop, Warehouse, Fiskehus, Floating Sauna, Rooftop Sauna and Former Kursted.

A base is permanent after purchase. It can receive only its compatible extensions. Tent and container families are the limited exception: they can add compatible extra units rather than transform into a different permanent building family.

Detailed compatibility: `venue-composition-v0.1.md`, `building-library-v0.1.md`, `location-scene-layouts-v0.1.md`.

## Assets, Capacity And Exterior Rules

Every visible asset defines a stable ID, compatibility, fixed physical field, capacity channels, economy, route anchors, effects and visual package. Guests never use a facility that lacks a route and interaction anchor.

Capacity is channel-specific:

- arrival/changing
- ordinary sauna
- Special Aufguss
- cold/warm recovery
- rest/social linger
- shop/service

An asset cannot silently boost all channels. Larger and extra saunas are visible assets. `Bench Refit` is the controlled invisible exception: it adds three seats to the existing sauna, never a room or program lane.

`specialCapacity` is physical offer, `specialSeats` is actual attendance, and `specialOccupancy` explains whether a room feels intimate, calm, crowded, social or show-ready. Capacity alone never creates guests or premium value.

Detailed asset rules: `asset-effect-model-v0.1.md`, `asset-registry-v0.1.md`, `simulation-contract-v0.1.md`.

## Aufguss Programs

Aufguss is the player-expression system. A reusable program contains:

- player-entered English name
- Intent: Classic Ritual, Quiet Recovery, Social Energy or Show Journey
- heat profile and Short/Standard/Long format
- one to three ordered aroma rounds, each with material and delivery form
- performance language and music direction
- optional physical recovery finish
- requested session frequency and supplement price

The game derives room time, guest-journey time, input costs, feasible sessions and physical capacity. The player can attempt ambitious combinations early, but a weak Master, unsuitable room, price or recovery route can make delivery fail.

Every composition begins `Unproven`; its fixed Composition Tier reveals after the first actual session. Execution Tier is evaluated per delivery. Venue Fit evaluates location, base, visible assets, flow and local market. Overall stars use all three without averaging away a weak link.

Detailed rules: `aufguss-system-v0.1.md`, `aufguss-combination-model-v0.1.md`, `aufguss-material-library-v0.1.md`, `master-development-and-equipment-v0.1.md`.

## Guests And Routes

Guests are individual people with stable English-language names, age, independent preferences, value/queue tolerance, current activity and a clear outcome. Appearance and identity never drive mechanical worth or behaviour.

The full visit lifecycle is:

```text
discover → decide → arrive → wait/enter → sauna or Gus → recovery/shop/rest → leave → remember/respond
```

Not every guest follows every stage. A chosen recovery finish sends only relevant Gus participants to shower, plunge, water, deck or refreshments; capacity and preferences determine who uses it and who waits, changes plan or leaves. All visible behavior needs a route and animation contract.

Detailed rules: `guest-behaviour-model-v0.1.md`, `scene-composition-and-render-contract-v0.1.md`, `character-animation-contract-v0.1.md`.

## Staff And Maintenance

The player starts as unseen owner. Masters run Gus and have Heat, Aroma and Performance Craft plus style strengths. Host/service staff support guest flow and visible service work. Technicians travel between venues and repair technical assets; they do not choose strategy.

Staff automate routine delivery, never core choices such as site purchase, loans, venue concept, price, programs, strategic upgrades or repair policy.

Detailed rules: `staff-and-maintenance-model-v0.1.md`, `master-development-and-equipment-v0.1.md`.

## Economy, Loans And Property

The chain holds cash, debt and asset value. Venues earn entry, Gus supplements and shop margin; they pay wages, material inputs, facility operation, maintenance and loan repayments.

Loans are chain-wide and based on venue value, demonstrated earnings and existing obligations. Negative cash opens factual choices, not forecasts. The game has no taxes, shares, bonds, energy or paid-time skips.

Detailed rules: `finance-property-model-v0.1.md`, `canal-workshop-balance-reference-v0.1.md`.

## Reputation, Brand And Rank

Local delivered experience drives a venue's local reputation, returns and willingness to pay. Chain Brand Value has capped reach/credibility effects but does not create capacity or free income. Rank is score-only and may move up or down; later multiplayer competitors affect rank, not the local guest simulation.

Detailed rules: `brand-and-ranking-model-v0.1.md`, `player-agency-and-long-term-model-v0.1.md`.

## Time, Save And Rendering

One game week maps to 24 real hours. Construction, repair, travel and offline progress resolve from real timestamps. Simulation is deterministic and produces state; React UI and Phaser exterior scenes render it. Save data retains business truth, not transient animation state.

Visual layers are background, base building, upgrades, effects, routes and guests. Assets use authored fields, route anchors, effect anchors and draw-order/mask rules so guests can pass in front of, behind or into buildings/water correctly.

Detailed rules: `simulation-contract-v0.1.md`, `technical-blueprint-v0.1.md`, `visual-production-manifest-v0.1.md`.

## Current Implementation Boundary

The Canal prototype currently proves one location/base, basic construction, loans, named guest samples, first routes, a saved Gus builder, material input calculation, first Composition reveal and capacity/occupancy separation. The remaining P0 connections before numeric balancing are listed in `first-slice-balance-audit-v0.1.md`.
