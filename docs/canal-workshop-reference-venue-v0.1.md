# Canal Location Reference v0.1

## Purpose

This is an early reference for a canal **location layer**, not a locked venue called "Canal Workshop". A real canal offer combines this location with a compatible plot and building base, as defined in `venue-composition-v0.1.md`. It establishes exterior upgrade language, guest routes and asset scale for later venue combinations.

## Scene Identity

- **Site:** compact former brick repair workshop beside a clean, designated city bathing canal.
- **View:** larger top-down 3/4 exterior canal location with a controlled zoom range. The default mobile view shows the active venue; zooming out provides surrounding canal context and zooming in lets the player inspect guests and additions.
- **Street:** along the left edge. Arrival and departure happen here.
- **Building:** a narrow, two-storey brick workshop occupies the centre-left.
- **Water:** the canal runs along the full right edge, from the top to the lower foreground.
- **Mood:** ordinary daytime canal life turns into warm, active evening sauna light; winter keeps a maintained ice opening at the bathing bridge.

## Scene Assembly

The scene is not a single painted image. It is composed from:

- the larger canal-city environment base: canal, quay, paving, trees, railings and clear usable yard, extending beyond the venue so it remains believable when zoomed out
- a compatible canal building base at its fixed footprint
- site-specific modules at its authored canal, roof and facade anchors
- shared compatible outdoor props, guest sprites and ambience

The environment base can support several compatible canal-city building types, but their exact footprints and expansion anchors are authored separately. A boathouse, for example, can share the quay and water but not a repair workshop's rear extension geometry. The maximum building footprint includes room for all major building-specific modules, so the player never reaches a late upgrade and finds that the scene has no physical space for it.

## Base Venue

The first playable test begins immediately after the modest, operational sauna conversion is complete. The player does not build the initial basic sauna shell in this slice. Its managed interior includes the necessary basic sauna functions, but the exterior shows only:

- a single warm front entrance facing the street
- a restrained venue sign with the player-selected venue name
- one chimney with a small smoke/steam loop
- a narrow service doorway facing the canal-side yard
- a paved passage from street to entrance and around the building
- canal railings and an inactive waterside edge

No exterior shop, terrace, bathers or bathing bridge appear until the relevant upgrade is built.

The terrace, shop/program identity and bathing bridge are all available as visible early goals. Their order is determined by price, the player's cash and a responsible borrowing limit, not by an arbitrary unlock sequence.

## Fixed Upgrade Anchors

| Anchor | Upgrade | Visible result | Guest-route result |
| --- | --- | --- | --- |
| Street-front window | Reception Shop | Lit service hatch, small program display and purchase stop | Entrance <-> shop stop |
| Lower canal-side yard | First terrace | Compact timber deck, benches and planters | Entrance <-> terrace sit |
| Canal edge below terrace | Bathing Bridge | Steps/pier into canal; ice opening in winter | Entrance <-> bridge <-> water |
| Rear/upper building volume | Sauna Capacity Extension | Brick/timber rear volume and fuller steam output | More apparent arrival/exit activity |
| Street-facing upper facade | Program Frame and evening light | Stronger exterior sign, poster/emblem and window light | No route; increases visible evening identity |
| Canal-facing building side | Glass Sauna Wing | Major late-stage glass extension facing water | Supports higher venue activity; water/terrace routes remain connected |
| Roof | Roof Plunge | Expensive compact rooftop cold facility | Requires an authored building-to-roof transition and use/return route before it enters production |

Placement is fixed. The player selects upgrades but does not drag buildings or modules around the scene.

## Guest Route Graph

```text
street arrival -> entrance -> interior
interior -> exit -> street departure
entrance <-> shop stop             (after Reception Shop)
entrance <-> terrace               (after First Terrace)
terrace <-> bathing bridge <-> water (after Bathing Bridge)
```

Water activity uses the shared guest animation library: walking, descending, water entry, short idle/swim loop, exit and return. In winter, the same route leads to the automatically maintained ice opening.

## Time and Season Presentation

| State | Reusable presentation changes |
| --- | --- |
| Day | Brick and canal are clear; limited pedestrian and cyclist ambience |
| Evening | Warm entrance/window light, sign light, richer steam and more visible social activity |
| Night | Reduced background activity, strong venue light and reflective canal highlights |
| Winter | Climate-dependent snow or wet-cold layer, steam contrast and ice opening at bridge |

## Initial Asset Order

1. `backgrounds/canal-city-01-base-v01.png`
2. `tiles/buildings/canal-workshop-base-01-v01.png`
3. `tiles/upgrades/canal-terrace-01-v01.png`
4. `tiles/upgrades/canal-bathing-bridge-01-v01.png`
5. `sprites/guests/guest-base-01-walk-v01.png`
6. `sprites/guests/guest-base-01-water-v01.png`
7. `effects/chimney-steam-01-v01.png`
8. Day/evening/night and winter overlay layers
9. Shop, capacity-extension, program-frame and glass-wing modules

No asset is final until checked against the Pixel Art Production Guide and placed in the playable scene.
