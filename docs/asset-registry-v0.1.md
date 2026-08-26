# Sauna Sim Asset Register v0.1

## Purpose

This is the production register for **every approved asset family**. A concrete item may reuse a functional card from `asset-effect-model-v0.1.md`, but it still needs its own visual variant, anchors and production status. No module may enter the game from an undocumented list.

The register deliberately separates:

- **Functional card:** the common gameplay rule, appeal, revenue mechanism and running cost.
- **Concrete variant:** the believable building/location-specific visual object the player buys.

For example, every reception shop uses the `Reception Shop` card, but a cabin shop window, a boathouse quay hatch and a warehouse loading-port counter are different concrete variants with their own art and guest anchors.

## Spatial Coherence Rule

A purchasable asset must attach to one of two things only:

1. A visible, authored anchor on the selected building base, such as an existing port, roof, wing, courtyard or stair.
2. A visible, authorised piece of the chosen location base, such as a fixed quay, shore, roof surface, forest clearing or owned plot edge.

The asset may not invent a new yard, water edge, terrace, roof or building volume after the location and building are selected. If a proposal needs one of those spaces, that space must be in the base scene from the beginning and be tagged as an available expansion anchor. This applies to every future suggestion and production asset.

## Independent Upgrade Field Rule

Players may buy compatible upgrades in any order. Each upgrade therefore owns one fixed, authored field on the base scene and must look visually complete when it is the only upgrade purchased.

- An upgrade may replace or enrich only its own field: for example an existing facade panel, a marked roof field, a fixed yard corner or a defined shore anchor.
- It must never require another optional upgrade to make sense. No deck needs an unbuilt fireplace; no stair needs an unbuilt terrace; no water feature needs an unbuilt path.
- If two upgrades are both purchased, their authored boundaries may meet cleanly, but neither is allowed to cover, move or visually break the other.
- A base scene includes all necessary structural context from the start: a roof field already has safe structural edges, a yard field has its boundary, and a water field already has its shore/quay geometry.

## Visible Upgrade Contract

Every purchasable upgrade must visibly change the exterior scene on its own authored field. A menu-only number increase is not an acceptable upgrade.

At least one of the following must be present for every upgrade:

1. A new or altered exterior volume, facade, roof field, water facility, path field or material layer.
2. A new visible guest route, arrival, entry/exit, sit/stand, swim, shower or program activity.
3. A persistent or timed effect such as chimney steam, Aufguss steam, water flow, lighting, fire, bubbles or opened facade state.

The asset register must record the visible consequence before final art or code is made.

## Functional Card Key

| Key | Functional card | Main job | Revenue mechanism |
| --- | --- | --- | --- |
| `ARR` | Arrival quality | Better first arrival and usable guest flow | Retention/return |
| `SHOP` | Reception shop | Small automatic product sales | Direct spend less purchasing cost |
| `CAP` | Extra sauna room | More sauna seats | More sellable admissions/sessions |
| `GUS` | Program sauna | Aufguss capability and seats | Paid program seats where selected |
| `COLD` | Cold recovery | Plunge or natural-water use | Retention and price tolerance |
| `WARM` | Warm recovery | Wild bath/spa use | Retention and premium spend |
| `REST` | Rest/social space | Recovery seating and outdoor linger capacity | Retention/return |
| `PREM` | Premium presentation | Suitable guests accept a higher price | Willingness to pay |
| `SHWR` | Outdoor shower | Completes cold/warm recovery route | Enables the value of linked facility |
| `LIGHT` | Evening presentation | Day-to-evening identity and wayfinding | Retention/price tolerance, never flat income |
| `DECOR` | Decorative presentation | Visual identity only | No direct revenue |

`ARR`, `LIGHT` and `DECOR` use the same required data fields as a full asset card. They are added here because their detailed numerical values should be set in the first balance pass, not guessed now.

## Building Variants

Each row is a distinct production asset. The card key gives its gameplay contract; the listed visual form ensures it is not treated as a generic pasted object.

