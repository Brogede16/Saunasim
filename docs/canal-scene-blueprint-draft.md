# Canal Scene Blueprint - Draft

## Purpose

This is the approved Canal layout model, not final art. It proves how one large, zoomable Canal setting supports different compatible buildings and every approved location upgrade without requiring a purchase order.

## The Key Decision

Canal uses one shared waterfront background family with **two authored plot layouts**:

1. **Workshop Parcel:** a slightly wider street-side former repair workshop with its own visible yard/port fields.
2. **Boathouse Parcel:** a water-close former boathouse with a fixed quay immediately outside it.

They reuse the canal water, promenade, street edge, trees, stonework, lights and distant city background. They do not force a boathouse into a workshop footprint or invent a quay where none exists.

## Shared Scene Bands

From left to right, the camera sees:

1. **Street/arrival band:** static city edge, sidewalk, street arrival point and gate/door route.
2. **Building parcel band:** one selected building layer plus its building-owned fields.
3. **Promenade band:** a complete, walkable base path behind/along the parcel. It exists at the beginning.
4. **Canal edge band:** fixed stone edge, water, light/reflection anchors and location-owned water fields.
5. **Water/context band:** canal surface, opposite bank and sparse ambient city detail.

The player can zoom from a whole-place view that shows the route to a close view that shows water entry, sitting, shower and program activity.

## Fixed Base Route

The base route is present before any upgrade:

`street arrival -> building entrance -> promenade -> every empty location field -> return route`

Empty fields look complete as paving, planted edge, stone quay or small retained utility area. An upgrade changes only its field; it does not create the only path to another upgrade.

## Location-Owned Fields

| Field | Base appearance before purchase | Purchased state | Required guest activity |
| --- | --- | --- | --- |
| Canal terrace | Stone/paved quay pocket | Timber/stone seating terrace | Sit, stand, towel/idle |
| Shower point | Paved service recess | Canal shower/cooling point | Rinse, continue |
| Bathing bridge | Retained stone quay edge | Bridge/stairs to canal | Descend, enter, swim, exit |
| Canal descent | Separate unused quay bay | Broad sitting steps | Sit, enter, swim, exit |
| Quay lights | Standard ambient lamps | Low warm edge-light line | Evening light/reflection |
| Planting beds | Narrow soil/stone edge | Grasses/planting | Ambient only; never blocks route |

The bridge and descent are separate complete water routes. Neither needs the other.

## Building-Owned Fields

### Workshop Parcel

- Original port/entrance
- Shop field
- Side sauna field
- Program sauna field
- Glass-door field
- Glass-dome field
- Workshop courtyard Aufguss field
- Port recovery field
- Copper-shower field
- Cold-plunge field
- Wild-bath field
- Water-wall field
- Greenery fields

### Boathouse Parcel

- Restored entrance
- Shop window
- Land-side sauna field
- Program sauna field
- Water glass-port field
- Lamella/cooling-front field
- Shower field
- Cold-plunge field
- Quay Aufguss field
- Quay wild-bath field
- Sliding-lamella field
- Drying-area field

Each building layer owns only the fields in its own parcel. The Canal fields remain identical in both layouts.

## Visual States

Every purchased field must add one or more of:

- visible architecture/material change
- reachable activity anchors
- timed steam/water/light/fire effect

This gives a full venue visible life without showing interiors.

## Current Prototype Selection Bridge

The player can tap any built Canal upgrade in the overview scene. The selected field receives a restrained warm outline, and Overview states its exact English name plus its current short effect with a direct `View in Venue` action. This uses the temporary renderer field map only; final pixel assets must retain the same authored bounds or update the scene contract and selection map together. A guest remains individually inspectable; selection is an explanation layer, not a replacement for guest tapping.

## Production Checks

The two-parcel model is selected as the practical Canal solution. During art/layout production, validate promenade width, ownership readability and the mobile camera framing; these are execution checks, not new design decisions.
