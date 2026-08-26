# Sauna Sim Master Development and Equipment v0.1

## Purpose

Aufguss Masters develop through expensive, understandable craft training and a small set of credible tools. This supports better program delivery without becoming a gear-collection game or an automatic-income system.

## 1. Visible Craft Ratings

Each Master has three visible craft ratings from `0` to `10`, plus one style tag. These replace generic character stats because they map directly to the player's Aufguss decisions.

| Rating | What it improves |
| --- | --- |
| Heat Craft | Heat distribution, demanding heat profiles, fan use and controlled finales. |
| Aroma Craft | Dosage, multi-round blends, herbs and ice-infusion delivery. |
| Performance Craft | Rhythm, audience connection, choreography and story-led presentation. |

`0-2` is novice, `3-5` is capable, `6-7` is advanced, `8-9` is specialist and `10` is an exceptional maximum. A Master's style tag remains a natural preference, not a prohibition. Workload is calculated from scheduled sessions and opening hours; it is not a fourth visible Master stat.

## 2. Courses

- A course improves one named craft rating by one level.
- Each further level in the same craft costs more than the previous one. The final levels are rare, expensive long-term investments, not routine purchases.
- Courses improve delivery quality and consistency. They do not make a program category illegal before training; an untrained Master can attempt it with a lower chance of meeting its promise.
- `Heat Craft`, `Aroma Craft` and `Performance Craft` courses map to the matching parts of a program and can produce clearer guest reactions and stronger Steam Guide mentions.
- Exact prices, eligibility and time treatment are economy-balance data. A course must never be a paid real-time wait gate.

## 3. Materials Are Used, Not Unlocked

All approved program materials appear in the Gus editor's `Supplier & Craft` catalogue from the start. The player chooses actual materials for each program, and the simulation charges their displayed per-session use cost when the session runs.

The catalogue is not a venue shop and has no manual stock-counting loop. It groups inputs by real program use:

| Input group | Role |
| --- | --- |
| Essential oils and blends | Main fragrance rounds; cheap standard options through premium blends. |
| Herbs and infusions | Natural, craft-oriented aroma treatment with a higher session cost. |
| Ice rounds | Distinct heat/aroma pacing; from basic scented ice to premium infusion forms. |
| Later specialist ritual materials | Rare/expensive additions such as smoke or advanced herb ritual treatment, only after their safety, visual and balance contract is approved. |

The player can use an expensive material from day one if they can afford its recurring cost. A costly material is never a hidden progression key.

## 4. Master Equipment

Every Master arrives with functional basic tools. Better equipment is purchasable from the first version and is assigned to an individual Master. It uses three simple categories:

| Equipment category | Primary effect | Visual treatment |
| --- | --- | --- |
| Towel Set | More reliable classic/performance execution. | Shared towel overlay palette/shape. |
| Hand Fan | More controlled heat distribution and pulse/finale delivery. | Shared fan overlay and wave frames. |
| Infusion Kit | Clearer, more reliable aroma, herb and ice-round delivery. | Shared bucket/ladle/ice overlay; fresh-bundle overlay where approved. |
| Rain Ladle | More even water distribution and a controlled strong steam phase. | Shared rain-ladle overlay and widened steam pulse. |

- A Master may equip one item in each category; items in the same category do not stack.
- The catalogue can contain multiple price/quality variants within each category. Variants affect one narrow delivery component and may suit a particular style; they never multiply total revenue or all guest satisfaction.
- Effects are bounded and are explained through program outcomes, guest reactions and Master detail, not an opaque final-score multiplier.
- Equipment never replaces the need for a capable Master, matching room, physical capacity or a coherent program.

## 5. Outdoor Aufguss Animation Contract

When the schedule runs an outdoor session, the selected Master is visible and uses the actual equipped tool category:

1. Walk from the venue entrance/staff transition to the outdoor Gus field.
2. Short preparation pose at the field anchor.
3. Play the relevant performance loop: towel, fan or infusion-led delivery.
4. Trigger the program's reusable steam, aroma accent and guest-reaction layers.
5. End the session, then use the field's return/recovery route where relevant.

The Master sprite pipeline is layered: a common body/walk base, five broad performance-pose families, and transparent tool overlays. Equipment variants reuse the same pose timing and only swap the overlay/palette. Program combinations select these reusable layers; they never require a bespoke character sheet.

## 6. Production Order

1. Lock the v0.1 equipment catalogue, silhouettes, hand anchors, palette variants and which tool categories need a visible outdoor action. No Master performance frame is final before this step.
2. Build a small transparent tool-overlay test sheet: towel set, hand fan, infusion/bucket/ladle, rain ladle and fresh ritual bundle. Validate that every overlay fits the same hand position, body angle and draw order.
3. Create the Master body base with tool-ready walk, idle and field-preparation poses. The body sheet is not a complete performance asset by itself.
4. Create outdoor performance loops using the already approved overlay sheet: classic towel, fan-assisted heat delivery and infusion-led delivery.
5. Add remaining performance-style pose variants, steam/aroma layers and guest heat/recovery reactions.
6. Add equipment price-tier palette/shape variants and Master appearance variation only after the shared actions have been approved.

No outdoor Gus asset is produced before its venue field exposes approach, activity, effect and return anchors.
