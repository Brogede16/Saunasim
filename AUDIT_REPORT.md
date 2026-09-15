# Sauna Empire Repository Audit

## Executive summary

Sauna Empire is not an empty prototype. The repository contains two playable implementations plus a large design/specification library:

1. **Canal Workshop**, the cleaner modular implementation in `src/`, built with TypeScript, React, Phaser, Vite, Dexie and Zod.
2. **Sauna Empire rebuild**, a broader self-contained JavaScript reference build in `empire-rebuild/`, with 48 markets and more of the long-term empire loop.
3. **Design and production documentation** in `docs/`, much of which describes systems that are not yet implemented.

For the future native iPhone version, the recommended source of truth is the modular Canal architecture for executable logic plus the documented design and selected Empire-rebuild behavior as product specification. Do not port the self-contained HTML/JavaScript rebuild wholesale.

## Technology and architecture today

- Runtime: browser.
- Language: TypeScript for the modular app, JavaScript for the Empire reference build.
- UI: React 19.
- Game/world rendering: Phaser 4.
- Build tool: Vite 8.
- Persistence: Dexie/IndexedDB in the Canal prototype, browser storage in the Empire build.
- Validation: Zod.
- Tests: Vitest, Node test runner, Playwright/browser QA and scenario tests.
- Main modular boundaries already exist: `src/sim`, `src/save`, `src/content`, `src/game`, `src/ui`.

Classification: **BEVAR** as architectural evidence and migration source.

## What actually works

### Canal Workshop

Implemented and test-covered to varying degrees:

- one playable venue;
- weekly deterministic business simulation;
- admissions, special Gus attendance, shop revenue and operating costs;
- construction;
- loans;
- Master recruitment, wages, training and equipment;
- service-team hiring;
- maintenance, wear and repairs;
- shop assortment;
- Aufguss program composition and delivery evaluation;
- guest samples, visit routes, reactions and outcomes;
- local save, autosave, import/export and schema validation;
- React management screens;
- Phaser exterior scene with placeholder/draft visual assets.

Classification: **BEVAR**, with individual systems later ported or translated to Swift.

### Sauna Empire rebuild

The repository describes this as a playable broader reference implementation with:

- 48 markets;
- broader empire/map flow;
- owned venues and market opportunities;
- desktop/mobile browser QA;
- local saving and migration from an older browser-storage key;
- offline settlement capped at eight hours;
- campaign victory conditions and insolvency behavior.

Classification: **KAN GENBRUGES SOM LOGIK/DESIGN**. It is valuable as a reference and behavior oracle, but should not become the native app's architecture.

## Mockups, prototypes and non-production material

- Final character art is not complete.
- Many sprite sheets are drafts, provisional, tests or explicitly rejected.
- Canal world rendering is a production-architecture prototype with placeholder/draft art.
- `public/design/*.html` files are visual/placement experiments, not core gameplay.
- Several assets appear in source, public and production-like folders in different maturity states.
- The large documentation set often describes intended full-game behavior, not current executable behavior.

Classification: **KAN GENBRUGES SOM LOGIK/DESIGN** unless an asset is explicitly marked approved.

## Game state

The modular prototype currently keeps a central `GameState` in `src/sim/game.ts`. It includes cash, week, built modules, Master state, staff, price, schedule, active/repertoire programs, shop range, construction, loans, profitability, maintenance condition, repair state, selections and last report.

The state store also owns commands such as construction, hiring, progression and advancing a week. This is workable for a prototype but too broad for the final architecture.

Classification: **BØR OMSKRIVES** structurally during migration, while preserving domain rules and tests.

## Save/load

`src/save/savegame.ts` is one of the strongest reusable design assets:

- explicit save schema version, currently 12;
- minimum readable version;
- Zod validation;
- default values for compatible additions;
- separation between persistent state and transient UI selections;
- local autosave;
- JSON export/import;
- preservation rather than destructive overwrite when a save cannot be read.

Classification: **KAN GENBRUGES SOM LOGIK/DESIGN**, with the same principles implemented using Codable/versioned Swift save envelopes.

## Economy

Economy exists for the Canal venue and includes admissions, special sessions, shop sales, operating costs, wages, facility costs, materials, loan repayments, construction, training/equipment and maintenance/repair. Loan offers and several balancing values are currently declared directly in TypeScript.

The broader documents describe chain-wide property, brand and multi-venue economics beyond the implemented Canal simulation.

Classification: Canal rules **BEVAR/OVERSÆT**, hardcoded balance tables **BØR FLYTTES TIL DATA**.

## Time

There are currently multiple concepts of time:

- Canal core loop advances by one game week per action.
- Construction, recruitment and repairs use real timestamps.
- documentation specifies a future deterministic real-time/offline model.
- Empire reference build already has offline settlement behavior.

This is a major migration risk because there is not yet one fully implemented canonical time model.

Classification: **BØR OMSKRIVES** behind a dedicated GameClock/SimulationClock before expanding the native app.

## Guests

Canal has generated weekly guest samples, visit goals, routes, outcomes and feedback. Documentation goes substantially further, including guest memory, regulars, local preferences and deeper markets.

Classification: current visit simulation **KAN GENBRUGES SOM LOGIK/DESIGN**. Guest memory/regulars **MANGLER** in production code.

## Staff

Implemented: Masters, candidate searches, craft stats, wages, training/equipment, service hosts and technician/repair behavior. Full scheduling/automation depth described in design docs is not yet implemented.

