# Sauna Empire Canonical Mechanics

## Purpose

This document is the mechanical bridge between product decisions and executable game behavior.

A decision is not implementation. Every approved rule must ultimately become:

`player/world input -> owning system -> state transition -> downstream consequences -> player feedback -> automated test`

This file describes those causal chains across the whole game. It does not replace detailed system contracts; it tells coding agents how those systems interact.

## Authority

Read in this order when mechanics conflict:

1. `docs/decision-reconciliation-2026-09-15.md`
2. `PRODUCT_DECISIONS_2026-09-15.md`
3. `docs/decision-log.md`
4. this `MECHANICS.md`
5. dedicated current system contracts in `docs/`
6. implementation/tests
7. historical/proposal documents

If executable code disagrees with a newer locked product decision, that code is implementation debt, not product truth.

---

# 1. Canonical simulation loop

## Production clock

- 1 in-game week = 24 real hours.
- 1 in-game year = 52 real days.
- Time never pauses in production gameplay.
- UI/rendering never creates business time.
- Online and offline elapsed time use the same simulation contract.
- Debug/test builds may advance injected time explicitly.

## Chronological resolution order

Every call equivalent to `advanceSimulation(from, to)` must resolve canonical changes in chronological order:

1. complete construction, repair and technician-travel milestones;
2. update facility and staff availability;
3. evaluate venue opening/closing state;
4. compute staffing coverage;
5. build feasible Aufguss schedules;
6. generate potential demand for the operating block;
7. resolve guest arrival/entry/visit/facility/program/recovery/shop/departure;
8. apply revenue and variable operating costs;
9. apply staff wages, rent/property and scheduled obligations;
10. apply facility wear/maintenance effects;
11. apply loan payments and evaluate financial distress at settlement boundaries;
12. update guest memory, reviews, Local Reputation and retention;
13. update slow market/trend/season state when its timestamp is reached;
14. derive Brand Value, Standing/ranking inputs and management summaries;
15. persist canonical state and bounded return summaries.

Derived UI state never feeds backward into this order.

---

# 2. Venue operating mechanics

## Player inputs

Per venue the player controls:

- opening days;
- opening/closing time;
- entry price;
- owned facilities/upgrades;
- hired venue staff;
- active Aufguss programs and desired frequencies;
- selected shop assortment where a shop exists;
- approved marketing choices where implemented.

The player does not micromanage guest movement, shift minutiae or exact session placement.

## Operating consequence chain

`opening schedule + facilities + staff + programs + price + local market + season/trend + reputation`

produces:

`feasible capacity + expected demand + operating cost + visit outcomes`

which produces:

`cash + guest feedback + retention + reputation + wear + future demand`

The venue therefore cannot be optimized by one isolated stat.

---

# 3. Staff mechanics

## Staff classes

### Venue staff

Venue staff serve one venue's operating needs. Examples include Reception Host, Service Host, Shop/Cafe Host where separately required, Aufguss Master and later Venue Manager.

### Chain staff

Chain staff belong to the company rather than a venue. Examples include Technician and later Operations Manager.

Chain staff must not be represented as venue staffing coverage unless their role explicitly operates a venue function.

## Staffing demand

The player hires/fires people; the game computes assignments automatically.

Required venue coverage is derived from:

- venue open/closed state;
- active guest-facing functions;
- facility scale/throughput;
- expected/actual operating load;
- scheduled Aufguss sessions;
- any role-specific requirement defined by an asset or system contract.

Avoid one universal rule such as `1 staff per 25 guests`.

A small venue may combine compatible duties. A larger or more complex venue may require separate coverage.

## Automatic assignment

For each operating block:

1. determine required role coverage;
2. determine hired staff who can legally cover it;
3. assign staff automatically for a continuous working window where practical;
4. compute uncovered requirements;
5. compute labor hours and wages;
6. expose coverage problems before and during operation.

No detailed player rota is required.

## Staff consequences

Adequate staffing may protect:

- entry/service throughput;
- guest comfort/service quality;
- shop/service availability;
- Aufguss execution;
- operational preparation where explicitly supported.

Understaffing must have a concrete consequence tied to the missing role, not a generic hidden happiness penalty.

Examples:

- no eligible Master -> requested Aufguss cannot run;
- insufficient entry/service coverage -> reduced throughput/longer queue/service friction;
- no shop coverage where separate coverage is required -> shop unavailable/reduced throughput.

## Wage mechanics

- Venue staff are paid hourly for assigned work time.
- A Master assigned across a continuous work window remains paid between sessions.
- A Master is not paid only for active towel-work minutes.
- Long opening hours therefore create real labor cost even when demand is weak.

## 24/7 protection

24/7 is not artificially locked.

