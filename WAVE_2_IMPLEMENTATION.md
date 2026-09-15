# Wave 2 Venue Operating Loop

## Status

Wave 2 is actively replacing the old weekly aggregate with a chronological, saveable operating simulation. Product truth remains in `MECHANICS.md` and the reconciled decision documents.

## Implemented in code

### Venue staffing coverage

`src/sim/venueStaffing.ts`

- one basic Host function must be covered while the venue operates;
- the owner may cover one compatible basic Host function for up to 50 hours per game week at no wage cost;
- owner coverage does not scale past that limit and cannot make 24/7 free;
- hired Service Hosts provide additional venue-only coverage;
- staff allocation is automatic rather than a player-authored rota;
- uncovered host-hours are explicit and reduce actual operating availability.

The 50-hour reference is current compact-venue balance data, not a universal staffing rule for future venues.

### Automatic Aufguss scheduling

`src/sim/aufgussScheduler.ts`

- the player requests sessions per game week rather than clock times;
- the scheduler deterministically places sessions inside staffed opening hours;
- one Master cannot overlap themself;
- program intent influences preferred daypart;
- sessions spread across open days before stacking;
- unfilled requests return explicit reasons;
- short gaps can form one paid Master work block while long gaps create separate work blocks.

`MASTER_MAX_PAID_GAP_HOURS = 2` remains an explicit balance parameter.

### Native per-block ordinary demand

`src/sim/canalBlockDemand.ts`

Ordinary attendance is no longer copied from `simulateCanalWeek()` in canonical runtime.

- demand is calculated from actual staffed open blocks;
- block duration matters directly;
- program intent changes daypart demand;
- unsupported admission prices reduce demand;
- current physical offer contributes to the compact-venue demand reference;
- capacity is bounded against actual operating time;
- a staffing-truncated 24/7 request cannot generate demand for hours the venue cannot cover;
- the starter Master reference still reproduces 70 admissions for the canonical 5-day 10:00–20:00 week.

`buildCanalOperatingBlocks()` uses native admissions by default. `legacy-allocation` exists only for migration/parity tests.

### Native per-session Special Gus demand

Special Gus attendance is also block-native in canonical runtime.

- only actually scheduled sessions create Gus capacity;
- room capacity comes from the current compact room / program sauna / outdoor yard envelope;
- program-sauna condition can reduce usable capacity;
- supplement price affects demand;
- program/venue fit and schedule timing affect demand;
- spare upgraded capacity can receive bounded walk-up fill;
- seats are capped by ordinary visitors, session capacity and demand;
- seats are allocated only to blocks containing scheduled Gus;
- the starter reference reproduces 14 Special Gus seats from two scheduled sessions.

### Deterministic daypart operating blocks

`src/sim/canalOperatingBlocks.ts`

Each block captures the facts required to replay its economics without rereading later mutable player state:

- day and daypart;
- start/end/open hours;
- scheduled Gus count;
- demand weight;
- admission price;
- Gus supplement price;
- per-session program material cost;
- ordinary admissions;
- Special Gus seats.

This makes the block contract directly portable to Swift and safe across midweek save/resume.

### Native guest-flow revenue and Gus materials

`src/sim/canalBlockEconomy.ts`

Canonical block economy now owns:

- ordinary admission revenue = block admissions × captured admission price;
- Special Gus revenue = block Special Gus seats × captured supplement price;
- program material cost = actual scheduled sessions × captured session material cost.

These values ignore the corresponding weekly-oracle totals. Explicit `legacy-allocation` mode remains for migration tests only.

Shop revenue/procurement and remaining operating-cost categories are still reference-backed while their native models are migrated.

### Persistent in-progress operating week

`src/sim/canalWeekRuntime.ts` and `src/sim/canalRealtime.ts`