Classification: **KAN GENBRUGES SOM LOGIK/DESIGN**. Full rota/automation system **MANGLER**.

## Locations and venues

- Canal Workshop is the implemented modular location.
- Empire rebuild contains a much broader market/location reference.
- docs define location families, building bases, compatibility and scene composition.
- production-ready multi-location implementation in `src/` is missing.

Classification: Canal data contracts **BEVAR**; broad location catalogue **KAN GENBRUGES SOM LOGIK/DESIGN**; native multi-location runtime **MANGLER**.

## Sauna facilities and upgrades

Venue modules are data-driven enough to be useful, with price/build-time/compatibility and scene concepts. The documents also define much broader asset and upgrade catalogues.

Classification: **BEVAR** the domain vocabulary and compatibility model. **BØR OMSKRIVES** renderer-specific integration.

## Progression, ratings and reviews

Program tiers, guest feedback and some financial progression exist. Chain-wide brand, rank, deeper ratings, guest memory, trends and multi-location progression are mostly design-level.

Classification: local feedback/program evaluation **KAN GENBRUGES SOM LOGIK/DESIGN**; chain progression/ranking **MANGLER** in the modular runtime.

## Assets

The repository already has a valuable visual production system:

- 32x32 character frame standard;
- first guest approximately 28 px tall;
- 16x16 native world tile grid;
- fixed foot anchor for land characters;
- fixed waterline for water animation;
- nearest-neighbour scaling;
- layered environment/building/upgrade/effect model;
- route and effect anchors separated from pixels;
- lower-case kebab-case naming.

However, many images are drafts or rejected and similar files appear in multiple places.

Classification: asset specification **BEVAR**; current draft art **KAN GENBRUGES SOM REFERENCE**; final production set **MANGLER**.

## Technical debt and forensic findings

### Hardcoded balance values

Examples in `src/sim/game.ts` include Master candidates, wages, hiring fees, search costs, equipment prices, admission defaults, loan products and borrowing formulas. These are legitimate prototype choices but should not remain scattered through native code.

Classification: **BØR OMSKRIVES** into central configuration.

### Overloaded central store

`src/sim/game.ts` combines state definition, balance data, commands, progression, timers, loans, construction, staff and simulation orchestration.

Classification: **BØR OMSKRIVES** into focused domain systems while keeping behavior stable.

### Large presentation files

`src/ui/App.tsx` and `src/game/CanalScene.ts` are each large files and likely difficult for coding agents to modify safely because many UI/rendering responsibilities are concentrated together.

Classification: **BØR OMSKRIVES** gradually, not before the native vertical slice has a stable simulation boundary.

### Parallel implementations

The biggest source of confusion for future agents is that the modular Canal prototype and the Empire rebuild can both appear to be "the game". They have different save formats and different implementation breadth.

Classification: documentation must explicitly designate:

- Canal/`src` as the primary executable architecture reference;
- Empire rebuild as behavioral/product reference;
- `docs` as design intent, with implementation status stated per system.

### Duplicate and generated artefacts

The repository contains TypeScript and generated JavaScript Vite config files plus repeated visual assets under `assets`, `public/assets` and design folders. Some duplication is intentional for runtime delivery, some should be reviewed during cleanup.

Classification: **KAN SLETTES** only after confirming build/runtime references. Do not delete during this audit branch without a separate cleanup task.

### Simulation/presentation mixing

The modular project is already better than the Empire reference build because simulation lives under `src/sim`. However, the central store still exposes UI-oriented selection state, and real-time resolution uses `Date.now()` directly inside gameplay commands.

Classification: **BØR OMSKRIVES** behind injected clock/services for deterministic testing.

## Canonical classification

| Area | Classification |
| --- | --- |
| TypeScript deterministic Canal simulation | BEVAR |
| Simulation tests | BEVAR |
| Save versioning principles | BEVAR |
| React UI implementation | KAN GENBRUGES SOM LOGIK/DESIGN |
| Phaser rendering implementation | KAN GENBRUGES SOM LOGIK/DESIGN |
| Empire rebuild architecture | BØR IKKE PORTES DIREKTE |
| Empire rebuild gameplay breadth | KAN GENBRUGES SOM LOGIK/DESIGN |
| Draft/rejected art | KAN GENBRUGES SOM REFERENCE |
| Final production art | MANGLER |
| Multi-location modular runtime | MANGLER |
| Real-time/offline canonical simulation | MANGLER/PARTIAL |
| Guest memory/regulars | MANGLER |
| Trends/novelty | MANGLER |
| Chain brand/ranking | MANGLER |
| Hardcoded balance constants | BØR OMSKRIVES |
| Very large UI/render files | BØR OMSKRIVES GRADVIST |

## Recommended source hierarchy for the Xcode migration

1. **Tests and deterministic behavior in `src/sim`**: strongest executable source.
2. **Validated data/save contracts in `src/content` and `src/save`**.
3. **Canonical design documents in `docs`**.
4. **Empire rebuild** as a reference for broader product behavior and UI flow.
5. **Current browser rendering code** as visual behavior reference, not native architecture.

## Overall project maturity

The project is beyond idea stage and beyond a static mockup. It has a credible simulation prototype and unusually extensive design documentation. It is not yet a production game because the full systems do not converge in one implementation, final art is missing, multi-location behavior is split across implementations, and the canonical time/progression model is not fully implemented.

The right next move is therefore **consolidation and a small native vertical slice**, not a wholesale rewrite.