# Wave 2 Venue Operating Loop

## Status

Wave 2 has started. This file records executable progress only. Product truth remains in `MECHANICS.md` and the reconciled decision documents.

## Implemented in code

### Venue staffing coverage

`src/sim/venueStaffing.ts`

The compact first-venue model now has a deterministic staffing plan:

- one basic Host function must be covered while the venue operates;
- the owner may cover one compatible basic Host function for up to 50 hours per game week at no wage cost;
- owner coverage does not scale past that limit and cannot make 24/7 free;
- hired Service Hosts are venue staff and provide additional coverage at that venue only;
- hired staff are automatically assigned; the player does not author a rota;
- hired venue staff are paid only for assigned hours;
- uncovered host-hours are explicit state in the plan with `adequate`, `strained` or `missing` status.

The 50-hour owner/staff reference is balance data for the current compact venue, not a permanent claim that all future roles use 50 hours.

### Automatic Aufguss scheduling

`src/sim/aufgussScheduler.ts`

The player-facing intent `desired sessions per game week` now produces concrete scheduled sessions:

- schedule is deterministic;
- sessions must fit opening hours;
- one Master cannot overlap themself;
- current Canal scheduling uses one effective room lane and one Master lane;
- program intent influences preferred daypart;
- sessions are spread across open days before stacking extra sessions on one day;
- unfilled requests return a concrete reason;
- the Master is paid through short gaps within one work block;
- long gaps create separate work blocks rather than silently paying an all-day shift.

`MASTER_MAX_PAID_GAP_HOURS = 2` is an explicit balance parameter and can be tuned by tests rather than becoming hidden logic.

### Connected Canal operating plan

`src/sim/canalOperatingPlan.ts` connects staffing and scheduling to the current Canal reference:

1. calculate venue staffing coverage;
2. turn uncovered host time into unavailable operating time rather than a hidden happiness penalty;
3. automatically place requested Aufguss sessions inside the resulting operating window;
4. calculate paid Host hours and Master work blocks;
5. pass the actual scheduled session count into the current Canal demand-planning reference;
6. replace the old aggregate staff-cost shortcut with actual assigned-hour wage cost;
7. expose staffing/scheduling warnings as causal report text.

### Deterministic daypart operating blocks

`src/sim/canalOperatingBlocks.ts` converts the canonical operating week into concrete open blocks by day and daypart (`night`, `morning`, `day`, `evening`).

- blocks are created only where the venue is actually open after staffing coverage;
- program intent changes the demand weighting between dayparts;
- actual scheduled Aufguss sessions are attached to their real daypart blocks;
- planned admissions are allocated deterministically across those blocks;
- Gus seats can only be allocated to blocks containing an actual scheduled session;
- block admissions and Gus seats conserve the current planning reference while native block demand is being migrated.

### Temporal block economy ownership

`src/sim/canalBlockEconomy.ts` places the currently planned revenue and operating-cost categories into the operating blocks that caused them.

- admission revenue follows actual block admissions;
- Gus revenue follows blocks with actual Gus seats;
- program material cost follows scheduled Gus blocks;
- shop revenue/procurement follows visiting guests;
- venue base, utilities and facilities follow operating hours;
- staffing cost follows operating load and scheduled Gus work;
- every category conserves the planned period totals, including rounding residuals.

### Persistent in-progress operating week

`src/sim/canalWeekRuntime.ts` and `src/sim/canalRealtime.ts` make the blocks real simulation milestones rather than report-only annotations.

- an operating block settles at its canonical block-end timestamp;
- block operating net changes canonical cash immediately;
- allocated facility wear changes condition immediately;
- admissions, Gus seats, revenue categories and cost categories accumulate in persistent runtime state;
- settled block IDs prevent the same business period from being applied twice;
- `lastReport` remains unpublished until the game-week boundary;
- loan repayment, debt ageing, profitability streak and financial-distress evaluation remain period-boundary consequences;
- construction/repair/recruitment share the same chronological milestone engine;
- same-timestamp real-time work resolves before weekly settlement.

`CanonicalCanalEnvelope` keeps the in-progress operating runtime outside the legacy browser `GameState`, so the old IndexedDB format does not silently become the native contract.

`src/save/canonicalSimulationSave.ts` is canonical save version 2 and persists the in-progress runtime. Version 1 remains readable. This prevents save/resume from replaying already-settled revenue, costs or wear.

### Weekly financial report reduced from completed blocks

The canonical game-week boundary no longer takes revenue, operating costs or net result directly from `simulateCanalWeek()`.

`canalRealtime.ts` now builds the financial period report from the runtime accumulators produced by blocks that actually settled:

