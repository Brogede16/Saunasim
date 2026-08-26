# Sauna Sim Simulation Contract v0.1

## Implementation Status: Not Yet Built

This is the target structure for real-time simulation. It is not implemented yet. The current code
(`gameStore.advanceWeek()` in `src/sim/game.ts`) is a deliberate prototype/debug stand-in: the player
taps `Run Week` and one week resolves instantly through `src/sim/canalBalance.ts`, with no real elapsed
time, no offline catch-up and no chronological event ordering. Real-time week progression and offline
catch-up were explicitly deferred by decision during the first vertical slice (see `progress.md`,
2026-08-25 entry: "Deferred by decision: real-time week progression, offline catch-up and full save
migrations. `Run Week` remains an intentional prototype/debug tool; later work must not present it as
final time design."). Building the `advanceSimulation(from, to)` order below is real, currently-unstarted
work, not a description of something already running — see `remaining-work-overview-v0.1.md`.

## Purpose

This contract is the single bridge between design, simulation, saves, UI and exterior rendering. It prevents an asset, venue or offline session from behaving differently depending on whether the browser was open.

It locks structure, not final numeric balance values.

## 1. One Canonical Clock

- The simulation receives only real timestamps: `from` and `to`.
- One in-game week maps to one real 24-hour day. The conversion is a balance constant, not a browser-speed setting.
- Construction, technician travel and maintenance use real elapsed time, including offline time.
- The browser, Phaser scene and React UI never advance business state themselves. They render state produced by the simulation.
- Offline progress has no arbitrary cap. Long absences resolve in efficient operating blocks and return a concise summary rather than a long event feed.
- A future multiplayer server can call the exact same contract with an authoritative timestamp.

## 2. Required Advance Order

Every `advanceSimulation(from, to)` call processes time in chronological order. At each relevant timestamp, use this order:

1. Complete construction projects, technician travel and repairs due at that timestamp.
2. Update facility availability, staff availability and venue configuration resulting from those completions.
3. Open or close venues according to their selected schedules.
4. Build the feasible Aufguss schedule from the current rooms, fields, Master availability, capacity and opening hours.
5. Resolve the next operating block: guest discovery, arrival, queue, visit, program, recovery, shop and departure.
6. Apply the block's revenue, consumables, wages, rent/property obligations and condition change.
7. At the end of an operating/financial period, apply scheduled loan repayment, evaluate negative cash and create the appropriate report/notification.
8. Recompute derived views only after canonical state has changed: demand summaries, feedback, reputation, Brand Value, Standing and rank.

If no venue is open, only real-time projects, travel, repairs and time-based reports may advance. No hidden revenue, guest visits or condition loss occurs outside a plausible operating cause.

## 3. Canonical Save State

The save file must contain the minimum state needed to replay the same result:

- schema version and `lastSimulatedAt`;
- chain cash, debt contracts, repayment schedule, Brand Value and Standing inputs;
- owned venues, their base, location, owned fields, operating schedule, pricing and construction projects;
- room/field capacity and availability state;
- staff roster, assignments, travel/repair task state and wages;
- facility condition state for eligible technical assets only;
- program definitions, frequency requests and Master eligibility;
- market/guest-memory state, current slow trends and novelty history;
- seeded random state or deterministic event identifiers needed for reproducible guest generation;
- pending financial decisions and unread return summaries.

Views, rendered guest sprites, camera position, menu selection and temporary animation state are derived or UI-only state and are not business truth. The latest completed operating period may persist as a bounded, read-only return event because its historical inputs can no longer be reconstructed from the current state; it is not a mutable view model and must be replaced by the smaller versioned event summary when `advanceSimulation` is built.

## 4. Mandatory Asset Data Card

Every purchasable venue asset, building module, program room and outdoor field must define all of the following before it can enter production:

| Field | Requirement |
| --- | --- |
| Identity | Stable ID, type and owner layer: location or building. |
| Compatibility | Permitted location, base-building and variant tags. |
| Physical field | Fixed authored field/anchor and collision footprint. |
| Capacity | Explicit affected channels: arrival/changing, sauna seats, program seats, recovery, rest/social or shop. |
| Program capability | Basic/Special Aufguss support, room/field quality and eligible recovery finish where relevant. |
| Route contract | Entry, activity and exit/return anchors for every guest-visible function. |
| Economy | Purchase/rush cost, recurring operating cost, revenue mechanism and valuation contribution. |
| Experience | Appeal/guest-preference profile and any clear trade-off. |
| Condition | Whether it can deteriorate, cause of wear and repair class; decorative assets are excluded. |
| Build state | Independent construction state, operational consequence and completion reveal. |
| Visual package | Base overlay, effects, animation anchors, draw order and required shared sprite actions. |

A validation test rejects an asset that is missing any required field or is placed on an incompatible field. No generic hidden operations or staff-efficiency bonus may bypass this card.

## 5. Capacity Contract

Capacity is always channel-specific. An asset may improve one or more channels but cannot silently improve all of them:

- arrival/changing flow;
- ordinary sauna seats;
- Special Aufguss seats and parallel program lanes;
- cold/warm recovery use;
- rest/social linger use;
- shop/service throughput.

The guest simulation must be able to identify the physical channel that created a queue, disappointment or opportunity. The UI presents the consequence in natural language; it does not expose raw hidden scores by default.

## 6. Brand, Standing And Local Demand

- Local delivered experience is the dominant cause of local demand, return and willingness to pay.
- Brand Value has a capped, diminishing effect on consideration, marketing reach and suitable premium confidence. It never creates capacity, free guests, direct income or lower operating costs.
- Standing/rank has no direct effect on local demand, revenue, site-offer quality or borrowing capacity.
- Each new venue begins with its own Local Reputation and must prove its offer locally.
- Simulated reference chains and later real players affect rank only. They never undercut, steal, block or otherwise alter local guests.

## 7. Financial Distress Rule

- Negative cash immediately opens a financial decision card with the factual options: available loan, venue sale, wait for the next financial settlement, or voluntary bankruptcy.
- The card shows current cash, due obligations, available borrowing room and sale candidates. It does not predict whether a project will succeed.
- Choosing to wait remains valid until the next completed financial settlement.
- Automatic bankruptcy occurs only when that settlement leaves the chain unable to pay due obligations and no realistic approved loan or venue-sale option remains.
- Bankruptcy is therefore objective, but never an unexplained surprise or a countdown used to create pressure.

## 8. Trend, Novelty And Maintenance Protections

- A trend lasts multiple real days, is signalled before it materially changes demand and never turns a well-run viable venue into a non-viable one.
- Repetition reduces only the additional novelty opportunity of overused program content. It never removes the stable value of a coherent standard program.
- Facility condition deteriorates slowly through plausible use. Preventive work is cheaper than emergency work; emergency failure is uncommon and clear.
- Technicians only perform a player-selected dispatch or maintenance policy. The Operations Manager may improve terms, reporting and planning information, but never selects strategic projects, prices, programs, loans or repairs.

## 9. Required Test Scenarios

Before a system is considered implemented, it must be reproducible in automated tests and in the first Canal venue:

1. A compact, well-matched venue produces stable visits and return signals.
2. A popular venue hits a specific physical bottleneck and gives an actionable queue/feedback signal.
3. An ambitious premium Aufguss fails due to insufficient room, Master or recovery capability, with a concrete cause.
4. A venue continues operating plausibly while an unrelated upgrade completes offline.
5. A technician travels, repairs one asset and restores only that asset's function.
6. A negative-cash chain reaches the objective decision path without a forecast or surprise bankruptcy.
7. The same elapsed interval produces the same canonical result online and offline.

## Implementation Gate

No broad asset pack, second location or complex management UI should be built before the first Canal slice proves this contract with its six working assets.
