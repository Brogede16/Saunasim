# Sauna Sim Local Market and Feedback Contract v0.1

## Purpose

Each venue has a hidden local market, but the player learns it from people and outcomes rather than a demographic dashboard. This contract defines that translation before guest copy, balance values or UI are produced.

The market is a **starting tendency**, not a stereotype, a hard lock or a fixed destiny. A strong sauna can create new demand gradually; a weak one does not become good merely because it sits in a favourable area.

## Hidden Market Model

Every generated venue stores six bounded directions. They are internal `0-100` values, never shown as numbers to the player.

| Direction | It influences | It never means |
| --- | --- | --- |
| `routine_access` | demand for reliable hours, fair price, predictable flow and short visits | all local guests are busy or dislike premium programs |
| `recovery_interest` | demand for cold/warm/rest recovery and quieter visits | every guest wants silence or natural water |
| `social_program_interest` | demand for shared, musical, show-led or evening Gus experiences | a guest's age, gender or appearance determines taste |
| `destination_potential` | willingness to travel for setting, rarity and a complete experience | the venue may ignore price, access or execution |
| `premium_acceptance` | price tolerance when the visible and delivered quality supports it | expensive pricing alone succeeds |
| `value_sensitivity` | importance of clear value, accessible price and dependable basics | lower-priced guests are less valuable or less discerning |

The offer also stores three non-score context values:

| Context | It influences |
| --- | --- |
| `daypart_rhythm` | whether daytime, after-work, evening and weekend slots are more promising |
| `seasonal_pressure` | whether demand changes gently across the year, without closing the venue or invalidating facilities |
| `arrival_reach` | the balance between walk-in convenience and destination travel |

These values shape the pool of individual visits. A guest still has their own motivation, available time, queue tolerance, price comfort, social preference and program preferences.

## Five Player-Facing Market Signals

The player receives market information through five channels. No one channel tells the whole answer.

| Channel | When it appears | What it can teach | What it must not reveal |
| --- | --- | --- | --- |
| Property card | before purchase | likely rhythm, setting promise, obvious constraint, broad price/access clue | exact demand scores or a best concept |
| Exterior observation | during opening | visible arrival rhythm, queue shape, recovery use, social linger | total market size or hidden preference values |
| Guest card | individual click | one person's current reason, positive, friction and return memory | raw stats, universal demographic conclusions |
| Weekly review | once each game week | repeated cause, bottleneck, emerging opportunity and one practical response | a deterministic formula or a mandatory upgrade |
| Steam Guide / local mention | after meaningful programs or milestones | external framing, word of mouth and concept clarity | a global ranking cheat-sheet |

`Steam Guide` is a working player-facing publication name until final naming is approved. It is a recommendation/observation channel, not a second score system.

## Property Card Clue Pool

Each offer shows exactly two strengths and one pressure from the following pools. They must be truthful to the generated location/building/market card.

| Hidden direction or context | Example visible clues |
| --- | --- |
| Strong `routine_access` | “A reliable after-work rhythm.” “Easy to reach for a short reset.” “Local traffic is steady rather than spectacular.” |
| Strong `recovery_interest` | “Visitors here make time for a proper cooldown.” “The setting rewards a slower landing.” “There is appetite for a complete reset.” |
| Strong `social_program_interest` | “Evenings can feel communal here.” “A clear program may draw a crowd.” “The area responds to shared occasions.” |
| Strong `destination_potential` | “A place people will travel for if the experience earns it.” “The setting can carry a destination concept.” “The journey needs to feel worthwhile.” |
| Strong `premium_acceptance` | “Thoughtful details can support a higher ticket.” “Guests will pay for an experience that feels complete.” |
| Strong `value_sensitivity` | “Guests notice quickly when the price runs ahead of the visit.” “Simple, dependable value has real pull here.” |
| Daytime rhythm | “Quiet daytime visits are plausible.” “The strongest window may be before the evening rush.” |
| After-work rhythm | “The neighbourhood wakes up after 17:00.” “A compact evening routine could travel well.” |
| Weekend rhythm | “Weekends have room for slower stays.” “A program-led Saturday could become part of the draw.” |
| Seasonal pressure | “Summer visitors change the rhythm, not the venue's identity.” “Winter can make the recovery ritual especially visible.” |

Property copy may use one physical fact as a clue, but cannot claim that water, forest, a roof view or an industrial setting makes the venue commercially successful on its own.

## Individual Guest Evidence

