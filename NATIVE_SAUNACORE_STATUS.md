# Native SaunaCore Status — 2026-09-16

This file is the concise current implementation status for the native Swift core. Product truth still follows the decision precedence in the repository; this file records what is actually implemented and parity-tested.

## Implemented in `native/SaunaCore`

- canonical clock: 24 real hours = 1 game week;
- deterministic xorshift32 RNG and named streams;
- chronological milestone engine with milestone-before-week-boundary ordering;
- persistent canonical envelope with `lastSimulatedAt` and in-progress operating runtime;
- daypart operating blocks;
- owner/venue staffing coverage;
- automatic Gus scheduling;
- ordinary admissions and Special Gus demand/capacity;
- block-owned revenue/cost consequences;
- shop sales + automatic procurement;
- recovery demand/queue consequences;
- direct condition wear at block settlement;
- save/resume without replay;
- future-only replanning after midweek commands;
- admission-price and programme-intent changes;
- construction and repair completion as canonical milestones;
- one major construction slot per venue;
- money-only construction rush, with no contractor mechanic;
- three loan bands (small / standard / large);
- borrowing room based on current Canal collateral/profitable-weeks reference rule;
- automatic weekly loan repayment and remaining-term decrement;
- profitable-week streak tracking;
- `financialDecisionPending` when settlement leaves cash negative.

## Shared TypeScript -> Swift parity fixtures

Current fixtures under `src/sim/fixtures/` include:

- `canal-canonical-week-v2.json` — starter canonical week;
- `canal-midweek-reprice-v1.json` — future-only price replanning;
- `canal-midweek-program-v1.json` — future-only programme replanning;
- `canal-upgraded-channels-v1.json` — upgraded Gus/shop/recovery/wear channels;
- `canal-finance-small-loan-v1.json` — automatic bridge-loan settlement;
- `canal-finance-distress-v1.json` — negative-cash settlement and financial decision state;
- `canal-construction-completion-v1.json` — construction milestone completion;
- `canal-construction-rush-v1.json` — 25% money-only rush contract.

Parity fixtures are migration contracts, not final balance approval.

## Current architectural rule

Do not move production work into SwiftUI or SpriteKit while a mechanic still lacks a headless domain contract or parity fixture. UI/rendering must observe `SaunaCore`; it must not own economy, scheduling, construction, finance, wear or guest-demand formulas.

## Next native targets

1. complete CI validation of finance/construction shared fixtures;
2. migrate versioned native save schema/migrations around the expanded finance/construction state;
3. add explicit financial recovery actions (loan / sale path contracts) without arbitrary bankruptcy countdown;
4. port venue sale/site-offer mechanics when their TypeScript/data contracts are stable;
5. only then begin the minimal SwiftUI shell and SpriteKit scene adapter.
