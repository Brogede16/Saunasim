# Sauna Empire Architecture

## Current architecture

The modular browser prototype already has useful separation:

```text
src/
  content/   validated venue/art/content contracts
  sim/       deterministic business/gameplay logic
  save/      persistence, validation and migration
  game/      Phaser scene/rendering
  ui/        React management interface
  dev/       QA/development helpers
```

This is the correct conceptual direction. The main problems are that several responsibilities still accumulate in large files, time is not fully abstracted, and a second broader implementation exists under `empire-rebuild/`.

## Current source-of-truth policy

- `src/sim`: primary executable reference for simulation rules already implemented.
- `src/save`: primary executable reference for save principles.
- `src/content`: primary executable reference for current data contracts.
- `docs`: design intent, subject to implementation-status checks.
- `empire-rebuild`: broad product/reference behavior, not future architecture.
- React/Phaser: presentation references, not native framework targets.

## Target native architecture

```text
SaunaEmpire/
  App/
    SaunaEmpireApp.swift
    AppEnvironment.swift

  Game/
    Simulation/
    Guests/
    Staff/
    Sauna/
    Locations/
    Economy/
    Reviews/
    Progression/
    Events/
    Time/
    Save/

  Rendering/
    SpriteKit/

  UI/
    SwiftUI/

  Data/
    Balance/
    Catalogs/
    SeedData/

  Assets/
    SpriteAtlases/
    SceneMetadata/
    UI/

  Tests/
    Unit/
    Simulation/
    Regression/
    Balance/
    Integration/
    UI/

  Documentation/
```

This is a destination, not a requirement to reorganize the current repository immediately.

## Dependency direction

Allowed dependency direction:

```text
Data/Config
   ↓
Domain models
   ↓
Simulation systems
   ↓
Application/Game controller
   ↓
SwiftUI + SpriteKit adapters
```

Rendering and UI may depend on domain-facing interfaces. Domain/simulation must not import SpriteKit or SwiftUI.

## State ownership

Target rule: gameplay truth belongs to a single `GameState`/domain state aggregate, but mutation should be performed by focused systems rather than a single giant store.

Suggested ownership:

- EconomySystem: cash flows, expenses, loans, financial summaries.
- TimeSystem: game calendar, ticks, offline settlement inputs.
- GuestSystem: demand, visits, routes, satisfaction and memory.
- StaffSystem: staff roster, wages, skills, schedules.
- VenueSystem: owned venues, facilities, construction and condition.
- ProgramSystem: Aufguss programs and evaluation.
- ProgressionSystem: unlocks, brand, rank and expansion.
- ReviewSystem: local reputation/reviews/ratings.
- SaveSystem: serialization/version migration.

Systems should communicate through typed state, commands and domain events, not by reaching into UI objects.

## Rendering architecture

SpriteKit should be an adapter that receives snapshots/events such as:

- guestArrived;
- guestMovedTo(activityPoint);
- constructionStarted;
- facilityCompleted;
- sessionStarted;
- sessionEnded;
- conditionChanged.

SpriteKit may animate those events. It must not calculate business outcomes.

## SwiftUI architecture

SwiftUI displays state and sends commands such as:

- SetAdmissionPrice;
- HireStaff;
- StartConstruction;
- CreateProgram;
- AdvanceTime;
- TakeLoan.

Views should not contain financial formulas or simulation rules.

## Data architecture

Balance/catalog data should be Codable, centrally versioned and easy for agents to inspect. Use Swift structs or bundled JSON/plist where external editability is useful. Avoid opaque singleton constants spread throughout source files.

## Testing seam

Every simulation system must be callable without UI/rendering. Clock and randomness must be injectable. This allows thousands of simulated runs from XCTest or a command-line test target.

## Migration principle

Do not translate folders mechanically. Translate behavior system by system, retaining tests and fixtures as the behavioral contract. The first native implementation should be a thin vertical slice that proves the boundaries before the rest of the game moves.