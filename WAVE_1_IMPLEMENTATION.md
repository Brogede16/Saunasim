# Wave 1 Simulation Foundation

## Status

Wave 1 is actively implemented. This file records executable progress only; it is not a design substitute for `MECHANICS.md` or `docs/simulation-contract-v0.1.md`.

The foundation now has a canonical clock, deterministic RNG, a generic headless advance engine, a Canal/GameState adapter, portable canonical saves and online/offline equivalence tests. The application UI still uses the legacy store path; replacing production `Run Week` usage is a remaining integration step.

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

Existing gameplay systems still contain legacy deterministic formulas and are migrated deliberately rather than silently rewritten.

### Canonical advance engine

`src/sim/simulationEngine.ts`

A generic headless `advanceSimulation(envelope, to, adapter)` engine exists with explicit boundaries for:

- ordinary operating intervals;
- real-time milestones such as construction/repair/travel completion;
- end-of-game-week settlement;
- canonical `lastSimulatedAt` advancement;
- deterministic RNG state transport;
- bounded simulation events returned to reporting/UI layers.

At an identical timestamp, real-time milestones resolve before weekly settlement, matching the canonical simulation contract.

The engine contains no React, Phaser, DOM or rendering dependency.

### Canal/GameState realtime bridge

`src/sim/canalRealtime.ts`

The existing Canal reference state can now run inside a `SimulationEnvelope<GameState>`.

Implemented bridge behaviour:

- construction completion is a real-time milestone;
- technician repair completion is a real-time milestone;
- Master recruitment/search completion is a real-time milestone;
- multiple milestones are resolved chronologically;
- the current proven Canal weekly result is resolved at canonical game-week boundaries;
- weekly settlement is a pure GameState transition rather than UI-driven time;
- one long offline advance and repeated online advances share the exact same simulation path.

Important limitation: ordinary venue operations still settle through the legacy weekly aggregate at the weekly boundary. Wave 2 will replace that aggregate with finer operating blocks for staffing, scheduling, demand, guest movement and hourly costs. The realtime bridge is therefore canonical infrastructure, not the final continuous operating model.

### Portable canonical simulation save

`src/save/canonicalSimulationSave.ts`

Wave 1 now has a versioned portable envelope containing:

- `startedAt`;
- `lastSimulatedAt`;
- deterministic RNG state;
- validated existing browser GameState save data.

A compatible legacy browser save can be migrated into the canonical envelope at a chosen migration timestamp. Migration intentionally sets both canonical timestamps to that instant, so it never fabricates historical offline progress for an old save that did not previously track canonical simulation time.

The portable envelope is the bridge format for parity fixtures and later Swift tests. The existing IndexedDB autosave has deliberately not yet been destructively schema-migrated; that happens only when the application runtime itself switches to canonical advancement.

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
- `src/sim/canalRealtime.test.ts`
  - 24-hour offline jump equals four six-hour online advances for full canonical Canal state;
  - construction finishing at a weekly boundary resolves before settlement;
  - repair and recruitment milestones complete without waiting for a game week.
- `src/save/canonicalSimulationSave.test.ts`
  - canonical time/RNG/GameState round-trip;
  - resume-from-save equals direct continuous advance;
  - compatible legacy save migration starts canonical time without invented catch-up.
- `src/sim/fixtures/canal-baseline-v1.json` + `baselineFixtures.test.ts`
  - first portable browser-to-Swift fixture locks the proven Canal starter ledger so native work has an executable reference rather than prose only.

## Test-runner repair

`empire-rebuild/core.test.mjs` uses Node's native `node:test` API. Vitest 4 was collecting the file and reporting `No test suite found` despite the Node tests themselves running. The package test command now deliberately:

1. runs Vitest while excluding the Empire Node test file;
2. runs `node --test empire-rebuild/core.test.mjs` separately.

This preserves the broader Empire reference tests instead of suppressing them.

## What Wave 1 now proves

For the adapted Canal reference, the canonical engine can prove:

`same initial GameState + same canonical origin + same RNG + same elapsed time = same canonical state`

whether elapsed time is advanced in one offline jump or multiple online chunks.

The equality currently covers the existing weekly mechanics and real-time construction/repair/recruitment milestones. It does not yet claim that minute/hour-level guest operations exist; those belong to Wave 2.

## Remaining Wave 1 work

Do **not** mark the entire production realtime migration complete yet.

Remaining integration work:

1. move the application runtime/store from production reliance on `gameStore.advanceWeek()` to canonical timestamp advancement;
2. migrate the IndexedDB autosave envelope to persist canonical metadata directly, with backward-compatible migration;
3. remove ad-hoc production `Date.now()` resolution paths once the store is fully behind the canonical engine;
4. centralize remaining foundation balance/config values that still live inside the old monolith;
5. add a stable domain report/event boundary consumed by UI rather than UI reading transient simulation internals;
6. expand portable fixtures around debt/negative-cash boundaries and other Wave 1 foundation cases.

Wave 2 then owns continuous operating blocks: opening state, automatic staff coverage, hourly wages, automatic Aufguss scheduling, demand, visits/capacity, revenue/cost/wear and feedback/reputation.

## Migration principle

The browser runtime is being turned into an executable behavioural specification, not polished as a second final product. Every stable mechanic should gain portable fixtures so the Swift implementation can reproduce it and then become the production owner.
