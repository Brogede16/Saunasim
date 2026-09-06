# Sauna Sim Sprite Production Master Manifest v0.1

## Purpose

This is the single production checklist for every visible game asset. It consolidates the approved building, location, action, route and effect contracts into packages that can be drawn and implemented without rediscovering scope halfway through production.

It is an art-production map, not a replacement for the gameplay registers. When a module is added or removed, update its source register first, then this manifest.

## The Composition Rule

The goal is **not** that every house can literally appear on every location. The approved compatibility table remains authoritative: a Boathouse belongs on Canal, Harbour or Coast; a Floating Sauna belongs only on Water Plot.

The production guarantee is stronger and more useful:

> Every legal `location x building base` combination can show its base house and every compatible purchased upgrade at the same time, in any purchase order, without repainting the location or causing visual/path collisions.

To achieve this, the scene is always assembled from independent layers. A location provides multiple approved placement profiles, so a compatible house can stand where it fits the location rather than being forced into the same coordinates everywhere:

1. Location base: terrain, water, shore, road, fixed safety infrastructure and empty fields.
2. Building base: transparent building sprite with its own entrance, roofline and fixed building fields.
3. Field module: one transparent completed-world sprite per purchasable facility or upgrade state.
4. Character and effect layers: people, props, steam, water and construction rendered from explicit anchors.

No building PNG may bake in another building upgrade, a location-specific shoreline or a guest. No location base may bake in a purchasable building module. The exact footprint/envelope and placement-profile system is defined in `venue-placement-contract-v0.1.md`.

## Sheet Standard

The exact cell size, pivot, frame count, frame rate, loop mode and depth band of every sheet family is declared in `src/content/artContract.ts`. The table below is the intent; that file is the contract an export is checked against.

The motion test proved the approach. Final production uses **one sheet per action family**, rather than one huge mixed character sheet.

| Asset type | Standard | Notes |
| --- | --- | --- |
| Land movement | 8 frames, 4 directions | `32 x 32 px` cells for the first guest base; shared foot anchor. |
| Short character loop | 6 frames | Sit, shower, queue, browse, repair and similar actions. |
| One-shot/transition | 6-8 frames | Enter water, door threshold, plunge entry and stand/rise. May play forward then hold or reverse. |
| Master tool action | 8 frames | Base body action plus separately aligned towel/fan/ladle/vihta overlay. |
| Ambient effect | 3-6 seamless frames | Water, steam, light, foliage, canvas, bubbles and fire. |
| Triggered effect | 4-8 frames | Splash, cascade bucket, dense Gus steam, door/hatch and repair cue. |
| Static module | One transparent PNG per state | Base, Level 1, Level 2 and Level 3/4 visual states; no animation required unless below. |

Every frame has a fixed pivot. Land people use bottom-centre foot anchors; water activities use a waterline anchor; handheld tools use a fixed hand anchor. A sheet is named by action, never by a whole venue, for example `guest-walk-8dir-v01.png`, `guest-shower-rinse-v01.png` and `master-fan-heat-v01.png`.

## Shared Character Sprite Library

These are reusable across all locations. Appearance layers change body, skin, hair, towel/swimwear and optional accessory; they never alter action timing or preferences.

| Pack | Sheets to produce | Used by |
| --- | --- | --- |
| Movement | `walk-8dir`, `idle-stand`, `door-enter-exit`, `queue-shift` | Guests and all staff. |
| Guest arrival/service | `arrival-read-sign`, `check-in`, `shop-browse-buy`, `refill-water`, `changing-pod-transition` | Entrance, shop, refill and changing fields. |
| Guest rest | `bench-sit-stand`, `lounge-recline-rise`, `fire-rest`, `program-wait` | Benches, loungers, fire areas and Gus queues. |
| Guest recovery | `shower-rinse`, `cascade-rinse`, `cold-plunge-enter-exit`, `natural-water-entry`, `water-idle-swim`, `ladder-return`, `warm-spa-enter-exit`, `spa-seated-idle` | Every shower, cold/warm basin and eligible water route. |
| Outdoor Gus guests | `outdoor-program-participate`, `program-exit-recover` | Enclosed Outdoor Gus Sauna field only. |
| Aufguss Master | `master-field-arrive`, `master-prepare`, `master-towel-classic`, `master-fan-heat`, `master-infusion`, `master-rain-pour`, `master-vihta`, `master-rhythm`, `master-show`, `master-close` | Visible outdoor Gus sequence. |
| Master tool overlays | Classic towel, hand fan, ladle/ice/herb kit, rain ladle, vihta bundle | Aligned to the Master action sheets; do not redraw bodies per tool. |
| Service Host | `staff-host-arrival-guide`, `staff-host-shop-handoff`, `staff-host-towel-collect`, `staff-host-seat-reset`, `staff-host-water-service` | Real entry, shop, towel and reset tasks only. |
| Technician | `staff-tech-arrive`, `staff-tech-inspect`, `staff-tech-repair-ground`, `staff-tech-repair-wall`, `staff-tech-repair-roof`, `staff-tech-complete-leave` | Chain-level repair visits, including off-hours. |