### Floating Sauna

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Arrival sign at pier | ARR | Pier-facing sign and entry anchor |
| Attached changing pod | ARR | Pod threshold and hidden changing transition |
| Outdoor shower pod | SHWR | Rinse anchor and falling-water effect |
| Water-facing panorama front | PREM | Water-side facade/roof overlay |
| Expanded floating deck | REST | Seated deck anchors beside gangway |
| Floating-deck sea entry and fixed ladder return | COLD | Direct deck jump/step-in anchor, short swim/idle points, splash/ripple effects and ladder-exit anchor inside Water Plot's safe bathing zone |
| Second small sauna pod | CAP | Connected pod, door and chimney-steam anchor |
| Program sauna pod | GUS | Connected pod and timed program-steam anchor |
| Covered recovery niche | REST | Slatted screens and seated anchors |
| Wave-form timber shell across existing pods | PREM + REST | Existing-pod exterior field; sheltered sitting niches, distinctive silhouette and warm light/steam anchors |
| Lit gangway with planters | ARR | Walkable gangway, lights and planter overlay |
| Sliding deck screens | REST + PREM | Existing floating-deck field; authored open/closed screen state and sheltered seating anchors |
| Small evening Aufguss platform between pods | GUS | Existing inter-pod deck field; small-group program anchors, timed steam and light |

### Rooftop Sauna

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Lift-core entrance and roof sign | ARR | Visible lift/stair arrival transition |
| Reception/shop niche | SHOP | Counter stop at lift core |
| Second rooftop sauna | CAP | Second roof volume and entry anchor |
| Program sauna pavilion | GUS | Program door and timed steam anchor |
| Skyline-facing glass front | PREM | City-facing facade overlay |
| Glass recovery room | REST | Enclosed seated recovery anchors |
| Third compact sauna volume | CAP | Structural-roof-only footprint and entry anchor |
| Timber lamella crown with sheltered sitting niches | PREM + REST | Existing sauna exterior field; filtered skyline view, seating anchors and integrated warm lighting |
| Sliding screens before skyline glass front | PREM | Same facade field; authored open/closed wind/privacy state |
| Glowing lift-arrival portal | ARR + PREM | Existing lift-core field; low warm light, sheltered arrival and entry anchor |
| Small sky Aufguss alcove | GUS + PREM | Fixed program-sauna exterior field; small-group outdoor program anchors and timed steam |

### Saunatelt Camp

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Improved entrance and sign | ARR | Canvas gate/sign and entry anchor |
| Timber floor and forecourt | ARR | Walkable timber patch and arrival path |
| Changing tent | ARR | Canvas threshold and hidden change transition |
| Second sauna tent | CAP | New tent volume, door and chimney steam |
| Third sauna tent | CAP | New tent volume, door and chimney steam |
| Covered shelter and recovery seating | REST | Shelter, seated anchors and towels/idle loops |
| Wood-fired outdoor Aufguss deck with wind screens | GUS | Program activity point, wind-screen overlay and timed outdoor steam |
| Portable cold-plunge tub | COLD | Step-in, cold loop and splash anchors |
| Potted palms and greenery | DECOR | Decorative identity overlay; no hidden bonus |
| Fire circle with timber benches | REST | Evening fire loop, bench anchors and smoke/ember effect |
| Outdoor rain shower in timber frame | SHWR | Rinse loop, falling-water and splash effects |
| Raised viewing deck | PREM + REST | Only on authored view footprint; seated viewing anchors |
| Large wood-fired wild bath | WARM | Seated anchors, chimney/steam, bubbles and entry/exit splash |
| Low covered robe/drying rail | DECOR | Recovery-route visual only; towels/robes remain non-interactive detail |
| Narrow timber bathing path | ARR | Only connects to existing location-owned water access; walk patches and no water-entry anchor of its own |

### Container Compound

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Entrance gate and sign | ARR | Street/plot entry anchor and container-yard identity |
| Compound-wide timber cladding | PREM + LIGHT | Reskins every present container and becomes the inherited finish for later container modules; warmer windows and container-edge steam |
| Shared courtyard deck | REST | Walkable deck with seated/standing anchors |
| Changing container | ARR | Container threshold and hidden changing transition |
| Second sauna container | CAP | Connected container, door and chimney-steam anchor |
| Third sauna container | CAP | Connected container, door and chimney-steam anchor |
| Reception/shop hatch | SHOP | Exterior hatch purchase stop and small product display |
| Small outdoor Aufguss deck | GUS | Program activity point and timed outdoor steam |
| Compact cold-plunge tub | COLD | Step-in, cold loop and splash anchors |
| Pergola, benches and large planters | REST | Sheltered seating anchors and contained-yard identity |
| Reinforced roof terrace with visible stair | PREM + REST | Visible stair/roof transition and seated viewing anchors |
| Panoramic glass-front sauna container | CAP + PREM | Container sauna door, premium facade and chimney steam |
| Covered rain-shower portal | SHWR | Rinse loop, falling-water and splash effects |
| Fire courtyard with steel bowl/long benches | REST | Evening fire loop, bench anchors and smoke/ember effect |
| Courtyard-deck wild bath | WARM | Reuses Wild Bath mechanics; seated anchors, steam, bubbles and splash |
| Low courtyard canopy with long benches | REST | Container-aligned canopy, sheltered seating and social anchors |
| Fixed Aufguss wind/privacy screens | GUS | Part of outdoor program deck; visible shelter and timed steam backdrop |
| Integrated evening edge lighting | LIGHT | Under-step, stair and shop-hatch light anchors; wayfinding and evening presentation |

