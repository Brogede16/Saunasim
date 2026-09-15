# Sauna Empire Game Design

## Product vision

Sauna Empire is a management game about building distinctive sauna venues, learning what local guests value, and growing from one modest operation into a respected multi-location sauna business. The player should feel that operational and creative choices become visible in the venue and in guest behavior, not only in financial tables.

## Core loop

1. Review venue performance, guests, staff, programs and finances.
2. Change price, opening schedule, staffing, Aufguss program, facilities or shop offer.
3. Let canonical game time advance and the simulation resolve demand, capacity, costs and guest outcomes.
4. Read feedback, queues, occupancy, profit/loss, condition and reputation.
5. Repair, upgrade, borrow, refine or expand.
6. Eventually acquire additional opportunities and manage an empire of locally distinct venues.

## Player goal

Short term: make the first venue operational and financially viable.

Medium term: improve guest experience, create stronger programs, add facilities, develop staff and increase capacity/revenue without destroying quality.

Long term: operate multiple locations, build brand value and ranking, and choose when to keep, adapt or sell venues.

The Empire reference build currently uses a victory target of eight owned locations, 1.5 million kr. empire value and average rating 4.25. This is an existing reference rule, not automatically final product balance.

## Canonical game time - LOCKED PRODUCT DECISION

**One in-game week equals 24 real hours.**

Consequences:

- one in-game year is approximately 52 real days, around 7.5 real weeks;
- time progression is persistent and based on canonical timestamps;
- the same elapsed real time must produce the same simulation result whether the app was open or closed;
- construction, repairs, staff travel and other timed work continue against the same clock;
- scoreboards or later competitive/ranking systems can compare players against the same fixed time base;
- UI and rendering never invent or accelerate business time independently of the simulation;
- development builds may provide debug time controls, but these are never part of production scoring.

The existing `Run Week` behavior is a prototype/debug shortcut only and is not the final time design.

## Economy

Existing implemented revenue sources:

- admission;
- special Aufguss/Gus supplement;
- shop sales.

Existing implemented or designed costs:

- venue/base operating costs;
- staff wages;
- utilities and cleaning;
- program materials;
- shop procurement;
- facility operation;
- construction;
- maintenance and repair;
- staff training/equipment;
- loan repayments.

Design scope also includes rent/property economics, heating, electricity and water as understandable operating drivers. These should ultimately be represented in the central economy model rather than scattered UI calculations.

## Loans and insolvency

The Canal prototype has small, standard and large loan offers plus borrowing limits driven by built value and profitable operation. Negative cash creates a financial-decision state. The Empire reference build contains sustained insolvency/campaign-loss behavior.

**OPEN DETAIL:** exact bankruptcy grace period, forced-sale rules, refinancing options and final interest model.

## Sauna sessions and capacity

The game distinguishes ordinary sauna capacity from special Aufguss capacity. Special capacity is physical offer, while actual seats and occupancy describe delivered attendance. Program frequency must respect room time, staff and venue constraints.

The player creates reusable Aufguss programs using name, intent, heat profile, duration/format, aroma rounds, performance language, music direction, recovery finish, requested frequency and supplement price.

Programs are evaluated through composition quality, execution quality and venue fit.

## Guests

Current implemented guest simulation includes named weekly guest samples, age, visit goal, program fit, route, current stop, likes/dislikes, reaction and outcome.

The intended lifecycle is:

`discover -> decide -> arrive -> wait/enter -> sauna or Gus -> recovery/shop/rest -> leave -> remember/respond`

Guests should have individual preferences, value tolerance and queue tolerance. Appearance must not determine mechanical value or behavior.

Planned but not fully implemented:

- stable guest memory;
- regulars;
- deeper local market preferences;
- repeat visitation and loyalty over time.

## Satisfaction, loyalty and reviews

Delivered experience determines satisfaction. Existing guest outcomes include satisfied, mixed, frustrated and aborted. Program delivery also creates structured evaluation.

Local reputation, repeat visits and review/rating systems are intended to convert repeated guest outcomes into visible market consequences.

**OPEN DETAIL:** exact review frequency, rating aggregation, loyalty decay and public-review copy rules.

## Staff

Existing concepts include Aufguss Masters with Heat, Aroma and Performance Craft, style strengths, wages, hiring fees and recruitment search, training, equipment, service/host staff, technicians and repairs.

Staff may automate routine delivery, but strategic choices remain with the player.

Planned but incomplete:

- robust rota/vagtplan system;
- richer staff abilities/traits;
- absence/fatigue if desired;
- cross-venue staff movement.

**OPEN DETAIL:** exact scheduling granularity and which routine assignments should be automatically resolved.

