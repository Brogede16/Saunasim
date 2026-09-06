# Sauna Sim Scene Effects Inventory v0.1

## Purpose

This document records the independent scene behaviour required by every locked location, building family and upgrade family. It complements `character-animation-contract-v0.1.md`: character actions explain what people do; this inventory explains what the world itself does.

## Effect Rule

Every approved asset must have one visible scene consequence, chosen deliberately from:

1. **Static transformation:** an altered facade, volume, path, screen or object that needs no loop.
2. **Shared ambient loop:** a quiet 3-6-frame world loop such as water, smoke, wind, light or foliage.
3. **Triggered activity effect:** an effect that only appears during real use, such as steam, splash, shower water, bubbles, door/hatch movement or fire interaction.

An asset does not require a unique animation merely because it is unique art. It inherits the correct shared loop/effect family and exposes its own anchors. This is the only viable way to keep every upgrade visible without producing hundreds of unrelated animations.

## Shared Effect Library

| ID | Effect | Used by |
| --- | --- | --- |
| `water-calm` | Small ripples/reflection drift | Canal, harbour basin, forest lake, calm coast/beach cove and Water Plot. |
| `water-wave` | Slight directional wave/foam loop | Coast and beach only. |
| `water-entry` | Entry splash plus expanding ripple | All natural-water and pool entries. |
| `steam-chimney` | Low chimney/roof steam plume | Operational sauna buildings. |
| `steam-program` | Timed dense Gus steam, intensity and aroma accent variants | Program Sauna and enclosed Outdoor Gus Saunas. |
| `shower-water` | Falling water, floor splash and short runoff | Outdoor showers and rain-shower rows. |
| `shower-cascade` | Brief heavy bucket-tip water sheet and stronger splash | Cold Cascade Bucket only; triggered, never ambient. |
| `cold-surface` | Cold-basin surface/rim effect | Plunges and cold-water basins. |
| `spa-steam-bubble` | Warm steam, bubbles and water-surface movement | Wild bath and all warm-spa variants. |
| `fire-flicker` | Low contained flame and ember loop | Approved fire bowls/circles only. |
| `light-warm` | Window, sign, path or lamp glow | Evening-capable arrival, shop and recovery assets. |
| `foliage-wind` | Small grass, leaf, reed, canvas or screen movement | Nature, coast, beach, rural and tent contexts. |
| `door-hatch` | Brief door, counter hatch or changing-pod threshold state | Building entrance, shop/service hatch and changing pods. |
| `construction-work` | Temporary screen/material/steam/dust with countdown | Any field while its project is active. |
| `repair-work` | Tool spark/pipe drip/panel cue during actual technician repair | Eligible technical assets only. |

## Location Base Effects

| Location | Persistent ambient effects | Triggered effects required by its approved fields |
| --- | --- | --- |
| Canal | `water-calm`, canal-wall reflection, occasional reed/edge movement, evening `light-warm` | Canal descent/bridge `water-entry`; canal shower `shower-water`; quay/fire/spa effects where built. |
| Harbour | Basin ripple/reflection, rope/flag movement, quay lamps | Eligible basin steps `water-entry`; shower row; outdoor Gus steam; floating raft water response. |
| Industrial District | Restrained vent/chimney steam, gate/lamp glow, planter movement | Program-yard steam; shower; cold/warm basin; fire; repair effects on technical yard assets. No natural-water loop. |
| Forest Lake | `water-calm`, leaf/reed movement, distant soft mist only where appropriate | Lake bridge/entry, lake shower, floating rest platform water response, fire circle, outdoor Gus steam, spa steam. |
| Coast | `water-wave`, wind in grass/screens, low coastal light | Sheltered-cove entry only, shower, spa, outdoor Gus and fire effects. Never open-sea swim animation. |
| Beach | Gentle `water-wave`, dune-grass/umbrella movement, warm evening light | Calm-cove/bridge entry, shower, spa, fire, lounge use and floating-platform water response. |
| Rural Plot | Grass/branch movement, farmyard chimney smoke, evening path light | Shower, cold/warm basin, field-edge Gus steam, fire, orchard/rest activity. |
| Water Plot | `water-calm`, pontoon bob/rope movement, reflected deck light | Mandatory deck entry/splash, bounded swim, ladder return, floating spa, fire pontoon and outdoor Gus platform effects. |
| Urban Lot | Restrained street/light ambience, canvas/screen movement, planter leaves | Shower, cold/warm basin, urban Gus steam, fire and refill actions strictly inside owned plot. |
| Hotel Rooftop | Wind in screens/planting, city glow, controlled roof steam | Lift/door threshold, shower, cold/warm roof basin, roof Gus steam and fire. No external climbing animation. |