It is made unattractive early through real operating economics:

- low night demand;
- continuing wage coverage;
- heat/energy/cleaning costs;
- minimum staffing requirements;
- weak utilization of expensive program capacity.

Late-game venues with sufficient reach, scale, demand and economics may rationally support very long hours.

Automated balance tests must compare 24/7 operation against realistic shorter schedules at multiple progression stages.

## Staff overview UI contract

Every venue needs a compact staffing status showing at minimum:

- adequate / strained / missing coverage;
- missing role/function;
- current/expected labor hours;
- current/expected wage cost;
- unresolved Aufguss coverage;
- a direct path to hire/fire/inspect relevant staff.

The Chain Overview separately shows chain staff, including technician workload and chain-level roles.

---

# 4. Aufguss scheduling mechanics

## Player choice

The player chooses:

- program;
- desired frequency/session count;
- premium supplement if applicable;
- eligible venue/program configuration where player choice is relevant.

The player does not place every session manually on a timeline.

## Feasibility inputs

Automatic scheduling considers:

- venue opening hours;
- program room/field compatibility;
- room capacity;
- program duration and turnaround;
- recovery-route/capacity requirements where relevant;
- Master eligibility;
- Master availability;
- demand/daypart fit;
- existing sessions in the same room;
- existing sessions assigned to the same Master.

## Scheduling algorithm contract

For each requested program frequency:

1. generate feasible room/time candidates;
2. remove candidates outside opening hours;
3. remove room conflicts;
4. remove Master conflicts;
5. score remaining candidates by demand/daypart fit and room/venue fit;
6. place the strongest feasible candidate;
7. repeat until requested count is filled or no valid candidate remains;
8. expose unfilled requested sessions with a concrete reason.

A Master may never execute overlapping sessions.

Multiple simultaneous Aufguss sessions require separate eligible rooms/fields and separate available Masters.

## Consequences

A scheduled session affects:

- Master paid working time;
- room occupancy/capacity;
- guest program opportunities;
- program-input costs;
- premium revenue if charged;
- recovery facility pressure;
- Execution result;
- program/guest review evidence.

A request that cannot be scheduled creates no invisible session and no revenue.

---

# 5. Aufguss quality mechanics

Aufguss quality is deliberately multi-dimensional.

## Composition

Derived from the authored program combination itself.

A new/materially revised program begins Unproven and reveals its Composition Tier after first completed execution.

## Execution

Derived from actual delivery conditions including:

- Master craft;
- style/music/program fit;
- equipment;
- workload/schedule;
- practical delivery conditions;
- value/guest response where specified by the existing contract.

## Venue Fit

Derived from credible physical and local evidence:

- landscape connection;
- building character/scale;
- physical program facilities;
- flow/recovery support;
- local market fit;
- visible promise.

## Feedback channels

First completed Unproven program:

- structured first-run review;
- Composition;
- Execution;
- Venue Fit;
- overall star outcome;
- one useful observation;
- optional concrete warning.

Ongoing operation:

- guest comments/reviews from actual experiences;
- Steam Guide/editorial-style observations;
- operational/capacity signals.

These channels share underlying recorded causes but have different presentation roles.

---

# 6. Guest demand and visit mechanics

## Potential demand

Potential guests are generated from:

- local hidden market directions;
- daypart and weekday/weekend availability;
- entry price/value expectation;
- Local Reputation;
- chain Brand Value with capped influence;
- awareness/marketing where active;
- active program offer;
- facilities/visible promise;
- season;
- slow trends/novelty;
- prior guest memory for persistent regulars.

Rank/leaderboard position does not directly create local guests.

## Guest decision chain

`discover -> consider -> arrive -> queue/value check -> enter or leave -> sauna/program -> recovery/rest/shop -> depart -> react -> remember`

Every negative outcome must have a concrete operational cause where possible.

Examples:

- entry queue;
- no program seat;
- recovery bottleneck;
- weak price/value;
- poor program execution;
- missing desired facility;
- schedule mismatch.

## Capacity channels

Capacity is channel-specific:

- entry/changing;
- ordinary sauna;
- Special Aufguss;
- recovery;
- rest/social;
- shop/service.

No facility silently increases all capacities.

---

# 7. Persistent guests and regulars

Use a hybrid model.

- Most visits are generated population visits.
- Each venue has a bounded persistent regular pool.
- Persistent guests retain identity and limited factual memory.
- They may become curious, occasional, regular, cooling or lapsed based on actual experience and availability.
- Do not retain every simulated visitor forever.

Persistent memories influence return propensity and qualitative feedback but never become collectible VIP bonuses.

---

# 8. Reviews, reputation and retention

## Guest review generation

