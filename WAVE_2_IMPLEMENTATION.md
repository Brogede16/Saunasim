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
5. pass the actual scheduled session count into the proven Canal balance model;
6. replace the old aggregate staff-cost shortcut with actual assigned-hour wage cost;
7. expose staffing/scheduling warnings as causal report text.

### Deterministic daypart operating blocks

`src/sim/canalOperatingBlocks.ts` converts the canonical operating week into concrete open blocks by day and daypart (`night`, `morning`, `day`, `evening`).

- blocks are created only where the venue is actually open after staffing coverage;
- program intent changes the demand weighting between dayparts;
- actual scheduled Aufguss sessions are attached to their real daypart blocks;
- weekly admissions are allocated deterministically across those blocks;
- Gus seats can only be allocated to blocks containing an actual scheduled session;
- block admissions and Gus seats sum exactly back to the proven weekly ledger while migration is in progress.

### Temporal block economy ownership

`src/sim/canalBlockEconomy.ts` places the proven weekly revenue and operating-cost categories into the operating blocks that caused them.

- admission revenue follows actual block admissions;
- Gus revenue follows blocks with actual Gus seats;
- program material cost follows scheduled Gus blocks;
- shop revenue/procurement follows visiting guests;
- venue base, utilities and facilities follow operating hours;
- staffing cost follows operating load and scheduled Gus work;
- every category conserves the exact weekly ledger total, including rounding residuals.

### Persistent in-progress operating week

`src/sim/canalWeekRuntime.ts` and `src/sim/canalRealtime.ts` now make the blocks real simulation milestones rather than report-only annotations.

- an operating block settles at its canonical block-end timestamp;
- block operating net changes canonical cash immediately;
- allocated facility wear changes condition immediately;
- admissions, Gus seats, revenue categories and cost categories accumulate in persistent runtime state;
- settled block IDs prevent the same business period from being applied twice;
- `lastReport` is still published only at the game-week boundary;
- loan repayment, debt ageing, profitability streak and financial-distress evaluation remain period-boundary consequences;
- construction/repair/recruitment continue to share the same chronological milestone engine;
- same-timestamp real-time work resolves before weekly settlement.

`CanonicalCanalEnvelope` keeps the in-progress operating runtime outside the legacy browser `GameState`, so the old IndexedDB format does not silently become the native contract.

`src/save/canonicalSimulationSave.ts` is now canonical save version 2 and persists the in-progress runtime. Version 1 remains readable. This prevents save/resume from replaying already-settled revenue, costs or wear.

## Tests added

### `venueStaffing.test.ts`

Proves owner coverage, paid venue staffing, 24/7 under-coverage and bounded staff capacity.

### `aufgussScheduler.test.ts`

Proves deterministic session placement, no Master overlap, explicit unfilled reasons and paid work-block gaps.

### `canalOperatingPlan.test.ts`

Proves actual scheduled session count, concrete Master wage, exact staff cost and economic consequences of understaffed long opening.

### `canalOperatingBlocks.test.ts`

Proves weekly admissions/Gus-seat conservation, session-only Gus allocation, intent-specific dayparts and deterministic allocation. Its daypart comparison explicitly uses adequate staffing so it measures demand timing rather than accidental understaffing.

### `canalBlockEconomy.test.ts`

Proves every revenue/cost category conserves the weekly ledger exactly and that Gus revenue/materials are owned only by blocks containing scheduled Gus.

### `canalOperatingEvents.test.ts`

Proves:

- operating blocks are emitted at canonical timestamps;
- block totals match the weekly report;
- cash and condition mutate before week settlement;
- `lastReport` remains unpublished midweek;
- one-jump offline vs repeated online advancement stays deterministic.

### `canonicalSimulationSave.test.ts`

Now also proves that a midweek canonical save round-trips the operating runtime and resumes to the same result as uninterrupted simulation, without replaying settled block economy or wear.

## Known transitional limits

Do not mark the complete Wave 2 loop implemented yet.

1. Block totals are still planned from the proven weekly Canal reference before being settled in time. The next major migration removes that reference dependency and computes block demand/economy natively.
2. Once the first operating block of a game week has settled, its period plan is frozen for deterministic replay. A construction/repair/configuration change after that point does not yet re-plan only the remaining blocks. This is temporary and must be solved before the browser aggregate is retired.
3. Wear is now applied in the blocks where use occurs, but its current per-block allocation conserves a weekly wear total rather than deriving wear independently from native block usage rules.
4. Current Canal scheduling has one Master and one effective room lane. Multi-room/multi-Master concurrency is specified but belongs to the scalable scheduler pass.
5. The old browser `gameStore.updateSchedule()` command still clamps player-entered schedules more aggressively than canonical mechanics allow. Headless mechanics can represent 24/7, but the browser control must be reconciled separately; do not copy its 16-hour cap into Swift.
6. The legacy `simulateCanalWeek()` function still contains old schedule/staffing/demand shortcuts. It is now a planning oracle only and must disappear from canonical runtime before native parity is declared.
7. Staffing is currently the compact first-venue requirement set. Larger venues need additional simultaneous function requirements driven by authored facility/content data.
8. Staff overview UI has not been built. The domain plan already exposes the data the UI must show.

## Next executable slice

1. replace weekly-reference block allocation with native per-block demand and capacity formulas;
2. re-plan only future blocks when construction, repair, staffing, opening hours, price or programme choices change midweek;
3. reduce completed blocks into the weekly report rather than storing a precomputed weekly report;
4. remove the obsolete 16-hour browser schedule restriction;
5. add portable Swift fixtures containing midweek runtime, block outcomes and end-of-week parity;
6. then migrate the same domain contracts into the Swift simulation core.
