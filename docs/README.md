# Sauna Sim Docs

This folder is the working source of truth for `Sauna Sim` v0.1 planning.

## Canonical Reading Order

When documents disagree, apply this order:

1. `decision-log.md` for locked player decisions.
2. `canonical-vocabulary-v0.1.md` for exact cross-system type/tag names and prototype-status boundaries.
3. The dedicated current system models: guest behaviour, venue operations, staff/maintenance, finance/property, brand/ranking, site market, player agency and Aufguss.
4. `venue-fit-data-contract-v0.1.md`, `building-library-v0.1.md`, `venue-composition-v0.1.md`, `location-scene-layouts-v0.1.md`, `asset-effect-model-v0.1.md` and `asset-registry-v0.1.md` for physical compatibility, Venue Fit, fields, routes and assets.
5. `technical-blueprint-v0.1.md` for implementation boundaries and saves; `visual-production-manifest-v0.1.md` and production specifications for staged delivery.

`gdd-v0.1.md`, `first-gameplay-spec-v0.1.md`, `first-sites-and-upgrades-v0.1.md`, `site-library-v0.1.md`, `upgrade-catalog-v0.1.md` and older single-venue references remain useful planning history. They must not override the sources above where a decision has changed.

Only `design-closure-audit-v0.4.md` is the current design-closure verdict. `design-audit-v0.1.md`, `design-consistency-audit-v0.2.md` and `system-coherence-audit-v0.3.md` are superseded historical audits, kept only for their reasoning; see the Superseded/Historical section below before treating any of their open items as still outstanding — check `remaining-work-overview-v0.1.md` for what is actually still open.

Files:

- `canonical-vocabulary-v0.1.md`
  - Exact program, tier, capacity and asset vocabulary, with explicit prototype-status boundaries.
- `game-systems-map-v0.1.md`
  - Integrated explanation of the whole game: locations, buildings, assets, programs, guests, staff, finance, rank, save and rendering.
- `remaining-work-overview-v0.1.md`
  - Prioritised remaining design, implementation, art, balance and release work.
- `project-structure-v0.1.md`
  - Folder map for docs, code, assets, content data, scenario tests and exports.

- `gdd-v0.1.md`
  - Product vision, pillars, systems, prototype scope, and open design questions.
- `technical-blueprint-v0.1.md`
  - Recommended web architecture, state boundaries, and savegame approach.
- `github-workflow-v0.1.md`
  - Repo shape, branching, issue flow, testing, and release habits.
- `workstreams-v0.1.md`
  - How to split the project across ChatGPT Work chats without losing shared context.
- `decision-log.md`
  - Current locked decisions and working assumptions, last updated August 23, 2026.
- `design-closure-audit-v0.4.md`
  - Current non-visual design closure verdict, canonical interpretation rules, remaining content/balance work and visual decision gate. This is the audit that counts; see Superseded/Historical below for v0.1-v0.3.
- `rettelser-fra-claude.md`
  - Running log of concrete code fixes made by Claude, with the reasoning and file:line evidence for each. Useful evidence of where implemented systems have actually drifted from their own spec.
- `first-gameplay-spec-v0.1.md`
  - Integrated first-playable rules, player-psychology rationale, production constraints, and future multiplayer contract.
- `first-sites-and-upgrades-v0.1.md`
  - Proposed first three site offers, upgrade catalogue, gameplay roles and asset scope.
- `site-library-v0.1.md`
  - First 20 generated site templates for individual review and approval.
- `feedback-and-improvement-v0.1.md`
  - Concrete mapping from guest feedback to actionable player improvements.
- `upgrade-catalog-v0.1.md`
  - Proposed first 15 functional venue upgrades, visual outcomes and feedback links.
- `aufguss-system-v0.1.md`
  - Program construction, capability-backed phases, Master automation, hidden appeal and frequency rules.
- `aufguss-starter-program-library-v0.1.md`
  - Twelve editable English starter Gus presets, physical requirements, teaching roles and venue-coverage check.
- `pixel-art-production-guide-v0.1.md`
  - Locked visual rules, shared generation prompt, production method and asset naming.
- `venue-composition-v0.1.md`
  - The compatible location, plot, building and upgrade layers used to generate a venue.
- `building-library-v0.1.md`
  - Single inventory for proposed, locked and produced building bases, including compatibility and production requirements.
- `asset-effect-model-v0.1.md`
  - Required gameplay, appeal, revenue and visual data for every purchasable asset.
- `canal-workshop-reference-venue-v0.1.md`
  - Canal location reference: exterior composition, compatible upgrade anchors, guest routes and asset order.
- `location-scene-layouts-v0.1.md`
  - Fixed exterior layouts for all ten locations, including route, building and upgrade-field rules.
- `venue-placement-contract-v0.1.md`
  - Reusable placement-profile system: maximum building envelopes, local upgrade slots and protected location fields that allow many legal venue combinations without hand-painting every offer.
