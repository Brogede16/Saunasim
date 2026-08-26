# Sauna Sim Location Scene Layouts v0.1

## Rule

Each location is one large, zoomable exterior scene with a base route, a building parcel and fixed independent upgrade fields. Its exact upgrades and effects remain in the asset register; this document decides where they physically belong.

## Canonical Layouts

| Location | Base route | Building/plot arrangement | Location field arrangement |
| --- | --- | --- | --- |
| Canal | Street -> parcel -> promenade -> canal edge -> return | Two shared-background parcels: Workshop and Boathouse | Separate terrace, shower, bridge, canal descent, lights and planting bays along the quay |
| Harbour | Arrival road -> quay parcel -> promenade -> eligible basin -> return | Boathouse, Warehouse, Fiskehus or Container on a fixed harbour parcel | Quay terrace/stage/shower bays; water fields only on calm eligible basin variants |
| Industrial District | Street gate -> building yard -> service loop -> return | One broad industrial parcel with building-specific ports/yards | Arrival court, program yard, shower canopy, cold/warm basin, recovery canopy, port social and green-wall fields |
| Forest Lake | Forest arrival -> building clearing -> shore path -> lake route -> return | Building sits at the clearing edge, never in the water | Separate terrace, deck, bridge, shower, shelter, fire clearing, program clearing, spa and shore-rest fields |
| Coast | Coastal arrival -> building terrace -> sheltered cove route -> return | Building set back from exposed edge with fixed view side | Outlook/terrace fields behind protection; sea steps only in cove; spa, shower, program, planting and wind-wall fields |
| Beach | Boardwalk -> building parcel -> sand deck -> calm-cove water route -> return | Building behind the dune/within a defined sand parcel | Deck, bridge, shower, wind/changing, sun/recovery, fire, spa, lounge and refill fields; platform only in calm cove |
| Rural Plot | Gate -> building/property yard -> meadow/garden loops -> return | Tent/container/estate use their own authored compound footprint | Meadow, windbreak, shower, cold, spa, orchard, fire, covered recovery and field-edge program fields |
| Water Plot | Shore landing -> fixed gangway -> floating sauna -> deck jump/swim/ladder -> return | Floating Sauna is the only building and sits at the fixed gangway end | Pontoon network with independent recovery, spa, swim net, fire and program fields; shore deck/changing/shower fields |
| Urban Lot | Street gate -> owned plot loop -> building entrance -> return | Tent or Container stays entirely inside a bounded city plot | Deck, canopy, shower, cold, program, fire, warm bath, refill and wall/window fields inside owned boundary |
| Hotel Rooftop | Visible lift/stair core -> roof walkway loop -> building -> return | Rooftop Sauna sits beside core on defined structural fields | Viewing, shower, cold, spa, canopy, screens, program, lounge, fire and refill fields on separate safe roof pads |

## Field Rules Applied Everywhere

1. Base routes, railings, required stairs, shore geometry and structural safety exist before any purchase.
2. Every purchasable field has a neutral base appearance and a complete purchased appearance.
3. Location water fields and building facade/room fields never overlap.
4. Water entry includes approach, entry, activity, exit and return anchors.
5. Roof/loft/stair use includes a visible transition before the guest appears at the upper activity field.
6. Scenes reserve their maximum approved fields at the base-layout stage, even when the player never buys them all.

## Production Consequence

Artists produce one base map per layout, then building layers, independent field modules and effects. Programmers receive the same map with walk patches, blocked patches, route anchors, activity anchors and effect anchors. No later asset is allowed to require repainting the base geography.
