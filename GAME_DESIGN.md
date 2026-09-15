# Sauna Empire Game Design

## Product vision

Sauna Empire is a management game about building distinctive sauna venues, learning what local guests value, and growing from one modest operation into a respected multi-location sauna business. The player should feel that operational and creative choices become visible in the venue and in guest behavior, not only in financial tables.

Before implementation, read `docs/decision-reconciliation-2026-09-15.md`, `PRODUCT_DECISIONS_2026-09-15.md` and the inherited `docs/decision-log.md`.

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

The Empire reference build currently uses a victory target of eight owned locations, 1.5 million kr. empire value and average rating 4.25. This is a reference rule, not automatically final product balance.

## Canonical game time - LOCKED

**One in-game week equals 24 real hours.**

Consequences:

- one in-game year is approximately 52 real days, around 7.5 real weeks;
- time progression is persistent and based on canonical timestamps;
- the same elapsed real time must produce the same simulation result whether the app was open or closed;
- construction, repairs, staff travel and other timed work continue against the same clock;
- future scoreboards/ranking periods can compare players against the same fixed time base;
- UI and rendering never invent or accelerate business time independently of the simulation;
- debug builds may provide time controls, but these are not production gameplay/scoring.

The existing `Run Week` behavior is a prototype/debug shortcut only.

## Economy

Existing implemented revenue sources include admission, paid premium/show Aufguss and shop sales. Approved/expected costs include venue/base operation, hourly wages, utilities/cleaning, program materials, shop procurement, facility operation, construction, maintenance/repair, training/equipment and loan repayments.

Rent/property economics, heating, electricity and water should be understandable operating drivers represented in the central economy model rather than scattered UI calculations.

## Loans and insolvency - LOCKED STRUCTURE

Negative cash creates a factual financial-decision state.

- the player may use realistic available borrowing and venue-sale options;
- there is no arbitrary fixed countdown;
- automatic bankruptcy happens only at a financial settlement where due obligations cannot be paid and no realistic approved loan or venue-sale path remains;
- voluntary bankruptcy remains possible;
- exact interest rates, borrowing values and sale weights are balance data.

## Sauna sessions and capacity

The game distinguishes ordinary sauna capacity from special Aufguss capacity. Program frequency must respect room time, available staff and venue constraints.

The player creates reusable Aufguss programs using name, intent, heat profile, duration/format, aroma rounds, performance language, music direction, recovery finish, requested frequency and supplement price.

Programs are evaluated through separate composition, execution and Venue Fit layers.

A newly created or materially revised program receives a first-run review. Later quality is also visible through ordinary guest feedback and the more informed Steam Guide/editorial layer.

## Guests

The intended lifecycle is:

`discover -> decide -> arrive -> wait/enter -> sauna or Aufguss -> recovery/shop/rest -> leave -> remember/respond`

Guests have preferences, value tolerance and queue tolerance. Appearance must not determine mechanical value or behavior.

Use a bounded hybrid memory model:

- most demand may be represented through population/market simulation;
- each venue keeps a limited pool of identifiable persistent regulars;
- regulars can retain limited factual memories, satisfaction and return/lapse history;
- do not persist every simulated visitor forever.

## Satisfaction, loyalty and reviews

Delivered experience determines satisfaction. Feedback may identify concrete causes such as program quality, price/value, queues/capacity, staff/service, facilities or atmosphere.

Review channels serve different purposes:

- first-run Aufguss review diagnoses Composition, Execution and Venue Fit;
- guest reviews/comments describe actual individual experiences;
- Steam Guide/editorial observations provide a more informed craft/value/venue-fit perspective.

Local reputation, repeat visits and loyalty translate repeated outcomes into market consequences. Exact probabilities and aggregation curves remain balance parameters.

## Staff - LOCKED OPERATING MODEL

The player hires and fires staff and sets venue opening hours. The player does **not** create detailed shift rotas.

- staff are automatically assigned across required opening hours;
- staff are paid hourly for assigned work;
- an Aufguss Master cannot deliver overlapping sessions;
- a Master who remains assigned between two sessions is also paid for that in-between time;
- exact minimum staffing requirements by venue size/facility mix are an implementation/balance question;
- staff sickness, holidays, voluntary resignations and HR-drama systems are outside current scope.

Longer opening hours increase potential demand but also labor and operating costs. Early 24/7 operation must not be an easy exploit. This is solved through daypart demand, minimum staffing, utilities/cleaning, market fit and physical capacity rather than an artificial unlock.

## Locations and site offers

Expansion comes through generated site offers, not a world map where the player selects arbitrary cities.

The repository contains locked/proposed location families such as Canal, Harbour, Industrial District, Forest Lake, Coast, Beach, Rural Plot, Water Plot, Urban Lot and Hotel Rooftop. These are design families, not automatically real city names.

Specific city names, venue names, neighbourhoods or market names generated by an agent are not canonical unless explicitly approved.

Every generated site must be viable under at least one sensible strategy. Affordability and attractiveness are separate dimensions.

- starting offers remain realistically accessible from starting cash/responsible borrowing;
- later offer batches may contain aspirational expensive sites;
- every fresh batch must still contain at least one financially realistic path for the player's current stage;
- no offer is an objective trap.

### What makes a site attractive?