- an operating block settles at its canonical block-end timestamp;
- block operating net changes canonical cash immediately;
- facility wear changes condition midweek;
- admissions, Gus seats, revenue and cost categories accumulate in persistent runtime state;
- settled block IDs prevent replay;
- `lastReport` remains unpublished until the game-week boundary;
- construction, repair and recruitment share the same chronological milestone engine;
- same-timestamp real-time work resolves before weekly settlement.

### Canonical save/resume

`src/save/canonicalSimulationSave.ts` remains canonical save version 2.

It persists the in-progress operating runtime, including block-owned price/material inputs. Early v2 saves that predate those fields remain readable: missing block values are normalised from the saved world configuration on import.

This prevents a later price or program edit from retroactively changing already-planned midweek blocks after save/resume.

### Weekly financial report reduced from completed blocks

The canonical week boundary no longer takes revenue, operating costs or net result directly from `simulateCanalWeek()`.

- admissions and Gus seats come from completed blocks;
- revenue/cost breakdowns are reduced from block accumulators;
- operating cash has already moved when the blocks occurred;
- loan repayment remains a week-boundary obligation;
- `netResult = completed block revenue - completed block operating costs - loan repayment`;
- the old planned report currently supplies only categories/details not yet migrated.

## Tests

The current suite covers:

- owner/staff coverage and 24/7 under-coverage;
- deterministic Gus scheduling and paid Master work blocks;
- native ordinary demand baseline, price sensitivity and daypart effects;
- native Gus demand baseline, supplement-price sensitivity and session-only allocation;
- explicit legacy allocation as a migration control;
- native ticket and Gus revenue ignoring fake weekly oracle values;
- Gus materials following actual scheduled sessions rather than a weekly total;
- block-event revenue/cost/net reduction into the published period report;
- midweek cash and condition mutation;
- one-jump offline vs chunked online equivalence;
- midweek save/resume without replaying settled revenue, cost or wear.

### Portable native parity fixture

`src/sim/fixtures/canal-canonical-week-v2.json` is the current TypeScript-to-Swift canonical week fixture. It advances a real 24-hour game week through staffing, automatic Gus scheduling, operating milestones and week settlement.

The fixture is a parity contract, not final balance approval.

## Known transitional limits

Do not mark the complete Wave 2 loop implemented yet.

1. Shop demand/revenue/procurement still comes from the temporary weekly reference.
2. Venue base, utilities/cleaning, staff and facility operating costs are still initially sourced from the reference and allocated to blocks. Fixed period obligations should be separated from variable block costs rather than falsely spread across guests.
3. Wear is applied in the blocks where use occurs, but the current total still originates from a weekly wear calculation rather than fully native block usage rules.
4. Recovery pressure, queue/bottleneck detail, guest snapshots, guest feedback and programme-review copy still come from the temporary planned report.
5. Once the first operating block settles, the current week plan freezes. Midweek configuration/construction/repair changes do not yet re-plan only future unsettled blocks.
6. Current Canal scheduling has one Master and one effective room lane. Multi-room/multi-Master concurrency belongs to the scalable scheduler pass.
7. The browser schedule control still has an obsolete 16-hour clamp; do not copy it into Swift.
8. `simulateCanalWeek()` is no longer canonical demand or guest-revenue truth, but it remains a temporary oracle for the unmigrated categories above.
9. Larger venues still need authored simultaneous staffing-function requirements.
10. Staff overview UI has not been built; domain data exists first.

## Next executable slice

1. split fixed period obligations from variable per-block operating costs;
2. make variable utilities/cleaning and staffing cost native to elapsed block work;
3. migrate facility operating cost into explicit period/block ownership;
4. derive wear and recovery pressure directly from the block where usage occurs;
5. migrate shop demand/revenue/procurement from the weekly oracle;
6. re-plan only future unsettled blocks after midweek changes;
7. migrate guest outcomes/reviews from weekly planning into block-level outcomes;
8. remove the obsolete 16-hour browser schedule restriction;
9. expand Swift fixtures with midweek save/resume and changed-price/program scenarios;
10. then implement the same pure domain contracts in the Swift simulation core.
