# Wave 1 Simulation Foundation

## Status

Wave 1 has started. This file records executable progress only; it is not a design substitute for `MECHANICS.md` or `docs/simulation-contract-v0.1.md`.

## Implemented in code

### Canonical time primitives

`src/sim/canonicalTime.ts`

- exactly 24 real hours = 1 in-game week;
- exactly 52 game weeks = one game year;
- deterministic elapsed game-week/day conversion;
- fixed-origin game-week boundaries;
- interval splitting at weekly boundaries;
- backwards-time rejection.

### Deterministic RNG foundation

`src/sim/deterministicRng.ts`

- explicit persisted RNG state;
- deterministic replay from the same seed;
- bounded deterministic integer generation;
- stable named child streams for future guest/trend/system isolation.

This is infrastructure only. Existing gameplay systems still contain legacy deterministic formulas and must be migrated deliberately rather than silently rewritten.

### Canonical advance engine

`src/sim/simulationEngine.ts`

A generic headless `advanceSimulation(envelope, to, adapter)` engine now exists with explicit boundaries for:

- ordinary operating intervals;
- real-time milestones such as construction/repair/travel completion;
- end-of-game-week settlement;
- canonical `lastSimulatedAt` advancement;
- deterministic RNG state transport;
- bounded simulation events returned to reporting/UI layers.

At an identical timestamp, real-time milestones resolve before weekly settlement, matching the canonical simulation contract.

The engine contains no React, Phaser, DOM or rendering dependency.

## Tests added

- `src/sim/canonicalTime.test.ts`
  - 24h = 1 game week;
  - 6h = 1/4 game week;
  - stable week indexes/boundaries;
  - multi-week interval splitting;
  - backwards-time rejection.
- `src/sim/deterministicRng.test.ts`
  - same seed = same stream;
  - stable named streams;
  - deterministic bounded integers.
- `src/sim/simulationEngine.test.ts`
  - one long offline advance equals repeated small online advances for canonical state;
  - milestone-before-week-settlement ordering;
  - zero-time no-op;
  - backwards advance rejection.
- `src/sim/fixtures/canal-baseline-v1.json` + `baselineFixtures.test.ts`
  - first portable browser-to-Swift fixture locks the proven Canal starter ledger so native work has an executable reference rather than prose only.

## Test-runner repair

`empire-rebuild/core.test.mjs` uses Node's native `node:test` API. Vitest 4 was collecting the file and reporting `No test suite found` despite the Node tests themselves running. The package test command now deliberately:

1. runs Vitest while excluding the Empire Node test file;
2. runs `node --test empire-rebuild/core.test.mjs` separately.

This preserves the broader Empire reference tests instead of suppressing them.

## Not yet implemented

Do **not** mark canonical real-time gameplay or offline catch-up complete yet.

The following remains next:

1. adapt the existing `GameState`/Canal mechanics to `SimulationEnvelope`;
2. persist `startedAt`, `lastSimulatedAt` and deterministic RNG state in saves with migration/defaulting;
3. replace production reliance on `gameStore.advanceWeek()` with canonical timestamp advancement;
4. resolve construction/repair/search milestones through the new engine rather than ad-hoc `Date.now()` calls;
5. move the current weekly Canal operating result behind a pure adapter and then deepen it into smaller operating blocks;
6. prove actual Canal cash, visits, debt, wear and reports are identical for equivalent online/offline elapsed time;
7. expand portable fixtures for staffing, Aufguss scheduling, construction, repair, debt and negative-cash boundaries.

## Migration principle

The browser runtime is being turned into an executable behavioural specification, not polished as a second final product. Every stable mechanic should gain portable fixtures so the Swift implementation can reproduce it and then become the production owner.