### Small Timber Cabin

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Renovated entrance and sign | ARR | Door/sign entry point |
| Reception/shop window | SHOP | Window purchase stop |
| Small side sauna | CAP | Side volume, door and chimney steam |
| Loft sauna | CAP | Visible stair/loft transition before guest appears |
| Location-compatible panorama window | PREM | Water/forest/coast facade variant |
| Covered veranda | REST | Covered seated anchors |
| Fixed outdoor shower | SHWR | Rinse loop and water effect |
| Compact cold-plunge tub | COLD | Plunge positions and splash anchors |
| Timber cladding/chimney treatment | LIGHT | Material overlay, warm windows and steam |
| Rock-built spring plunge | COLD | Step-in, cold loop, stone water edge and splash anchors |
| Raised timber platform | PREM + REST | Only on authored forest/coast view footprint; seated viewing anchors |
| Cabin wild bath | WARM | Reuses Wild Bath mechanics; timber/stone basin, steam, bubbles and splash |

### Pavilion

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Renovated arrival facade | ARR | Main entry and sign |
| Reception/shop module | SHOP | Building-specific counter/window |
| Extra sauna room | CAP | Attached room and chimney steam |
| Program sauna | GUS | Program entry and steam anchor |
| Panorama front | PREM | Location-facing facade overlay |
| Fixed outdoor shower | SHWR | Rinse loop and water effect |
| Compact cold-plunge tub | COLD | Plunge loop and splash anchors |
| Glass recovery wing | REST | Attached wing and seated anchors |
| Open Aufguss stage beneath broad canopy | GUS | Outdoor program point, audience/arrival anchors and timed steam |
| Folding panorama facades | PREM | Open/closed facade state on credible view side |
| Sunken fire circle | REST | Bench anchors, evening fire loop and ember effect |
| Integrated-deck wild bath | WARM | Reuses Wild Bath mechanics; seated anchors, steam, bubbles and splash |
| Timber lamella cloak with sitting niches/viewing plateau | PREM + REST | Replaces veranda/lantern field; sheltered seating, low stair and view anchors |
| Cold ritual shower with pull cord and bucket | SHWR | Existing shower field; rope-pull, falling-water and splash effects |
| Narrow outdoor meditation sauna | CAP + PREM | Requires authored large-site field; quiet entry and chimney-steam anchor |

### Boathouse

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Restored port and entrance | ARR | Quay-side entry anchor |
| Reception/shop window | SHOP | Quay-facing shop stop |
| Land-facing sauna room | CAP | Attached/converted volume and steam |
| Program sauna | GUS | Program entry and timed steam |
| Water-facing glass port | PREM | Water-side facade overlay |
| Boathouse front with timber lamellas/cooling niches | REST + PREM | Building-owned waterfront facade field, sheltered seating anchors and slatted overlay |
| Fixed outdoor shower | SHWR | Rinse loop and water effect |
| Compact cold-plunge tub | COLD | Plunge loop and splash anchors |
| Restored timber facade | LIGHT | Timber restoration and window glow |
| Outdoor Aufguss deck on the quay | GUS | Requires an authored fixed quay; program point, guest anchors and timed steam |
| Quay-deck wild bath | WARM | Reuses Wild Bath mechanics; seated anchors, steam, bubbles and splash |
| Sliding timber lamellas before water-facing glass port | PREM | Same facade field; authored open/closed state without depending on another upgrade |
| Maritime drying area beneath existing eave | DECOR | Eave anchor, robe/towel detail and recovery-route seating; no hidden bonus |

