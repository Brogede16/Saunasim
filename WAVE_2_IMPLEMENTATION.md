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

`src/sim/canalOperatingBlocks.ts` converts the canonical operating week into concrete open blocks by day and daypart (`night`, `morning`, `day`, `evening`).

- blocks are created only where the venue is actually open after staffing coverage;
- program intent changes the demand weighting between dayparts;
- actual scheduled Aufguss sessions are attached to their real daypart blocks;
- weekly admissions are allocated deterministically across those blocks;
- Gus seats can only be allocated to blocks containing an actual scheduled session;
- block admissions and Gus seats sum exactly back to the proven weekly ledger while migration is in progress.

`canalRealtime.ts` emits `operating-block-settled` events with canonical timestamps inside the game week. UI/rendering can consume factual `what happened when` events without owning simulation logic.

### Temporal block economy ownership

`src/sim/canalBlockEconomy.ts` places the proven weekly revenue and operating-cost categories into the operating blocks that caused them.

- admission revenue follows actual block admissions;
- Gus revenue follows blocks with actual Gus seats;
- program material cost follows scheduled Gus blocks;
- shop revenue/procurement follows visiting guests;
- venue base, utilities and facilities follow operating hours;
- staffing cost follows operating load and scheduled Gus work;
- every category conserves the exact weekly ledger total, including rounding residuals;
- each `operating-block-settled` event now includes its revenue, costs and operating net.

This is intentionally a conservation migration step rather than a competing balance model. The next pass can replace category allocation with native block formulas one category at a time while fixtures prove the weekly outcome stays correct.

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

Proves operating blocks are emitted inside the correct canonical week, event totals match the report, and one-jump offline vs repeated online advancement still yields identical canonical world state.

## Known transitional limits

Do not mark the complete Wave 2 loop implemented yet.

1. The block economy currently conserves and allocates the proven weekly ledger; it does not yet mutate cash incrementally as each block passes.
2. Recovery pressure and facility wear are still finally calculated from the weekly aggregate rather than their specific operating blocks.
3. Current Canal scheduling has one Master and one effective room lane. Multi-room/multi-Master concurrency is specified but belongs to the scalable scheduler pass.
4. The old browser `gameStore.updateSchedule()` command still clamps player-entered schedules more aggressively than canonical mechanics allow. Headless mechanics can represent 24/7, but the browser control must be reconciled separately; do not copy its 16-hour cap into Swift.
5. The legacy `simulateCanalWeek()` function still contains old schedule/staffing shortcuts internally. Canonical settlement overrides the relevant staffing/session consequences; those shortcuts should be deleted as native block formulas replace the aggregate.
6. Staffing is currently the compact first-venue requirement set. Larger venues need additional simultaneous function requirements driven by authored facility/content data.
7. Staff overview UI has not been built. The domain plan already exposes the data the UI must show.

## Next executable slice

1. make operating blocks actual simulation milestones/state transitions rather than settlement-only temporal ownership;
2. mutate cash/revenue/cost accumulators as each block passes while preserving the weekly fixture result;
3. move recovery pressure and facility wear to the blocks where use happens;
4. build the weekly report by reducing completed blocks, not by first calling the aggregate ledger;
5. remove the obsolete 16-hour browser schedule restriction;
6. add portable Swift fixtures containing staffing plan, session plan and block outcomes.