The current `motion-guest-v01.png` remains a scale and runtime proof only. It is replaced by these clean action sheets, each with 3-4 more readable phases than the current test where the action benefits from it.

## Shared Effect Sprite Library

Every field owns anchors, but these sheets are reused across material variants.

| Sheet | Required places |
| --- | --- |
| `water-calm`, `water-wave`, `water-entry`, `cold-surface` | All water, cold basin and shore variants allowed by the location. |
| `steam-chimney`, `steam-program` | Operational sauna volumes; timed Gus steam with aroma accents. |
| `shower-water`, `shower-cascade` | All shower fields; cascade only where the bucket upgrade exists. |
| `spa-steam-bubble` | Wild baths, sunken spas, rooftop and pontoon spas. |
| `fire-flicker`, `light-warm`, `foliage-wind`, `door-hatch` | Approved fire, evening, weather-sensitive and entry assets. |
| `construction-work`, `repair-work` | Only over the field currently under construction or maintenance. |
| Seasonal/ambient overlays | Snow cover, light snowfall, rain/wind, sparse bird/duck/boat/car only where the base location supports it. These are later production packs, not baked into day art. |

## Location Base Packs and Location-Owned Fields

Each location needs one large zoomable base map, empty neutral versions of every approved field, route/blocked patches, and the listed transparent field modules. A dash means a one-step presentation asset, not a missing graphic.

| Location | Base art and ambient sprites | Location-owned field modules to draw |
| --- | --- | --- |
| Canal | Quay, promenade, canal wall/water, calm ripples/reflections, reeds, lights | Terrace -> loungers -> heat bench; shower -> twin rinse -> cascade; bathing bridge -> wide steps -> dip rail; quay lights; planting. |
| Harbour | Quay, calm eligible basin variant, ropes/flags, lamps | Terrace chain; enclosed quay Outdoor Gus Sauna -> tiered benches -> ritual station; bathing steps -> wide steps -> dip zone -> recovery pontoon; shower chain; lanterns; salt planting; cargo-net loungers; dockside fire bowl. |
| Industrial District | Yard, gate, brick/steel surfaces, vent steam, low lights | Shower chain; long cold basin -> extra entries -> cold rail; sunken spa -> seats -> steam pergola; recovery canopy chain; enclosed Outdoor Gus Sauna chain; social port -> tables -> workshop fire bowl; green wall; event lights. |
| Forest Lake | Clearing, lake edge, forest, calm water, leaves/reeds | Terrace chain; lake bridge chain; shower chain; floating rest platform -> seats -> hammock nets; enclosed lakeside Outdoor Gus Sauna chain; rock spa -> seats -> steam shelter; fire clearing chain; lakeside shelter; stone bench circle; view frame; ritual path. |
| Coast | Protected cove, rock/grass, wave loop, wind | Outlook deck -> loungers -> wind wall; cove steps -> wider steps -> dip rail; shower chain; changing/wind shelter; rock niche; enclosed Outdoor Gus Sauna chain; lights; planting; stone spa -> seats -> steam shelter; screens; optional visibly-present spring route only on its matching base art. |
| Beach | Boardwalk, dunes, calm cove, gentle waves, dune grass | Deck chain; cove bridge chain; shower chain; changing/wind shelter; sun/recovery zone; dune niches; enclosed Outdoor Gus Sauna chain; floating recovery platform; lights; spa chain; screen yard; fire; planting; loungers/parasols; refill station. |
| Rural Plot | Gate, meadow/garden, farmyard, grass/branch movement | Meadow terrace chain; windbreak planting; shower chain; built cold plunge chain; enclosed field-edge Outdoor Gus Sauna chain; fire circle chain; covered recovery; garden spa chain; orchard zone; rural planting. No natural-water modules. |
| Water Plot | Small shore landing, fixed gangway, water, pontoons, bob/rope/reflections | Recovery pontoon; floating spa chain; bounded swim room/net; shore deck; changing cabin; gangway shower; floating fire bowl; enclosed pontoon Outdoor Gus Sauna chain. Base includes Floating Sauna, gangway and direct dip/ladder route. |
| Urban Lot | Owned gate, bounded yard, static city backdrop, controlled street ambience | Lighting; potted greenery; social deck; low canopy/benches; shower chain; compact plunge chain; enclosed Outdoor Gus Sauna chain; wall/mural; fire courtyard; screened wild-bath; refill bench; street-facing sitting window. |
| Hotel Rooftop | Lift core, roof pads, rails, skyline, wind in screens/planting, evening glow | Skyline deck -> loungers -> parasols; wind canopy -> longer bench -> warm light; shower chain; cold plunge chain; spa chain; enclosed rooftop Outdoor Gus Sauna chain; fire bowl chain; planted corners, roof lights and lift-core refill. |

