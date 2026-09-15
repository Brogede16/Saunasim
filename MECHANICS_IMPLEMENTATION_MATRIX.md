# Sauna Empire Mechanics Implementation Matrix

## Purpose

This file tracks whether approved product behavior is merely discussed, fully specified, partially implemented or actually proven in code.

Status meanings:

- `LOCKED` = product behavior is decided.
- `SPECIFIED` = mechanical contract exists, but code may not.
- `PARTIAL` = some executable behavior exists, but the complete causal chain is not yet implemented.
- `IMPLEMENTED` = canonical state transition, consequences, saves/offline behavior where relevant and automated tests exist.
- `DEFERRED` = deliberately outside the current implementation slice.

The goal is to prevent `documented` from being mistaken for `implemented`.

| Mechanic | Product status | Current executable status | Primary current reference | Target owner | Required consequence/test before IMPLEMENTED |
| --- | --- | --- | --- | --- | --- |
| Canonical 1 week = 24 real hours | LOCKED | NOT IMPLEMENTED | `docs/simulation-contract-v0.1.md`; current `Run Week` is debug stand-in | TimeSystem / SimulationEngine | Same real interval produces identical online/offline state; no UI-driven production advance |
| Chronological simulation advance | LOCKED/SPECIFIED | NOT IMPLEMENTED | `docs/simulation-contract-v0.1.md` | SimulationEngine | Construction/staff/schedule/guest/economy/review order tested across boundaries |
| Offline catch-up | LOCKED/SPECIFIED | NOT IMPLEMENTED | simulation contract | SimulationEngine + SaveSystem | Closed-app and open-app fixture outputs match |
| Venue opening schedule | LOCKED | PARTIAL | `src/sim/game.ts`, Canal balance, venue operations docs | VenueOperationsSystem | Daypart demand + wages + energy + guest availability all react to schedule |
| 24/7 economic protection | LOCKED | PARTIAL/NEEDS BALANCE | venue operations + new product decisions | Economy + Demand + Staffing | Early 24/7 loses/underperforms sensible schedule without artificial lock; late-game scenario may become viable |
| Venue staff hire/fire | LOCKED | PARTIAL | current game store/staff data | StaffSystem | Roster changes feed staffing coverage and hourly wage ledger |
| Automatic venue staffing | LOCKED/SPECIFIED | NOT FULLY IMPLEMENTED | `MECHANICS.md` | StaffingSystem | Required functions calculated; automatic assignment; missing coverage has role-specific consequence |
| Staffing overview | LOCKED/SPECIFIED | NOT IMPLEMENTED | `MECHANICS.md` | App/UI adapter from StaffingSystem | UI reports adequate/strained/missing, missing role, labor hours and wage cost |
| Hourly wage accounting | LOCKED | PARTIAL | existing wage models | EconomySystem | Labor hours, continuous Master work windows and venue schedules reconcile exactly |
| Aufguss Master no overlap | LOCKED | PARTIAL/SPECIFIED | Aufguss/staff docs | ProgramScheduler | Deterministic test rejects overlapping Master sessions |
| Master paid between sessions | LOCKED/SPECIFIED | NOT FULLY IMPLEMENTED | product decisions | Staffing + Economy | Continuous assignment window includes between-session time in wages |
| Automatic Aufguss scheduling | LOCKED/SPECIFIED | PARTIAL | existing requested-session aggregation, venue operations | ProgramScheduler | Places sessions by hours/room/Master/demand fit; exposes concrete reason for unfilled request |
| Parallel Aufguss | LOCKED | PARTIAL | Aufguss docs | ProgramScheduler | Requires distinct room/field + distinct free Master; conflict tests |
| Composition Tier | LOCKED | IMPLEMENTED/PARTIAL integration | Aufguss combination implementation/docs | ProgramSystem | Preserve deterministic composition result and first-run reveal behavior through native migration |
| Execution Tier | LOCKED | PARTIAL/IMPLEMENTED in Canal path | current program evaluation | ProgramExecutionSystem | Execution inputs remain separate from Composition and Venue Fit; tests |
| Venue Fit | LOCKED | PARTIAL | current fixed reference implementation + docs | VenueFitSystem | Move to data-driven canonical contract across venue families; no generic multiplier bypass |
| First-run Gus review card | LOCKED | PARTIAL | current feedback contracts/UI | ReviewSystem | First completed Unproven program yields one diagnostic card with recorded causes |
| Guest comments about Gus | LOCKED | PARTIAL | guest feedback system | Guest/ReviewSystem | Comment refers only to experienced facts; test cause tags |
| Steam Guide/editorial feedback | LOCKED | SPECIFIED/PARTIAL | copy contract | ReviewSystem | Generated from canonical factors, not arbitrary AI authority |
| Hidden local market | LOCKED | PARTIAL | Canal guest weights + site market docs | MarketSystem | Acquired site stores market profile; demand consumes it |
| Individual visit lifecycle | LOCKED | PARTIAL | guest week + venue docs | GuestSystem | discover->decide->arrive->visit->depart chain executable headlessly |
| Channel-specific capacity | LOCKED | PARTIAL | Canal balance + asset contracts | Venue/Guest systems | Every queue/loss points to a physical channel; no global capacity shortcut |
| Walk-up spare Gus fill | LOCKED | IMPLEMENTED in Canal reference | `src/sim/canalBalance.ts` | Guest/Program systems | Preserve bounded rule in migration fixtures |
| Turned-away Gus demand | LOCKED | IMPLEMENTED in Canal reference | current report/guest story | Guest/Program systems | Preserve signal without hidden economic double counting |
| Persistent regular pool | LOCKED/SPECIFIED | NOT IMPLEMENTED | guest-memory contract | GuestMemorySystem | Bounded identities/memories saved; return/lapse tests; anonymous visitors not retained forever |
| Local Reputation | LOCKED | PARTIAL | existing design/reference | Review/ReputationSystem | Delivered experience + retention drive local reputation; no rank shortcut |
| Brand Value | LOCKED | DESIGN/PARTIAL | brand/ranking docs | BrandSystem | Capped diminishing reach effect only; no free capacity/revenue |
| Ranking/Standing | LOCKED | REFERENCE/DESIGN | Empire rebuild + docs | RankingSystem | Comparison only; no local demand/borrowing/offer effects |
| Membership products | LOCKED/SPECIFIED | NOT IMPLEMENTED | product decisions + mechanics | MembershipSystem | Adoption from expected usage/value/fit; churn from actual deterioration; capacity pressure remains real |
| Small shop assortment | LOCKED | IMPLEMENTED/PARTIAL | Canal shop | ShopSystem | Procurement margin + motivation-linked purchases preserved |
| Merchandise max ~10 meaningful types | LOCKED | NOT FULLY IMPLEMENTED | product decisions | Shop/Merchandise | Catalogue capped/readable; branded goods require earned identity |
| Seasons | LOCKED/SPECIFIED | NOT IMPLEMENTED as continuous native mechanic | seasons contract | SeasonSystem | Fixed calendar, bounded modifiers, reproducible year progression |
| Trends | LOCKED/SPECIFIED | NOT IMPLEMENTED | trends contract | TrendSystem | Seeded gradual spread, advance warning, non-identical years, viable baseline protected |
| Broad Events system | SUPERSEDED/OUT OF SCOPE | DO NOT IMPLEMENT | reconciliation | none | Test/architecture should not require generic event engine for current scope |
| Construction real-time | LOCKED | BASIC/PARTIAL | current tasks + simulation contract | ConstructionSystem | Offline completion; affected facility unavailable/reduced; no claim button |
| Asset mandatory data card | LOCKED | PARTIAL/STRONG SCHEMA | `src/content/*` + docs | Content/Catalog validation | Validation rejects missing compatibility/capacity/economy/route/render fields |
| Content Studio | LOCKED/SPECIFIED | NOT IMPLEMENTED | `CONTENT_STUDIO.md` | macOS ContentStudio target | Non-programmer can author hierarchy/anchors/routes/effects and export validated data |
| Facility condition | LOCKED | IMPLEMENTED/PARTIAL | current maintenance | MaintenanceSystem | Wear caused by use; only target facility changes availability/capacity |
| Chain technicians | LOCKED | IMPLEMENTED/PARTIAL | current technician model | ChainStaff/Maintenance | One task at a time; travel time; wage + material cost; chain workload visible |
| Operations Manager | LOCKED concept | DEFERRED/PARTIAL design | staff docs | ChainStaffSystem | Only credible chain mechanisms; no generic unexplained bonus |
| Loans as chain capital | LOCKED | IMPLEMENTED BASIC | `src/sim/game.ts` | FinanceSystem | One borrowing-room model; repayments automatic; no venue-project loan fiction |
| Negative-cash decision state | LOCKED | IMPLEMENTED/PARTIAL | current game store + finance docs | FinanceSystem | Options factual; continue path only while real financing/sale path remains |
| Objective bankruptcy | LOCKED | PARTIAL | existing prototype rule | FinanceSystem | Settlement test; no arbitrary timer; sale/borrowing options checked first |
| Three generated site offers | LOCKED | REFERENCE/DESIGN | site generator docs/Empire reference | SiteOfferSystem | Exactly three viable distinct offers from legal combinations |
| At least one realistic affordable offer | LOCKED/SPECIFIED | NOT PROVEN | product decisions | SiteOfferSystem | Property-based test across progression bands ensures one current-stage financing path |
| No objective trap sites | LOCKED | DESIGN + balance protocol | site market docs | SiteOfferSystem + Balance harness | Every generated seed has >=1 viable strategy in scenario matrix |
| Full-batch broker refresh | LOCKED | DESIGN | decision log/site docs | SiteOfferSystem | Refresh replaces all three; single-slot reroll unavailable |
| Site attractiveness multidimensional | LOCKED/SPECIFIED | PARTIAL data | site market + mechanics | SiteOfferSystem | Offer card shows clues; hidden dimensions affect economics/demand without single visible score |
| Venue sale valuation | LOCKED/SPECIFIED | REFERENCE/DESIGN | finance/property docs | VenueSaleSystem | Sale reflects assets/wear/performance/reputation/debt; staff not automatically sold |
| Venue names player-defined | LOCKED | PARTIAL/reference | decision log | VenueSystem/UI | Generated city/venue names never become canonical without approval |
| Modular location/building/add-on hierarchy | LOCKED | STRONG SPEC/PARTIAL code | content contracts + Content Studio | ContentCatalog/VenueSystem | Legal combinations validated data-first; no ordinary hardcoded compatibility branches |
| Fixed authored upgrade placement | LOCKED | PARTIAL | current scene contracts | Venue/Rendering | Player chooses upgrade, not coordinate; asset anchor drives placement |
| Exterior-only venue scene | LOCKED | IMPLEMENTED prototype direction | Phaser scene | SpriteKit renderer | Native scene preserves exterior representation; indoor mechanics remain domain/UI |
| Guest-visible routes | LOCKED | PARTIAL/STRONG contract | route contracts/Canal scene | RoutingSystem/Renderer | Built functional asset has route/activity anchors before approval |
| Placeholder-first asset workflow | LOCKED | SPECIFIED | ASSET_SPEC/Content Studio | Asset pipeline | Placeholder swap cannot change IDs/gameplay/anchors; validation warns footprint violations |
| Save schema/versioning | LOCKED | STRONG IMPLEMENTATION browser | `src/save/savegame.ts` | Native SaveSystem | Codable envelope + migrations + corrupt-save safety |
| Deterministic RNG/time injection | LOCKED | PARTIAL | current tests + prep docs | Simulation core | No hidden wall-clock/random calls in domain logic |
| Player-facing causal feedback | LOCKED | PARTIAL | many current reports | ReportingSystem | Important losses/bottlenecks explain real cause without raw formula dump |