- `building-envelope-estimates-v0.1.md`
  - Provisional tile and pixel budgets for all 13 building bases, their internal upgrade slots and the placeholder-validation rules before final art.
- `location-envelope-estimates-v0.1.md`
  - Provisional world sizes and reserved full-upgrade space for all ten locations before their reusable building-placement profiles are drawn.
- `location-placement-profiles-v0.1.md`
  - Geometry-only all-location review: all 36 legal building placement profiles, protected geography and fixed location-upgrade fields, with a linked coloured-box board for visual review.
- `location-profile-layout-production-v0.1.md`
  - Production gate for all 36 profiles: each needs an explicit location-and-building composition before final assets are drawn.
- `location-profile-composition-directions-v0.1.md`
  - The approved visual direction for each legal profile, used to turn the board's planning coordinates into varied final site compositions.
- `location-upgrade-review-v0.1.md`
  - Owner-review inventory of every location-owned field, explicitly separated from later building-base upgrades.
- `location-upgrade-proposals-v0.1.md`
  - Detailed all-location proposal sheet: Level 1-4 paths, gameplay effects, rough exterior treatment and required guest/effect activity.
- `visual-production-manifest-v0.1.md`
  - Asset-production order, first playable vertical slice and animation staging.
- `sprite-production-master-manifest-v0.1.md`
  - Complete execution checklist for character sheets, world effects, all approved location fields, building modules and the independent-layer rules that let every legal venue composition render safely.
- `asset-production-checklist-generated.md`
  - **Generated, do not edit.** Every runtime PNG with its exact native canvas, frame layout and pivot, derived from `src/content/artContract.ts` and `src/content/spatialEnvelopes.ts`. Regenerate with `pnpm art:spec`.
- `canal-workshop-production-spec-v0.1.md`
  - Fixed map, module fields, guest routes, anchors and art deliverables for the first playable venue.
- `canal-workshop-balance-reference-v0.1.md`
  - First numbered reference venue: starting state, guest flow, programmes, six upgrades, operating ledger, loans and required balance tests.
- `canal-balance-scenarios-v0.1.md`
  - The eight-case Canal balance scenario matrix mirrored by `src/sim/canalScenarioMatrix.ts`; use this to check code and doc numbers agree.
- `first-slice-balance-audit-v0.1.md`
  - Pre-connection balance audit distinguishing what the first vertical slice still needed to wire up from what was already numerically sound.
- `canal-scene-blueprint-draft.md`
  - Early draft scene layout for Canal Workshop; superseded in the field/route details by `canal-workshop-production-spec-v0.1.md` and the runtime `src/content/canalWorkshopScene.ts` contract, kept for its original composition reasoning.
- `venue-reference-research-v0.1.md`
  - Real-world sauna/spa venue research used as grounding for the Canal Workshop reference and later venue families.
- `cross-venue-balance-protocol-v0.1.md`
  - Required scenario bands, comparison rules, pass conditions and failure patterns for numerical balance across all venue families.
- `guest-behaviour-model-v0.1.md`
  - Guest needs, visit lifecycle, queue behaviour, inspection card and feedback contract.
- `guest-memory-and-regulars-contract-v0.1.md`
  - Bounded local regular pools, factual guest memories, return/lapse behaviour, save fields and first-playable scope.
- `venue-operations-model-v0.1.md`
  - Player controls, capacity, daily venue flow, staff responsibilities, finance and reporting structure.
- `staff-and-maintenance-model-v0.1.md`
  - Recruitment, staff roles, Aufguss Master traits, chain technicians, facility condition and repair dispatch.
- `brand-and-ranking-model-v0.1.md`
  - Local reputation, chain Brand Value, dynamic rank, concept coherence and future multiplayer contract.
- `finance-property-model-v0.1.md`
  - Chain cash, site investment, loans, negative-cash decisions, valuation and venue sale rules.
- `site-market-generator-v0.1.md`
  - Site offers, hidden local market, player influence, water potential and no-local-rivals rule.
- `local-market-feedback-contract-v0.1.md`
  - Canonical hidden-market directions, player-facing evidence channels, clue pools, weekly diagnostics and gradual audience change rules.
- `player-agency-and-long-term-model-v0.1.md`
  - Strategic decisions staff never automate, slow trends, content saturation and long-term play.
- `trends-and-novelty-contract-v0.1.md`
  - Protected baseline for programs, separate novelty/saturation/interest-shift rules, readable cadence and first-playable trend boundary.
- `simulation-contract-v0.1.md`
  - Canonical real-time advance order, save-state boundary, asset data card, capacity contract and implementation test scenarios.
- `seasons-and-operating-calendar-contract-v0.1.md`
  - Real-time year/calendar, bounded seasonal context, year-round natural-water rule and deferred visual-season hooks.
