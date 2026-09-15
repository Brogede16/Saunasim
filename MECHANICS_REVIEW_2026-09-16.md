# Sauna Empire Mechanics Review - 2026-09-16

## Purpose

This review cross-checks `MECHANICS.md` and `MECHANICS_IMPLEMENTATION_MATRIX.md` against the inherited decision log, reconciled decisions, current system contracts and current browser simulation.

The goal is to distinguish:

1. locked mechanics already represented correctly;
2. inherited locked mechanics missing from the consolidated mechanics layer;
3. historical statements that must not leak into implementation;
4. genuine product decisions still required from the owner;
5. balance/technical details that should be solved by simulation and tests rather than by asking the owner to invent numbers.

This document is an audit, not a new authority source. Owner answers to the open decisions must be written back into the decision reconciliation and canonical mechanics before implementation.

## Overall verdict

The consolidated mechanics are structurally sound and correctly establish the main causal loop:

`time -> venue availability -> staffing -> Aufguss schedule -> demand -> visits/capacity -> economy/wear -> reviews/retention -> market/reputation/brand -> expansion`

However, the mechanics layer is not yet complete enough to call the full product mechanically closed. Several inherited decisions exist only in dedicated documents/decision history and are not yet represented as explicit causal mechanics or matrix rows.

The current browser implementation is an advanced reference prototype, not the canonical complete engine. In particular the deterministic real-time/offline `advanceSimulation(from,to)` contract remains unimplemented.

## A. Correctly represented in consolidated mechanics

The following are consistent across reconciled decisions and current mechanics:

- one in-game week equals 24 real hours;
- one deterministic online/offline simulation contract;
- player-set opening days/hours;
- automatic venue staffing rather than player-authored rotas;
- hourly staff wages and paid continuous Master work windows;
- no Master overlap;
- automatic Aufguss session placement;
- Composition / Execution / Venue Fit separation;
- first-run program review plus guest and Steam Guide feedback layers;
- hidden local market and channel-specific capacities;
- bounded persistent regulars rather than saving every guest;
- Local Reputation distinct from chain Brand Value;
- rank/Standing does not alter local demand, offers or borrowing;
- membership adoption/churn tied to actual expected use and quality;
- small shop/merchandise scope;
- automatic seasons/trends and no broad Events system;
- modular fixed-placement content hierarchy;
- construction, maintenance and chain technicians;
- one chain cash/debt/borrowing pool;
- objective financial distress rather than arbitrary countdown;
- three generated site offers, at least one realistic current-stage financing path, no trap sites;
- full-batch broker refresh;
- multidimensional site attractiveness without one visible score;
- sale valuation based on real venue state;
- Content Studio as data/mechanics authoring, not merely art placement;
- deterministic saves/offline continuation;
- causal player-facing feedback.

## B. Locked inherited mechanics missing or underrepresented in `MECHANICS.md` / matrix

These do not require new product decisions unless noted in section D. They should be added to the consolidated mechanics before implementation.

### B1. Owner role and first-venue operation

Inherited rules say:

- the player starts alone as the owner;
- the owner is not a visible avatar;
- the owner can cover basic operations at the beginning;
- lack of an Aufguss Master does not stop ordinary sauna admissions;
- the owner cannot scale as free unlimited labor across a chain.

The consolidated mechanics currently mention venue staff but do not define the owner as a mechanical coverage source. This becomes important for labor cost, 24/7 exploits and the transition from the first venue to a staffed chain.

A genuine owner decision is still needed for the exact free-owner-coverage boundary; see D1.

### B2. Recruitment

Inherited mechanics already approve:

- staff candidates arrive through recruitment/search;
- hiring is a player choice;
- candidate quality/wage/traits vary;
- roles are not hidden behind arbitrary level gates;
- rare/special candidates may later exist as authored content, but this is not a broad Events system.

Recruitment should have its own mechanic/matrix row and feed the StaffSystem rather than candidates simply appearing from nowhere.

### B3. Staff development and equipment

Inherited mechanics lock:

- Aufguss Masters have Heat Craft, Aroma Craft and Performance Craft plus a style strength;
- courses improve one craft dimension and become more expensive at high levels;
- bounded equipment categories include towel sets, hand fans and infusion kits;
- equipment may improve a concrete delivery component, never provide generic income multipliers.

These mechanics need explicit ownership, costs, state transitions and tests in the consolidated layer. Exact prices/effects are balance work.

### B4. Venue Manager and Operations Manager

Inherited decisions distinguish:

- later Venue Manager: venue-level automation of approved low-risk operations within player strategy;
- Operations Manager: chain-level role affecting credible procurement, operating-resource waste and marketing mechanisms;
- neither may choose strategic prices, programs, loans, expansion or construction on the player's behalf.

The matrix currently has Operations Manager but not the full manager boundary. Venue Manager value remains intentionally under-specified and can stay deferred until multi-venue implementation.

### B5. Marketing

Marketing is an inherited player-controlled strategic system and should not disappear merely because broad Events were removed.

Locked direction:

