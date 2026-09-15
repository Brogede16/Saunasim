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

`src/sim/canalRealtime.ts` uses this operating plan at canonical game-week settlement.

### Deterministic daypart operating blocks

`src/sim/canalOperatingBlocks.ts` now converts the canonical operating week into concrete open blocks by day and daypart (`night`, `morning`, `day`, `evening`).

- blocks are created only where the venue is actually open after staffing coverage;
- program intent changes the demand weighting between dayparts;
- actual scheduled Aufguss sessions are attached to their real daypart blocks;
- weekly admissions are allocated deterministically across those blocks;
- Gus seats can only be allocated to blocks containing an actual scheduled session;
- block admissions and Gus seats sum exactly back to the proven weekly ledger while migration is in progress.

`canalRealtime.ts` emits `operating-block-settled` events with canonical timestamps inside the game week. UI/rendering can therefore consume factual `what happened when` events without owning simulation logic.

This is an intentional migration layer: timing has moved into domain code, while the final revenue/cost/wear formulas still settle from the weekly reference. The next pass moves those state transitions into the blocks themselves.

## Tests added

### `venueStaffing.test.ts`

Proves owner coverage, paid venue staffing, 24/7 under-coverage and bounded staff capacity.

### `aufgussScheduler.test.ts`

Proves deterministic session placement, no Master overlap, explicit unfilled reasons and paid work-block gaps.

### `canalOperatingPlan.test.ts`

Proves actual scheduled session count, concrete Master wage, exact staff cost and economic consequences of understaffed long opening.

### `canalOperatingBlocks.test.ts`

Proves:

- weekly admissions and Gus seats are preserved exactly;
- Gus seats occur only where a scheduled Gus exists;
- social/show demand shifts later than quiet-recovery demand for the same opening window;
- block allocation is deterministic.

### `canalOperatingEvents.test.ts`

Proves:

- operating blocks are emitted with canonical timestamps inside the correct game week;
- emitted block totals match the canonical weekly report;
- one-jump offline and repeated online advancement still produce identical canonical world state.

## Known transitional limits

Do not mark the complete Wave 2 loop implemented yet.

1. Revenue, utilities, shop, recovery pressure and wear are still finally calculated by the proven weekly Canal aggregate, then represented in time by the new operating blocks.
2. Current Canal scheduling has one Master and one effective room lane. Multi-room/multi-Master concurrency is specified but belongs to the scalable scheduler pass.
3. The old browser `gameStore.updateSchedule()` command still clamps player-entered schedules more aggressively than canonical mechanics allow. Headless mechanics can represent 24/7, but the browser control must be reconciled separately; do not copy its 16-hour cap into Swift.
4. The legacy `simulateCanalWeek()` function still contains old schedule/staffing shortcuts internally. Canonical settlement overrides the relevant staffing/session consequences; those shortcuts should be deleted as block economics replace the aggregate.
5. Staffing is currently the compact first-venue requirement set. Larger venues need additional simultaneous function requirements driven by authored facility/content data.
6. Staff overview UI has not been built. The domain plan already exposes the data the UI must show.

## Next executable slice

1. move admission revenue, staff/utilities and program-material settlement into operating blocks;
2. move recovery pressure and wear into the blocks where use occurs;
3. accumulate the weekly report from block outcomes rather than allocating a precomputed weekly report;
4. prove the new block-built report against portable fixtures and offline/online equivalence;
5. remove the obsolete 16-hour browser schedule restriction;
6. add portable Swift fixtures containing staffing plan, session plan and block outcomes.