## Locations - product truth and generated content

The repository contains proposed location families such as Canal, Harbour, Industrial, Forest Lake, Coast, Beach, Rural Plot, Water Plot, Urban Lot and Hotel Rooftop. These are useful design material, but **specific city names, market names and concrete locations generated by previous agents are not user-approved product decisions unless explicitly recorded as such.**

A location supplies physical opportunities and constraints. It should not directly declare whether a concept is good or bad.

The final location catalogue must be authored through explicit data and the Sauna Empire Content Studio, with provenance/status fields so every entry is clearly marked as one of:

- APPROVED PRODUCT CONTENT
- PROPOSED / AGENT SUGGESTION
- LEGACY REFERENCE
- TEST / PLACEHOLDER

No proposed city, venue or market name may silently become canonical content.

## Buildings, sauna facilities and upgrades

Venue construction is modular rather than free tile-by-tile building. A venue consists of:

- location/environment;
- one or more allowed start-building choices;
- compatible purchasable modules;
- upgrades that apply to a fixed/start building;
- upgrades that apply to an added module;
- location-specific modules or facilities;
- shared outdoor kit where compatible;
- route/activity/effect anchors.

The content system must clearly distinguish:

1. **Start buildings**: what can exist when the location is first acquired/opened.
2. **Add-on modules**: new physical structures/facilities the player can purchase later.
3. **Base-building upgrades**: upgrades to an existing start building.
4. **Module upgrades**: upgrades to a purchased add-on.
5. **Location-specific content**: only valid on one location or one explicit set of locations.
6. **Shared content**: reusable only where compatibility rules allow it.

Facilities may include sauna rooms, showers, cold plunge, natural-water access, recovery areas, shop/service, deck/terrace and social/rest areas.

## Sauna Empire Content Studio

A dedicated internal Xcode/macOS content-authoring tool is part of the planned architecture. It must make location composition understandable to a non-programmer and prevent invalid combinations.

The Studio must:

- make hierarchy visually obvious: Location -> Start Building -> Add-on -> Upgrade;
- show what is required, optional, incompatible, already occupied or location-specific;
- allow placement of authored anchors, routes, walkable areas, activity points, effect points, masks and draw order;
- preview placeholder assets before final art exists;
- display capacity, economy and gameplay effects alongside visual placement;
- validate that all required metadata exists;
- explain validation errors in plain language;
- offer AI-generated suggestions without applying them automatically;
- mark every suggestion visibly as a suggestion until approved;
- support duplicating a valid location/module as a starting template without inheriting inappropriate location-specific rules;
- export deterministic, versioned content data consumed by the game;
- never require manual Swift editing for ordinary location/module authoring.

See `CONTENT_STUDIO.md` for the full specification.

## Upgrades

Upgrades should have explicit effects rather than generic percentage bonuses hidden in code. Each upgrade should define compatibility, price, build time, capacity channels, operating impact, visual state and route/effect anchors where relevant.

## Progression

Progression comes from stronger programs, better staff/equipment, improved facilities/capacity, higher local reputation, stronger finances/borrowing ability, additional venue opportunities, chain brand/ranking and eventual acquisition/sale decisions.

The player should not simply unlock a linear tech tree. Progression should involve trade-offs between concept, site, market, capacity and cost.

## Trends and seasonal variation

Design documents reserve systems for seasons, operating-calendar fit, trends, novelty and saturation.

**OPEN DETAIL:** final numerical curves and whether specific trend instances are global, regional or local.

## Events

Events can modify demand, market attention, staff/program opportunities or special operating conditions.

**OPEN DETAIL:** final event catalogue and frequency, not whether the system exists.

## Subscriptions and merchandise

The long-term product concept includes subscriptions/memberships and merchandise/shop revenue. A basic shop already exists in the Canal prototype.

**OPEN DETAIL:** exact membership products, churn numbers and merchandise catalogue.

## Brand, ratings and ranking

Local delivered experience should drive local reputation. Chain Brand Value should give capped credibility/reach effects, never free capacity or guaranteed demand. Ranking is intended as a score layer that may rise or fall. The fixed game-time model is compatible with later fair scoreboards.

## Selling venues

The long-term loop includes the ability to sell a sauna/location as part of empire strategy.

**OPEN DETAIL:** final sale valuation formula and transaction rules.

## Progression between locations

Each new venue should be locally meaningful, not a cloned production unit. The chain can transfer know-how, brand and selected reusable assets while the new site still has its own market fit, physical constraints, costs and guest behavior.

## Design principle

Sauna Empire should reward observation and adaptation. The strongest gameplay is not "buy the largest upgrade" but understanding how site, building, staff, program, price, capacity and local guest preferences interact.