- admissions and Gus seats come from completed blocks;
- revenue breakdown is the sum of completed block revenue;
- operating-cost breakdown is the sum of completed block costs;
- operating revenue/cost has already affected cash as each block happened;
- loan repayment is added only at the week boundary;
- `netResult = block revenue - block operating costs - loan repayment`;
- the boundary applies only period-only cash consequences that have not already happened in blocks;
- the old planned report currently supplies only detail fields not yet migrated, such as guest snapshots, queue/bottleneck notes and review copy.

This removes the old weekly aggregate as the source of truth for canonical cashflow. It is still used earlier as a temporary demand/detail planning oracle and must be removed in the next migration passes.

## Tests added

### `venueStaffing.test.ts`

Proves owner coverage, paid venue staffing, 24/7 under-coverage and bounded staff capacity.

### `aufgussScheduler.test.ts`

Proves deterministic session placement, no Master overlap, explicit unfilled reasons and paid work-block gaps.

### `canalOperatingPlan.test.ts`

These integration tests now advance through the canonical time engine rather than calling week settlement directly. They prove actual scheduled session count, concrete Master wage, exact staff cost and economic consequences of understaffed long opening.

### `canalOperatingBlocks.test.ts`

Proves admissions/Gus-seat conservation during migration, session-only Gus allocation, intent-specific dayparts and deterministic allocation. Its daypart comparison explicitly uses adequate staffing so it measures demand timing rather than accidental understaffing.

### `canalBlockEconomy.test.ts`

Proves every revenue/cost category conserves the planned ledger exactly and that Gus revenue/materials are owned only by blocks containing scheduled Gus.

### `canalOperatingEvents.test.ts`

Proves:

- operating blocks are emitted at canonical timestamps;
- block totals match the published period report;
- cash and condition mutate before week settlement;
- `lastReport` remains unpublished midweek;
- one-jump offline vs repeated online advancement stays deterministic.

### `canonicalSimulationSave.test.ts`

Proves that a midweek canonical save round-trips the operating runtime and resumes to the same result as uninterrupted simulation, without replaying settled block economy or wear.

### Portable native parity fixtures

`src/sim/fixtures/canal-canonical-week-v2.json` is the first canonical TypeScript-to-Swift fixture. Unlike the older legacy baseline it advances a real canonical 24-hour week through staffing, automatic Gus scheduling, operating milestones and the week boundary. Expected values are treated as observed canonical-engine truth and are corrected from CI output rather than forcing the engine to match guessed fixture numbers.

## Known transitional limits

Do not mark the complete Wave 2 loop implemented yet.

1. Admissions, programme demand, queue/recovery totals and the initial per-block financial amounts are still planned from the old Canal weekly reference before being settled in time. The canonical cashflow after planning is block-owned, but the demand plan itself is not yet native per block.
2. Once the first operating block of a game week has settled, its period plan is frozen for deterministic replay. A construction/repair/configuration change after that point does not yet re-plan only the remaining blocks. This must be solved before the weekly reference is retired.
3. Wear is applied in the blocks where use occurs, but its current per-block allocation conserves a planned weekly wear total rather than deriving wear independently from native block usage rules.
4. Guest snapshots, guest feedback, queue/bottleneck detail and programme-review copy still come from the temporary planned report rather than being reduced from block-level guest outcomes.
5. Current Canal scheduling has one Master and one effective room lane. Multi-room/multi-Master concurrency is specified but belongs to the scalable scheduler pass.
6. The old browser `gameStore.updateSchedule()` command still clamps player-entered schedules more aggressively than canonical mechanics allow. Headless mechanics can represent 24/7, but the browser control must be reconciled separately; do not copy its 16-hour cap into Swift.
7. `simulateCanalWeek()` is now a planning oracle, not canonical cashflow truth. It must disappear from canonical runtime before native parity is declared complete.
8. Staffing is currently the compact first-venue requirement set. Larger venues need additional simultaneous function requirements driven by authored facility/content data.
9. Staff overview UI has not been built. The domain plan already exposes the data the UI must show.

## Next executable slice

1. replace weekly-reference admissions/programme-demand allocation with native per-block demand and capacity formulas;
2. derive recovery pressure and wear directly from the block where usage occurs;
3. re-plan only future unsettled blocks when construction, repair, staffing, opening hours, price or programme choices change midweek;
4. migrate guest snapshots/feedback/reviews from weekly planning into block-level guest outcomes;
5. remove the obsolete 16-hour browser schedule restriction;
6. finish portable Swift fixtures for full week and midweek save/resume parity;
7. then implement the same pure domain contracts in the Swift simulation core.