Only a subset of guests reviews/comments.

Probability/content may depend on strength of experience, but all published review claims must derive from recorded visit factors.

Potential topics include:

- price/value;
- Aufguss;
- queue/capacity;
- staff/service;
- recovery facilities;
- atmosphere/visible promise.

## Local Reputation

Local Reputation is earned primarily from delivered local experience and retention.

It affects future consideration/return but cannot create capacity.

## Brand Value

Brand Value is chain-level credibility/reach built from sustained venue performance.

It has capped diminishing effects and must never become a flat free-revenue multiplier.

## Ranking

Ranking/Standing is comparison and recognition.

It has no direct local-demand, revenue, offer-quality or borrowing-capacity effect.

A later competitive Empire Score may combine business value, quality/reputation, successful venues and brand/portfolio performance, but exact scoring remains a balance decision.

---

# 9. Membership mechanics

The player may define simple membership products.

A membership has at minimum:

- monthly price;
- included visit/value structure;
- any approved Aufguss benefit/discount;
- venue/chain scope if later supported.

## Adoption propensity

A guest is more likely to subscribe when:

- they already like the venue;
- they expect frequent use;
- location/convenience fits their routine;
- opening hours fit them;
- membership saves money relative to expected single visits;
- venue capacity makes expected future visits credible.

Membership must be cheaper than repeated frequent single visits while materially more expensive than one visit.

## Churn

Churn increases when:

- expected usage falls;
- satisfaction falls;
- opening-hour fit worsens;
- overcrowding reduces usable value;
- price/value weakens.

Membership revenue does not magically create additional capacity or guest satisfaction.

---

# 10. Shop and merchandise mechanics

- Shop requires a compatible visible/service facility.
- Player chooses a small readable assortment.
- Restocking is automatic.
- Every sale has procurement cost.
- Guest motivations/preferences affect purchase likelihood.
- Merchandise breadth remains small; broader catalogue maximum is approximately 10 meaningful product types.
- Branded merchandise requires earned venue/program identity, not merely a typed name.

Shop is secondary revenue, not the primary game loop.

---

# 11. Seasons and trends

## Seasons

- fixed shared calendar dates;
- bounded understandable modifiers;
- never close otherwise valid venues;
- natural-water routes remain operational year-round with appropriate visuals;
- weather remains primarily cosmetic unless a later approved mechanic changes this.

## Trends

Trends are automatically generated simulation state.

They must:

- emerge gradually;
- be signalled before material impact;
- persist long enough for response;
- have plausible local/regional/global spread according to trend type;
- vary between game years rather than repeat a fixed script;
- be deterministic from stored seed/time inputs for reproducibility;
- offer multiple credible responses;
- never erase the stable baseline value of good standard content.

The user does not manually maintain a trend calendar.

## Events

There is no broad generic Events system in current approved scope.

Do not implement player-created venue events or random modifier cards merely because older documents mention Events.

Specific future event-like mechanics require a concrete separately approved need.

---

# 12. Facility, upgrade and construction mechanics

Every purchasable functional asset has a mandatory data card defining:

- stable identity;
- ownership layer;
- compatibility;
- authored field/anchor;
- footprint/collision;
- capacity channels;
- program capability;
- route/activity contract;
- economy;
- guest/experience effects;
- maintenance/condition behavior;
- construction state;
- visual package.

## Hierarchy

Content must distinguish:

- Location;
- Start Building;
- Base Upgrade;
- Add-on Module;
- Module Upgrade;
- Location Module;
- Shared compatible facility/prop;
- Visual/effect asset.

Normal compatibility belongs in data, not scattered Swift/TypeScript conditionals.

## Construction

Construction consumes money and real elapsed time.

Where plausible the venue remains open, but the affected field/facility is unavailable or reduced.

Construction completes automatically; no manual claim button.

Expensive in-game rush/contractor options may accelerate work where already approved, but are economic choices, not monetization gates.

---

# 13. Maintenance and technicians

Only eligible functional/technical assets deteriorate.

Condition affects that asset's actual capacity/function.

Technicians:

- are chain staff;
- have wages;
- occupy one task/travel state at a time;
- travel between venues using elapsed time;
- repair only the selected target;
- do not create a generic percentage efficiency bonus.

Preventive work is cheaper than failure repair. Maintenance frequency must remain light enough that the game does not become repair spam.

---

# 14. Economy mechanics

## Revenue

Potential sources include:

- admission;
- premium Aufguss supplement;
- shop/merchandise margin;
- membership/subscription revenue.

No revenue source exists without an operational cause.

## Costs

Potential sources include:

- property/rent;
- hourly wages;
- heat/electricity/water;
- cleaning;
- program consumables;
- shop procurement;
- facility operating costs;
- maintenance/repair;
- training/equipment;
- construction;
- marketing;
- debt repayment.