## Building Base Packs

A base is a transparent, location-neutral architectural layer. Each row needs: `base`, `restored/arrival`, `shop`, sauna-volume states, facade/roof states, chimney/door anchors, and its listed special modules. A compatible location supplies the ground-facing material trim and placement anchor.

### Repair Workshop Style Lock

`assets/source/buildings/repair-workshop-base-draft-v02.png` is the approved visual direction for the first Repair Workshop: substantial brick architecture, dark slate roof, warm lit entrance, industrial service opening and a readable 3/4 facade. The later final sprite may be cleaned, trimmed and split into base/overlay layers, but it must retain this architectural density and proportions. Do not replace it with a smaller Pokémon-town-house interpretation.

The Canal scene, guest scale, path width and future building modules adapt to this base. In particular, the final door anchor is taken from the visible entrance, shop upgrades modify the service-window/frontage zone, and programme/recovery assets remain on their own exterior fields rather than being placed over the roof.

| Building base | Legal locations | Building-owned visual module families |
| --- | --- | --- |
| Saunatelt Camp | Industrial, Forest Lake, Beach, Rural, Urban | Sign/forecourt, changing tent, second/third sauna tent, shelter, enclosed outdoor Gus sauna, compact plunge, planting; optional fire, rain shower, view deck, wild bath, drying rail, water path. |
| Container Compound | Industrial, Harbour, Forest Lake, Beach, Rural, Urban | Gate, compound-wide timber cladding, courtyard deck, changing container, second/third sauna containers, shop hatch, enclosed outdoor Gus sauna, compact plunge, canopy/benches/planters; roof terrace, glass-front sauna, rain-shower portal, fire courtyard, wild bath, edge lights. |
| Small Timber Cabin | Forest Lake, Coast, Beach, Rural | Entrance, shop window, side/loft sauna, panorama wall, veranda, shower, compact plunge, cladding/chimney; spring plunge, raised platform, wild bath. |
| Pavilion | Forest Lake, Coast, Beach | Arrival facade, shop, extra/program sauna, panorama front, veranda, shower, plunge, glass recovery wing, roof lantern/chimney; outdoor Gus pavilion, folding facade, fire circle, deck wild bath, lamella cloak/view plateau, ritual shower, meditation sauna. |
| Country Estate with Barn | Rural, selected Coast/Forest Lake | Gate, main-house shop, first/second barn sauna bay, barn Gus hall, orangery, veranda, loft gallery/stair, shower, cold plunge; open barn recovery, sun balcony/stair, outdoor Gus, water-wall showers, estate spa variant. |
| Boathouse | Canal, Harbour, Coast | Port/entrance, shop window, land-facing sauna, program sauna, glass port, lamella cooling front, shower, plunge, facade; quay Outdoor Gus Sauna, quay wild bath, sliding lamellas, maritime drying area. |
| Repair Workshop | Canal, Industrial | Port/entrance, shop, extra/program sauna, glass doors, roof-material/light treatment, port recovery, copper shower, plunge, brick/light; courtyard Outdoor Gus Sauna, wild bath, oven/chimney, water wall, greenery. |
| Small Depot | Industrial | Port entrance, shop, compact/program sauna, glass, yard module, rain shower, plunge, softened facade; ramp recovery, skylights, wild bath, gable recovery box, enclosed yard Gus sauna, cold trough, open port bench zone. |
| Warehouse | Harbour, Industrial | Loading facade, shop port, first/second existing hall-bay sauna conversion, existing bay Gus hall, facade/roof glass, orangery, covered-yard Outdoor Gus Sauna, cold basin, roof terrace/external stair; warm loading-bay pool, recovery gallery/stair, greenery. |
| Fiskehus | Harbour, Industrial | Loading entrance, shop hatch, two converted cold-room saunas, machinery-room program sauna, windows/skylights, ramp recovery, shower, former trough cold basin, restored materials/lights; terrace, loading-edge Outdoor Gus Sauna, wild bath, net/lamella screens, planting. |
| Floating Sauna | Water Plot only | Pier sign, attached changing pod, shower pod, panorama front, deck, second flexible sauna pod, program pod, recovery niche, wave timber shell, lit gangway, sliding deck screens, small evening Gus point. |
| Rooftop Sauna | Hotel Rooftop only | Lift sign/shop, second/program/third sauna volume, skyline glass, glass recovery room, lamella crown, sliding screens, lift portal, sky Gus alcove. |
| Former Kursted / Badesanatorium | Coast, Forest Lake, Rural | Historic entrance, foyer shop, two bath-wing sauna conversions, hall Gus conversion, orangery, veranda, upper lounge/belvedere/stair, shower, cold plunge; sun balcony, shower colonnade, Kur terrace, spa variant, glass passage, ritual court. |

