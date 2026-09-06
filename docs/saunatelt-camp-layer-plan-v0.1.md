# Saunatelt Camp: Layer and Upgrade Plan v0.1

## Goal

`Saunatelt Camp` is a small Nordic canvas sauna compound, not one ever-growing tent. It must work on Industrial District, Forest Lake, Beach, Rural Plot and Urban Lot without repainting its base art or colliding with location-owned water and terrain.

The approved visual reference is [saunatelt-camp-concept-approved-v01.png](../assets/source/buildings/saunatelt-camp-concept-approved-v01.png).

## Asset Boundary

The full building canvas is `320 x 256 px`, with its ground pivot at bottom centre. It reserves a modest open forecourt from day one; no purchased item may exceed this envelope.

| Layer | Belongs to | What it contains | Animation? |
| --- | --- | --- | --- |
| `base` | Building | Low linen tent, one compact black stove pipe, plain warm entrance flap and simple timber step. | No. Chimney steam is separate. |
| `arrival` | Building | Visible entrance/shop progression, only changing the front porch and sign zone. | No. Door light is a separate effect. |
| `service` | Building | Separate compact changing/service tent and its two upgrades. | No. |
| `sauna-a` | Building | Second sauna tent progression. | No. Steam is separate. |
| `sauna-b` | Building | Third compact sauna tent progression. | No. Steam is separate. |
| `program` | Building | Enclosed wood-fired Outdoor Gus tent progression. | No. Gus steam and guest/Master actions are separate. |
| `facade` | Building | Canvas finish, wind screen and low Nordic edge-light/planting changes only. | No. Foliage/light are separate. |
| `attached-recovery` | Building | One bounded sheltered recovery edge, robe/drying rail and heat-bench progression. | No. Sitting/host actions are separate. |
| `location fields` | Location | Shower, compact plunge, fire, wild bath, water path and large planting where geographically legal. | Static states plus their own effects/actions. |

## Base State

The starter camp always includes a simple entrance/shop inside the main tent. It is not an optional detached reception.

- Sand-beige low broad canvas tent.
- Dark timber threshold and one visible doorway facing the guest path.
- One compact stove pipe and later chimney-steam anchor.
- No detached furniture, other tents, pool or decorative clutter baked into the base.
- The lower front-left doorway is the permanent `entry/shop` route anchor.

## Building-Owned Upgrade Families

Each family has a first purchased state and two visible upgrades. Families stack only when their art regions do not overlap.

### Arrival / Shop Patch

| State | Visible change | Reason |
| --- | --- | --- |
| 1. Timber threshold | Clearer signboard, tidy porch mat and compact counter cue inside the flap. | Makes arrival and small purchases legible. |
| 2. Covered entry | Low timber awning and side shelf, still part of the main tent. | Better weather handling and stronger arrival support. |
| 3. Nordic welcome front | Refined sign, warm fixed light and organised goods display visible through the entrance. | Better identity and premium presentation without creating a detached shop. |

### Changing / Service Tent

| State | Visible change | Reason |
| --- | --- | --- |
| 1. Changing tent | Small matching canvas pod at the rear-side edge. | Basic changing and staff storage. |
| 2. Divided changing pod | Second bay or timber divider, with a visible service hatch. | More practical arrival flow. |
| 3. Linen service pavilion | Matching canvas roof with drying rail and discreet stock cabinet. | Stronger service support, still a small camp. |

### Extra Sauna Tents A and B

Both families use the same visual language but occupy separate reserved side positions.

| State | Visible change | Reason |
| --- | --- | --- |
| 1. Compact sauna tent | Small insulated round/low canvas tent with its own tiny pipe. | Adds a distinct sauna room. |
| 2. Insulated sauna tent | More substantial canvas wall, timber threshold and clear vent. | Better heat stability and capacity. |
| 3. Nordic sauna pod | Canvas-and-dark-timber hybrid with a larger vent/stone cue. | High-quality compact room, not a giant tent. |

### Outdoor Gus Tent

This is an **enclosed** exterior sauna tent, never an open stage.

| State | Visible change | Reason |
| --- | --- | --- |
| 1. Wood-fired Gus tent | Wider low canvas tent, black pipe and dedicated entry. | Supports small outdoor Gus sessions. |
| 2. Tiered bench tent | Broader silhouette, two high vents and a visible waiting rail outside. | Adds program capacity. |
| 3. Ritual Gus tent | Timber-framed entry canopy, controlled vent stack and tool rack cue. | Improves Master/program presentation. |

### Recovery Edge

| State | Visible change | Reason |
| --- | --- | --- |
| 1. Wind-sheltered bench | Low matching canvas screen and one timber bench. | Basic rest between sauna and recovery. |
| 2. Covered recovery | Small linen canopy and robe/drying rail. | Useful shelter and service clarity. |
| 3. Heat bench shelter | More robust canopy with warm light and stone/wood heat bench. | A visible premium recovery finish. |

### Canvas Finish / Forecourt Patch

| State | Visible change | Reason |
| --- | --- | --- |
| 1. Grounded canvas edge | Neater canvas skirting and a few fixed planters. | Gives the starter camp a deliberate footprint. |
| 2. Wind cloth and timber path | Low wind cloth plus a clear short internal path. | Better Nordic weather identity and readability. |
| 3. Evening camp finish | Quiet edge lights, dark timber trim and stronger planting. | Higher appeal without turning the camp into glamping clutter. |

## Location-Owned Facilities

These must be drawn as separate field modules. Their availability is decided by the location, never by the tent itself.

- Outdoor shower: base -> twin rinse -> cascade bucket.
- Compact plunge: base -> expanded basin -> ritual entry deck.
- Warm spa/wild bath: base -> extra seats -> screen/pergola where the location permits it.
- Fire/recovery field: fire bowl -> extra seats -> wood/fuel/light finish.
- Natural water route: only on a location that visibly contains safe water access.
- Raised view deck: only where the location owns a credible view edge.
- Planting: location material varies, while the building uses the same restrained Nordic visual language.

## Composition Rules

1. The base tent is always drawn first.
2. `arrival` changes only the doorway/porch pixels; it never moves the route anchor.
3. `sauna-a`, `sauna-b`, `service` and `program` are separate compact volumes, with at least one narrow route-width of visual clearance unless deliberately connected.
4. `facade` and `attached-recovery` patch only their own reserved regions. They never overlap another tent volume.
5. Water, spa, shower and fire modules live in the location layer and may vary in placement by location profile.
6. Steam, lights, water and construction effects are anchored separately and never baked into a completed module PNG.

## Next Art Batch

Do not generate all states. Prove the assembly system with these five static art pieces first:

1. Neutral `Saunatelt Camp` base, including plain entry/shop.
2. `arrival` state 1: timber threshold.
3. `service` state 1: small changing tent.
4. `sauna-a` state 1: compact sauna tent.
5. One compatible location-owned outdoor shower base.

After these compose cleanly in a real location profile, produce the remaining tiers and external fields.

## Production Correction

The first browser experiment using independently generated base and entry images was rejected. The images did not share identical perspective, canvas geometry or doorway pixels, so they created a duplicate, misaligned entrance rather than a credible upgrade.

Until a pixel editor or source workflow can produce aligned replacement patches from one master canvas, the approved Saunatelt concept is used as one temporary combined placeholder. This plan remains the approved ownership and future-layer specification; it is not permission to compose unrelated generated images as overlays.