### Repair Workshop and Small Depot

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Restored/new entrance in original port | ARR | Original loading-port entry anchor |
| Building-specific reception/shop | SHOP | Workshop port or depot hatch purchase stop |
| Extra sauna volume | CAP | Side/rear volume and chimney steam |
| Program sauna | GUS | Program entry and timed steam |
| Glass doors/facade glass section | PREM | Original-port facade overlay |
| Glass recovery wing/covered yard | REST | Building-appropriate recovery anchors |
| Rain shower at existing workshop/depot port | SHWR | Attached to visible port; rinse loop, falling-water and splash effects |
| Compact cold-plunge tub | COLD | Plunge loop and splash anchors |
| Brickwork or softened industrial facade/greenery treatment | LIGHT + PREM | Material/plant overlay, lighting and steam |
| Existing workshop courtyard as outdoor Aufguss space | GUS | Requires authored workshop-yard footprint; program point, guest anchors and timed steam |
| Copper-pipe rain shower | SHWR | Attached to visible workshop exterior; rinse loop, falling-water and splash effects |
| Workshop-courtyard wild bath | WARM | Requires authored courtyard footprint; reuses Wild Bath mechanics |
| Glass dome over existing workshop roof/port field | PREM + REST | Requires a defined roof/port anchor; enclosed recovery seating and glass-light overlay |
| Open workshop-port recovery field | REST | Existing port field opens to covered bench/recovery anchors and steam |
| Restored workshop oven/chimney | LIGHT | Existing wall/roof anchor; stronger chimney steam and warm evening identity |
| Industrial water wall | COLD | Existing courtyard wall; water-flow effect, rinse/cold-recovery anchor and return route |
| Industrial greenery field | PREM + REST | Existing wall/courtyard field; large planters/climbers/grasses and recovery-atmosphere anchors |
| Existing loading ramp as screened recovery deck | REST | Requires a visible depot ramp; screened seating anchors |
| Restored shed roof with skylights | PREM | Existing roof overlay with daylight/evening glow |
| Rain shower at existing depot port | SHWR | Attached to visible port; rinse loop, falling-water and splash effects |
| Depot-yard wild bath | WARM | Requires authored yard field; reuses Wild Bath mechanics |
| Narrow glass recovery box along existing gable | PREM + REST | Requires a defined gable anchor; enclosed seating and glass-light overlay |
| Small covered Aufguss field in existing depot yard | GUS | Requires authored yard field; small-group program anchors and timed steam |
| Long cold-water trough along existing yard wall | COLD | Requires authored wall field; compact step-in/rinse/exit anchors and water effects |
| Open port and bench zone | REST | Existing port field opens to recovery bench anchors and evening activity |

### Warehouse

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Restored loading facade/main entrance | ARR | Main port entry anchor |
| Reception at loading port | SHOP | Counter purchase stop |
| Converted first existing hall bay | CAP | Lit/active existing bay and increased steam |
| Converted second existing hall bay | CAP | Lit/active existing bay and increased steam |
| Existing bay as large Aufguss hall | GUS | Large program entry, timed steam and optional queue |
| Facade or roof glass sections | PREM | Large transparent facade/roof overlay |
| Sawtooth glass orangery along existing side bay | PREM + REST | Existing side-bay field; glass seating/recovery anchors |
| Large outdoor Aufguss yard in covered industrial yard | GUS | Existing yard field; wind screens, program anchors, multiple shower fields and timed steam |
| Long cold-water basin beneath existing loading edge | COLD | Existing loading-edge field; multiple entry/exit anchors and water effects |
| Roof terrace with shower/visible external stair | REST + SHWR | Separate authored roof field; external stair, seats and rinse anchors |
| Warm pool in existing open loading bay | WARM | Existing open-bay field; seated water anchors, steam, bubbles and splash |
| High recovery gallery on existing gable | REST + PREM | Requires authored gable and external-stair field; elevated seating anchors |
| Warehouse industrial greenery | PREM + REST | Existing yard-wall fields; planters/climbers/grasses and recovery atmosphere |

### Fiskehus

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Restored loading entrance | ARR | Main entry anchor |
| Reception/shop hatch | SHOP | Building-specific hatch purchase stop |
| Converted first former cold room | CAP | Its own visible cold-room facade field changes: altered equipment, warm door/window light, activated sauna vent/steam and guest route |
| Converted second former cold room | CAP | Its own visible cold-room facade field changes: altered equipment, warm door/window light, activated sauna vent/steam and guest route |
| Machinery room as program sauna | GUS | Program entry, timed steam and machinery identity |
| New windows and skylights | PREM | Facade/roof transparency overlay |
| Salt-air recovery terrace on covered loading ramp | REST | Existing-ramp seating, wind-screen and multiple shower-field anchors |
| Former ice/sorting trough as long cold basin | COLD | Existing trough field, multiple entry/exit anchors and water effects |
| Restored materials/evening lighting | LIGHT | Material overlay and warm light |
| Small outdoor Aufguss field at loading edge | GUS | Existing loading-edge field; intimate program anchors and timed steam |
| Fiskehus yard/sorting-field wild bath | WARM | Requires authored yard/sorting field; shared Wild Bath mechanics |
| Net/timber-lamella screens | REST + PREM | Fixed facade/terrace edge; shelter and recovery anchors |
| Coastal-grass planter fields | PREM + REST | Existing ramp/wall anchors; grass/planter overlays and recovery atmosphere |

