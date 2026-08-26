# Sauna Sim Project Structure v0.1

```text
docs/             Canonical design, systems, audits and production specifications
assets/           Art workspace, separated by source, production, sprites, effects and UI
src/
  sim/            Pure deterministic business simulation
  game/           Phaser exterior rendering and interaction
  ui/             React management interface
  save/           Local save validation and persistence
  content/        Validated game content derived from approved design
tests/
  scenarios/      Reproducible balance and play-flow scenarios
output/
  exports/        Screenshots and user-facing preview/export artifacts
```

`docs/README.md` remains the entry point for documents. `game-systems-map-v0.1.md` explains how the domains connect, while `remaining-work-overview-v0.1.md` defines their implementation order.
