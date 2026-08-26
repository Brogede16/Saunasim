# Sauna Sim System Coherence Audit v0.3

Date: August 24, 2026

## Verdict

The game now has a coherent identity and a workable high-level loop:

`site -> concept/building -> operations -> guest experience -> reputation/cash -> expansion`

The exterior-only presentation, authored route anchors, physical capacity, qualitative guest feedback and Aufguss system reinforce one another. No approved location or venue family is inherently impossible to operate.

The project is **not yet ready for full simulation or mass asset production**. It needs a small shared data contract and a few precise policy decisions first. These are systems work, not a request to reopen the design of locations, buildings or visual direction.

## P0: Resolve Before Full Simulation

### 1. Canonical-document conflict

`decision-log.md` and the dedicated 2026-08-23/24 system models represent the current design. Several older planning documents still describe superseded rules:

- `decision-log.md` contained both real-time construction and an older in-game-day construction line; the latter has been removed in this audit update.
- `first-gameplay-spec-v0.1.md` and `gdd-v0.1.md` still describe nearby rivals, score-gap explanations and local competition language. The current rule is simulated reference chains, rank only, and no active local rivals.
- `gdd-v0.1.md` still permits vacant/raw first plots, while the locked rule requires every offer to have a visible starter base.
- `canal-workshop-reference-venue-v0.1.md` allows an invisible roof-plunge route in its first slice. The current route contract requires every functional visible facility to have a route before approval.

**Fix:** the documentation index must explicitly declare the decision log plus dedicated system models canonical; older GDD, first-playable, first-site and reference documents become historical context when they conflict. Update or retire their conflicting passages before implementation work uses them.

### 2. One simulation clock is specified, but its state transition is not

The project has a real elapsed clock, a compressed operational calendar, real-time construction and technician travel, operating blocks, daily/weekly reports and offline catch-up. It does not yet define one deterministic order for processing them.

Without it, opening hours, construction completion, repairs, staff availability, debt and guest outcomes can resolve differently after an hour offline than after an hour with the app open.

**Fix:** create one pure `advanceSimulation(from, to)` contract before implementing guests. It must define the order for: completion events, technician travel/repair, opening periods, program scheduling, guest blocks, revenue/costs, debt, condition, reviews and notifications. The browser scene only renders the resulting state.

### 3. Capacity is conceptually strong but not yet a common data language

Capacity appears in venue operations, buildings, assets, Aufguss and guest queues, but their actual inputs are not one shared schema. A later asset could accidentally add seats, recovery use and program capacity without defining its arrival flow, route anchor, operating cost or condition eligibility.

**Fix:** make each venue base, room, field and purchasable asset conform to one data card: compatibility tags, physical capacity channels, program capability, routes/anchors, appeal profile, running cost, condition rule, construction state and visual/effect package. Validate combinations with tests, rather than manually relying on prose.

## P1: Resolve During Simulation Design, Before Balance Or Production Packs

### 4. Rank and Brand can become a snowball without an explicit cap model

Brand Value affects consideration, marketing and price; reputation improves from delivery; Standing affects rank; a strong chain also gains borrowing capacity. Each part is sensible, but together they can make early success self-reinforcing and make location differences irrelevant.

**Fix:** lock three protections in the economy model: diminishing Brand Value effects, local guest experience as the dominant demand factor, and standing/rank with no direct income multiplier. Simulated reference chains must never change the player's local demand.

### 5. Negative cash has a player-friendly intention but no boundary

The player can wait for incoming operations while negative, which correctly avoids a paternalistic forecast. But "sustained" negative cash is undefined, so either bankruptcy is arbitrary or debt can be ignored indefinitely.

**Fix:** define an objective grace rule based on the next completed operating period and payable obligations, while retaining the player's choices: borrow, sell, wait, or voluntarily bankrupt. Show only facts, not a prediction about whether a project will succeed.

### 6. Aufguss combination space needs a content budget