## Building Base Effects

| Building family | Base behaviour | Building-owned module behaviour |
| --- | --- | --- |
| Floating Sauna | Chimney steam, hull/pontoon bob and water reflection | Panorama windows glow; deck extension bob; ladder/entry splash; attached pod door/hatch; second sauna pod has its own chimney steam. |
| Rooftop Sauna | Chimney steam, roof-screen wind and warm window glow | Roof-edge deck/changing volume door states; water/spa modules use shared basin effects; sign/lift portal use warm glow. |
| Saunatelt Camp | Canvas flutter, restrained tent-chimney steam and lantern glow | Added tents use shared canvas/steam; outdoor lounges/fire use shared effects; changing canvas uses pod transition. |
| Container Compound | Chimney/roof-vent steam, small security/entry light | Timber cladding is static transformation; added containers expose separate chimney/door/steam anchors; yard program uses timed steam. |
| Small Timber Cabin | Chimney steam, window glow and subtle eave/foliage movement | Porch/terrace door state, attached sauna volume chimney, shower/spa/fire shared effects. |
| Pavilion | Broad-window light reflection, roof steam and light wind at open edges | Glass facade is static/light response; deck/wing modules add door/chimney anchors; program field uses timed steam. |
| Boathouse | Water lapping/reflection at base, chimney steam, timber-door state | Loading-door/shop hatch, water-facing deck, bath access and attached volume use shared door/water/steam families. |
| Repair Workshop | Chimney steam, loading-door state and practical exterior light | Renovated facade is static; shop hatch, program yard, shower, plunge and wild bath use shared effects. |
| Small Depot | Vent/chimney steam, compact yard light and door state | Service/window/yard modules use the same shared shop, steam, shower and basin effects. |
| Warehouse | Tall roof-vent steam, loading-door state and broad window light | Hall/program volume has stronger chimney/program steam; yard facilities reuse shared effects. |
| Fiskehus | Chimney steam, weathered facade light and sheltered-water reflection where applicable | Sorting-yard/hatch, spa, showers and waterfront rests use shared effects. |
| Country Estate with Barn | House/barn chimney steam, tree/grass movement and warm windows | Courtyard/estate program, garden spa, fire and barn-door states reuse shared systems. |
| Former Kursted/Badesanatorium | Measured chimney steam, historic window glow and garden foliage movement | Terrace, program hall, spa and entrance additions use shared light, steam and water effects; no bespoke fountain system unless separately approved. |

## Upgrade-Family Effects

Every concrete row in `asset-registry-v0.1.md` belongs to one of these approved families and inherits the listed effect package plus its own anchor.

