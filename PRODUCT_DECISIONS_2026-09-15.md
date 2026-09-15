# Sauna Empire Product Decisions - 2026-09-15

This file records product decisions explicitly approved by the user during the Xcode preparation pass. These decisions override older TBD language in preparation documents. Existing canonical repo documents should be reconciled against them before implementation.

## 1. Financial distress

Use the objective solvency model rather than an artificial countdown.

- Negative cash triggers a clear financial decision state.
- The player can use available borrowing, sell a venue where possible, or continue until the next financial settlement.
- Bankruptcy occurs only when due obligations cannot be met and there is no realistic approved loan or venue-sale path remaining, or the player voluntarily declares bankruptcy.
- Do not create an arbitrary one-week grace timer purely to pressure the player.

## 2. Staff and opening-hours model

The staff system must remain simple to operate.

- The player hires and fires staff.
- The player chooses venue opening hours.
- Staff are automatically assigned across the venue's opening hours according to the roles/capacity required for operation.
- The player does not build a detailed shift rota.
- Staff are paid by the hour for the hours they are assigned/working.
- An Aufguss Master cannot conduct two overlapping Aufguss sessions.
- If a Master is assigned for a continuous working period containing multiple sessions, the Master is paid for the time between those sessions as well. The game must not treat only active session minutes as paid work.
- No sickness, holiday, resignation or other personnel-absence simulation is required at this stage.

### 24/7 operating balance

A venue must not become rational to operate 24/7 early in the game simply because the player can set long opening hours.

This should be achieved through simulation economics, not an artificial unlock on the clock:

- local demand varies strongly by daypart;
- very low-demand hours still incur required staffing costs;
- heat/energy, cleaning and other operating costs continue while open;
- larger/complex venues can require more minimum staffing coverage;
- Aufguss capacity only creates value when demand, Master availability and physical capacity support it;
- late-game brand, venue scale, market reach and stronger economics can eventually make very long opening hours viable for suitable venues.

The balance system should test opening-hour strategies explicitly, including 24/7 operation, and flag cases where an early venue profits unrealistically from empty night hours.

## 3. Guest absence/personnel events

Do not implement staff sickness, holidays, resignations or HR-event complexity now.

## 4. Reviews and Aufguss feedback

Aufguss quality is deliberately visible through more than one feedback channel.

### Program review

A newly created or materially revised Aufguss program receives a structured first-run review after its first completed session. Existing repo design already separates:

- Composition
- Execution
- Venue Fit
- Overall result
- one useful guest/observer note
- an optional concrete issue to watch

This is the clearest diagnostic of whether the program itself is coherent, whether the Master delivered it well, and whether the venue supported it.

### Guest reviews/comments

A subset of actual guests leaves ratings/comments based only on factors they experienced. These can reveal whether a Gus was liked, but also price/value, queues, cleanliness/service, recovery facilities and atmosphere.

### Editorial/guide reviews

The existing `Steam Guide` concept can provide a more informed editorial observation about craft, venue fit and value. This is distinct from ordinary guest reviews and should not replace them.

Therefore Gus quality can be learned from both direct program diagnostics and public/guest feedback, while each channel has a different purpose.

## 5. Guest memory and regulars

Use a bounded hybrid model.

- Most demand can be represented through population/market simulation.
- Keep a limited pool of persistent identifiable guests/regulars per venue.
- Persistent guests may accumulate visits, preferences, satisfaction/memory and lapse/return history.
- Do not save every simulated visitor forever.

## 6. Seasons and trends

Seasons and trends run automatically. They are game systems, not manually maintained live content.

- Seasons follow the canonical shared calendar.
- Seasonal effects should remain bounded and understandable.
- Trends emerge and spread over time rather than switching globally and instantly.
- Trend spread should be plausible and gradual, with local/regional/global reach as appropriate to the specific trend.
- The exact pattern should have controlled variation, so the same trend calendar does not repeat identically every in-game year.
- A player should be able to observe signals and react, but should not need to maintain or configure the trend system.
- Trend generation must be deterministic/reproducible from game seed/time inputs where required for saves and future fair competition.
- Trends must not arbitrarily make an otherwise sound venue non-viable.