Costs must be centralized balance data and attributed clearly in reports.

---

# 15. Loans and financial distress

Loans are chain capital, not venue-specific project loans.

The player sees factual loan terms and one combined borrowing limit.

Borrowing capacity may depend on chain asset value, actual earnings and current debt according to the finance contract.

## Negative cash

Negative cash opens explicit choices.

The player may use available borrowing, sell a venue, continue to the next financial settlement while a realistic path remains, or declare bankruptcy.

Automatic bankruptcy occurs only at a settlement when obligations cannot be met and no realistic approved loan or venue-sale path remains.

No arbitrary countdown.

---

# 16. Site offer and expansion mechanics

Expansion uses generated offers, not free city selection or a world-map picker.

## Offer batch

A batch contains three viable, meaningfully different opportunities.

Each offer combines compatible:

- location/environment;
- authored plot/profile;
- permanent start building;
- market variation;
- economic variation.

At least one offer in a relevant-stage batch must provide a financially realistic path for the player's current resources/borrowing capacity, even if it is less attractive than the others.

## Attractiveness dimensions

There is no single player-visible attractiveness score.

Underlying dimensions include:

- acquisition economics;
- demand potential;
- market fit;
- price sensitivity;
- daypart fit;
- starter-base usefulness;
- expansion potential;
- physical advantages;
- operating burden;
- destination/brand potential;
- seasonal exposure;
- concept flexibility.

The player sees concrete clues rather than hidden raw scores.

## Rotation

- rejecting an individual offer does not punish the player;
- current batch persists until purchase or deliberate broker refresh;
- broker refresh replaces the full batch;
- refresh uses approved time/cost rules;
- player cannot reroll one slot endlessly to optimize a perfect result.

Every offer must support at least one sensible viable strategy. Affordable may still mean less desirable, but never secretly doomed.

---

# 17. Venue sale mechanics

Sale valuation reacts to:

- property/site value where applicable;
- installed permanent assets;
- condition/wear;
- demonstrated earnings/performance;
- local reputation/brand contribution;
- associated debt/obligations where relevant.

Staff do not automatically transfer with a sold venue.

Reusable company know-how/program IP remains with the chain unless a future explicit rule says otherwise.

---

# 18. Content Studio as mechanics authoring

Content Studio is not only an art-placement tool. It is the authoring interface for data that mechanics consume.

It must be able to author/validate:

- locations and start buildings;
- add-ons/upgrades and ownership hierarchy;
- compatibility;
- anchors/routes/activity points;
- capacity channels;
- economy fields;
- construction/maintenance fields;
- program capabilities;
- visual/render metadata;
- provenance/approval status.

It must not author runtime guest outcomes, cash results or strategic decisions.

AI assistance may propose content but never approve it automatically.

---

# 19. Save/offline mechanics

Canonical saves include all business state required for deterministic continuation, including:

- last simulated timestamp;
- chain finance/debt;
- venues/configuration;
- facility state;
- staff and chain-staff state;
- construction/repair/travel tasks;
- programs and scheduling requests;
- market/regular/trend state;
- deterministic random state/identifiers;
- pending financial decisions;
- bounded unread summaries.

UI selections, camera state and temporary animations are not canonical game state.

On resume:

1. load/migrate save;
2. call canonical simulation from last simulated timestamp to now;
3. produce the same result the open app would have produced;
4. show concise return summary.

---

# 20. Player-facing causal feedback

Every important mechanical consequence must answer `why?`

Examples:

- "Two requested Aufguss sessions could not run: no Master was free."
- "Night opening lost money: 3 visits did not cover 11 staff-hours and heating."
- "Cold recovery is limiting this program: 18 guests wanted the plunge, capacity served 10."
- "Membership churn increased because repeat visits fell and evening hours no longer matched members."
- "This site is affordable but has lower immediate demand and less expansion space."

Do not expose every hidden formula. Do expose the real causal category.

---

# 21. Definition of mechanically implemented

A locked decision is only `IMPLEMENTED` when all applicable conditions are true:

1. owning system is identified;
2. required state/data fields exist;
3. state transition is implemented outside UI/rendering;
4. downstream systems receive the result;
5. player-facing consequence/feedback exists where relevant;
6. save/offline behavior is correct;
7. deterministic automated test exists;
8. balance scenario covers exploit/failure cases;
9. renderer/UI only presents the canonical result;
10. documentation status is updated.

Anything less is `SPECIFIED`, `PARTIAL` or `NOT IMPLEMENTED`.

See `MECHANICS_IMPLEMENTATION_MATRIX.md` for current status and coding order.