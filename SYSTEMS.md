# Sauna Empire Systems

This file is the high-level registry of game systems. Status refers to the repository as audited before native migration.

| System | Purpose | Main inputs | Main outputs | May communicate with | Owns | Current status | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Simulation | Resolve deterministic gameplay over time | state, config, seed, commands | new state, domain events, reports | all domain systems | orchestration only | Partial/implemented for Canal | P0 |
| Game Time | Define day/week/month progression and offline settlement | clock, elapsed time, calendar config | ticks, period boundaries | simulation, economy, events, staff | canonical game time | Partial/inconsistent | P0 |
| Economy | Resolve revenue, expenses, cash and summaries | visits, prices, wages, utilities, loans | cash flow, ledgers, insolvency state | guests, staff, venue, progression | financial truth | Implemented for Canal | P0 |
| Loans/Finance | Credit, repayments, borrowing room, insolvency | assets, earnings, debt | loan availability, repayments | economy, progression | debt | Implemented basic | P1 |
| Locations | Define sites, market context and physical constraints | location catalog, market seed | available sites, site properties | venue, guests, progression | location definitions | Canal implemented, broader design/reference exists | P1 |
| Venue/Facilities | Buildings, sauna rooms, recovery, shop and upgrades | site, module catalog, commands | capacity, operating effects, visual module state | economy, guests, rendering | owned facility state | Implemented for Canal | P0 |
| Construction | Timed building and upgrade delivery | module, cost, clock | project state, completed module | venue, economy, time | construction projects | Implemented basic | P1 |
| Maintenance | Wear, condition, outages and repairs | usage, condition, technician, time | wear, unavailable facilities, restored condition | venue, economy, staff | condition/repair tasks | Implemented | P1 |
| Aufguss Program | Create reusable Gus programs | intent, heat, aroma, music, performance, recovery | program definition, composition tier | staff, guests, venue | programs/repertoire | Implemented | P0 |
| Program Execution | Evaluate delivery quality and fit | program, Master skill, room, occupancy | execution/fit/stars | guests, reviews | delivery evaluation | Implemented for Canal | P1 |
| Guests/Demand | Decide who visits and why | local market, price, reputation, time, program | arrivals and demand | venue, economy, reviews | guest visit decisions | Partial | P0 |
| Guest Routing | Resolve visit path and facility choices | guest, available facilities, queues | route/stops/outcome | rendering, satisfaction | visit journey | Implemented basic | P1 |
| Guest Satisfaction | Convert delivered experience into reactions | queues, program, facilities, value | satisfaction/outcome/feedback | reviews, loyalty, economy | visit outcome | Implemented basic | P1 |
| Guest Memory/Loyalty | Remember prior visits and create regulars | identity, past visits, satisfaction | return propensity, loyalty | demand, reviews | guest history | Not implemented | P2 |
| Reviews/Ratings | Surface public/local reputation | guest outcomes, expectation/value | reviews, rating, reputation | demand, progression | local reputation | Partial/design | P2 |
| Staff | Roster, skills, wages and roles | candidates, wages, training | staffed capabilities and costs | programs, economy, maintenance | staff roster | Implemented basic | P1 |
| Staff Scheduling | Assign shifts/coverage | opening hours, sessions, staff availability | coverage, labor cost | staff, time, program | rota | Not fully implemented | P2 |
| Automation | Let staff run routine operations | policies, roster, venue state | automated routine actions | staff, program, venue | automation settings | Design only | P3 |
| Shop/Merchandise | Sell selected items | assortment, guests, procurement | units, revenue, costs | economy, guests | shop assortment | Implemented basic | P2 |
| Membership/Subscription | Recurring guest offers | products, guest loyalty, price | recurring revenue/benefits | economy, loyalty | subscriptions | Design only/TBD | P3 |
| Events | Temporary conditions/opportunities | calendar, market, random seed | modifiers/opportunities | guests, economy, progression | event state | Design only | P3 |
| Seasons | Seasonal demand/operating context | calendar, location | demand/cost modifiers | guests, economy | seasonal state/modifiers | Design only | P2 |
| Trends/Novelty | Create changing guest interest and saturation | market, time, venue choices | trend modifiers | demand, reviews | trend state | Not implemented | P3 |
| Progression | Unlock opportunities and expansion | performance, value, reputation | unlocks, offers | locations, brand, economy | progression state | Partial/reference build | P1 |
| Brand | Chain-level credibility/reach | venue performance, history | brand value/effects | demand, progression | chain brand | Design only | P3 |
| Ranking | Score empire performance | ratings, scale, value | rank/leaderboard score | progression | ranking state | Design/reference | P3 |
| Venue Sale | Sell an owned location | venue value, market, debt | cash, removed venue | economy, progression | sale transaction | Design/reference/TBD | P3 |
| Save System | Persist canonical gameplay state | game state, schema | saved envelope, restored state | all persistent systems | schema/migrations | Strong implementation for Canal | P0 |
| Configuration/Balance | Central numeric tuning | catalogs/config | values consumed by systems | all domain systems | balance variables | Partly hardcoded today | P0 |
| Rendering | Visualize world and events | state snapshots, domain events, scene metadata | SpriteKit scene | UI only through presentation layer | visual state only | Phaser prototype exists | P1 |
| UI | Present controls and management information | observable state | player commands | application controller | transient UI state | React prototype exists | P1 |
| Asset Runtime | Resolve sprites, layers, anchors and atlases | asset metadata | render-ready references | rendering | asset registry | Partial/spec strong | P1 |
| Analytics/Balance Harness | Run batches and report outcomes | seeds, scenarios, configs | distributions/statistics | simulation | test results only | Partial tests, full harness missing | P1 |

## Communication rule

Systems should not call renderer or UI code. Domain systems may exchange typed domain data through the simulation/application layer. Cross-system shortcuts should be avoided when an explicit input/output can represent the dependency.

## Priority meaning

- **P0**: required before or during Vertical Slice 0.1.
- **P1**: required for a credible core management game.
- **P2**: important depth after core stability.
- **P3**: expansion systems after the architecture and balance loop are proven.