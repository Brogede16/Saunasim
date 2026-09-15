# AI Instructions for Sauna Empire

This file is the primary instruction contract for coding agents working on Sauna Empire.

## Decision source of truth

Before interpreting any product behavior, read the decision sources in this order:

1. `PRODUCT_DECISIONS_2026-09-15.md` for the newest user-approved decisions made during Xcode preparation.
2. `docs/decision-log.md` for the full inherited repository decision history.
3. Current dedicated system contracts under `docs/` for detailed implementation rules.
4. `GAME_DESIGN.md`, `ARCHITECTURE.md`, `SYSTEMS.md`, `DATA_MODEL.md`, `BALANCE.md`, `SAVE_SYSTEM.md`, `ASSET_SPEC.md`, `CONTENT_STUDIO.md` and migration/roadmap documents for the native preparation layer.
5. Historical/audit/proposal documents only as supporting context.

When these disagree, newer explicit user-approved decisions override older working assumptions. Do not silently invent a compromise.

The `ai-xcode-preparation` branch inherits the full repository history from `main`; preparation documents are an additional consolidation/migration layer, not a replacement for the existing decision archive.

Specific city names, venue names, market names or other generated content are not canonical merely because an agent wrote them. Only treat them as approved when a decision source explicitly marks them approved.

## Before changing code

1. Read this file.
2. Read the decision sources above, then `AUDIT_REPORT.md`, `ARCHITECTURE.md` and the relevant system documents.
3. Inspect the current implementation and tests before proposing a rewrite.
4. Determine whether the task changes simulation, data, rendering, UI, saves or assets.
5. Prefer the smallest isolated change that satisfies the task.

## Core rules

- Do not rewrite a working system merely because another architecture looks cleaner.
- Preserve existing behavior unless the task explicitly changes product behavior.
- Build after meaningful code changes.
- Run relevant tests after meaningful code changes.
- Fix build/test failures introduced by the task before finishing.
- Do not leave the repository in a knowingly broken state.
- Do not introduce breaking changes without a concrete reason and migration plan.
- Reuse existing models and terminology when they represent the same concept.
- One system must have one clear owner. Avoid duplicate sources of truth.
- Keep files focused and names explicit. Optimize for agents and maintainers, not cleverness.
- Add tests for deterministic gameplay changes whenever practical.
- Update documentation when architecture, save data, balance ownership or system boundaries change.

## Simulation boundary

Simulation must never depend on SpriteKit, SwiftUI, React, Phaser, DOM APIs or visual animation state.

The target architecture must allow simulation advancement without starting a renderer. The canonical production time contract is persistent real-time simulation with one in-game week equal to 24 real hours. Development/debug helpers may advance time explicitly, but production gameplay time is not driven by UI buttons or renderer speed.

Rendering observes simulation state and events. Rendering must not decide revenue, guest satisfaction, progression, upgrade effects or other business truth.

UI may issue commands and display state, but business rules live outside UI views.

## Determinism

Gameplay should be deterministic when supplied with the same initial state, configuration, seed and commands.

- Randomness must be seeded or injected.
- Time must come from an injected game clock or explicit timestamp, not hidden calls scattered through domain logic.
- Tests should not depend on wall-clock timing.
- Generative AI must never determine deterministic gameplay outcomes.

Generative AI may later be used for optional non-authoritative flavor text, summaries or cosmetic copy, but the game must remain fully playable and logically correct without network AI.

## Balance values

Do not scatter prices, wages, probabilities, energy usage, thresholds, unlock requirements or progression multipliers through view or system code.

Balance data belongs in central configuration/data structures. If a value is intentionally exceptional, document why.

When changing balance:

- name the affected variable;
- state the previous and new value;
- identify expected impact;
- run relevant simulation/balance tests.

## Save safety

Any persistent data-model change must consider save compatibility.

- Never silently reinterpret an old field with a different meaning.
- Increment the save schema when necessary.
- Provide migration/defaulting for compatible changes.
- Preserve unreadable saves instead of overwriting them.
- Keep transient UI/render state out of saves unless it is required to reproduce gameplay truth.

## Assets

Follow `ASSET_SPEC.md` and `CONTENT_STUDIO.md`.

- Never manually nudge individual runtime assets into place as a one-off fix.
- Fix the anchor/spec/metadata instead.
- Preserve global coordinate and scale standards.
- New modular layers must declare their attachment/anchor rules.
- A visual asset must not carry gameplay logic that belongs in data.
- Placeholder assets are valid during implementation when their footprint/anchor contract is correct.
- AI-generated content proposals remain proposals until explicitly approved.

## Native migration

Do not perform a big-bang JavaScript/TypeScript-to-Swift rewrite.

During migration:

1. choose one system;
2. describe current behavior with tests/fixtures;
3. implement the Swift equivalent;
4. compare outputs;
5. only then retire the old implementation for that system.

The existing TypeScript simulation and tests are behavioral references. The Empire rebuild is a broader product reference, not the target native architecture.

## Agent completion checklist

Before finishing a coding task:

- requested scope implemented;
- decision source checked;
- no unrelated refactor;
- build succeeds;
- relevant tests pass;
- new logic has tests where practical;
- save compatibility checked if data changed;
- balance ownership checked if numeric rules changed;
- docs updated if system contracts changed;
- short changelog/summary supplied.