There is no exposed single attractiveness score. Important underlying dimensions include acquisition pressure, reachable demand, market fit, price sensitivity, daypart rhythm, starter-base usefulness, expansion potential, physical advantages, operating burden, destination/brand potential, seasonality and concept flexibility.

The player sees concrete clues, not hidden raw scores.

`Canal Workshop` is a prototype/reference composition, not a locked player-facing venue name. Native work should refer to it as the Canal reference slice unless discussing the old prototype itself.

## Buildings, facilities and upgrades

Venue construction is modular rather than free tile-by-tile building.

The content model must clearly distinguish:

1. **Location**
2. **Start Building**
3. **Base-building Upgrade**
4. **Add-on Module**
5. **Module Upgrade**
6. **Location-specific Module**
7. **Shared Compatible Content**

A venue consists of location/environment, a legal starter base, compatible later modules/upgrades and authored route/activity/effect anchors.

The player chooses what to build. Authored data controls where/how it can legally attach.

Upgrades should have explicit effects rather than hidden generic percentage bonuses. Each purchasable item defines compatibility, price, build time, capacity channels, operating impact, visual state and relevant routes/anchors.

## Sauna Empire Content Studio - LOCKED PRODUCTION TOOL

A dedicated internal macOS authoring tool in the Xcode workspace is part of the production architecture.

It must make the hierarchy and ownership of content immediately clear and allow a non-programmer to create/review locations without editing Swift.

It must support:

- Location -> Start Building -> Add-on -> Upgrade hierarchy;
- location-owned versus building-owned content;
- compatibility and attachment anchors;
- routes/walkable areas/activity/effect points/masks/draw order;
- placeholder assets before final art exists;
- capacity/economy/gameplay metadata;
- plain-language validation errors;
- AI suggestions that remain clearly marked proposals until approved;
- deterministic versioned export consumed by the game.

See `CONTENT_STUDIO.md`.

## Placeholder assets - APPROVED

Final assets are not required before implementation.

Placeholders may be used as long as they respect the same footprint, anchor, IDs and metadata contract as final art. Replacing art must not change simulation behavior.

## Progression

Progression comes from stronger programs, better staff/equipment, improved facilities/capacity, higher local reputation, stronger finances/borrowing ability, additional venue opportunities, chain brand/ranking and acquisition/sale decisions.

Progression should not be a simple linear tech tree. Facilities should not be withheld behind arbitrary levels when the player has the money/borrowing capacity and a compatible site.

## Seasons and trends - APPROVED AUTOMATIC SYSTEMS

Seasons use the shared canonical calendar and create bounded context rather than hard viability gates.

Trends are automatic simulation content:

- they emerge/spread gradually;
- they may have local, regional or global reach depending on the trend;
- yearly patterns should vary rather than repeat identically;
- generation/spread must remain reproducible from canonical state/seed/time when required for saves and fair competition;
- trends are signalled before material effects;
- they never arbitrarily make a sound venue non-viable;
- the player reacts to trends but does not maintain or curate them.

Exact frequencies and numerical curves remain balance work.

## Events - NOT CURRENT CORE SCOPE

Do not implement a general player-created event system or broad random world-event taxonomy now.

Seasonality, trends, press/reviews, market evolution and normal operations already provide changing conditions. A narrow future event feature may only be reconsidered if playtesting reveals a concrete gameplay need.

## Memberships / subscriptions - APPROVED SYSTEM

Memberships are recurring products aimed primarily at guests who already fit and like the venue and expect repeated use.

- monthly membership costs materially more than one single visit;
- for frequent users it can be cheaper than repeated individual admissions;
- adoption depends on satisfaction, repeat behavior, convenience/reach, opening-hour fit, price/value and capacity experience;
- strong regulars are natural candidates;
- memberships do not create demand independently of venue appeal;
- overcrowding can lower member satisfaction and cause churn.

Exact products, prices and churn curves are balance data.

## Shop and merchandise

Keep retail small and readable.

- individual venues offer a small assortment;
- replenishment is automatic;
- broader catalogue should remain roughly maximum 10 meaningful product types;
- branded merchandise is tied to genuine venue/program identity;
- do not turn Sauna Empire into a retail inventory simulator.

## Brand, ratings and ranking

Local delivered experience drives local reputation. Chain Brand Value has capped credibility/reach effects, never free capacity or guaranteed demand.

Ranking is a separate comparison layer and does not alter local demand or create active local competitors.

A future Empire Score should not be based only on cash. It may combine business value, quality/reputation, successful venue operation and portfolio/brand performance. The exact formula is deliberately deferred because it affects player incentives.

## Selling venues

The player can sell a sauna/venue.

Sale value should react to property/site value where relevant, installed investments, condition/wear, demonstrated performance, local reputation/brand contribution and associated debt/obligations.

Staff do not automatically transfer with the sold venue. Reusable company knowledge and player-owned program IP remain with the chain unless a later explicit rule changes this.

## Progression between locations

Each new venue should be locally meaningful, not a cloned production unit. The chain can transfer know-how, brand and selected reusable assets while the new site retains its own market fit, physical constraints, costs and guest behavior.

## Design principle

Sauna Empire should reward observation and adaptation. The strongest gameplay is not "buy the largest upgrade" but understanding how site, building, staff, program, price, capacity and local guest preferences interact.