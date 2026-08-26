# Sauna Sim Technical Blueprint v0.1

Last updated: August 22, 2026

## 1. Technical Goal

Build a browser-based management game prototype that can validate the core fantasy quickly, stay easy to iterate on, and avoid a rewrite when cloud sync or multi-site simulation arrives later.

## 2. Recommended Runtime Choice

The selected visual direction needs a top-down pixel-art exterior venue that visibly contains a closed building, grounds, outdoor facilities, guests and expansions. The interior is managed in UI and is never rendered as a room cutaway. Use a hybrid presentation layer: Phaser renders the venue; React handles mobile-first management screens, reports, configuration and accessible menus.

Recommended stack:

- `React`
- `TypeScript`
- `Vite`
- `Phaser` for the top-down venue scene and pixel-animation layer
- `pnpm` workspace
- A small hand-rolled TypeScript domain store for canonical prototype state. This is deliberate: the simulation stays framework-independent, and React subscribes through `useSyncExternalStore` rather than owning business truth.
- `Vitest` for simulation and unit tests
- `Playwright` for end-to-end flows
- `Dexie` over `IndexedDB` for saves
- `Zod` for save validation and migrations

### Tested Major Baseline

The prototype deliberately uses Phaser `4`, React `19`, Vite `8`, Vitest `4`, TypeScript `7` and Zod `4`. Their tested package versions are declared as caret ranges in `package.json` and resolved exactly by the committed `pnpm-lock.yaml`; a major upgrade is an explicit engineering decision with a full test/build pass, never a lockfile refresh side effect.

The spatial venue is a visual and feedback layer, not the simulation's source of truth. It must never own saveable business state.

## 3. Non-Negotiable Boundaries

### 3.1 Simulation Owns Truth

All saveable game state lives in pure TypeScript domain modules, not inside React components.

Simulation owns:

- time progression
- guest generation
- site properties
- finances
- brand and ranking state
- staff state
- venue modules
- events

Phaser owns:

- tile and prop rendering
- guest and staff movement/animation
- palette-based guest variants: a small custom rendering pass maps reserved source shade groups for hair, skin, swimwear and towels to a guest's selected palette without duplicating animation sheets
- steam, water, heat and other ambient visual effects
- venue camera, selection and scene input plumbing

React owns:

- screens
- forms
- menus
- charts
- hover and selection state
- presentation-only filters

### 3.2 Command and Event Flow

The UI should not mutate deep state directly. The UI sends commands. The simulation returns new state plus domain events.

Examples:

- `CreateProgram`
- `AssignAufgussMaster`
- `InstallAmenity`
- `AdvanceDays`
- `TakeLoan`
- `SellVenue`

This makes the prototype easier to save, test, replay, and migrate.

### 3.3 Content Data Stays Separate

Static content should not be embedded inside UI files.

Keep data-driven definitions for:

- site templates
- guest preference axes
- amenities
- wellness modules
- staff traits
- event text
- tutorial copy

## 4. Recommended Repo Shape

When the GitHub repo is created, use a small monorepo from day one:

```text
sauna-sim/
  apps/
    web/
  packages/
    sim-core/
    content/
    savegame/
    ui/
  docs/
  .github/
```

Package responsibilities:

- `apps/web`
  - React app shell, routes, screens, charts, UI flows
- `packages/sim-core`
  - pure game logic, commands, reducers, calculators, time progression
- `packages/content`
  - data tables and authored content
- `packages/savegame`
  - schema, serialization, migrations, import and export helpers
- `packages/ui`
  - reusable components once duplication appears

If the project stays solo for a while, this is still worth it because it preserves the boundary between game logic and UI.

## 5. State Model

Split state into three layers:

### 5.1 Canonical Game State

Serializable simulation state.

Examples:

- current day
- venue configuration
- staff roster
- guest demand inputs
- finances
- rankings
- notifications

### 5.2 Derived View Models

Computed data for screens.

Examples:

- attendance forecast
- last 7 days summary
- top complaints
- top performing programs
- venue valuation breakdown

These should be computed from canonical state, not persisted.

### 5.3 Ephemeral UI State

Examples:

- current modal
- selected tab
- expanded panel
- current filter
- unsaved draft form values

This should not go into save files unless it affects gameplay.

## 6. Savegame Strategy Without Login

### 6.1 Recommendation

Use local-first savegames in `IndexedDB`.

Why:

- large enough for structured simulation data
- safer than `localStorage`
- can support multiple slots
- works well with autosave

### 6.2 v0.1 Save Features

- one autosave slot
- three manual save slots
- visible timestamp per slot
- manual export to JSON file
- manual import from JSON file
- schema version on every save

Suggested export filename:

- `sauna-sim-save-YYYY-MM-DD-HHMM.json`

### 6.3 Save File Shape

Every save should include:

- `schemaVersion`
- `createdAt`
- `updatedAt`
- `gameState`
- `meta`

Recommended `meta` fields:

- save name
- playtime
- venue name
- cash
- rank
- current day

### 6.4 Migration Policy

Do not treat the first save format as disposable. Add migrations immediately, even if they are simple.

Rules:

- each schema version has an upgrader
- old saves are upgraded on load
- invalid saves fail with a clear message
- imported saves are validated before entering the game

### 6.5 User-Facing Constraints

The UI should state clearly:

- saves are local to this browser and device
- clearing browser data may erase local saves
- export is the backup path until account sync exists

### 6.6 Render Test Deployment

For the first public test, deploy the browser game as a Render Static Site from GitHub. The canonical save remains in the player's IndexedDB, so it survives closing and reopening the browser and is unaffected by normal code deployments as long as the player returns to the same Render URL in the same browser.

- Autosave after every state-changing command and on normal page hiding/closing.
- Persist `lastSimulatedAt` in every save. On return after minutes or days, calculate elapsed real time and advance the simulation deterministically before showing the venue. The browser does not need to remain open for the test to progress.
- Keep a small local rolling history of recent autosaves in addition to the current slot, so a bad test build or migration can be rolled back locally.
- Preserve schema migrations across every deployment; never clear IndexedDB in a release.
- Include export/import from the first playable build, because browser data can be cleared and a Render pull-request preview has a different URL and therefore a separate browser save.
- Do not store saves in the Render service filesystem. It is ephemeral by default and loses changes on redeploy/restart.

If testers later need cross-device recovery without a full account system, add an opt-in server save using a randomly generated recovery key stored in the browser. Store that save in Render Postgres, never a local SQLite file. This is a later test feature, not a first-prototype dependency.

### 6.7 Later Upgrade Path

When login arrives, do not redesign the save format. Keep the same canonical save schema and store the blob remotely with metadata.

That makes the v0.1 save system a true foundation rather than throwaway code.

## 7. Screen Architecture

Recommended first screens:

- main dashboard
- venue overview
- Aufguss program editor
- staff roster
- amenities and upgrades
- finance view
- ranking view
- save and load dialog

When multiple venues exist, the venue dashboard should be a flexible per-venue control surface with tabs for overview, programs, team, venue, shop, guests and finances. A separate chain-level view handles portfolio comparison and expansion opportunities.

Optional first prototype sequence:

1. new run setup
2. generated site reveal
3. opening venue dashboard
4. first operational week
5. first summary

## 8. Simulation Module Breakdown

Suggested modules inside `sim-core`:

- `time`
- `site-generator`
- `guests`
- `programs`
- `staff`
- `amenities`
- `wellness`
- `finances`
- `brand`
- `rankings`
- `valuation`
- `events`
- `save-schema`

## 9. Testing Strategy

Prioritize simulation correctness over pixel-perfect UI early.

### 9.1 Unit and Integration Tests

Focus on:

- deterministic site generation from a seed
- guest preference matching
- revenue calculations
- valuation calculations
- save migration loading
- ranking updates

### 9.2 End-to-End Tests

Cover:

- start a new game
- change a program
- advance time
- install an amenity
- save, reload, and continue

## 10. Why This Architecture Fits Sauna Sim

This game's complexity sits in hidden simulation, authored content, and interpretable feedback. A clean TypeScript simulation core plus a DOM-first UI keeps iteration cheap while leaving room for richer presentation later.
