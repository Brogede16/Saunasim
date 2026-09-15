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

`src/sim/canalRealtime.ts` now uses this operating plan at canonical game-week settlement.

This means requested Gus frequency and opening hours now have concrete staffing/scheduling consequences before demand, revenue and wear are settled.

## Tests added

### `venueStaffing.test.ts`

Proves:

- a normal 50-hour compact week can be owner-operated;
- 24/7 cannot be owner-operated for free;
- hired venue Hosts cover remaining hours automatically;
- hourly wage is based on assigned hours;
- one hired Host does not become unlimited staffing capacity.

### `aufgussScheduler.test.ts`

Proves:

- desired weekly frequency becomes concrete sessions without manual clock placement;
- one Master is never double-booked;
- missing Master produces an explicit unfilled reason;
- short gaps are paid while an all-day gap is not silently one continuous work block.

### `canalOperatingPlan.test.ts`

Proves:

- the actual scheduled session count becomes the reported feasible session count;
- Master cost comes from concrete work windows;
- staff cost in the weekly ledger equals the operating plan;
- under-covered 24-hour opening loses operating time and admissions instead of producing free revenue;
- fully covered long opening requires real paid venue staff.

## Known transitional limits

Do not mark the complete Wave 2 loop implemented yet.

1. Demand/guest flow is still resolved by the proven weekly Canal aggregate, not smaller intraday operating blocks.
2. Current Canal scheduling has one Master and one effective room lane. Multi-room/multi-Master concurrency is specified but belongs to the scalable scheduler pass.
3. The old browser `gameStore.updateSchedule()` command still clamps player-entered schedules more aggressively than the canonical mechanics allow. Headless mechanics can represent 24/7, but the browser control must be reconciled separately; do not copy its 16-hour cap into Swift.
4. The legacy `simulateCanalWeek()` function still contains its old schedule/staffing shortcuts internally. `canalOperatingPlan` overrides the relevant inputs/cost output during canonical settlement. Those shortcuts should be removed when the aggregate is decomposed, not copied to native code.
5. Staffing is currently the compact first-venue requirement set. Larger venues need additional simultaneous function requirements driven by authored facility/content data.
6. Staff overview UI has not been built. The domain plan already exposes the data the UI must show.

## Next executable slice

1. decompose weekly demand into deterministic operating/daypart blocks;
2. use staffing coverage per block rather than shortening one aggregate schedule;
3. make scheduled Aufguss sessions occur at their actual block timestamps;
4. resolve arrivals, channel capacity, program seats and recovery pressure from those blocks;
5. accumulate one weekly report from block outcomes;
6. prove one large offline advance and repeated online block advances remain identical;
7. remove the obsolete 16-hour browser schedule restriction without changing the canonical rule;
8. add portable Swift fixtures containing staffing plan, session plan and block outcomes.
