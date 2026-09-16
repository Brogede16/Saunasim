# Xcode Migration Strategy

## Current native implementation status — 2026-09-16

The migration is now active implementation, not preparation only.

`native/SaunaCore` is a Swift 6 package with no SwiftUI/SpriteKit dependency. It currently contains:

- canonical time constants and week-boundary helpers matching TypeScript;
- deterministic xorshift32 RNG parity, including named stream forks;
- a generic chronological simulation engine with milestone-before-week-boundary ordering;
- Codable operating-block/runtime contracts with idempotent settlement;
- direct loading of `src/sim/fixtures/canal-canonical-week-v2.json` from XCTest;
- a first Canal operating-loop port that reproduces the shared starter-week fixture;
- native daypart operating blocks rather than only weekly aggregate totals;
- future-only midweek replanning that preserves settled block history and accrued accounting;
- macOS `swift test` as part of repository CI.

The TypeScript canonical runtime remains the behavior oracle. Do not fork rules independently in Swift. Every additional native system should either consume a shared fixture or add a new TypeScript fixture before claiming parity.

The next native parity targets are:

1. persistent canonical envelope/save-resume with in-progress operating runtime;
2. a shared midweek repricing fixture proving settled history is immutable;
3. a shared changed-program fixture;
4. construction/repair milestones inside the Swift chronological adapter;
5. then broader Canal shop/recovery/wear parity before any production SwiftUI/SpriteKit work.

## Goal

Move Sauna Empire toward a native iPhone app using Swift, SwiftUI and SpriteKit without rewriting the entire project at once.

GameplayKit may be used selectively where it reduces custom infrastructure, for example state machines or pathfinding, but it is not required as the core architecture.

## Source classification

### Reuse directly

Very little browser code should be copied literally into the native target. Reuse directly mainly means data/specification assets that are platform-neutral:

- approved image assets;
- stable IDs and naming conventions;
- test fixtures/scenario inputs where portable;
- JSON-like data/catalogs after schema review;
- documentation and balance tables.

### Translate behavior

Translate, system by system:

- `src/sim/*` deterministic rules;
- `src/save/savegame.ts` save/versioning principles;
- validated content models in `src/content/*`;
- selected Empire rebuild behavior that is not yet represented in modular TypeScript.

### Use as specification

- React management UI;
- Phaser scene behavior;
- `empire-rebuild/` map and empire flow;
- docs describing future systems;
- visual QA screenshots and prototypes.

### Discard from native runtime

- DOM/browser-specific code;
- IndexedDB/Dexie implementation details;
- React component architecture;
- Phaser scene implementation;
- bundled standalone HTML as architecture;
- browser localStorage wiring.

Do not delete these references until the native equivalents are proven.

## Migration phases

### Phase 0 - Freeze behavioral references

Before porting:

- keep `main` stable;
- use `ai-xcode-preparation` for preparation;
- record current build/test commands;
- capture deterministic fixtures for the first systems to port;
- define a small set of canonical simulation scenarios and expected outputs.

Definition of done: current browser implementations remain runnable and documented as references.

### Phase 1 - Create native simulation package

Create a Swift package or framework target with no SwiftUI/SpriteKit imports.

Implement only:

- core IDs/models;
- seeded RNG abstraction;
- clock abstraction;
- first `GameState`;
- simulation command/result interface.

Definition of done: XCTest can instantiate and mutate a game without launching an app.

**Status:** substantially underway. The package, clock, RNG, block/runtime contracts and chronological engine exist and are CI-tested. A full native `GameState`/command surface is still being expanded system by system.

### Phase 2 - Models and central data

Port only the model subset needed by the first venue:

- chain/player;
- venue/location;
- facility;
- staff/Gus Master;
- program;
- game time;
- finance ledger.

Move starting values and balance into central configuration.

Definition of done: no UI-dependent domain types.

### Phase 3 - Economy

Port the Canal economy first because it is measurable and already testable.

Translate:

- admission revenue;
- special-session revenue;
- shop revenue if included in slice;
- operating costs;
- wages;
- basic facility cost;
- one loan only if needed by the slice.

Run Swift vs TypeScript fixture comparisons.

Definition of done: identical fixture inputs produce equivalent expected ledgers within documented rounding rules.

### Phase 4 - Game clock

Do not port the current mixed week/action/timestamp behavior blindly.

Create one canonical clock that can:

- advance deterministic simulated time;
- expose day/week/month boundaries;
- accept an injected wall clock for offline settlement;
- run without graphics.

Definition of done: tests can simulate time without sleeping or using device timers.

### Phase 5 - Save system

Implement a versioned Codable envelope and migration framework.

Initial native saves do not need to import browser saves unless explicitly chosen as a product requirement. Browser save formats remain reference material.

Definition of done: round-trip and migration tests pass; corrupt saves are preserved/rejected safely.

### Phase 6 - Basic SwiftUI shell

Build:

- app launch;
- New Game/Continue;
- venue management shell;
- economy summary;
- basic controls for the one-venue slice.

SwiftUI observes domain state through an application/view-model adapter. Business rules remain in simulation.

### Phase 7 - SpriteKit scene

Create a SpriteKit scene adapter for one location.

Responsibilities:

- environment/building/facility layers;
- one guest sprite;
- route/activity visualization;
- camera/zoom;
- asset anchors;
- visual events.

No economic or satisfaction formulas in SpriteKit.

### Phase 8 - One guest

Port a deliberately small guest flow:

`arrive -> sauna -> leave`

Then add one optional special session/recovery step.

Definition of done: the same logical visit can be executed headlessly and visualized in SpriteKit.

### Phase 9 - One sauna

One location, one sauna/oven, one admission product, one capacity rule, one operating-cost model.

Definition of done: venue can open, receive visits and produce a ledger.

### Phase 10 - Complete Vertical Slice 0.1

Add:

- guest arrival/demand;
- use of sauna;
- payment;
- expenses;
- time progression;
- save/load;
- economy view;
- one upgrade.

This is the first proof that architecture, simulation, UI, rendering and persistence work together.

## Do not migrate yet

Until Vertical Slice 0.1 is stable, do not port all of:

- 48 markets;
- full guest memory;
- full rank/brand;
- all upgrades;
- all Gus materials/program combinations;
- memberships;
- trends;
- large staff scheduler;
- final art catalogue.

## Comparison strategy

For each translated simulation system:

1. choose canonical TypeScript fixture;
2. record input and expected output;
3. implement Swift equivalent;
4. run XCTest;
5. compare output;
6. document intentional differences;
7. only then expand scope.

## Biggest migration risk

The main risk is not Swift itself. It is accidentally combining rules from two prototypes and future design docs into a new third behavior set. The migration must therefore make the source of every rule explicit.