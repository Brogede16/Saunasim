# Sauna Empire Game Design

## Product vision

Sauna Empire is a management game about building distinctive sauna venues, learning what local guests value, and growing from one modest operation into a respected multi-location sauna business. The player should feel that operational and creative choices become visible in the venue and in guest behavior, not only in financial tables.

## Core loop

1. Review venue performance, guests, staff, programs and finances.
2. Change price, opening schedule, staffing, Aufguss program, facilities or shop offer.
3. Advance time and let the simulation resolve demand, capacity, costs and guest outcomes.
4. Read feedback, queues, occupancy, profit/loss, condition and reputation.
5. Repair, upgrade, borrow, refine or expand.
6. Eventually acquire additional opportunities and manage an empire of locally distinct venues.

## Player goal

Short term: make the first venue operational and financially viable.

Medium term: improve guest experience, create stronger programs, add facilities, develop staff and increase capacity/revenue without destroying quality.

Long term: operate multiple locations, build brand value and ranking, and choose when to keep, adapt or sell venues.

The Empire reference build currently uses a victory target of eight owned locations, 1.5 million kr. empire value and average rating 4.25. This should be treated as an existing reference rule, not automatically final product balance.

## Time

Current implemented Canal loop advances one week at a time. Construction, repairs and recruitment can also use real timestamps. Existing design docs propose a real-time/offline model in which one game week maps to 24 real hours.

**TBD - MANGLER PRODUKTBESLUTNING:** final native time model. It must be singular and canonical before broad Xcode implementation.

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

**TBD - MANGLER PRODUKTBESLUTNING:** exact bankruptcy grace period, forced-sale rules, refinancing options and final interest model.

## Sauna sessions and capacity

The game distinguishes ordinary sauna capacity from special Aufguss capacity. Special capacity is physical offer, while actual seats and occupancy describe delivered attendance. Program frequency must respect room time, staff and venue constraints.

The player creates reusable Aufguss programs using:

- name;
- intent;
- heat profile;
- duration/format;
- 1-3 aroma rounds and delivery forms;
- performance language;
- music direction;
- recovery finish;
- requested frequency;
- supplement price.

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

Delivered experience should determine satisfaction. Existing guest outcomes include satisfied, mixed, frustrated and aborted. Program delivery also creates structured evaluation.

Local reputation, repeat visits and review/rating systems are intended to convert repeated guest outcomes into visible market consequences.

**TBD - MANGLER PRODUKTBESLUTNING:** exact review frequency, rating aggregation, loyalty decay and public-review copy rules.

## Staff

Existing concepts:

- Aufguss Masters with Heat, Aroma and Performance Craft;
- style strengths;
- wages;
- hiring fees and recruitment search;
- training;
- equipment;
- service/host staff;
- technicians and repairs.

Staff may automate routine delivery, but strategic choices remain with the player.

Planned but incomplete:

- robust rota/vagtplan system;
- richer staff abilities/traits;
- absence/fatigue if desired;
- cross-venue staff movement.

**TBD - MANGLER PRODUKTBESLUTNING:** how detailed scheduling should be versus automatic staffing.

## Locations

Documented location families include Canal, Harbour, Industrial, Forest Lake, Coast, Beach, Rural Plot, Water Plot, Urban Lot and Hotel Rooftop.

A location supplies physical opportunities and constraints. It should not directly declare whether a concept is good or bad.

Examples:

- water access can enable natural-water recovery, bridge or floating sauna;
- urban/rooftop sites trade space and cost for access and premium potential;
- forest/rural sites trade reach for atmosphere, land and expansion space;
- industrial sites can support social/event identity but still require credible guest flow.

## Buildings, sauna facilities and upgrades

Documented building bases include tent camp, container compound, timber cabin, pavilion, country estate/barn, boathouse, repair workshop, warehouse, fish house, floating sauna, rooftop sauna and former spa/kursted concepts.

Venue construction is modular rather than free tile-by-tile building. A venue consists of:

- location/environment;
- building base;
- compatible facility/upgrade modules;
- shared outdoor kit;
- route/activity/effect anchors.

Facilities may include sauna rooms, showers, cold plunge, natural-water access, recovery areas, shop/service, deck/terrace and social/rest areas.

## Upgrades

Upgrades should have explicit effects rather than generic percentage bonuses hidden in code. Each upgrade should define compatibility, price, build time, capacity channels, operating impact, visual state and route/effect anchors where relevant.

Examples already present in the design include visible facility additions and a limited invisible exception such as Bench Refit.

## Progression

Progression comes from:

- stronger and more distinctive programs;
- better staff and equipment;
- improved facilities and capacity;
- higher local reputation;
- stronger finances and borrowing ability;
- additional venue opportunities;
- chain brand/ranking;
- eventual acquisition and sale decisions.

The player should not simply unlock a linear tech tree. Progression should involve trade-offs between concept, site, market, capacity and cost.

## Trends and seasonal variation

Design documents reserve systems for seasons, operating-calendar fit, trends, novelty and saturation. These are not yet complete production systems.

**TBD - MANGLER PRODUKTBESLUTNING:** final seasonal demand curve, trend duration, trend discovery and whether trends are global, regional or local.

## Events

Events can modify demand, market attention, staff/program opportunities or special operating conditions.

**TBD - MANGLER PRODUKTBESLUTNING:** final event taxonomy and frequency.

## Subscriptions and merchandise

The long-term product concept includes subscriptions/memberships and merchandise/shop revenue. A basic shop already exists in the Canal prototype.

**TBD - MANGLER PRODUKTBESLUTNING:** membership tiers, recurring billing simulation, churn and merchandise breadth.

## Brand, ratings and ranking

Local delivered experience should drive local reputation. Chain Brand Value should give capped credibility/reach effects, never free capacity or guaranteed demand. Ranking is intended as a score layer that may rise or fall.

The deeper chain-wide brand/rank system is primarily design-level today.

## Selling venues

The long-term loop includes the ability to sell a sauna/location as part of empire strategy.

**TBD - MANGLER PRODUKTBESLUTNING:** sale valuation formula, whether staff/program IP transfers, and any cooling-off or transaction cost.

## Progression between locations

Each new venue should be locally meaningful, not a cloned production unit. The chain can transfer know-how, brand and possibly staff/program assets, while the new site still has its own market fit, physical constraints, costs and guest behavior.

## Design principle

Sauna Empire should reward observation and adaptation. The strongest gameplay is not "buy the largest upgrade" but understanding how site, building, staff, program, price, capacity and local guest preferences interact.