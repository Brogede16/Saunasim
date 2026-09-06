# Sauna Sim Location Placement Profiles v0.1

## Status

This is the all-location placeholder-layout pass. It locks the **geometry plan**, not final pixel art. The interactive coloured-box board is [location-placement-board.html](/Users/mads/.codex/.chatgpt-projects/g-p-6a89c487fca481919ee73ef8085ad596/public/design/location-placement-board.html).

Each board map contains:

- protected geography/background: water, forest, cliff, road, neighbouring property or structural roof area;
- fixed location-owned upgrade fields, already sized for their highest approved state;
- one selected legal building profile at a time, shown at its full maximum envelope and its building-specific local slots;
- a continuous route band between entry, building and outdoor fields.

Every location also has one fixed yellow `guest arrival` field on the usable map edge. It is the visible start/end anchor for guests and may be a street gate, quay arrival, forest gate, boardwalk entrance or shore landing. Hotel Rooftop is the sole exception: its lift core is the edge of the player-controlled roof area. A visible route line always connects this field to the selected building's main entrance. It is base infrastructure, not a purchasable upgrade and is never displaced by a building profile.

## Profile Coverage

| Location | Legal building profiles represented |
| --- | --- |
| Canal | Repair Workshop, Boathouse |
| Harbour | Container Compound, Boathouse, Warehouse, Fiskehus |
| Industrial District | Saunatelt Camp, Container Compound, Repair Workshop, Small Depot, Warehouse, Fiskehus |
| Forest Lake | Saunatelt Camp, Container Compound, Small Timber Cabin, Pavilion, Country Estate with Barn, Former Kursted / Badesanatorium |
| Coast | Small Timber Cabin, Pavilion, Country Estate with Barn, Boathouse, Former Kursted / Badesanatorium |
| Beach | Saunatelt Camp, Container Compound, Small Timber Cabin, Pavilion |
| Rural Plot | Saunatelt Camp, Container Compound, Small Timber Cabin, Country Estate with Barn, Former Kursted / Badesanatorium |
| Water Plot | Floating Sauna |
| Urban Lot | Saunatelt Camp, Container Compound |
| Hotel Rooftop | Rooftop Sauna |

That is every legal building/location pair currently approved in `building-library-v0.1.md`: `2 + 4 + 6 + 6 + 5 + 4 + 5 + 1 + 2 + 1 = 36` placement profiles in total.

## Board Review Rule

The profile box means the complete maximum building envelope, including all building-owned upgrades listed in `building-envelope-estimates-v0.1.md`. Location fields stay fixed and never become building overflow space. If a visual review finds a credible composition cannot fit, enlarge the world or relocate the profile before art; do not rescale the building, pool or guest.

The board shows these two ownership types separately:

- **Dark-red base:** the starter building that exists on day one. The pale-red dashed outline is its complete maximum envelope.
- **Orange local slots:** house-specific additions that occupy unused space inside the maximum envelope without overlapping the base: tent saunas, added container volumes, barn bays, cold rooms, shop hatches, verandas, glass wings, roof stairs and similar features.
- **Purple location fields:** water access, cove/bridge, location spa pad, fire-safe pad, location Outdoor Gus Sauna and other terrain-owned facilities. These normally remain stable inside one location base because they depend on real geography, but later location-base variants may use a different full field arrangement rather than forcing a bridge or water edge to move unrealistically.

This keeps custom buildings genuinely custom without pretending that a lake bridge or cliff cove is portable furniture.

The next approval is visual: review each selected profile on the board for obvious bad adjacency, missing route space or protected geography that should instead be integrated with a specific module.
