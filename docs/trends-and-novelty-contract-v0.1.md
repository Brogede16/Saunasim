# Sauna Sim Trends and Novelty Contract v0.1

## Purpose

Trends create occasional reasons to reconsider programming, timing and venue identity. Novelty rewards discovery and variation. Neither system is allowed to turn a well-run sauna into a failing business without a player mistake or a visible, gradual change in demand.

## Protected Baseline

Every viable program has a baseline result determined by its Composition, Execution, Venue Fit, price and physical capacity. Trends and novelty may modify **attention at the margin** only.

- A `Normal` or better program remains commercially usable when repeated.
- A coherent chain may standardise a reliable program across venues.
- A trend cannot reduce the baseline attendance or value of a successfully delivered program below its non-trend level.
- No trend removes an item, disables an upgrade, forces a program change or creates a deadline.

## Three Distinct Effects

| Effect | What changes | Player can respond with |
| --- | --- | --- |
| `program_novelty` | Extra curiosity and word of mouth for a newly discovered composition at a venue. | Keep it, vary it, save it or let it become a dependable standard. |
| `chain_saturation` | The additional novelty bonus weakens when the exact composition is overused across the chain. | Run it where it fits best, make a related variation or accept a reliable standard result. |
| `interest_shift` | A slow broader interest in a program mood, recovery style or social format. | Change timing, market a fitting existing program, create a new one or ignore it. |

These effects never alter Composition Tier. An `Iconic` Gus remains `Iconic`; its attention effect can still be ordinary if it is repeatedly run, poorly delivered or badly placed.

## Program Novelty

1. A composition is new at a venue only after it has completed its first real session and revealed its tier.
2. The first successful appearances receive an additional, bounded curiosity/word-of-mouth opportunity.
3. The bonus fades over several completed sessions and real game weeks, never after a single run.
4. A revised program with a material, heat, performance, music, delivery or recovery change is a new composition version and must be run once before its tier/novelty is known.
5. A saved program can remain a profitable standard indefinitely. The game does not call it “stale” merely because it is familiar.

## Chain Saturation

The model tracks exact composition identity across the player's chain, not broad tags such as “all birch programs” or “all recovery Gus.”

| Chain use | Novelty behaviour |
| --- | --- |
| One venue, occasional use | Full venue-level novelty opportunity. |
| One venue, frequent use | Fades to standard familiarity over time. |
| Several venues, appropriate local fit | Each venue may still have its own initial discovery; later chain-level attention is reduced. |
| Several venues, identical headline programme everywhere | Extra press/curiosity is limited, while ordinary fit and profit remain valid. |

This protects both desired playstyles: a player can build a recognisable chain concept, while another can create local variations without a mechanical requirement to do so.

## Interest Shifts

An interest shift has a `mood`, not a mandatory recipe. The first content set uses these broad, readable moods:

| Mood | May favour | Does not require |
| --- | --- | --- |
| `quiet_reset` | calm recovery, earlier sessions, rest decks, gentler heat | a specific scent, age group or location |
| `cold_ritual` | water/cold finishes, contrast programs, winter presentation | natural water at every venue |
| `shared_evening` | social programs, later sessions, seating and clear event framing | loud music or high capacity |
| `craft_tradition` | considered aroma progressions, towelwork, classic/folk framing | only traditional materials or rural venues |
| `curious_programming` | unusual but coherent music/material/performance combinations | random/weird combinations being good |
| `slow_premium` | longer, well-supported programs and complete recovery | high price without delivery |

A single shift may be active at a time per broad region/reference market in the first release. Later multiplayer can use the same content directions globally, but rank must never make a trend stronger for high-ranked players.

## Cadence and Visibility

1. An emerging shift is hinted for at least one game week before it can create a meaningful additional attendance opportunity.
2. A shift remains legible for at least three game weeks after it becomes active.
3. It fades gradually, with no cliff-edge penalty on the final day.
4. The game avoids back-to-back shifts that ask the player to change the same venue repeatedly.
5. A venue's core local market, delivered quality and current capacity always outweigh a weak trend match.

The player learns through guest comments, weekly reviews, Steam Guide/local mentions and a small market-note area. No urgent pop-up, countdown or forced quest is allowed.

## Decision Value

A trend is only eligible to surface when it creates at least two credible player choices for the current chain, such as:

- move an existing suitable program to a better time;
- run a compatible saved program more often;
- build a relevant recovery/support facility;
- develop a new variation;
- market a venue's existing strength;
- deliberately ignore the shift because the core audience is more valuable.

If the player cannot plausibly act, the trend stays background flavour only.

## Data Contract

```text
trend_id
mood
emerging_at
active_at
fading_at
eligible_program_hints[]
eligible_facility_hints[]
approved_feedback_roots[]
```

No trend data contains an attendance multiplier visible to the UI. The balance layer applies bounded effects only after normal programme/venue evaluation.

## First Playable Boundary

The first full simulation needs only one authored `quiet_reset` or `cold_ritual` shift. It must prove:

1. An early hint appears in an approved weekly observation.
2. A matching existing program gains an observable but modest opportunity.
3. An unchanged reliable program retains its stable baseline.
4. The shift fades without a hard event or player punishment.
