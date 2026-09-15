# Sauna Empire Vertical Slice 0.1

## Purpose

Vertical Slice 0.1 is the smallest real native version of Sauna Empire worth building in Xcode. It is not a separate demo game. It proves the actual future architecture using one location and one complete management loop.

## Product promise

The player starts a small sauna venue, opens it, receives guests, earns money, pays operating costs, improves the venue once, and can close/reopen the app without losing progress.

If this slice works cleanly, the architecture is ready to expand. If it does not, the project should fix the architecture before adding broad content.

## Included scope

### App shell

- native iPhone app;
- Swift entry point;
- SwiftUI navigation/shell;
- New Game;
- Continue when a save exists;
- simple settings/debug access in development builds.

### One location

Use a simplified native representation of the existing Canal Workshop concept.

Required data:

- one `LocationDefinition`;
- one `Venue` instance;
- one environment scene configuration;
- one entrance and guest route;
- one buildable upgrade anchor.

The slice does not need the full 48-location map.

### One sauna

The starting venue has:

- one sauna room;
- one stove/oven represented visually;
- fixed base capacity;
- fixed per-period operating cost;
- one admission price controlled by the player.

The stove can be a visual component of the sauna in 0.1. It does not need a deep equipment system yet.

### One guest type

Define one neutral starter guest segment with:

- base arrival propensity;
- price sensitivity;
- satisfaction from successful sauna use;
- frustration if capacity blocks the visit.

Guests are simulated individually enough that one guest can be visualized, but the system must scale later to multiple segments.

### Guest loop

Minimum logical route:

```text
arrive -> enter/pay -> sauna -> leave
```

Optional recovery step may be added only if it remains small and does not delay the architecture proof.

SpriteKit visualizes this route. The simulation owns whether the guest arrived, paid, received service and was satisfied.

### Economy

Required revenue:

- admission payment.

Required costs:

- base venue operating cost;
- sauna heat/energy cost represented as one clear cost category in 0.1.

Optional if simple:

- basic staff wage.

The economy view must show at least:

- current cash;
- revenue for latest period;
- operating cost for latest period;
- net result;
- admission price;
- guest count.

### Time

Use a canonical deterministic game clock from the start.

For 0.1, choose one simple simulation step such as `runDay()` or `runOperatingPeriod()`.

The exact real-time mapping is less important than the architecture requirement:

```text
GameSimulation.runDay()
```

must work in tests without SwiftUI or SpriteKit.

Offline real-time settlement may be deferred until after the core slice if it risks muddying the first time model. The save must still persist game calendar state.

### One upgrade

Add exactly one meaningful upgrade, preferably a capacity upgrade such as a bench improvement or small sauna-capacity expansion.

It must have:

- stable ID;
- price;
- one explicit effect;
- visual before/after state;
- central balance configuration;
- test coverage.

Example:

```text
Bench Refit
Cost: configured value
Effect: +N sauna seats
```

Exact final price/effect is a balance decision, not hardcoded in this spec.

### Save/load

Required:

- versioned save envelope;
- autosave after stable transactions/simulation step;
- Continue restores exact canonical gameplay state;
- transient SpriteKit animation state is reconstructed, not saved;
- invalid save handling must not overwrite data silently.

### SpriteKit

Required visual scene:

- Canal environment/background;
- base sauna/building representation;
- one guest sprite, placeholder art allowed if technically compliant;
- entrance route;
- sauna activity point;
- guest movement visualization;
- upgrade visual state;
- nearest-neighbour pixel rendering.

No game logic inside SpriteKit.

### SwiftUI

Required controls:

- cash/economy summary;
- admission-price adjustment;
- advance/open operation action;
- upgrade purchase action;
- save/continue lifecycle;
- venue status.

No economy formulas inside views.

## Explicitly excluded from 0.1

- full 48-location world map;
- multiple owned venues;
- full Aufguss builder;
- Master recruitment/training;
- shop/merchandise;
- subscriptions;
- loans unless needed to prove architecture;
- guest memory/regulars;
- public reviews/ranking;
- brand system;
- trends/events/seasons;
- full maintenance system;
- deep staff scheduling;
- final character catalogue;
- final sound/localization;
- complex offline simulation.

These are not removed from the product. They are deliberately postponed until the native boundaries work.

## Core model subset

Suggested minimum native types:

```text
GameState
GameTime
ChainState
Venue
LocationDefinition
FacilityInstance
GuestDefinition or GuestSegment
GuestVisit
EconomyLedger
BalanceConfig
UpgradeDefinition
SaveEnvelope
```

## Core systems

```text
GameSimulation
GameClock
GuestSystem
VenueSystem
EconomySystem
UpgradeSystem
SaveSystem
```

## Required commands

At minimum:

```text
StartNewGame
SetAdmissionPrice
RunDay / OpenVenue
BuyUpgrade
SaveGame
LoadGame
```

## Required simulation events

At minimum:

```text
GuestArrived
GuestEntered
GuestUsedSauna
GuestLeft
RevenueRecorded
ExpenseRecorded
UpgradePurchased
UpgradeActivated
DayCompleted
```

The renderer may subscribe/map these into animation, but the game remains correct if no scene is running.

## Definition of done

Vertical Slice 0.1 is complete only when all of the following are true:

1. App launches on an iPhone simulator.
2. New Game creates a deterministic starting state.
3. One Canal venue is visible.
4. The player can set admission price.
5. Advancing/opening the venue creates guest demand.
6. At least one guest can arrive and use the sauna logically.
7. SpriteKit can visualize a simulated guest route.
8. Admission revenue is added by the economy system.
9. Operating costs are deducted by the economy system.
10. Latest-period economy is visible in SwiftUI.
11. One upgrade can be purchased and changes the simulation.
12. The upgrade is also visible in the SpriteKit scene.
13. Game can be saved and restored.
14. Simulation unit tests run without UI/rendering.
15. Save round-trip tests pass.
16. No balance rule is hidden in SwiftUI/SpriteKit.
17. No game rule depends on generative AI.
18. Build and relevant tests are green.

## Recommended acceptance scenarios

### Scenario A - baseline day

Start new game, run one operating day at default price. Verify guests, revenue, operating cost and net result.

### Scenario B - expensive price

Increase admission price, run multiple seeded days. Verify demand responds according to the configured model and no UI code determines the result.

### Scenario C - capacity upgrade

Run a capacity-constrained scenario, buy upgrade, rerun the same demand seed and verify higher service capacity changes the outcome.

### Scenario D - save continuation

Run several days, buy upgrade, save, terminate/relaunch, continue. Verify cash, time, upgrade and venue state match the pre-termination canonical state.

### Scenario E - headless

Run 100 days from XCTest with SpriteKit and SwiftUI never initialized. Verify simulation completes and emits valid ledgers/state.

## Why this is the right first native version

It contains every architectural category the full game needs: simulation, time, guests, economy, data, UI, SpriteKit, assets, upgrades and persistence. But each category is deliberately tiny, so problems can be fixed before hundreds of locations, staff variants and sprites depend on them.