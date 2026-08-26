# Sauna Sim Guest Memory and Regulars Contract v0.1

## Purpose

Regulars make a venue feel like a place with a growing relationship to real people. They are evidence that a concept, improvement or failure has had a lasting consequence.

They are **not** collectible characters, loyalty cards, friendship quests, VIP guests or a separate scheduling problem. The player never assigns them, gifts them items or manages them one by one.

## Model Boundary

The simulation has two layers:

| Layer | Purpose | Persistence |
| --- | --- | --- |
| Ordinary visits | Most demand; wide variety of individual people generated from market and venue conditions. | Only aggregate outcomes and short feedback history. |
| Local regular pool | A small group of named people who may reappear when their actual reasons to return remain present. | Stable guest IDs, profile identity, preferences and meaningful memories. |

The visible scene always contains a mixture. A successful venue must not look as if the same six people are carrying all its demand, and a struggling venue must still have new visitors who can discover it.

## Pool Size and Visibility

These are content/balance envelopes, not exposed player statistics.

| Venue stage | Local regular pool | Usual visible regulars in one operating block |
| --- | --- | --- |
| New or low-volume venue | 0-4 prospects/occasional returners | 0-1 |
| Stable small venue | 4-10 | 1-3 |
| Established mid-scale venue | 8-16 | 2-5 |
| Large established destination | 12-24 | 2-6 |

The upper pool size is deliberately capped. Growth beyond it is represented by aggregate repeat demand and Local Reputation, not an unmanageable database of named individuals.

## Regular Relationship States

The internal state is simple and can move in both directions.

| State | Meaning | Typical visible evidence |
| --- | --- | --- |
| `new` | A first meaningful visit has occurred. | A first reaction, with no return claim. |
| `curious` | The visit was promising but no habit exists. | “She may come back for another recovery session.” |
| `occasional` | The guest has returned at least once for a compatible reason. | “Returned after enjoying last week's canal finish.” |
| `regular` | Several compatible visits were satisfactory and the venue has a reliable reason to return. | “Usually comes for the Wednesday reset.” |
| `cooling` | The person still knows the venue, but a recent mismatch or changed routine weakened return intent. | “The later queue has made this less dependable for them.” |
| `lapsed` | The guest is not expected soon, but may return if the specific issue changes. | No active scene label; later return is possible only with a real changed reason. |

These states are player-facing only through natural language. The game never displays a loyalty meter, a hearts meter or a percentage chance of return.

## What a Regular Remembers

Each regular stores at most three memory records. Records are concise, factual and replace weaker/older records as needed.

| Memory type | Example | Gameplay use |
| --- | --- | --- |
| `anchor` | “Found a reliable quiet recovery on weekday evenings.” | Explains a plausible repeat reason. |
| `highlight` | “Loved the Birch After Work program.” | Allows a later return when a genuinely similar program is offered. |
| `friction` | “Left after the 18:30 queue became too long.” | Explains reduced return until the relevant pressure changes. |

Memories refer to an actual visit, program, time window, facility or visible failure. They never imply that a guest mechanically owns a program or must return whenever it runs.

## Return Decision

At every eligible operating block, a regular can be considered for a return visit. The model evaluates in this order:

1. Is the venue open during a time the guest could plausibly attend?
2. Is there a current reason compatible with their previous positive anchor or ordinary current motivation?
3. Has a known friction persisted, improved or become worse?
4. Does the current price, expected queue and actual offer still feel worthwhile for this person?
5. Is there room in the current regular-return budget for this venue stage?

The result can be return, defer, visit for a different reason, or lapse. No result is guaranteed. A regular can enjoy one program and skip another; they do not become a fixed consumer of a single thing.

## How Players Learn From Regulars

Regulars are a feedback signal, not a second set of objectives.

| Situation | Player-facing outcome |
| --- | --- |
| A good routine repeats | Guest card: “Back for their usual weekday reset.” Weekly report: “Reliable evening visits are beginning to form.” |
| A new facility fixes an old friction | Guest card: “The new shower makes the cold finish easier to commit to.” |
| A good concept becomes too crowded | Guest card: “Still loves the ritual, but no longer risks the later queue.” |
| A price rises beyond delivery | Guest card: “The experience is familiar, but the new price feels harder to justify.” |
| The player successfully changes the offer | A formerly cooling/lapsed guest may return with a truthful reason, not an automatic forgiveness event. |

The weekly report treats several regular outcomes as a pattern only when ordinary visits point in the same direction. One named guest may be colour; it cannot override broader evidence.

## Venue-Local and Chain Rules

1. A regular belongs to one venue's local pool. They do not automatically follow the chain to every new location.
2. A destination guest may later visit another compatible venue only as a rare, explicit cross-venue event after multi-venue play is implemented. It is excluded from the first playable scope.
3. Chain Brand Value can make a new venue easier to consider, but does not transfer another venue's regulars or Local Reputation.
4. Selling a venue removes its regular pool from the player's active chain. The sale valuation may use aggregate retention/reputation, never the supposed monetary value of named people.
5. Venue closure, unresolved breakdowns, price/value mismatch and repeated queue friction can cool return interest. No guest is permanently deleted as punishment; the player can earn a later return through a changed, credible offer.

## Data Contract

The saved simulation stores only what is needed for truthful future behaviour:

```text
regular_id
venue_id
stable_name_id
stable_visual_palette_id
age_at_generation
base_preference_profile
relationship_state
memory_records[0..3]
last_visit_at
recent_outcome_summary
return_eligibility_at
```

The renderer reads a guest's current activity from the operating block. It does not save screen position, animation frame or a permanent physical location.

## Safety and Content Rules

- Name, appearance, age and gender expression are independent from spending, loyalty, taste, queue tolerance and all mechanical value.
- Several regulars may be non-binary without any special callout; there is no gender field on the guest card.
- No regular may be written as needy, flirtatious, dependent, irrational or comic because of their identity, age, body, disability, race or gender expression.
- Guest memories use approved English content roots and factual placeholders only. The content approval gate remains mandatory.

## First Playable Boundary

The first full simulation implementation uses a small authored regular pool for the Canal reference venue:

1. Up to four named regular candidates.
2. One positive anchor, highlight or friction memory per candidate.
3. One return/defer decision per game week, resolved from opening hours, compatible offer, price and capacity.
4. At most one returning regular visible in a representative scene block.
5. Weekly reports can mention a return pattern only after at least two relevant outcomes.

This proves that improvements and failures persist across real days without requiring the large content pool, final character art or multi-venue transfer logic.