The six-component program builder is the right core system, but it has many combinations. If every combination needs bespoke art, feedback, balance and unlock logic, the project becomes unfinishable; if they only become hidden numbers, it loses its identity.

**Fix:** build a program-effect matrix. Each component maps to a small reusable visual/state vocabulary, a few guest-preference dimensions, time/cost and a capability check. Templates are curated combinations; free composition remains possible. New aroma/music/workshop content adds rows to that matrix, not a new system.

### 7. Maintenance can accidentally become the unwanted main game

Condition, travel and technician workload add useful planning at scale. They become harmful if normal play produces frequent urgent repairs across a large chain, or if the Operations Manager automates every meaningful response.

**Fix:** set a maintenance burden budget: deterioration is slow, preventive repair is cheap, emergencies are rare and clear, and technicians only act after a player-selected policy/dispatch. The Operations Manager can improve terms and reporting, but cannot choose projects, prices, programs, loans or repairs for the player.

### 8. Trends and novelty need a protected player contract

Slow trends and content saturation create reasons to revisit the game. Their cadence, visibility, depth and lower bound are not specified, so they could feel like invisible penalties or force constant content churn.

**Fix:** each shift lasts multiple real days, is hinted before it materially changes demand, and cannot reduce a well-run coherent venue below a stable baseline. Repetition reduces only the extra novelty opportunity, never invalidates a standard program.

### 9. Asset scope is larger than the first production plan

The approved catalogue is deliberately rich: ten locations, many permanent building families, visible fields, routes, upgrades, water variants, effects and character actions. The visual manifest correctly limits the first playable to one Canal combination and six working assets, but other documents can be mistaken for a release checklist.

**Fix:** use production packs as hard gates. No location or building starts full art until Pack 01 proves the shared scene data, route graph, construction state, program effect mapping and guest interaction loop. Approved content remains canon; it is not automatically first-release scope.

## P2: Integrate Before UI And Multiplayer Work

### 10. Scene selection hierarchy is not fixed

The player must eventually tap guests for a profile and tap upgrades for details, while panning/zooming a dense portrait scene. The intended information is good; the touch priority is not documented.

**Fix:** reserve a simple hierarchy: tap guest opens guest card, tap built field opens asset card, tap empty ground pans/closes, and the management dock never blocks the scene's active area. Validate it on a phone before broad scene production.

### 11. Local saves are correct for the prototype but not yet sufficient for live simulation

IndexedDB autosave is the right first-prototype choice. The current app proves browser persistence, but it does not yet persist the full canonical state, timestamp, manual slots, rolling recovery history or export/import described by the technical blueprint.

**Fix:** implement these only with the deterministic simulation contract. A future server can then become authoritative without changing the save schema. Local clocks remain acceptable for prototype testing, but cannot determine multiplayer score.

## Safe Decisions Already Locked

- No interior renderer, free-placement builder, local active competitors, taxes, energy gates, paid skips or forced waiting loops.
- Every venue starts with a physical base; construction is a bounded real-time project with a visible field state and offline completion.
- Every functional exterior facility has a complete route and effect/interaction anchor.
- Every sauna room can host Basic Aufguss; dedicated rooms/fields improve capacity and presentation rather than making Aufguss legal.
- Rank is separate from local demand and uses the same eventual multiplayer score contract.
- All player-facing copy is English; the design documents remain Danish working material.

## Recommended Next Work Package

Create `simulation-contract-v0.1.md` and a matching data schema before more art or UI. It should contain:

1. Canonical save-state shape and deterministic `advanceSimulation` order.
2. Capacity channels and asset/base/program data-card schema.
3. Event and notification policy for offline return, construction, repair, debt and reviews.
4. Explicit caps for Brand Value, trends, novelty and maintenance burden.
5. A small test scenario set: successful compact venue, popular-but-overloaded venue, failed premium program, construction while open, technician travel, negative cash and offline catch-up.

Once that exists, the first Canal vertical slice can prove the whole architecture without prematurely producing the remaining locations.