- concrete marketing choices, not a generic magic demand slider;
- examples include signage, program promotion and local campaigns;
- marketing increases awareness/reach toward a real offer;
- it cannot repair bad delivery, create capacity or make a poor venue automatically good;
- Brand Value can make suitable marketing more effective with capped effects;
- references to an `opening event` are historical flavor and do not authorize an Events-management system.

Marketing needs an explicit mechanic/matrix row before the full demand system is considered complete. Exact campaign catalogue/costs can be balanced later.

### B6. Rent versus purchase

Inherited decisions explicitly allow renting and buying where plausible. Finance remains chain-wide.

The consolidated site-offer mechanic currently talks about acquisition economics but does not explicitly represent acquisition mode. The data model should support a site offer being `rent`, `buy` or `both where plausible`; if both are supported for a specific offer, the player selects the acquisition mode before purchase.

This is consistent with inherited direction and does not require inventing a new property-management system.

### B7. Starter-base rule

The production site generator must not regress to the old GDD's vacant-lot/raw-land wording.

Locked newer rule:

- every offer contains a visible existing physical starter base;
- no empty plot awaiting a free first building;
- tent/container/floating variants are themselves physical starter bases;
- later upgrades expand that authored base.

This rule is present implicitly in `MECHANICS.md` as a permanent start building but should be an explicit site-offer validation invariant.

### B8. Natural-water operation

Inherited rules lock year-round natural-water routes where the site contains approved water access, including an appropriate winter visual state. Winter does not close the mechanic or require an arbitrary winter-only upgrade.

This should be a Season/Facility invariant in mechanics/tests.

### B9. Guest equipment/towel path

The guest model already contains an equipment mode (own towel / rented / purchased / no towel-required path), while full towel rental/service is parked for later. Consolidated mechanics should mark the field as supported but the rental/service economy as DEFERRED, rather than silently dropping it or implementing it prematurely.

### B10. No-Master ordinary operation

Ordinary sauna admissions remain valid with no Aufguss Master. A missing Master only removes/blocks Master-required Aufguss delivery. This must be an explicit staffing/program test so staffing rules never accidentally make the whole venue closed.

### B11. Program presets and Ultimate compositions

The repo contains locked program-composition behavior including editable starter presets, Unproven/reveal behavior and fixed discoverable Ultimate compositions. The mechanics matrix covers Composition Tier but not the content-state implications around edited presets and Ultimate discovery. These can remain inside ProgramSystem but must be carried into migration fixtures.

### B12. Loan product structure

The mechanics layer correctly treats loans as chain capital but should preserve the inherited three loan bands and their term trade-offs (small/short, standard/medium, large/longer secured) as product behavior. Exact values remain balance data.

## C. Historical statements that must NOT drive implementation

The following occur in older planning documents but are superseded or historical and must be explicitly treated as non-authoritative:

- vacant/raw plots requiring a first building;
- local active competitors altering demand;
- competition as a local hidden-market factor;
- staff burnout as a current system;
- detailed HR events/sickness/holidays/voluntary resignation;
- exposed `distance to next rank` as a required primary rank mechanic;
- phone-themed UI fiction as a requirement;
- player-facing facade color/material customization;
- broad generic Events/world-event engine;
- empty/free placement construction;
- arbitrary agent-generated city/location names as product canon;
- browser `Run Week` as final time behavior.

## D. Genuine product decisions still needed before full mechanics implementation

Only decisions that materially alter gameplay/data architecture are listed here. Recommended defaults are included.

### D1. Owner coverage at the first venue - BLOCKING

Question: how much operating work can the unseen owner cover without being hired staff?

Why this matters: unlimited free owner coverage makes long opening hours/24-7 exploitable and makes the first paid Host unattractive. Zero owner coverage contradicts the inherited start-alone rule.

Recommended decision:

- owner provides one `basic host coverage` unit at the first/actively managed venue;
- owner coverage is bounded to approximately a normal working week, represented as a configurable balance value rather than detailed labor-law simulation;
- owner can cover reception/basic service, but not skilled Master delivery, technician work or simultaneous functions beyond one coverage unit;
- once the chain has several venues, the owner can only be assigned to one venue at a time and cannot provide free coverage everywhere;
- no owner wage is booked, but the opportunity limit prevents free 24/7 labor.

Exact hours should be balance data, not hardcoded product lore.

### D2. Ordinary venue staff across venues - IMPORTANT

Question: can Reception/Service staff and Aufguss Masters be reassigned between owned venues, or are they permanently venue-specific?

Recommended decision:

- staff remain chain employees with one current `home/assigned venue`;
- player may reassign them to another owned venue as a deliberate management action;
- ordinary venue staffing does not simulate daily commuting between multiple venues;
- a person contributes venue coverage to only one venue at a time;
- technicians and Operations Manager remain chain-level exceptions by design.

This permits sensible chain management without creating a workforce-logistics simulator.

### D3. Aufguss frequency input and Master work windows - BLOCKING

Question: what exactly does the player set: sessions per day, sessions per week, or a detailed day pattern?

Recommended decision:

- player sets desired **sessions per in-game week per program**;
- scheduler distributes them across compatible open days/dayparts according to demand and capacity;
- UI may optionally expose a simple daypart preference later (`day`, `evening`, `no preference`) but not exact times;
- scheduler groups Master assignments into sensible paid work windows;
- a configurable maximum shift/work-window length prevents a Master from being treated as continuously on duty merely because two sessions occur far apart;
- sessions within the same paid work window pay the Master for the intervening time.

This is simpler than daily micromanagement and matches the existing aggregate weekly prototype while remaining compatible with continuous real-time simulation.

### D4. Construction concurrency - IMPORTANT

Inherited text says projects/key people are scarce, but the exact rule is not locked.

Recommended decision:

- one **major active construction project per venue** by default;
- small cosmetic/non-disruptive work is outside core construction and must not consume the slot unless mechanically meaningful;
- different venues may build simultaneously;
- later chain capabilities/contractor spending may shorten work but should not simply create unlimited parallel build slots;
- repair/technician work is separate from the major construction slot.

This creates understandable trade-offs and prevents buying an entire completed venue instantly.

### D5. Membership scope - IMPORTANT BEFORE MEMBERSHIP IMPLEMENTATION

Question: is a membership initially tied to one venue or to the whole chain?

Recommended decision:

- memberships are initially venue-specific;
- later, when multiple venues exist, a separately priced chain membership can be offered as an advanced product;
- a chain membership must account for participating venues and capacity rather than granting unlimited universal value by default.

Venue-specific membership makes adoption/retention depend on real local convenience and regular behavior, which fits the existing guest model.

### D6. Sale timing / flip protection - IMPORTANT BEFORE VENUE SALE

Question: may a player buy a venue and immediately sell it again?

Recommended decision:

- sale action is always available after acquisition, but the valuation uses actual acquisition costs, transaction friction and demonstrated operating performance;
- a freshly acquired/unproven venue therefore has no automatic speculative profit and will normally sell at a loss/near-cost after transaction effects;
- no arbitrary `you must own this for X weeks` lock is needed.

This keeps player agency while preventing offer-market flipping from becoming the dominant strategy.

### D7. End condition / victory - IMPORTANT FOR LONG-TERM LOOP, NOT BLOCKING WAVE 1

The old Empire rebuild has an eight-location / 1.5m / 4.25 rating reference victory, but preparation docs correctly mark it non-final.

Question: should the production game have a formal victory, or be open-ended with milestones/rank?

Recommended decision:

- open-ended empire simulation is the default;
- use milestone achievements/recognition rather than a hard campaign-ending victory;
- reaching a major Empire milestone can trigger a celebratory `you built an empire` state while play continues;
- bankruptcy remains the only true failure/end of that save unless the player continues from an earlier save/restarts.

This fits the desired long-running real-time model and future ranking better than a hard eight-venue finish.

## E. Deliberately deferred decisions - do not block core coding

These remain appropriately deferred:

- exact Standing/Empire Score weights;
- final visual guest density;
- final staff uniform/animation variants;
- exact maintenance deterioration/emergency rates;
- exact prices/wages/interest/capacity effects;
- exact trend curves/frequency;
- exact membership prices/churn values;
- exact merchandise list within approved small scope;
- energy retrofit system;
- towel-rental/service implementation;
- cloud/account/recovery-key save;
- future multiplayer/server authority;
- final production asset inventory;
- detailed Venue Manager value;
- final Operations Manager numeric effects;
- upgrade-detail UI presentation.

These should not be guessed into product truth. Numeric items should be solved through central balance config and batch simulation where possible.

## F. Implementation recommendation

The next phase should be executable mechanics, but do **not** spend months completing a second browser game before Xcode.

Recommended migration-efficient sequence:

1. Close D1-D6 before their respective implementation waves; D7 can be decided before long-term progression/ranking is finalized.
2. Make the existing TypeScript simulation the behavioral oracle, not the final platform.
3. Implement the missing deterministic foundation in TypeScript first:
   - canonical clock;
   - `advanceSimulation(from,to)`;
   - seeded RNG streams;
   - central balance/config;
   - save/offline equivalence;
   - deterministic fixture export.
4. Implement one complete causal venue loop in TypeScript:
   - opening hours;
   - staffing/owner coverage;
   - Aufguss scheduler;
   - demand/capacity/visits;
   - ledger/wear;
   - review/reputation;
   - financial settlement.
5. Freeze representative JSON fixtures and invariants from the TypeScript oracle.
6. Create the native Swift simulation package and immediately reproduce those fixtures in Swift.
7. Thereafter implement major mechanics wave-by-wave in both layers only as needed for parity; retire TypeScript ownership once Swift fixtures match.
8. Do not spend time polishing React/Phaser UI for mechanics that are destined for SwiftUI/SpriteKit.
9. Keep catalogs/content in portable data formats so Xcode consumes the same IDs/config rather than rewriting content by hand.
10. Build Content Studio against the native data contracts once the core simulation models are stable.

This minimizes throwaway work while still using the existing tested TypeScript system as an executable specification.
