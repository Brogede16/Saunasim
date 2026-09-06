# Location Profile Layout Production v0.1

This is the graphics gate before final location and building sprites. Every legal profile needs an approved, explicit composition. The generic collision-safe board layout is a planning fallback only; it is not production approval.

## Invariants

- The asset's native bounds, anchor and sprite scale never change between profiles.
- The location, red base building, purple location-owned fields and orange building-owned fields may move to compatible coordinates.
- Every profile has an off-screen edge arrival, path to the main building's entry/shop, and enough clear route space for guests.
- Fixed geography remains fixed: water body, bridge, quay, shore access, cliff, mature forest, road, lift core and safety structure.
- Integrated upgrades are reserved overlay zones on the building base. Freestanding upgrades use separate orange fields.

## Approval Checklist

For each row, lock:

1. Base-building coordinate and door anchor.
2. Fixed purple geography.
3. Flexible purple fields and their exact positions.
4. Every orange freestanding field, using its invariant asset size.
5. Routes, depth/occlusion and effect anchors.

| Location | Legal building bases | Status |
| --- | --- | --- |
| Canal | Repair Workshop, Boathouse | First two explicit compositions complete in placement board |
| Harbour | Container Compound, Boathouse, Warehouse, Fiskehus | Pending explicit layouts |
| Industrial | Saunatelt Camp, Container Compound, Repair Workshop, Small Depot, Warehouse, Fiskehus | Pending explicit layouts |
| Forest Lake | Saunatelt Camp, Container Compound, Small Timber Cabin, Pavilion, Country Estate + Barn, Kursted | Pending explicit layouts |
| Coast | Small Timber Cabin, Pavilion, Country Estate + Barn, Boathouse, Kursted | Pending explicit layouts |
| Beach | Saunatelt Camp, Container Compound, Small Timber Cabin, Pavilion | Pending explicit layouts |
| Rural Plot | Saunatelt Camp, Container Compound, Small Timber Cabin, Country Estate + Barn, Kursted | Pending explicit layouts |
| Water Plot | Floating Sauna | Pending explicit layout |
| Urban Lot | Saunatelt Camp, Container Compound | Pending explicit layouts |
| Hotel Rooftop | Rooftop Sauna | Pending explicit layout |

Total: 36 legal profiles. Final art starts only when all 36 rows have passed this checklist.
