# Sauna Sim Remaining Work Overview v0.1

## Status

The game concept, venue catalogue and connected Canal prototype are sufficiently defined. The approved work order is now **content data and numerical balance first, final graphics second**. Placeholder scenes may remain for technical proof, but no final sprite/background/animation package should be produced before its offer card, asset card and balance envelope are approved.

## P0: Complete The First Playable Loop (Complete)

1. **Gus delivery economics**
   - Material cost, requested frequency, supplement price, feasible sessions, Master workload and room capacity now resolve into the weekly ledger.
   - First delivery exposes Composition, Execution, Venue Fit and whole stars.

2. **Execution and Venue Fit**
   - Master craft/style/equipment feed Execution. Visible recovery/room/field facilities feed Venue Fit and a bounded demand/price-acceptance effect.
   - The three review layers stay separate and state the actionable weak point in English.

3. **Guest samples**
   - A live subset carries typed arrival, programme, recovery, shop/queue and exit paths, and the scene plays the completed path to its truthful current activity.
   - The aggregate ledger remains the performance-safe scale model.

4. **Operating controls**
   - Opening days/hours, entry price, Gus supplement/frequency, staff, construction, shop range and finance are separated into the appropriate venue menus.

5. **First maintenance loop**
   - Eligible technical assets have condition, transparent repair quotes, a timed technician task and visible world-state markers.

## Release Gate: Real-Time And Offline Simulation

This work is deliberately not built on top of the temporary `Run Week` prototype. It becomes mandatory before any multi-day external test, Render deployment or final asset production:

1. Replace `gameStore.advanceWeek()` with one deterministic `advanceSimulation(from, to)` writer of canonical business state.
2. Persist `lastSimulatedAt`, named RNG stream state and unread return events in every save.
3. Resolve construction, repairs, opening blocks, visits, debt and wear in the documented chronological order whether the browser was open or closed.
4. Prove identical canonical outcomes for equivalent online and offline intervals, including a multi-day browser-closure test.
5. Add a version-by-version migration chain, rolling local autosave history and raw JSON recovery export. A save that cannot be migrated must remain preserved and never enable replacement autosave.
6. Replace the prototype's broad `lastReport` payload with a compact, versioned completed-period return event. It must preserve historical outcomes required by the return screen, without treating a prior resolved week as a recomputable view of current state.
7. Upgrade the existing aggregate opening-hours model to resolve night operations from weekly off-hours (`168 − open hours`): guests use facilities only while open; chain-level technicians, automatic service preparation and construction use closed capacity first. Each technician may hold one active job, so hiring more creates concurrent chain capacity. Daytime construction or repair must visibly and mechanically disrupt only its affected facility, while night work avoids that disruption. Do not add a separate night-cleanliness failure system. The later deterministic clock then makes these same blocks continuous and offline-equivalent.

## P1: Content And Balance Before Graphics

1. **Freeze Canal numerical balance**
   - Publish and protect the approved scenario table: starter, pricing, frequency, capacity, recovery, debt and staffed-shop routes.
   - Compare margin per Master-minute and physical channel; reject a route that is only strong because it has a specific site or expansion.

2. **Complete data cards and content sheets**
   - Review first-offer cards, asset effects, market clues, regular-memory copy and curated starter Gus presets.
   - Freeze location-owned upgrade fields for all ten locations before reviewing building-owned upgrade fields. Keep the two ownership layers separate in data, art and route planning.
   - Define the next layer of building and outdoor-asset upgrades as visible changes to their own authored field, each with one specific capacity, recovery, appeal, service or Gus effect. Do not add generic invisible efficiency bonuses. Budget the additional art explicitly: every approved upgrade needs its completed state, compact construction state and route/effect anchors before final asset production.
   - Do not create final backgrounds, buildings, sprite sheets or effect loops in this phase.

3. **Guest resolution depth**
   - Add a small amount of real queue reservation, longer visit timing and physical path masks only when the authored scene assets exist.

4. **Re-homed from `system-coherence-audit-v0.3.md` (never explicitly closed elsewhere)**
   - ~~Negative-cash grace rule~~ Resolved 2026-08-25: grace lasts exactly as long as `borrowingRoom` stays above zero; see `decision-log.md` and `src/sim/game.ts` (`continueAtRisk`/`declareBankruptcy`) (audit item #5).
   - Maintenance burden budget: set concrete numbers for deterioration rate, preventive-repair cost and emergency frequency so maintenance cannot become the unwanted main game at scale (audit item #7).
   - ~~Scene tap/touch priority~~ Resolved: `src/game/CanalScene.ts` implements exactly this hierarchy - guest tap calls `event.stopPropagation()` before opening the guest card (`CanalScene.ts:254-257`), a built-field tap selects that module (`CanalScene.ts:105-111`), and an empty-ground tap clears selection when Phaser reports no interactive object under the pointer (`CanalScene.ts:112-114`) (audit item #10).

## P2: Expand From The Proven Data Slice

1. Validate all locked locations and building bases using the offer-card and asset-card contracts.
2. Add location/building-specific capacity, recovery and landscape data only after comparable balance routes are tested.
3. Add staffing depth: recruitment search, courses, equipment, Host and Operations Manager.
4. Add local market generation, guest memory, trends, reputation, Brand Value and rank. This also unlocks the deferred shop-fit model, towel rental/service loop and branded merchandise gates.
5. Add venue sale/valuation and multi-venue operations.

## P3: Visual Production And Release Work

1. After the visual approval gate, full pixel-art asset production, seasonal/effect layers, animation sheets and performance profiling.
2. Mobile layout, touch interaction, accessibility, sound/music and localization readiness.
3. Manual export/import, cloud/account decision, iOS packaging path and backend only when later multiplayer requires authority.
4. Multiplayer rank/reference-chain service, moderation and anti-cheat design.

## Decisions Still Needed From The Owner

- The acceptable level of visible guest density on a mobile screen after route simulation is playable.
- Final price targets only after the Canal scenario table exists. Prices should not be locked from intuition alone.
- ~~The visual variation package~~ Resolved 2026-08-25, extended 2026-08-26 for guests (3 genders including a non-binary flat-chested body with a small chest scar, 3 body types, 10 hairstyles, realistic skin/hair palette ramps, optional eye colour/sunglasses/piercing/sauna hat - see `decision-log.md`). Staff uniforms and readable animation proportions at that scope are still open.

## Recommended Immediate Order

1. Produce and review offer cards, asset cards, player-facing copy and curated starter Gus presets.
2. Freeze and run the Canal balance table, then cross-venue balance scenarios.
3. Deepen guest resolution only where its non-visual data contract is complete.
4. Hold the focused visual approval pass, then start the first final asset package.
