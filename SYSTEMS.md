# Sauna Empire Systems

This file is the high-level registry of game systems for native preparation. Status refers to the repository as audited before native migration, reconciled with user-approved decisions through 2026-09-15.

Before implementing from this table, read `docs/decision-reconciliation-2026-09-15.md` and `PRODUCT_DECISIONS_2026-09-15.md`.

| System | Purpose | Main inputs | Main outputs | May communicate with | Owns | Current status | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Simulation | Resolve deterministic gameplay over time | state, config, seed, commands | new state, domain events, reports | all domain systems | orchestration only | Partial/implemented for Canal reference | P0 |
| Game Time | Define canonical persistent day/week/month progression and offline settlement | wall clock, elapsed time, calendar config | ticks, period boundaries | simulation, economy, staff | canonical game time | Product rule locked, native implementation missing | P0 |
| Economy | Resolve revenue, expenses, cash and summaries | visits, prices, wages, utilities, loans | cash flow, ledgers, insolvency state | guests, staff, venue, progression | financial truth | Implemented for Canal reference | P0 |
| Loans/Finance | Credit, repayments, borrowing room, insolvency | assets, earnings, debt | loan availability, repayments | economy, progression | debt | Implemented basic | P1 |
| Locations | Define sites, market context and physical constraints | location catalog, market seed | available sites, site properties | venue, guests, progression | location definitions | Canal implemented, broader design/reference exists | P1 |
| Site Offer Generator | Generate viable expansion opportunities rather than free city selection | location/building compatibility, market seed, player finances | three site offers | locations, economy, progression | offer batches | Designed, partial reference | P1 |
| Venue/Facilities | Buildings, sauna rooms, recovery, shop and upgrades | site, module catalog, commands | capacity, operating effects, visual module state | economy, guests, rendering | owned facility state | Implemented for Canal reference | P0 |
| Construction | Timed building and upgrade delivery | module, cost, clock | project state, completed module | venue, economy, time | construction projects | Implemented basic | P1 |
| Maintenance | Wear, condition, outages and repairs | usage, condition, technician, time | wear, unavailable facilities, restored condition | venue, economy, staff | condition/repair tasks | Implemented | P1 |
| Aufguss Program | Create reusable Aufguss programs | intent, heat, aroma, music, performance, recovery | program definition, composition tier | staff, guests, venue | programs/repertoire | Implemented | P0 |
| Program Scheduling | Automatically fit requested sessions into opening hours and available Masters/rooms | programs, requested frequency, opening hours, room capacity, Master availability | feasible schedule | staff, time, venue | session schedule | Structure decided, exact algorithm open | P1 |
| Program Execution | Evaluate delivery quality and fit | program, Master skill, room, occupancy | execution/fit/stars | guests, reviews | delivery evaluation | Implemented for Canal reference | P1 |
| Guests/Demand | Decide who visits and why | local market, price, reputation, time, program | arrivals and demand | venue, economy, reviews | guest visit decisions | Partial | P0 |
| Guest Routing | Resolve visit path and facility choices | guest, available facilities, queues | route/stops/outcome | rendering, satisfaction | visit journey | Implemented basic | P1 |
| Guest Satisfaction | Convert delivered experience into reactions | queues, program, facilities, value | satisfaction/outcome/feedback | reviews, loyalty, economy | visit outcome | Implemented basic | P1 |
| Guest Memory/Loyalty | Maintain bounded persistent regulars and return/lapse state | identity, past visits, satisfaction | return propensity, loyalty | demand, reviews, memberships | bounded guest history | Designed, not implemented | P2 |
| Reviews/Ratings | Surface program diagnostics, guest feedback, editorial observations and local reputation | guest outcomes, program execution, expectation/value | reviews, rating, reputation | demand, progression | local reputation | Partial/design | P2 |
| Staff | Roster, skills, hourly wages and roles | candidates, wages, training | staffed capabilities and costs | programs, economy, maintenance | staff roster | Implemented basic | P1 |
| Staff Coverage | Automatically cover player-selected opening hours without a manual rota | opening hours, sessions, staff roles, venue requirements | assigned work periods, labor cost | staff, time, program | coverage assignments | Structure locked, exact minimum-coverage formula open | P1 |
| Automation | Let staff run routine operations without taking strategic decisions | policies, roster, venue state | automated routine actions | staff, program, venue | automation settings | Design only | P3 |
| Shop/Merchandise | Sell a small selected assortment | assortment, guests, procurement | units, revenue, costs | economy, guests | shop assortment | Implemented basic; broader catalogue bounded | P2 |
| Membership/Subscription | Offer recurring membership products to suitable repeat guests | products, guest loyalty/fit, price, capacity | recurring revenue, churn, member state | economy, loyalty, demand | memberships | Product behavior approved, implementation pending | P2 |
| Seasons | Apply bounded shared-calendar seasonal context | calendar, location | demand/context modifiers | guests, economy, rendering | seasonal state/modifiers | Product behavior locked, implementation pending | P2 |
| Trends/Novelty | Generate gradual, non-identical changing guest interest and saturation | market, time, seed, venue choices | trend state/modifiers | demand, reviews | trend state | Product behavior approved, not implemented | P2 |
| Progression | Surface financially and strategically meaningful expansion opportunities | performance, value, reputation, finances | offers, opportunities | locations, brand, economy | progression state | Partial/reference build | P1 |
| Brand | Chain-level credibility/reach | venue performance, history | brand value/effects | demand, progression | chain brand | Design only | P3 |
| Ranking | Compare empire performance without changing local demand | ratings, scale, value, fixed calendar | rank/leaderboard score | progression | ranking state | Structure approved, formula deferred | P3 |
| Venue Sale | Sell an owned location | venue value, performance, condition, debt | cash, removed venue | economy, progression | sale transaction | Structure approved, weights deferred | P3 |
| Save System | Persist canonical gameplay state | game state, schema | saved envelope, restored state | all persistent systems | schema/migrations | Strong implementation for Canal | P0 |
| Configuration/Balance | Central numeric tuning | catalogs/config | values consumed by systems | all domain systems | balance variables | Partly hardcoded today | P0 |
| Content Studio | Author and validate locations, start buildings, modules, upgrades, anchors and routes | content definitions, placeholders/assets | versioned validated content data | content catalogs, rendering, tests | authoring metadata only | Approved native production tool, not built | P1 |
| Rendering | Visualize world and events | state snapshots, domain events, scene metadata | SpriteKit scene | UI only through presentation layer | visual state only | Phaser prototype exists | P1 |
| UI | Present controls and management information | observable state | player commands | application controller | transient UI state | React prototype exists | P1 |
| Asset Runtime | Resolve sprites, layers, anchors and atlases | asset metadata | render-ready references | rendering | asset registry | Partial/spec strong | P1 |
| Analytics/Balance Harness | Run batches and report outcomes | seeds, scenarios, configs | distributions/statistics | simulation | test results only | Partial tests, full harness missing | P1 |

## Explicitly not a current core system

A generic `Events` system is **not approved current scope**. Do not build player-created venue events or a broad world-event taxonomy. Seasonal change, trends, press/reviews, market evolution and normal operational variation cover the required changing conditions for now. Revisit only if playtesting identifies a concrete gameplay need.

Detailed HR simulation such as sickness, holidays and voluntary resignations is also outside current scope.

## Communication rule

Systems should not call renderer or UI code. Domain systems may exchange typed domain data through the simulation/application layer. Cross-system shortcuts should be avoided when an explicit input/output can represent the dependency.

## Priority meaning

- **P0**: required before or during Vertical Slice 0.1.
- **P1**: required for a credible core management game or its production tooling.
- **P2**: important depth after core stability.
- **P3**: expansion systems after the architecture and balance loop are proven.