### Country Estate with Barn

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Restored arrival gate and sign | ARR | Gate-to-house route |
| Main-house reception/shop | SHOP | Foyer/salon purchase stop |
| First barn bay sauna | CAP | Existing-barn activation and steam |
| Second barn bay sauna | CAP | Existing-barn activation and steam |
| Barn bay large Aufguss hall | GUS | Hall entry, program steam, optional queue |
| Glass orangery | PREM | Attached glass volume with seating |
| Restored veranda | REST | House-side seated anchors |
| Barn loft recovery gallery | REST | Visible barn stair/loft transition |
| Fixed outdoor shower | SHWR | Property shower route |
| Larger built cold plunge | COLD | Larger basin where natural water is absent |
| Open barn port as covered recovery field | REST | Existing barn-port field; benches, warm light, steam and guest anchors |
| Historic sun balcony | PREM + REST | Existing main-house gable and external-stair field; viewing/recovery anchors |
| Small outdoor Aufguss yard at barn port | GUS | Existing barn-port exterior field; social program anchors and timed steam |
| Limestone water wall with multiple outdoor showers | SHWR | Existing barn/stable wall; multiple rinse anchors and water-flow effects |
| Country Estate warm spa pool variant | WARM | Requires compatible location-owned garden/terrace field; historic stone pool, seated anchors and steam |

### Former Kursted / Badesanatorium

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Restored main entrance/historic sign | ARR | Main entry anchor |
| Foyer or salon reception/kurshop | SHOP | Indoor UI represented by visible entrance purchase stop |
| First old bath wing sauna area | CAP | Existing wing activation and steam |
| Second old bath wing sauna area | CAP | Existing wing activation and steam |
| Historic hall as large Aufguss hall | GUS | Hall entry, timed steam, optional queue |
| Orangery or winter garden | PREM | Glass garden seating anchors |
| Restored terrace/veranda | REST | Outdoor seated anchors |
| Upper lounge/roof belvedere | REST | Visible vertical route and viewing anchors |
| Fixed outdoor shower | SHWR | Property shower route |
| Larger built cold plunge | COLD | Larger basin where natural water is absent |
| Restored sun balcony on bath wing | PREM + REST | Existing wing/external-stair field; viewing/recovery anchors |
| Bathing colonnade with multiple outdoor showers | SHWR | Existing facade field; repeated rinse anchors and water-flow effects |
| Open Kur terrace at historic hall | REST | Existing historic-hall exterior field; arrival/pause anchors for program guests |
| Kursted warm spa-pool variant | WARM | Requires compatible location-owned garden/terrace field; stone basin, seated anchors and steam |
| Glowing glass passage between existing wings | ARR + PREM | Existing wing-to-wing connection field; visible route and evening glow |
| Sheltered outdoor ritual court by side wing | GUS + PREM | Existing side-wing exterior field; quiet program anchors and timed steam |

## Location and Outdoor Variants

Location-owned objects follow the same rule: they are individual production assets even when they reuse a functional card. The fully locked `Urban Lot`, `Hotel Rooftop` and `Forest Lake` lists are listed here; remaining location sets need the same approval pass before they become production scope.

### Forest Lake

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Arrival path and discreet lighting | ARR + LIGHT | Forest entry path and evening points |
| Forest terrace | REST | Building-edge seating anchors |
| Lake deck | REST | Shore deck seating/activity anchors |
| Lake bathing bridge | COLD | Water entry/swim/exit route |
| Lake shower | SHWR | Rinse loop before/after lake use |
| Floating rest platform | REST | Water platform sit/stand anchors |
| Cooling path | COLD | Route patch between sauna/shower/lake |
| Forest clearing/fire circle | REST | Bench and fire-side anchors |
| Covered lakeside shelter | REST | Covered seating anchors |
| Outdoor program space | GUS | Program point and timed steam |

### Urban Lot

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Arrival gate/street sign | ARR | Street-to-plot route |
| Paved internal paths | ARR | Walkable owned-plot patches |
| Overhead/perimeter lighting | LIGHT | Evening light anchors |
| Potted greenery and palms | DECOR | Identity overlay |
| Compact timber social deck | REST | Seating/standing anchors |
| Covered recovery pergola | REST | Covered recovery anchors |
| Urban shower | SHWR | Rinse loop and water effect |
| Compact built cold plunge | COLD | Plunge loop and splash anchors |
| Outdoor program deck | GUS | Program point and timed steam |
| Boundary wall/mural | DECOR | Plot boundary identity overlay |

