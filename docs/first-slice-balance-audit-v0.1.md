# First Slice Balance Audit v0.1

## Scope

This is the first Canal prototype audit after the initial guest, finance and Aufguss-builder loops. It separates canonical design decisions from implementation still required before numerical balancing is meaningful.

## Implementation Status: 2026-08-25

The original audit below records the pre-connection state. The following P0 bridges are now implemented and covered by Canal scenarios:

1. **Program economics:** every feasible scheduled session uses the selected material/delivery costs, and the report separates entry, Gus and shop revenue from venue, staff, operating, input, facility and loan costs.
2. **Program capacity:** requested sessions are constrained by opening hours, derived room time and a single Master's available delivery time. Canal uses the canonical Special Gus capacity envelope in `src/content/canalCapacity.ts`; Program Sauna condition reduces its live physical seats.
3. **Three-part Gus result:** Composition, Master Execution and physical Venue Fit are evaluated independently and shown with their combined star result.
4. **Guest sample:** a small deterministic visible guest sample follows typed arrival, programme, recovery, shop, queue and exit routes. It is intentionally a representative live sample over the aggregate operating result, not a simulation of every admitted person.

The remaining readiness work is broader balance tuning, complete timed route playback and eventual asset replacement, rather than re-implementing these economic connections.

## Current Connected Rules

1. **Program economics and frequency are live.**
   - Every feasible session consumes the selected program's material inputs. Its supplement revenue comes only from actual sold Gus seats.
   - Requested frequency creates more bookable occasions and potential demand per session, but it also increases material use and remains capped by opening hours, room time and a single Master's delivery time.

2. **Program capacity is physical and visible.**
   - `src/content/canalCapacity.ts` is the single canonical Special Gus seat envelope. The balance simulator imports it directly; prose must not duplicate its values.
   - One Master uses one room or field at a time. Later Masters, not an invisible multiplier, unlock true parallel delivery.

### Session Scale And Price Rule

- Small sessions are **not** mechanically superior merely because they have fewer seats.
- They can credibly support a higher supplement only when their program, execution and place offer an intimate or premium experience that guests actually value.
- Large sessions must win through accessibility, lower expected price or a genuinely stronger shared/show experience.
- Balance compares return and margin per **Master-minute**, not only revenue per seat. This prevents a small expensive room from automatically dominating a larger room.

### Controlled Invisible Upgrade Exception

`Bench Refit` is the first and only permitted invisible venue upgrade in the Canal slice. It adds `+3` seats to the existing physical sauna only. It does not create a new room, program lane, building silhouette or generic quality bonus. Every larger capacity change remains a visible new or expanded sauna asset.

Its balance consequence is explicit: more seats can increase attendance and session revenue, but high occupancy lowers the intimacy component of programs that promise quiet or premium recovery. It must not reduce the value of a larger visible sauna or create an automatic premium strategy.

### Capacity, Attendance And Exclusivity

The simulation tracks three separate values per Gus program: physical `specialCapacity`, actual `specialSeats` and `specialOccupancy`. Capacity only creates an opportunity. Price, program appeal and local demand determine attendance. Later Execution and Venue Fit consume occupancy as context: a quiet/intimate Gus benefits from a sensible, non-cramped fill level; a social/show Gus can benefit from stronger shared attendance. No programme gets a blanket bonus merely for being small or full.

3. **Composition, Execution and Venue Fit are separate.**
   - Composition is discovered after a real first delivery. Master craft, equipment and style affect Execution. Physical recovery, room/field and programme facilities affect Venue Fit.
   - Whole stars use the lowest of the three ratings, with one extra star only when all three are at least Rare. They are never an average.

4. **Guest snapshots are representative timed visits.**
   - The aggregate ledger remains the scale model. The on-screen subset uses the same saved route, current activity and physical recovery/queue consequences shown in its guest profile.
   - It now plays the completed visible part of that route in the scene. Asset-authored path and animation layers replace the temporary movement geometry later.

## P1: Needed For A Fair First Venue

1. **Numerical scenario table.** Freeze and compare starter, pricing, capacity, recovery, debt and staffed-shop routes. Test margin per Master-minute and per relevant physical channel, not just weekly revenue.
2. **Venue-fit demand benefit.** A good physical fit must produce bounded attendance, price-acceptance and retention benefits, as already promised by the canonical model. It must not make capacity itself profitable.
3. **Maintenance workload.** The first per-venue repair task is live. Multi-venue technician travel and aggregate workload are later expansion work.
4. **Guest detail.** Samples have truthful paths and outcomes, but return memory, exact waiting tolerance and long-term review effects are later balance work.

## P2: Do Not Balance Yet

1. Location/building comparison across the full venue catalogue.
2. Brand Value, rank and later multiplayer reference chains.
3. Trends, repetition and novelty decay.
4. Full guest memory/returning pools and review content volume.
5. Final art/effect production and long-lived pathing masks.

## Balance Protections Already Held

- Default Canal Master week remains the existing reference ledger until P0 connects real programme cost and capacity.
- Every venue family must retain a viable low-cost routine, craft route and premium route where physically credible.
- Water, premium upgrades and better locations may justify higher price and appeal, but never grant generic capacity or a universal multiplier.
- Different visual styles have no penalty; coherent visible promise is a positive, not sameness as a requirement.
- High debt is allowed; negative cash creates a factual choice, not a prediction or surprise bankruptcy.

## Next Implementation Order

1. Program price and frequency plus derived capacity.
2. Charge material inputs and connect Special Gus revenue to attendance.
3. Calculate Execution and Venue Fit separately.
4. Turn selected guests into actual timed route visits.
5. Freeze Canal scenarios and run the first numerical balance table.