| Upgrade family | Required scene behaviour |
| --- | --- |
| Arrival sign, gate, path or entrance renovation | Static transform plus optional evening `light-warm`; `arrival-read-sign`/door transition where guest-facing. |
| Reception shop, service hatch or shop window | Static counter/interior detail plus `door-hatch` during Host/guest transaction and warm evening light. |
| Changing wing, pod or service volume | Static volume; doorway/pod transition only when used. No fake constant animation. |
| Extra sauna room, sauna pod, hall or roof volume | Static silhouette change plus separate `steam-chimney` and door anchor. |
| Program Sauna or Outdoor Gus Sauna | Timed `steam-program`, optional low light cue, guest program wait/reaction and outdoor Master approach/entry sequence when applicable. |
| Terrace, deck, shelter, wind wall, benches or rest platform | Static transform plus seating/recline anchors; location-appropriate water/wind ambience. |
| Lounge chairs | Static chair set plus `lounge-recline-rise`; no separate environmental loop required. |
| Outdoor shower or shower row | `shower-water` only during use, with a dedicated rinse anchor per visible bay. A Cold Cascade Bucket additionally needs one `cascade-rinse` guest action and `shower-cascade` trigger. |
| Cold plunge, roof plunge, basin or water wall | `cold-surface` persistent loop and entry/exit splash on use; technical repair cue where eligible. |
| Bridge, bathing steps, descent or floating deck entry | Location water loop plus route-specific `water-entry`, activity and exit/ladder anchors. |
| Warm wild bath, sunken spa, rooftop spa or floating spa | `spa-steam-bubble`, entry/exit splash and seated water anchors; technical repair cue where eligible. |
| Fire bowl/circle | `fire-flicker` when opened/operating; seated fire-rest anchors. |
| Planting, greenery, orchard, dune grass or planters | Static planting plus `foliage-wind`; never technician-repaired. |
| Glass front, panorama port, privacy screen or timber cladding | Static material transformation, reflected light/window glow or subtle wind where physically appropriate. |
| Quay/roof/forest/urban evening lights | `light-warm` after dusk; no direct character action unless it is an arrival/service point. |
| Water refill station | Static station plus guest refill action; a Host water-service action only where that role is actually scheduled. |
| Construction state | Replaces only its own field with `construction-work`; on completion, immediately reveals its family effect package. |

## Towel Return and Service Loop

Towels create a small, readable service activity without turning guests into littering stereotypes.

1. A visit has an `equipment mode`: own towel, venue-rented towel, purchased towel or no towel-required path. It is chosen from visit context, shop use, recovery plan and convenience preference, never from age, gender, body, ethnicity, name or appearance.
2. Venue towels normally go to an authored return basket near changing, recovery or exit fields. This is the normal `towel-return` outcome and does not create a messy scene.
3. A small, capped number of context-driven visits may leave a used venue towel at a compatible bench, lounge chair or spa-side hook after a long, rushed or social lingering visit. This represents an unfinished service task, not a negative personality trait.
4. A scheduled Service Host can collect/fold the visible towel prop using `staff-host-towel-collect`. Without a Host, the prop stays only briefly and the venue's service/cleanliness presentation can become slightly strained if several authored anchors are occupied.
5. Guests who bring their own towel do not generate a return task. Bought retail towels do not become venue laundry.
6. The system never scatters towels across paths, water, fire fields or arbitrary ground. Each recovery field has at most its authored towel-prop capacity.

## Inclusive Guest Appearance and Behaviour Contract

- A guest's appearance is assembled from independent body silhouette, skin palette, hair, face, towel/swim/robe palette and accessory choices. These are visual variation only.
- The generator does not use gender, ethnicity, skin tone, hair, body shape, name, age or disability-coded appearance as an input to price comfort, taste, queue tolerance, spending, cleanliness, staff response or any hidden mechanical value.
- Several guests are non-binary as an ordinary part of the population. The game does not label, announce or mechanically distinguish them. The profile card shows name, age, current activity and preferences, not a gender field.
- Body silhouettes are designed as varied people, not as male/female gameplay classes. Clothing, hair, colours, towels and animation sets are not locked to a gender category.
- Names are internationally plausible and do not dictate behaviour. Cultural references in program/guest text require an approved, respectful content review rather than random name-to-trait matching.
- Accessibility-related visual variation is welcome when the route and animation can represent it respectfully; it must never be used as a penalty, gimmick or shorthand for a guest preference.

## Per-Scene Production Gate

Each produced scene file must list, for every built field:

- static state and effect IDs;
- ambient and triggered effect anchors;
- guest/staff action IDs and prop capacity;
- water/roof/depth-layer variant where applicable;
- towel-return anchors where the field supports venue towels.

No visual asset is final until this mapping is complete.
