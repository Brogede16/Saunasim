# Sauna Sim Design Closure Audit v0.4

Date: August 25, 2026

## Verdict

The non-visual design now has one coherent path from an offer through physical venue choice, programs, guests, operations, finance, retention and long-term change.

```text
offer -> location/building/market -> facilities/staff/programs
-> individual visits -> cash/reputation/memory -> investment/expansion
```

The project is ready for a **content and numerical-balance pass**. It is intentionally not ready for final asset production until those content cards and balance scenarios have been reviewed.

## Closed System Contracts

| Area | Canonical contract | Result |
| --- | --- | --- |
| Venue Fit | `venue-fit-data-contract-v0.1.md` | Six evidence families; place-specific benefits without generic multipliers. |
| Local market | `local-market-feedback-contract-v0.1.md` | Hidden tendencies learned through truthful clues and feedback. |
| Regulars | `guest-memory-and-regulars-contract-v0.1.md` | Bounded local pool; factual memories, no VIP/collection system. |
| Trends/novelty | `trends-and-novelty-contract-v0.1.md` | Slow, visible opportunity; no baseline punishment. |
| Seasons | `seasons-and-operating-calendar-contract-v0.1.md` | 52-real-day year, year-round water routes and deferred ambience. |
| Offers | `venue-offer-card-contract-v0.1.md` | Every venue is reviewable as text/data before routes or art. |
| Finance/staff/time | Existing dedicated models | Chain finance, real-time simulation, bounded maintenance and player-owned strategy remain compatible. |

## Canonical Interpretation Rules

1. **“Canal Workshop” has two legitimate uses only:** a technical/balance shorthand for the `Canal + Repair Workshop` reference offer, and a legacy filename. It is not a fixed named venue that removes future Canal combinations.
2. **No active local rivals:** rank compares score to simulated/reference chains only. Earlier mentions of a nearest competitor or local competitive pressure in `gdd-v0.1.md`, `first-gameplay-spec-v0.1.md` and `design-audit-v0.1.md` are historical and cannot drive implementation.
3. **Every offer has a physical base:** any older empty-plot or free-first-build wording is superseded by `decision-log.md` and `venue-offer-card-contract-v0.1.md`.
4. **Final art is blocked by content, not the other way around:** scene layouts reserve fields, but final sprites, backgrounds and animation sheets wait for approved offer cards, asset cards and balance envelopes.
5. **No hidden universal bonuses:** water, premium buildings, staff, Brand Value, capacity and upgrades all have bounded, specific mechanisms and counterweights.

## Remaining Non-Visual Work

### P0: Content Data

1. Produce reviewed offer cards from the locked location/building library, starting with first-offer candidates and then later-game offers.
2. Convert approved building/location modules into complete asset data cards: primary effect, capacity channel, cost category, route commitment, condition eligibility and Venue Fit evidence.
3. Assemble the first approved player-facing copy sheets for property cards, regular memories, reports and Steam Guide observations.
4. Produce curated starting Gus presets from the approved material/music/performance library. Free composition remains supported; presets teach the system.

### P1: Numerical Balance

1. Keep the Canal implementation aligned to the declared temporary capacity envelope in `src/content/canalCapacity.ts` before tuning. Any prototype display value must import or derive from that contract.
2. Run comparable low/mid/high investment routes for every building family, using margin per Master-minute and each physical capacity channel.
3. Tune first-offer cash, acquisition pressure, wages, material costs, prices, loans and upgrade costs together, not in isolated tables.
4. Validate online/offline simulation, negative cash, repair travel, return-memory persistence and one trend lifecycle.

### P2: Only Then Visual Preproduction

1. Approve visual character variation families: body silhouettes, hair, skin palettes, towel/outfit palettes, uniforms and accessibility-safe variation rules.
2. Approve the first location/building visual package and exact scene composition.
3. Create the final route/animation inventory from the approved facility cards.

## Balance Protections To Test

- Natural water has a strong identity route but cannot dominate a well-built city, industrial or rural alternative.
- Bigger venues sell more potential seats but pay through investment, wage, heat, recovery and queue complexity.
- Small sessions can earn premium only through actual intimacy, delivery and fit; they are never automatically superior.
- Operations Managers and staff make scale manageable but never choose the strategic game for the player.
- Loans enable calculated risk, but repayment and negative-cash decisions remain real.
- Returning guests, Brand Value, trends and rank cannot snowball into automatic demand.

## Visual Decision Gate

Before final pixel assets begin, the owner and project need one focused visual approval pass covering:

1. Guest body/silhouette families and proportions.
2. Hair, skin, towel/clothing and non-binary-inclusive palette/variation approach.
3. Staff uniforms, Master tools and role readability.
4. First venue composition, depth/masking and guest-route visibility.
5. Asset-sheet dimensions, scale, palette and animation frame budget.

No other non-visual design decision currently blocks that gate.