Guests show their own reason for visiting, not a label for an entire population. A clicked guest card can reveal:

```text
Maya, 41
Here for: A proper cooldown after work
Now: Heading to the shower after the 18:30 Aufguss

Enjoying
• The canal route makes the finish feel complete.

Watching
• She will not wait long for the next session.
```

Rules:

1. Names are English-language/internationally plausible, and profile cards have no gender field.
2. Age is context only. It cannot explain a music, price, ritual or social preference.
3. One guest never proves a market conclusion. The weekly review only calls something a pattern when enough similar visits support it.
4. A guest can show a positive and a friction at the same time. This is a useful diagnosis, not contradictory feedback.
5. A return memory appears only after a genuine earlier visit outcome and never invents familiarity.

## Weekly Review Selection

Every completed game week presents up to three observations, selected in this order:

1. **A repeated pressure** with a clear decision area, if one exists.
2. **A confirmed strength** that the player can preserve, price, market or build around.
3. **An emerging opportunity** where a small change could serve a visible group better.

Each observation has one of four diagnostic labels:

| Label | Meaning | Allowed player responses |
| --- | --- | --- |
| `Fit` | Current programs, price or promise do not match the guests being reached. | change program, price, marketing, opening rhythm or service mix |
| `Execution` | A viable idea is delivered inconsistently. | change Master/equipment/workload/program setup |
| `Capacity` | Demand exists but a visible channel cannot carry it. | build, staff, change session frequency or hours |
| `Awareness` | The right guests do not yet understand or notice the offer. | sign/program frame, clear program identity, marketing, reputation |

A review may state uncertainty honestly: “The first signs suggest…” rather than claiming certainty from a small sample. It must never say “the market does not want this” when a better fit, price, presentation or capacity response remains possible.

## Steam Guide and Local Mentions

This channel provides editorial-style recognition after real evidence, not random praise.

| Trigger | Possible observation | What it teaches |
| --- | --- | --- |
| First `Rare`/`Iconic` Composition completes | “A precise program with a memorable progression.” | composition has an interesting identity |
| Strong Execution with matching setting | “The canal finish gave the ritual a satisfying landing.” | execution and Venue Fit reinforced each other |
| Price/value mismatch | “Ambitious details, but the experience has not caught up with the ticket.” | price must be earned by delivery |
| New facility changes real visits | “The new shower route has made the cold finish feel considered.” | a specific upgrade solved a visible issue |
| Repeat guests grow | “This is becoming a dependable part of the local week.” | routine/reputation is forming |

The publication can describe a surprise fit, including a well-executed Metal Gus, when the program's intent, performance, setting and guest response support it. It must not reduce music to a demographic preference or treat unusual choices as jokes by default.

## Slow Market Change

The local starting tendency can shift only through accumulated delivered evidence. The first version uses three slow effects:

| Effect | Cause | Bounded result |
| --- | --- | --- |
| `earned_reach` | repeated good visits, clear promise, suitable marketing | more compatible guests consider the venue from beyond immediate convenience |
| `return_habit` | reliable value, routine-friendly hours, satisfactory repeat outcomes | a small pool of regulars becomes more likely to return |
| `concept_association` | repeated coherent programs with matching visible venue identity | guests understand what the venue is known for and self-select better |

These effects move gradually, have diminishing returns and are venue-local first. Brand Value may later extend awareness, but cannot replace the local evidence.

## Trend and Repetition Boundary

Market change is not the novelty system. Exact program repetition loses only its additional novelty effect, never its basic quality. A light trend may shift attention toward a mood, recovery need or social format over several game weeks, but it must:

- be announced through comments, weekly reports or guide mentions before it materially matters;
- have more than one viable response, including keeping a proven program for its core audience;
- never invalidate a location, building, staff member or purchased upgrade;
- remain weaker than actual delivered experience, price and capacity.

## Required Content Data

Before a first generated offer enters the game, content must provide:

```text
market_direction_profile
daypart_rhythm
seasonal_pressure
arrival_reach
property_clue_strengths[2]
property_clue_pressure[1]
weekly_feedback_roots[]
steam_guide_roots[]
```

All assembled English phrases remain subject to the existing guest-content approval gate. The model may only combine approved roots with facts that happened in the simulation.

## First Playable Boundary

The first technical vertical slice does not need a full market generator. It uses one authored Canal market profile, visible guest cards, a short weekly review and one Steam Guide observation. The content/data contract is complete enough that later locations can use the same system without redesign.
