# Sauna Sim GitHub Workflow v0.1

Last updated: August 22, 2026

## 1. Repo Recommendation

Create one repo for the playable product, not separate repos for design and code.

Recommended repo name:

- `sauna-sim`

Keep planning documents in the repo from day one:

- `docs/`
- `README.md`
- `CHANGELOG.md`

This keeps game design, technical design, and implementation aligned.

## 2. Default Branching Model

Use trunk-based development with short-lived branches.

- `main`
  - always releasable or at least runnable
- feature branches
  - one branch per scoped change

Branch naming:

- `feature/site-generator-v1`
- `feature/aufguss-editor`
- `feature/local-save-slots`
- `chore/repo-bootstrap`
- `docs/gdd-v0.1`
- `fix/ranking-breakdown`

Do not keep long-lived parallel architecture branches unless the prototype is being actively rewritten.

## 3. Pull Request Habit

Even if the project is mostly solo, use pull requests for any change that touches:

- simulation rules
- save format
- generated content definitions
- architecture

Each PR should answer:

1. What changed?
2. Why does the project need it now?
3. How was it checked?
4. Does it change player-facing behavior or save compatibility?

## 4. Issue Structure

Use GitHub Issues for all real work, including design work.

Recommended labels:

- `design`
- `simulation`
- `ui`
- `content`
- `savegame`
- `tech-debt`
- `prototype`
- `needs-decision`

Recommended milestones:

- `Prototype 0.1 Foundations`
- `Prototype 0.2 First Playable Loop`
- `Prototype 0.3 Expansion Layer`

## 5. First Milestone Breakdown

`Prototype 0.1 Foundations` should probably include:

- repo bootstrap
- app shell
- core simulation state
- site generator
- guest preference model
- one venue dashboard
- Aufguss editor
- local save and load
- seed content set

## 6. Definition Of Done

Use a practical definition of done:

- feature merged to `main`
- locally runnable
- tests added or updated where behavior matters
- docs updated when a decision becomes stable
- no hidden savegame breaking change

## 7. CI Recommendation

Start small:

- install dependencies
- typecheck
- run unit tests
- run end-to-end smoke test

Only add heavier checks when the project starts to slow down or attract more contributors.

## 8. Release Habit

Use informal prototype tags rather than polished versioning at first.

Examples:

- `v0.1.0-foundation`
- `v0.2.0-first-playable`

Add a short notes section for every tagged prototype:

- what is playable
- what changed
- what is intentionally missing
- whether old saves still work

## 9. Files That Should Be Treated Carefully

High-risk files and modules:

- save schema and migrations
- simulation rules
- content balance tables
- generated site rules
- ranking and valuation formulas

Changes here should never land without a quick explicit review, even if the review is self-review.