## Coding order

The implementation order should follow dependency depth, not document order.

### Wave 1 - simulation foundation

1. canonical clock;
2. deterministic `advanceSimulation(from,to)` engine;
3. central balance/config ownership;
4. save/offline continuation;
5. domain event/report boundary.

### Wave 2 - one complete venue causal loop

1. opening schedule;
2. staffing requirement + automatic coverage + hourly wages;
3. automatic Aufguss scheduling;
4. demand/visit/capacity flow;
5. revenue/cost/wear;
6. feedback/reputation;
7. offline equivalence tests.

### Wave 3 - chain operational depth

1. construction;
2. maintenance;
3. chain technicians;
4. loans/distress;
5. sale valuation;
6. site-offer batches.

### Wave 4 - retention and market evolution

1. bounded regular pool;
2. local reputation/retention;
3. seasons;
4. trends/novelty;
5. membership adoption/churn;
6. brand/ranking separation.

### Wave 5 - authoring and scale

1. Content Studio executable target;
2. validated location/building/module/upgrades export;
3. additional venue families;
4. larger-chain staff/Operations Manager;
5. broader merchandise/content.

## Migration rule

Do not mark a mechanic `IMPLEMENTED` merely because an equivalent existed in the browser prototype. Native implementation must reproduce the behavior through its own automated fixtures before the old runtime becomes disposable.