### Hotel Rooftop

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Lift/service-core arrival | ARR | Required visible vertical arrival route |
| Roof walkways/level changes | ARR | Walkable roof patches and safe transition |
| Safety rails/wind screens | REST | Screens plus sheltered seating anchors |
| Skyline viewing deck | REST | View-side seating anchors |
| Rooftop shower | SHWR | Rinse loop and water effect |
| Rooftop cold plunge | COLD | Plunge loop and splash anchors |
| Recovery pergola | REST | Covered seating anchors |
| Planters | DECOR | Roof identity overlay |
| Evening lighting | LIGHT | Evening light anchors |
| Outdoor rooftop program deck | GUS | Program point and timed steam |

### Canal Location

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Narrow canal terrace | REST | Authored quay field; seated/standing recovery anchors |
| Canal shower/cooling point | SHWR | Separate quay/terrace field; rinse loop and water effects |
| Canal bathing bridge | COLD | Full descent, entry, swim/idle, exit and winter state where appropriate |
| Small canal descent with broad sitting edges | COLD + REST | Independent water-entry field; steps, sit, swim/idle and exit anchors |
| Low quay-light line | LIGHT | Existing promenade edge; evening wayfinding and canal reflection effects |
| Canal planting beds | PREM + REST | Existing quay-edge fields; grasses/plants without obstructing the quay |

### Harbour Location

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Quay terrace | REST | Authored quay field; durable seated/standing recovery anchors |
| Quay Aufguss stage with wind screens | GUS | Separate quay program field; guest anchors, screens and timed steam |
| Harbour steps | COLD | Eligible bathing-basin field; descent, entry, swim/idle and exit anchors |
| Harbour shower row | SHWR | Defined quay shower fields; repeated rinse anchors and water effects |
| Low quay lantern line | LIGHT | Existing promenade/quay edge; evening wayfinding and water reflections |
| Salt-tolerant planting fields | PREM + REST | Existing quay-edge fields; planters with grasses/small pines |
| Bounded harbour dip zone | COLD | Separate safe water field; float boundary, steps/ladder, swim/idle and exit anchors |

### Industrial District Location

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Industrial arrival court | ARR | Separate gate/sign/walkway field; complete street-to-venue route |
| Large shared program yard | GUS | Authored open-yard field; large program anchors, timed steam and guest capacity |
| Steel-canopy shower row | SHWR | Separate repeated shower fields; rinse anchors and falling-water effects |
| Long constructed cold basin | COLD | Separate concrete/steel yard field; multiple entry/exit anchors and water effects |
| Sunken industrial-yard warm spa pool | WARM | Large authored yard field only; seated anchors, steam, bubbles and splash |
| Long recovery canopy | REST | Separate yard field; wind-screened benches and recovery anchors |
| Industrial greenery fields | PREM + REST | Existing walls/yard edges; climbers, grasses/planters and recovery atmosphere |
| Low industrial evening-light line | LIGHT | Existing walkways/gate/basin edges; warm orientation and reflection effects |
| Open-port social field | REST + SOCIAL | Existing port field; tables, seated/standing anchors and evening activity |

### Forest Lake Location

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Forest ritual path | ARR + REST | Separate stepping-stone/low-light field; never required for water access |
| Forest terrace | REST | Building/forest-edge field; seated recovery anchors |
| Lake deck | REST | Authored shore field; seated/standing activity anchors |
| Lake bathing bridge | COLD | Complete water route with entry, swim/idle, exit and winter state |
| Lake shower | SHWR | Separate shore field; rinse loop and water effects |
| Floating rest platform | REST | Authored water platform, sit/stand anchors and safe access route |
| Forest clearing/fire circle | REST | Fixed clearing field; fire, bench and evening anchors |
| Covered lakeside shelter | REST | Fixed shore field; covered recovery anchors |
| Outdoor program space by lake | GUS | Separate shore/clearing field; program anchors and timed steam |
| Rock-edged warm spa pool | WARM | Large clearing field only; seated anchors, steam, bubbles and splash |
| Forest shower row under timber eave | SHWR | Existing eave/shower fields; repeated rinse anchors and effects |
| Quiet stone/bench circle at water | REST | Fixed shore field; quiet seated/viewing anchors with no fire |
| Dark timber view frame/shelter | PREM + REST | Existing sitting field; filtered view, shelter and seated anchors |