## 7. Events

Do not implement player-created venue events.

No separate broad event system is required for the current product scope. Seasonal effects, trends, market changes, press/reviews and normal operating variation already cover the desired sources of changing conditions.

A future narrowly scoped event feature may be reconsidered only if playtesting reveals a concrete gameplay need. Do not build an event taxonomy merely because older planning documents contain an `Events` heading.

## 8. Subscriptions / memberships

The player may create simple membership products.

Core logic:

- membership should be cheaper for a frequent user than repeatedly paying standard single-entry price;
- the monthly fixed price is nevertheless materially larger than one individual visit;
- membership purchase propensity depends on whether a guest already likes/fits the venue and expects to visit often enough;
- local convenience/distance, opening-hour fit, satisfaction, regularity, price/value and available capacity should influence adoption;
- strong regulars and repeat guests are natural candidates;
- poor experiences and reduced expected usage can cause churn;
- membership must not generate demand independently of actual venue appeal;
- capacity pressure still matters: selling too many memberships into an overcrowded venue can lower satisfaction and retention.

Exact pricing and churn parameters belong in central balance data and should be simulation-tested.

## 9. Merchandise

Keep the merchandise system small and legible, with a maximum of roughly 10 meaningful product types in the broader catalogue.

Possible categories include practical sauna/wellness goods and later branded merchandise tied to a real venue/program identity. Avoid turning the game into a retail-management simulator.

## 10. Expansion offers and site attractiveness

Expansion should not use a linear level gate.

- New site opportunities appear over time.
- Whether the player can acquire them depends on cash, borrowing capacity and other meaningful business conditions.
- The offer generator must always include at least one financially realistic path for the player at the relevant stage, even if that offer is less attractive than expensive alternatives.
- An offer may be affordable but less attractive; affordability and attractiveness are different dimensions.

### What makes a site attractive?

There is no single player-visible `attractiveness score`. A site is attractive relative to the player's strategy and price.

Important underlying dimensions include:

1. **Acquisition economics** - purchase/rent pressure and essential opening investment.
2. **Demand potential** - credible local/customer flow and size of reachable demand.
3. **Market fit** - current local mix of convenience, recovery, social/program and premium/destination demand.
4. **Price sensitivity** - how easily the local market supports higher entry/program pricing.
5. **Daypart fit** - whether demand aligns with profitable operating hours.
6. **Physical starter base** - useful existing building/form, scale and immediate operating potential.
7. **Expansion potential** - authored space/anchors for future modules and capacity growth.
8. **Distinctive physical advantages** - e.g. natural water, outdoor potential or other site-specific features.
9. **Operating burden** - rent/property cost, utilities, maintenance and required staffing relative to potential revenue.
10. **Destination/brand potential** - ability to draw guests beyond immediate convenience demand if the concept becomes strong.
11. **Seasonal exposure** - beneficial or difficult seasonality, without creating objective trap sites.
12. **Concept flexibility** - how many credible venue directions the site/building combination supports.

The player sees concrete clues, not hidden numeric market values. The offer card should therefore communicate price, scale, setting, water/outdoor potential, physical constraints/expansion and qualitative market clues.

Every generated offer must be viable under at least one sensible strategy. A cheaper offer may be less attractive because it has lower flow, smaller expansion space, weaker premium potential, greater price sensitivity or less distinctive physical potential, but it must not be a disguised failure state.

## 11. Selling a venue

Venue sale value should react to:

- property/site value where applicable;
- installed permanent investments;
- venue condition/wear;
- demonstrated financial performance;
- local reputation/brand contribution;
- outstanding debt/obligations associated with the venue where relevant.

Staff do not automatically transfer with the sold venue. Reusable company know-how, program IP and chain knowledge remain with the player's company unless a later explicit mechanic says otherwise.

## 12. Ranking / scoreboard

A future competitive scoreboard can use the fixed canonical time model.

Do not rank only by cash. A broader Empire Score can later combine business value, quality/reputation, successful venue operation and brand/portfolio performance. The exact formula remains a later balance decision because it will shape player incentives.

Competitive/ranking scoring must stay separate from local guest demand and must not create active rival interference in a player's local market.
