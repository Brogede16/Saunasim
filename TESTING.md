# Sauna Empire Testing Strategy

## Goal

Sauna Empire must be testable primarily without graphics. The simulation is the product truth, SpriteKit and SwiftUI are presentation/adapters around it.

## Unit tests

Use XCTest for isolated systems and pure functions.

Cover at minimum:

- economy calculations;
- loan repayments and borrowing rules;
- construction costs/completion;
- maintenance wear/repair;
- guest demand decisions;
- guest satisfaction outcomes;
- program composition/execution;
- staff wage/skill effects;
- upgrade effects;
- rating/reputation updates;
- save migrations;
- clock/calendar boundaries.

Every test should inject time and RNG where relevant.

## Simulation tests

Run the game headlessly with no SwiftUI/SpriteKit.

Examples:

```text
simulate 1 venue for 30 game days
simulate 1 venue for 24 game months
simulate 100 seeded guest weeks
simulate construction + repair + loan lifecycle
```

These tests verify system interaction and state transitions.

## Regression tests

Canonical scenarios should be stored as fixtures with stable expected outcomes.

During TypeScript-to-Swift migration, use current TypeScript results as comparison fixtures where behavior is intended to remain unchanged.

Examples:

- starting venue baseline week;
- high-price/low-demand case;
- full-capacity special-session case;
- staff wage and loan repayment case;
- damaged facility case;
- save/load continuation case.

If expected output changes intentionally, the commit must document why.

## Balance tests

Build a batch simulation harness capable of thousands of seeded runs, for example:

```text
simulate 1,000 games for 24 in-game months
```

Collect distributions for:

- bankruptcy/insolvency rate;
- median and percentile revenue/profit;
- average cash/debt;
- time to first upgrade;
- time to expansion;
- progression speed;
- guest satisfaction/rating;
- occupancy and queue loss;
- price distribution;
- loan usage;
- upgrade popularity;
- staff progression;
- venue sale frequency once implemented.

Balance tests should assert broad acceptable ranges, not one exact economic outcome across all seeds.

## Property/invariant tests

Useful invariants:

- cash ledger components sum to net result;
- capacity cannot be negative;
- attendance cannot exceed relevant capacity unless an explicit overbooking rule exists;
- condition remains within 0...100;
- loan remaining periods never increase unexpectedly;
- an unavailable facility cannot serve guests;
- one guest cannot occupy two mutually exclusive activities simultaneously;
- save/load preserves canonical gameplay state;
- simulation does not depend on rendering state.

## SwiftUI tests

Use unit tests for view models/presentation adapters and XCUITest for critical flows.

Minimum flows:

- launch and create new game;
- continue saved game;
- change admission price;
- buy first upgrade;
- view economy summary;
- background/restore without losing state;
- error state for unreadable save if applicable.

Do not use UI tests to validate economy formulas.

## SpriteKit integration tests

Test renderer contracts rather than business outcomes:

- scene loads required assets;
- anchors resolve;
- guest logical route maps to valid scene route;
- sprites remain on valid layers;
- modular character layers share frame/anchor contract;
- upgrade state displays at declared attachment anchor;
- camera zoom preserves world scale;
- missing asset metadata fails loudly in development.

Where practical, create snapshot/image-diff tests for key scene states, but do not make them the only visual verification.

## Gameplay/integration tests

Run the application layer with simulation plus presentation adapters.

Examples:

- guest arrives logically, corresponding SpriteKit entity appears, visit resolves, revenue reaches economy UI;
- construction command removes cash, project completes through clock, renderer displays completed module;
- save during an active project, reload, advance time, project completes once.

## Save compatibility tests

Maintain fixture saves for every supported schema boundary.

Test:

- latest round-trip;
- migration from oldest supported save;
- corrupt save rejection;
- unsupported save preservation;
- offline settlement after load;
- migration idempotence where applicable.

## CI expectations

Every pull request/agent task that changes code should run the relevant subset. Main/native integration should eventually run:

1. compile/build;
2. unit tests;
3. simulation/regression tests;
4. save migration tests;
5. selected integration/UI tests;
6. optional scheduled large balance batch.

Large 1,000-game balance simulations may run nightly/on demand rather than on every tiny commit.

## Agent rule

An agent must never fix a failing gameplay test by weakening/removing the assertion unless the product rule intentionally changed and the documentation/fixture is updated to explain that change.