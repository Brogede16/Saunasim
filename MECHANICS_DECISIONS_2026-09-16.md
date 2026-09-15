# Sauna Empire Mechanics Decisions - 2026-09-16

These decisions were explicitly approved after the full mechanics review. They are canonical and override older proposal/TBD wording.

## 1. Owner as early operating labor

- The player/owner can cover one basic Host-type operating function at the first/active venue without a wage expense.
- The owner is not unlimited free labor: owner coverage is bounded by a normal working-time envelope defined in balance data.
- The owner cannot cover two simultaneous functions, cannot be in two venues at once, and cannot substitute for a Technician.
- The owner does not count as a qualified Aufguss Master unless a future explicit mechanic separately grants that capability.
- Owner coverage exists to make the first modest venue viable before a full staff roster, not to make 24/7 operation free.
- As the chain grows, hired staff and later management roles replace the owner's practical operating coverage.

## 2. Venue staff do not move between venues

- Reception Hosts, Service Hosts, Shop/Cafe Hosts, Aufguss Masters and Venue Managers are hired to one specific venue.
- They remain attached to that venue until fired; the game does not include routine inter-venue transfer, daily commuting or cross-venue shift assignment for these roles.
- If another venue needs the same role, the player hires staff for that venue.
- This keeps staffing legible and prevents a hidden logistics simulator.
- Chain roles are explicitly different: Technicians and later Operations Managers belong to the chain and work across venues according to their own mechanics.

## 3. Aufguss frequency and automatic placement

- The player sets a desired number of sessions per in-game week for each active program.
- The player does not choose exact clock times.
- The scheduler distributes requested sessions automatically across open days and suitable time windows using demand/daypart fit, compatible room/field availability, session duration/turnaround and Master availability.
- An optional simple `Day / Evening / No preference` hint may be introduced later only if needed for clarity; it is not required for the first implementation.
- A Master can never conduct overlapping sessions.
- Paid Master work is grouped into sensible continuous working windows. Time between nearby sessions is paid; very widely separated sessions do not automatically create one enormous paid shift. The maximum/merging gap is central balance data, not a player rota control.
- Unscheduled requested sessions must report a concrete reason such as room conflict, opening hours, no Master, capacity or incompatible facility.

## 4. Construction concurrency and rush

- Each venue may have one major construction project active at a time.
- Different venues may build simultaneously.
- Repairs/technician work are a separate operational track and do not consume the venue's major-construction slot.
- A player may pay additional in-game money to rush/accelerate an approved construction project.
- There is no separate `Contractor` system or contractor-management mechanic unless explicitly approved later.
- Rush changes time/cost only; it does not create unlimited simultaneous construction slots.
- Construction remains real-time/offline and completes automatically without a claim action.

## 5. Membership scope

- The initial membership system is venue-specific.
- A member subscribes to one concrete venue whose location, opening hours, quality and expected repeat usage justify the purchase.
- Adoption/churn therefore consumes that venue's convenience, opening-hour fit, satisfaction, capacity and repeat-use history.
- A later, more expensive chain-wide or selected-venue membership may be added as an expansion mechanic after multi-venue play is proven.
- Chain membership is not required for the first implementation.

## 6. Venue sale timing

- A venue may be sold at any time after acquisition; there is no artificial minimum ownership period.
- Rapid resale is naturally discouraged by acquisition/transaction costs, unresolved renovation needs and the absence of demonstrated profitable operating history.
- Sale value still follows the canonical valuation factors: property/site value where applicable, installed assets, condition, sustained performance, reputation/brand contribution and relevant debt/liabilities.
- The system must be balanced so repeated instant flipping is not a dominant strategy, without blocking legitimate emergency exits.

## 7. Open-ended game and future online direction

- Sauna Empire is open-ended rather than ending permanently at a fixed venue/cash/rating target.
- The game may celebrate major milestones, including an explicit `sauna empire` achievement/state, but the player may continue indefinitely afterward.
- Bankruptcy remains the genuine failure/end condition for a run unless a later mode introduces different rules.
- The previous Empire reference target of eight locations / 1.5m value / 4.25 rating is historical reference balance only, not a production victory condition.
- Architecture, deterministic simulation, fixed time and ranking data should preserve a credible path toward a future successful online game with shared rankings/competitive periods.
- Future online/ranking functionality must remain additive: it must not require local rival sabotage or undermine the single-player/local-market mechanics.
- Around 50 venues remains an extreme late-game scale reference, not a victory trigger or hard cap.

## Implementation consequences

These decisions must be represented in executable mechanics and tests, not only UI copy.

Required tests include:

1. First venue can operate at modest scale using bounded owner coverage, but owner coverage cannot make 24/7 operation free.
2. Venue staff cannot be assigned to another venue; chain Technician can service multiple venues sequentially.
3. Weekly Aufguss request deterministically produces a feasible schedule and rejects Master overlap.
4. Nearby sessions merge into paid work windows according to balance config; distant sessions need not form one continuous paid shift.
5. A venue refuses a second major construction project while one is active, while another venue may start its own project.
6. Rush reduces completion time and raises in-game cost without changing project concurrency.
7. Venue membership adoption/churn depends on the subscribed venue, not global chain satisfaction.
8. Newly acquired venue can be sold immediately, but scenario tests prevent profitable zero-operation flipping from becoming the dominant expansion strategy.
9. Hitting a major empire milestone never freezes or ends the simulation; continued expansion remains valid.