### Saunatelt Camp Style Lock

`assets/source/buildings/saunatelt-camp-concept-approved-v01.png` is the approved visual reference. The camp is a restrained Nordic canvas sauna: a low broad sand-beige tent, calm large canvas planes, dark timber entry porch, one compact black stove pipe and a subtle warm doorway. It is not a decorative glamping tipi. The final production asset must preserve that silhouette while separating the transparent base, entry/shop patch and later upgrade layers.

## Building Combination Rule

Do not draw a separate complete house for every purchased-upgrade combination. A building is assembled at runtime from a small, fixed set of transparent layers that share the same native canvas, pivot and door anchor:

1. `base`: the starter architecture, including entry/shop and its door.
2. `shop`: one of `tier-0`, `tier-1` or `tier-2`, replacing only the shop-front pixels.
3. `facade`, `roof`, `glass`, `chimney` and `attached-wing`: independent optional overlays or replacement patches.
4. `foreground`: rail, planting, snow or terrain masks that must draw in front of the building.

Each tier of one upgrade family is mutually exclusive: the renderer draws its highest purchased tier at that family's anchor. Different families can combine freely because their art bounds are reserved and non-overlapping. A purchased outdoor facility remains a separate field sprite; it is not baked into the house. This changes asset count from every possible combination to one base plus one short overlay sequence per upgrade family.

If two planned integrated upgrades would need the same pixels, they must be designed as one shared overlay family or moved to different reserved facade zones. Never solve the conflict by generating a special combined house sprite.

## Orientation Rule

Pixel-art assets are never programmatically rotated. A rotated asset needs its own drawn sprite and often a different door, shadow, depth mask and activity anchor.

- Characters use eight movement bearings and the approved activity sheets. Only `S`, `SE`, `E`, `NE` and `N` are drawn; `SW`, `W` and `NW` are those rows mirrored at runtime. Mirroring is explicitly permitted where rotation is not: it preserves the pixel grid, and the foot anchor sits on the flip axis. It requires ambient/top shading on characters and tool anchors stored as offsets from the pivot.
- Large building bases use one deliberate orientation per approved placement profile. A second mirrored or rotated building variant is made only when it unlocks a meaningful, visually coherent location composition.
- Freestanding modular assets may have two orientations as the normal case: long edge horizontal or vertical. A third or fourth orientation is approved only for genuinely directional props such as stairs, showers, ladders, benches or a water-entry structure.
- Symmetric assets, particles, steam, planting and compact basins use one sprite plus anchors rather than redundant rotation art.

The profile data chooses among the approved drawn orientations. It may never rotate a bitmap at runtime, because that breaks the locked pixel grid and the asset's path/depth anchors.