### Coast Location

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Evening coast path | ARR + LIGHT | Separate path/light/sitting field; never required for facility access |
| Outlook deck | PREM + REST | Authored view field; seated/standing anchors |
| Protected coastal terrace | REST | Fixed terrace field; sheltered recovery anchors |
| Sea steps in sheltered cove | COLD | Calm-cove field only; descent, entry, swim/idle and exit anchors |
| Coastal shower row | SHWR | Separate low-roof shower fields; rinse anchors and water effects |
| Wind/changing shelter | ARR + REST | Fixed shore field; change transition and sheltered anchors |
| Cliff/rock sitting niche | REST | Fixed rock field; quiet seated/viewing anchors |
| Outdoor program deck behind wind screens | GUS | Separate protected program field; timed steam and guest anchors |
| Low coastal lantern line | LIGHT | Existing terrace/path edge; warm evening orientation |
| Rock/stone-integrated warm spa pool | WARM | Fixed sheltered terrace field; seated anchors, steam, bubbles and splash |
| Stone/timber wind wall | REST + PREM | Existing sitting field; shelter without blocking outlook |
| Coastal planting fields | PREM + REST | Existing edge fields; marram grass/low pines and recovery atmosphere |
| Natural spring/stream-mouth cooling point | COLD | Rare authored coast-geography field only; entry/rinse/idle/exit anchors and water effects |

### Beach Location

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Evening boardwalk | ARR + LIGHT | Separate boardwalk/light/sitting field; never required for facility access |
| Beach deck | REST | Authored sand/deck field; seated/standing recovery anchors |
| Water bridge | COLD | Complete shore-to-water route; entry, swim/idle and exit anchors |
| Beach shower row | SHWR | Separate timber-eave shower fields; repeated rinse anchors and effects |
| Changing/wind shelter | ARR + REST | Fixed beach field; change transition and sheltered seating anchors |
| Sun/recovery zone | REST | Existing beach field; recovery activity anchors |
| Dune sitting niches | REST | Fixed dune-edge fields; quiet seated/viewing anchors |
| Outdoor program deck | GUS | Separate beach program field; guest anchors and timed steam |
| Floating platform | REST + COLD | Calm-cove field only; short fixed access, safe anchors and water effects |
| Evening beach lights | LIGHT | Existing deck/path edge; warm evening orientation |
| Freestanding beach warm spa pool | WARM | Fixed sheltered beach field; seats, steam, bubbles and splash |
| Timber-screen recovery yard | REST | Fixed beach field; sheltered seating anchors |
| Beach fire circle | REST | Separate safe sand field; fire, log seating and evening anchors |
| Dune planting fields | PREM + REST | Existing dune-edge fields; grass overlays without blocking access |
| Beach lounge chairs | REST | Existing sun/recovery field; lying/sitting anchors |
| Small water refill station | ARR + REST | Existing recovery/arrival field; brief refill activity, no inventory or direct revenue |

### Rural Plot Location

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Nature/ritual path | ARR + REST | Separate stepping-stone/light/sitting field; never required for facility access |
| Meadow terrace | REST | Fixed meadow-edge field; seated/standing recovery anchors |
| Living windbreak planting | PREM + REST | Existing edge fields; planting/shelter without concealing routes |
| Rural shower fields/long shower row | SHWR | Separate timber-eave fields; repeated rinse anchors and effects |
| Constructed cold plunge | COLD | Fixed yard/garden field; entry/exit anchors and water effects |
| Outdoor program field | GUS | Separate yard/field-edge field; program anchors and timed steam |
| Fire circle | REST | Fixed safe field; fire, log seating and evening anchors |
| Covered outdoor recovery area | REST | Fixed field; sheltered seating anchors |
| Sunken warm spa pool | WARM | Fixed garden/terrace field; seated anchors, steam, bubbles and splash |
| Orchard recovery zone | REST + PREM | Existing orchard field; bench/lounge anchors beneath fruit trees |
| Barn/field-edge program yard | GUS | Separate authored field; group program anchors and timed steam |
| Spring/cold-water pocket | COLD | Rare base-geography field only; entry/rinse/idle/exit anchors and water effects |
| Rural planting fields | PREM + REST | Existing edges; fruit trees/grasses/wildflowers without blocking routes |

### Water Plot Location

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Floating recovery pontoon | REST | Separate authored water field; seated anchors and safe access route |
| Floating warm spa pool | WARM | Own pontoon field; seated water anchors, steam, bubbles and splash |
| Bounded swim room/floating net | COLD + REST | Calm-water field; buoy/net boundary, multiple swim/idle anchors and returns |
| Sun/recovery deck at shore landing | REST | Existing shore-landing field; chairs/benches and recovery anchors |
| Small shore changing cabin | ARR | Existing shore-landing field; hidden changing transition and clear approach/exit anchors |
| Shore shower at gangway root | SHWR | Existing gangway-root field; rinse loop and water effects |
| Floating fire bowl with sitting edges | REST | Separate pontoon field; contained fire, seating and evening anchors |
| Outdoor Aufguss platform on pontoon | GUS | Separate pontoon field; larger group program anchors and timed steam |

