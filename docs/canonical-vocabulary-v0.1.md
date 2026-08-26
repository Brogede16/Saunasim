# Canonical Vocabulary v0.1

## Purpose

This file is the type and tag bridge between design documents, save data and simulation code. A later content compiler should validate against this vocabulary rather than maintain parallel strings.

## Locked Program Types

| Type | Canonical values | Current prototype |
| --- | --- | --- |
| Intent | `Classic Ritual`, `Quiet Recovery`, `Social Energy`, `Show Journey` | Complete |
| Heat | `Gentle Build`, `Steady Heat`, `Progressive Rounds`, `Rhythmic Pulses`, `High-Heat Finale` | Complete |
| Format | `Short`, `Standard`, `Long` | Complete |
| Performance | `Classic Towelwork`, `Quiet Ritual`, `Rhythmic Flow`, `Choreographed Show`, `Story-led Performance` | Complete |
| Aroma rounds | Ordered 1-3 rounds, one material + one delivery form each | Complete structure |
| Material class | `Everyday`, `Craft`, `Premium`, `Event` | Complete 30-material list |
| Recovery finish | `No Added Finish`, `Cold Plunge`, `Natural Water Dip`, `Outdoor Shower`, `Rest Deck`, `Refreshment Finish` | Complete vocabulary; Canal currently supports No Added Finish, Cold Plunge, Outdoor Shower and Refreshment Finish only |
| Delivery | `Water Pour`, `Scented Ice Round`, `Herbal Infusion`, `Fresh Birch Vihta`, `Rain Pour`, `Botanical Water`, `Fresh Vihta: Maple`, `Fresh Vihta: Juniper` | First 6 only; Vihta variants deferred |
| Music | Ten approved profiles in `aufguss-combination-model-v0.1.md` | Complete vocabulary |

## Rating Vocabulary

- `Composition Tier`: `Unproven`, `Bad`, `Normal`, `Rare`, `Iconic`, `Ultimate`.
- `Execution Tier`: `Bad`, `Normal`, `Rare`, `Iconic` only.
- `Venue Fit`: `Bad`, `Normal`, `Rare`, `Iconic` only.
- `Overall Stars`: 1-5 only. `Ultimate` never produces a sixth star.

## Capacity Vocabulary

- `specialCapacity`: physical places the scheduled Gus can offer.
- `specialSeats`: actual participating guests.
- `specialOccupancy`: `specialSeats / specialCapacity`, rounded for display.
- `program lane`: one room or field a Master can operate. One Master does not create parallel lanes.
- `Bench Refit`: controlled invisible exception; adds `+3` seats inside the current sauna, never a lane or room.

## Validation Rules

1. Player-facing text and save data use these exact English values.
2. An unimplemented canonical value may appear greyed out with its physical requirement, but may not be silently renamed or replaced.
3. A program edit resets only `Composition Tier` to `Unproven`; execution and venue fit are session/venue results, not saved composition fields.
4. `Event` is a material cost/content class, never a quality tier. At most one Event material appears in a program.
5. All visible assets require the asset card's compatibility, capacity, route, economy and visual package. `Bench Refit` is the sole approved invisible exception in the first slice.

## Known Implementation Gaps

The vocabulary exposes, rather than hides, remaining work: physical Natural Water Dip and Rest Deck facilities, two Vihta variants, Event-material validation, per-session execution/venue tiers and content-driven rather than string-driven tags.