## Facility Upgrade Visual Rule

Every purchasable facility has a base field and up to two approved upgrades. Draw the whole sequence as independent states on the same field, not as a serial full-scene repaint.

| Shared facility | Visible sequence | Character/effect requirement |
| --- | --- | --- |
| Reception Shop | Base shop -> Hydration Counter -> Venue Goods Display | `shop-browse-buy` and refill hold; door/hatch, warm light. |
| Outdoor Shower | Base shower -> Twin Rinse Rail -> Cold Cascade Bucket | Two rinse anchors; `shower-rinse`, `cascade-rinse`, shower/cascade sheets. |
| Cold Plunge | Compact basin -> Expanded Basin -> Ritual Entry Deck | Extra entry anchors; plunge, cold surface and splash sheets. |
| Terrace/Recovery Deck | Deck -> Recovery Loungers -> Sheltered Heat Bench | Sit and recline actions; towel prop/Host reset where applicable. |
| Base Sauna | Base -> Expanded Sauna Chamber -> Stone Stove Refit | New visible volume or stack; chimney and timed steam. |
| Program Sauna | Base -> Bench Gallery -> Heat & Vent Stack | Exterior size/vent change; timed program steam. |
| Outdoor Gus Sauna | Enclosed base -> Tiered Interior Benches -> Master Ritual Station | Master approach/prepare/enter; guest wait/participation; program steam. |
| Wild Bath / Warm Spa | Basin -> extra seats -> screen/pergola/shelter where approved | Enter, seated loop, bubbles, steam and splash. |
| Water route | Bridge/steps -> widened entry -> rail/dip zone/pontoon as approved | Full approach, entry, water idle, ladder/return route and water effects. |
| Fire / lounge / canopy | Base -> added seats -> fuel/store/light only where approved | Sit/recline/fire loop; fire/light sheets. |

## Required Scene Data Alongside Every Graphic

No rendered field is complete without its matching data card:

```text
field id
owner: location | building | shared facility
base pivot and depth layer
walkable and blocked patches
entrance, activity, waterline and return anchors
effect anchors with layer/scale
occlusion mask or foreground strip
capacity/activity positions
construction replacement state
condition/repair target, where applicable
integrated overlay families and their tier anchors
```

This is how a person can walk behind a building, in front of a bench, partly behind a plunge, or into water without special-case hand coding. Location base maps reserve every approved field from day one; an unbuilt field is neutral ground, not missing geography.

## Asset Production Order

1. **Global kit:** palette, terrain, depth convention, character pivots, tool overlays and shared effect sheets.
2. **Character proof pack:** final guest `walk-8dir`, `idle`, `bench`, `shower`, then the corresponding Phaser preview. This replaces the test sheet.
3. **Canal + Repair Workshop vertical slice:** canal base, workshop base, shop, one sauna expansion, one shower chain, terrace chain, bridge chain, water/steam/action anchors.
4. **Shared facility pack:** cold plunge, warm spa, Outdoor Gus Sauna, fire/loungers and Host/Technician actions.
5. **Remaining building bases:** architectural sprites and their independent fields, grouped by compatible location material family.
6. **Remaining location bases:** each with field data before final art, then its distinctive modules.
7. **Seasonal and high-variety overlays:** weather, snow cover, sparse wildlife/traffic and expanded appearance layers.

Before producing any pack, make a one-page asset card for each PNG/sheet: file name, source prompt/reference, native dimensions, frame count, pivots, legal tags, anchors and test scene. The card is the handoff between art and code.

## Audit Sources and Maintenance

This manifest was checked against `building-library-v0.1.md`, `venue-composition-v0.1.md`, `location-scene-layouts-v0.1.md`, `location-upgrade-review-v0.1.md`, `asset-effect-model-v0.1.md`, `asset-registry-v0.1.md`, `character-animation-contract-v0.1.md`, `scene-effects-inventory-v0.1.md`, `scene-composition-and-render-contract-v0.1.md`, `pixel-art-production-guide-v0.1.md` and `visual-production-manifest-v0.1.md`.

The detailed asset registry still has older terminology in a few historical entries. For production, `Outdoor Gus Sauna` always means an enclosed outdoor-sited sauna, and Canal has no separate Small Canal Descent; the current location review and this manifest take precedence until the registry is reconciled.