### Urban Lot Location

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Urban evening light layer | LIGHT | Existing wall/deck/walkway fields; warm low-light orientation |
| Potted urban greenery | PREM + REST | Existing owned-plot fields; palms/planters and recovery atmosphere |
| Compact timber social deck | REST | Fixed yard field; seated/standing anchors |
| Low urban canopy with long benches | REST | Replaces generic pergola on fixed field; sheltered seating anchors |
| Urban shower | SHWR | Separate owned-plot field; rinse loop and water effects |
| Compact built cold plunge | COLD | Fixed yard field; entry/exit anchors and water effects |
| Outdoor program deck | GUS | Separate owned-plot field; program anchors and timed steam |
| Boundary wall/mural | PREM | Owned wall field; visual identity without hidden income |
| Steel-and-brick fire courtyard | REST | Separate owned yard field; contained fire, seating and evening anchors |
| Urban wild-bath alcove | WARM | Separate screened field; seated anchors, steam, bubbles and splash |
| Water refill station with benches | ARR + REST | Existing program-deck field; brief refill and recovery anchors |
| Street-facing sitting window | ARR + REST | Owned wall/gate field; arrival/waiting anchors inside player boundary |

### Hotel Rooftop Location

| Concrete variant | Card | Visual/route requirement |
| --- | --- | --- |
| Skyline viewing deck | PREM + REST | Separate authored roof field; view seating/standing anchors |
| Rooftop shower/rain-shower row | SHWR | Separate screened roof fields; repeated rinse anchors and water effects |
| Rooftop cold plunge | COLD | Fixed roof field; entry/exit anchors and water effects |
| Warm rooftop spa | WARM | Fixed contained roof field; seated anchors, steam, bubbles and splash |
| Low exclusive wind canopy | REST + PREM | Replaces generic pergola on fixed roof field; sheltered seating/bronze-timber layer |
| Extra wind screens | REST | Separate roof fields; sheltered niche anchors |
| Planted roof corners | PREM + REST | Existing roof-edge fields; planters and recovery atmosphere |
| Evening roof lighting | LIGHT | Existing walkway/deck edges; controlled warm evening orientation |
| Outdoor rooftop program deck | GUS | Separate roof field; program anchors and timed steam |
| Skyline lounge chairs/parasols | REST + PREM | Separate roof field; small number of reclined/sitting anchors and parasol shade |
| Gas fire bowl with stone seating | REST | Separate fire-safe roof field; contained fire, seating and evening anchors |
| Water refill station at lift core | ARR + REST | Existing lift-core field; brief refill/recovery anchors and robe/towel detail |

## Shared Location Facilities

| Concrete variant | Card | Compatible setting | Required visual/route requirement |
| --- | --- | --- | --- |
| Natural-water bathing bridge | COLD | Canal, eligible Harbour, Forest Lake, Coast, Beach | Descent, water entry, swim/idle, exit, winter state where relevant |
| Wild bath/quay spa | WARM | Tent, container, cabin, pavilion, boathouse, compact waterfront/rural | 4-8 seated anchors, steam, bubbles and splash |
| Sunken spa pool | WARM | Estate, kursted, Forest Lake, Coast, Beach, large Industrial | 6-12 seated anchors, steam, bubbles and evening state |
| Rooftop spa | WARM | Hotel Rooftop only | Contained roof basin and safe access route |
| Floating spa pool | WARM | Water Plot recovery pontoon only | Pontoon route and water-safe seated anchors |
| Outdoor changing pod/tent | ARR | Water/shore routes as needed | Hidden change transition with setting-specific material |
| Slatted wind/privacy screens | REST | Coast, Beach, Hotel Rooftop, Urban Lot | Sheltered seating/niche anchors |
| Floating recovery pontoon | REST | Water Plot only | Pier/pontoon route, seats and water-entry anchor |

## Gaps That Must Be Resolved Before Production

These are deliberately **not invented** in this register. Their location-owned module lists still need to be cleaned into the ownership rule before becoming production scope:

1. Canal
2. Harbour
3. Industrial District
4. Coast
5. Beach
6. Rural Plot

After those two passes, every candidate asset will have a direct functional, economic, animation and art-production contract.
