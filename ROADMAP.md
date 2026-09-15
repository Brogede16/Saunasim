# Sauna Empire Roadmap

## Phase 0 - Repository cleanup

**Goal:** establish one understandable source hierarchy before native development.

**Features/work:** audit, source-of-truth policy, documentation index, identify duplicate/generated files, mark asset status, define central balance ownership, freeze canonical browser test fixtures.

**Definition of done:** agents can answer what is implemented vs designed; no destructive cleanup is required to understand the project; current browser build/tests remain usable.

**Dependencies:** none.

**Risks:** deleting a runtime duplicate that is actually referenced; confusing Empire rebuild behavior with Canal architecture.

## Phase 1 - Simulation prototype

**Goal:** prove a native/headless Swift simulation.

**Features:** GameState, clock abstraction, seeded RNG, one venue, basic economy, guest arrival, sauna use, one staff role if required.

**Definition of done:** XCTest can simulate repeated days/weeks without SwiftUI or SpriteKit.

**Dependencies:** Phase 0.

**Risks:** inconsistent time model; over-porting legacy state.

## Phase 2 - Playable vertical slice

**Goal:** Vertical Slice 0.1, a real native Sauna Empire loop.

**Features:** New Game, one location, one sauna/oven, one guest type, payment, expenses, time, save/load, economy UI, one upgrade, simple SpriteKit guest visualization.

**Definition of done:** complete loop works on iPhone simulator/device, saves safely, and core rules are test-covered.

**Dependencies:** Phase 1, asset contract.

**Risks:** letting visuals delay proof of simulation boundaries.

## Phase 3 - Core management systems

**Goal:** make one venue strategically interesting.

**Features:** broader pricing, opening schedule, staff, maintenance, construction, loans, shop, Aufguss program builder, capacity/queues, guest satisfaction.

**Definition of done:** first venue supports multiple viable strategies and regression suite covers core systems.

**Dependencies:** stable vertical slice.

**Risks:** balance complexity and coupled formulas.

## Phase 4 - Visual system

**Goal:** production-ready modular world rendering.

**Features:** sprite atlas pipeline, full guest rig, layered characters, building/facility anchors, effects, route visualization, camera/zoom, first approved location art.

**Definition of done:** one venue can change visually through upgrades without manual asset offsets.

**Dependencies:** ASSET_SPEC, stable scene metadata.

**Risks:** asset inconsistency is the largest graphical risk.

## Phase 5 - Content expansion

**Goal:** expand from one proven venue to multiple meaningful location/building combinations.

**Features:** additional location families, building bases, upgrades, staff candidates, programs/materials, merchandise.

**Definition of done:** at least several distinct venues use the same systems rather than custom branches.

**Dependencies:** data-driven catalogs and asset pipeline.

**Risks:** content exceptions leaking into code.

## Phase 6 - Progression

**Goal:** deliver the empire layer.

**Features:** multiple owned venues, expansion opportunities, venue sale, guest memory/regulars, local reputation, brand value, ranking, trends/seasons where approved.

**Definition of done:** player can progress from first venue into a multi-location campaign without manually scripted transitions.

**Dependencies:** multi-venue save model, stable economy.

**Risks:** chain effects overpowering local identity; performance of long simulations.

## Phase 7 - Polish

**Goal:** production feel.

**Features:** onboarding, accessibility, sound/music, haptics, localization structure, animation polish, error recovery, performance, battery/memory tuning, final copy.

**Definition of done:** no known critical UX or stability blockers; target devices meet performance budgets.

**Dependencies:** feature-complete core.

**Risks:** late visual/copy changes destabilizing layouts.

## Phase 8 - TestFlight

**Goal:** validate real-device play and balance.

**Features:** telemetry if approved, crash reporting, structured tester feedback, save migration testing, long-session tests, balance batches.

**Definition of done:** closed beta has acceptable crash-free rate, save reliability and progression distribution.

**Dependencies:** App Store Connect setup and privacy decisions.

**Risks:** discovering economy/time exploits late.

## Phase 9 - App Store

**Goal:** release a stable version 1.0.

**Features:** final privacy declarations, store assets, metadata, review compliance, production save policy, support process.

**Definition of done:** accepted release build with tested migration path for future updates.

**Dependencies:** TestFlight exit criteria.

**Risks:** platform review issues, device-specific bugs, insufficient onboarding.