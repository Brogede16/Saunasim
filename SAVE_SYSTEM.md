# Sauna Empire Save System

## Existing behavior worth preserving

The Canal prototype already demonstrates good save discipline:

- explicit schema version, currently 12;
- minimum readable schema version;
- shape validation before accepting a save;
- defaults for compatible newer fields;
- local autosave;
- JSON export/import;
- exclusion of transient selections from canonical saved state;
- preservation of unreadable saves instead of silently overwriting them.

The native system should preserve these principles.

## What must be saved

Persistent gameplay truth should include:

- save/schema version;
- game/balance/content version metadata where useful;
- GameTime/calendar state;
- chain/player state;
- cash and debt;
- owned venues and their location IDs;
- installed facilities/upgrades and condition;
- construction and repair projects;
- prices and operating settings;
- staff roster, skills, equipment and assignments;
- Aufguss programs/repertoire;
- shop assortment/stock state if modeled;
- guest memory/regulars once implemented;
- local reputation, ratings and review history needed for gameplay;
- progression/unlocks;
- active trends/events if they affect future state;
- RNG seed/state if required for deterministic continuation;
- last wall-clock settlement timestamp for offline progress.

## What should not be saved as gameplay truth

Unless explicitly necessary:

- selected tab;
- selected guest/module;
- open modal;
- animation frame;
- SpriteKit node positions that can be reconstructed from scene metadata;
- temporary particles/effects;
- derived totals that can safely be recalculated.

## Save envelope

Suggested native envelope:

```text
SaveEnvelope
- schemaVersion
- createdAt
- updatedAt
- gameVersion
- balanceVersion
- lastSettlementWallClock
- gameState
```

Use `Codable` and explicit validation/migration after decoding. Do not rely on decoding success alone as proof that a save is semantically valid.

## Autosave

Autosave should occur after stable gameplay transactions, for example:

- creating/renaming a game;
- purchasing/building/upgrading;
- hiring/firing/training;
- changing prices/schedule/programs;
- taking/repaying finance actions;
- completing a simulation day/week/month boundary;
- app entering background after pending state has been committed.

Avoid saving every animation tick.

## Manual save

For iPhone, a single autosave is sufficient for normal play. A manual export/backup mechanism is valuable for development and support. Multiple manual slots are **TBD - MANGLER PRODUKTBESLUTNING** and are not required for Vertical Slice 0.1.

## Versioning

Every persistent structural/semantic change must answer:

1. Can old data decode unchanged?
2. If not, can it be migrated truthfully?
3. If migrated, what version transition performs it?
4. If not migratable, can the old save be preserved/exported rather than overwritten?

## Migration rules for coding agents

- Never repurpose an existing field for a new meaning.
- Prefer additive optional/defaulted fields when semantically valid.
- Use explicit migration functions for renames/splits/merges.
- Keep migrations test-covered with representative older fixtures.
- Increment schema version when persistent meaning or shape requires it.
- Do not delete older migration code until the supported-version policy explicitly allows it.
- Never overwrite a save that failed migration.

## Atomicity and recovery

Native saves should be written atomically, for example to a temporary file then replaced, or through a persistence API with transaction semantics. Retain at least one recoverable previous autosave during development/polish if practical.

## Offline progress

Offline progress must be calculated by the simulation from:

- persisted game state;
- last settlement wall-clock timestamp;
- current wall-clock timestamp;
- explicit offline-progress cap/rules.

SpriteKit must not participate. The result should be reproducible and testable with injected timestamps.

The Empire reference build currently caps offline settlement at eight hours. Whether that remains final is **TBD - MANGLER PRODUKTBESLUTNING**.

## Save tests

Minimum native tests:

- current save round-trip;
- oldest supported fixture migration;
- invalid/corrupt save rejected without overwrite;
- transient UI/render state excluded;
- offline timestamp settlement deterministic;
- additive field defaults;
- migration chain from every supported schema boundary.