- `master-development-and-equipment-v0.1.md`
  - Master craft ratings, escalating courses, per-session materials, bounded equipment and outdoor Aufguss sprite pipeline.
- `aufguss-material-library-v0.1.md`
  - First 30 real-world-inspired materials, including distinctive and event essences, per-session price classes, ingredient marks, information cards and delivery forms.
- `aufguss-material-card-copy-v0.1.md`
  - Complete first English card-copy library for all 30 materials, including sensory roles and composition risks.
- `aufguss-music-card-copy-v0.1.md`
  - Complete first English card-copy library for the ten music directions, including program roles and combination risks.
- `aufguss-performance-card-copy-v0.1.md`
  - Complete first English card-copy library for the five performance styles, including delivery roles and combination risks.
- `aufguss-program-core-card-copy-v0.1.md`
  - Complete first English card-copy library for intent, heat profiles, base formats and recovery finishes.
- `aufguss-master-and-equipment-card-copy-v0.1.md`
  - Complete first English card-copy library for Master styles, craft ratings and the approved equipment categories.
- `aufguss-feedback-copy-contract-v0.1.md`
  - Approved English feedback fragments and generation rules for first-run reviews, guests and Steam Guide.
- `aufguss-ultimate-patterns-v0.1.md`
  - Internal specification for the six fixed discoverable Ultimate Gus compositions, clue coverage and balance limits.
- `aufguss-combination-model-v0.1.md`
  - Research-informed program-evaluation model: visible coherence/readiness, hidden guest/value/novelty fit, feedback rules and implementation contract.
- `aufguss-program-language-v0.1.md`
  - Shared plain-language tags and card/feedback conventions that teach component relationships without exposing formulas.
- `venue-fit-archetypes-v0.1.md`
  - Building-base Venue Fit routes, required physical support, trade-offs and cross-venue balance guardrails.
- `venue-fit-data-contract-v0.1.md`
  - Canonical six-family Venue Fit schema, location/building baselines, upgrade evidence rules, tier boundaries and required offer-card data.
- `venue-offer-card-contract-v0.1.md`
  - Mandatory generated-offer schema, first-offer generation protections and the Canal + Repair Workshop technical reference offer.
- `venue-offer-seed-library-v0.1.md`
  - One balanced content seed for each locked building base, including market direction, progression band and review requirements.
- `character-animation-contract-v0.1.md`
  - Complete guest, Master, Host and Technician action inventory, reusable sprite loops and location/asset route requirements.
- `sprite-route-runtime-contract-v0.1.md`
  - Final renderer contract for eight-direction movement, doorway entry/exit, foreground occlusion and authored venue route graphs.
- `guest-sprite-production-brief-v0.1.md`
  - Ready-to-execute guest sprite brief: locked scale, first-pass scope, variation-matrix layer breakdown and a generation-ready prompt.
  - The actual mixing/distribution logic for that variation matrix (which combination a guest gets, and why it looks varied rather than patterned) is implemented and tested in `src/content/guestAppearance.ts` - not just specified in prose. Not yet wired into guest state/saves; there is no sprite to consume it yet.
- `scene-effects-inventory-v0.1.md`
  - Ambient and triggered effects for every locked location/building/upgrade family, towel-service loop and inclusive guest visual contract.
- `scene-composition-and-render-contract-v0.1.md`
  - Coordinates, depth layers, water masks, routes, effect anchors and validation rules for composing scenes safely.
- `later-review-list.md`
  - Parking lot of smaller items flagged during review that are not yet urgent enough for `remaining-work-overview-v0.1.md`.

### Superseded/Historical

These audits are kept only for their original reasoning. None of them is the current verdict; check `design-closure-audit-v0.4.md` and `remaining-work-overview-v0.1.md` for what is actually still open before acting on anything below.

- `design-audit-v0.1.md` (August 22, 2026) - first coherence review; superseded by v0.2, then v0.3, then v0.4.
- `design-consistency-audit-v0.2.md` - second-pass audit after the building/location review; superseded by v0.3, then v0.4.
- `system-coherence-audit-v0.3.md` (August 24, 2026) - third-pass audit. Most of its findings were closed by v0.4, but three items were never explicitly marked resolved anywhere and are not yet listed in `remaining-work-overview-v0.1.md`: the negative-cash "grace rule" boundary (#5), a concrete maintenance burden-budget number (#7), and scene tap/touch input priority (#10). Treat these as genuinely open until they are re-homed.

The selected visual direction is top-down pixel art with a Phaser venue scene and React management UI.

Recommended update order:

1. Update `decision-log.md` when a design decision becomes real.
2. Reflect stable changes in `gdd-v0.1.md`.
3. Keep `design-audit-v0.1.md` current while closing structural design gaps.
4. Update `technical-blueprint-v0.1.md` when implementation constraints change.
5. Update `workstreams-v0.1.md` if the collaboration model changes.
