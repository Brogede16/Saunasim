# Sauna Sim: Aufguss System v0.1

Last updated: August 23, 2026

## Goal

Aufguss is the primary way the player expresses a sauna concept. It must be creative, commercially meaningful and visibly distinct without requiring a manual timetable or assignment of individual Masters to individual rooms.

## 1. Three Layers

### Sauna Room

A sauna room is a simulated venue asset, not a visible interior cutaway. It defines:

- guest capacity per session
- heat/technical capability
- whether it can host simultaneous programming with other rooms
- the maximum safe session volume inside opening hours

Building another sauna room adds a new program lane. The player sees the exterior building grow, while the menu shows the new room and its capacity.

Every sauna room can host a **Basic Aufguss** from the start: a simple heat, scent and Master-led session with visible timed steam and guest entry/exit at that room's exterior anchor. A dedicated **Program Sauna** does not make Aufguss possible for the first time; it adds stronger capacity, richer program support and/or an additional high-quality program lane. This ensures every venue family can serve guests who seek Aufguss, while larger specialist venues remain better at parallel and premium programs.

Every viable sauna room can also host a Special Aufguss when it has a suitable Master and slot. Program Saunas and eligible outdoor Gus fields are the strongest setting for it, with better capacity, presentation and satisfaction potential; they are not the only legal place to run one.

### Aufguss Program

The player creates a reusable program. It contains six composition categories:

| Category | Player chooses | Main purpose |
| --- | --- | --- |
| Intent | `Classic Ritual`, `Quiet Recovery`, `Social Energy` or `Show Journey` | The overall promise and initial guest expectation. |
| Heat curve | `Gentle Build`, `Steady Heat`, `Progressive Rounds`, `Rhythmic Pulses` or `High-Heat Finale` | Thermal experience, pacing and tolerance trade-off. |
| Base format | Short, standard or long | Starting time budget before selected rounds and finishes add their real operational time. |
| Aroma rounds | One to three aroma rounds in a chosen sequence | Mood, ritual identity and sensory progression. |
| Performance language | Classic towelwork, quiet ritual, rhythmic flow, choreographed show or story-led performance | Master fit, audience energy and visual performance. |
| Music direction | A reusable genre profile, from silence and ambient to folk, pop, electronic or metal | Sets pace and shared expectation; it must support the heat, performance and program promise. |

Outside the composition, the player also chooses program name, included/premium price, desired frequency, eligible Masters and optional recovery finish. The player may enter any English program name; the editor offers one optional name suggestion based on the actual selected components and never overwrites it. Time of day, target audience and final room are not arbitrary composition fields: the player chooses when to offer the program, while the game reports which guests it is likely to serve and schedules it into the best viable free room/field.

The name suggestion starts from the selected intent, then draws from the actual material family, music direction, delivery form, setting and recovery finish. It creates one clear English suggestion, not a list of interchangeable fantasy titles. Examples: `Quiet Recovery` + birch + natural-water finish may suggest `Birchwater Rest`; `Social Energy` + citrus + disco may suggest `Sunset Citrus Social`; `Show Journey` + pine + Rock & Metal may suggest `Steel & Steam`. The player may freely rename, retain or ignore every suggestion.

The player may build every program from scratch from the start or begin from a simple template and edit it. A complex idea can still be delivered poorly when the room, Master, capacity or supporting facilities are not ready, which creates an intentional quality risk rather than prohibiting creativity. `aufguss-combination-model-v0.1.md` defines the music profiles, coherent contrast rule and Master music affinities.

### Program Composition Tiers

The program's composition has a hidden tier when the player creates or edits it, but it is revealed only after the program has completed one real session. Until then its card reads `Unproven` with a neutral question-mark mark. The reveal is calculated only from the Gus combination: intent, heat, base format, ordered material/delivery rounds, performance style, music direction and highlighted recovery finish. Master, venue, price, attendance and past sessions never change the tier itself.

| Tier | Colour direction | Meaning |
| --- | --- | --- |
| `Bad` | restrained red | The selected elements visibly fight one another or leave a core promise unsupported. |
| `Normal` | neutral grey | A valid but ordinary combination. |
| `Rare` | deep blue | An unusually coherent or surprising combination with a strong internal idea. |
| `Iconic` | warm gold | A very rare, deeply coherent combination whose elements reinforce one another exceptionally well. |
| `Ultimate` | platinum white with restrained warm shimmer | One of six fixed, discoverable composition patterns with exceptional internal coherence. |

After the first completed session, the tier appears as a compact coloured border/mark in the Gus overview and on eligible program posters. It is not random loot, a product price bonus or a performance-history award. A high-cost Event Essence cannot buy `Rare`, `Iconic` or `Ultimate` by itself. `Ultimate` is Composition Tier only; it requires an `Iconic` Execution Tier and `Iconic` Venue Fit to reach the normal five-star maximum. Its six internal patterns and balance contract are defined in `aufguss-ultimate-patterns-v0.1.md`.

Any core composition change makes the revised version `Unproven` again until it completes one session. Operating choices such as Master eligibility, scheduling frequency, venue, price and staffing do not alter the revealed tier, but they determine whether the program is actually delivered well and whether guests think it was good value.

### Execution Tier and Overall Stars

Every completed session also receives a separate `Execution Tier`: `Bad`, `Normal`, `Rare` or `Iconic`. It uses the actual compatible Master, relevant craft and music affinity, equipment, workload, scheduling, price and guest response. It may change each time the program runs.

The active venue separately receives a `Venue Fit` tier: `Bad`, `Normal`, `Rare` or `Iconic`. It assesses the full place: location, building base, visible compatible upgrades, room/field scale, capacity, recovery flow and local guest rhythm. It never treats a backdrop as inherently superior; every venue family must have viable strong programs, but each reaches them through different physical and market strengths.

Venue Fit has direct, program-specific benefits. It never creates free capacity, removes running cost or gives a chain-wide revenue multiplier.

| Venue Fit | Direct benefit for that Gus at that venue |
| --- | --- |
| `Bad` | Some otherwise interested guests hesitate; the program is harder to market and earns weaker place-specific retention. |
| `Normal` | Baseline demand and ordinary retention. |
| `Rare` | Stronger targeted attendance, modestly better price acceptance and a small retention/word-of-mouth benefit after a successful execution. |
| `Iconic` | Capped destination pull for matching guests, clearer marketing response and a stronger retention/word-of-mouth benefit after a successful execution. |

Benefits apply only when the actual Execution Tier is at least `Normal`; a great location cannot compensate for a failed delivery. Exact values are balance data and must be capped per program so established chains cannot snowball merely through Venue Fit.

Venue Fit uses exactly six evidence families:

1. **Landscape Connection:** water, forest, beach, roof, harbour, city or other real surroundings used by the program.
2. **Building Character & Scale:** the credible strengths of the building base, such as intimate, raw, social, elegant or event-capable; never simple purchase price.
3. **Physical Program Facilities:** actual compatible rooms, field, water, shower, deck, shop and recovery upgrades.
4. **Flow Fit:** whether the venue can carry this program's session size, timing and recovery route, not raw capacity alone.
5. **Local Market Fit:** the local guest flow and visit motivations relative to program, time and price; never demographic stereotypes.
6. **Visible Promise:** how the building and owned upgrades communicate the experience before a guest enters; never arbitrary facade colour.

Every compatible location-plus-building combination requires at least two or three realistic routes to `Rare` or `Iconic` Venue Fit. The later balance pass must test these routes at comparable investment levels, so a compact tent camp, industrial hall, water venue, rural property and rooftop venue each have meaningful but different strengths.

The overview combines fixed Composition Tier, latest Execution Tier and current Venue Fit into one whole-star rating. All three sides must be strong: the star result is based on the lower of the three tiers, with a one-star synergy bonus only when all three are at least `Rare`.

| Composition + execution + venue | Overall result |
| --- | --- |
| `Iconic` + `Bad` + `Rare` | 1 star: exceptional idea, failed delivery. |
| `Rare` + `Rare` + `Normal` | 2 stars: strong Gus, ordinary place fit. |
| `Rare` + `Rare` + `Rare` | 4 stars: strong Gus, strong delivery and strong venue fit. |
| `Iconic` + `Rare` + `Iconic` | 4 stars: exceptional idea, strong delivery and place fit. |
| `Iconic` + `Iconic` + `Iconic` | 5 stars: exceptional composition, execution and place fit. |

The player can tap the stars to see all three underlying tiers and the concrete reason for the weaker one. This prevents a single averaged number from hiding whether the next improvement is the Gus concept, Master delivery or venue.

The first completed session of every `Unproven` program always ends with a compact review card. It combines the composition reveal with the actual first delivery:

```text
STEEL & STEAM
Composition: Rare
Execution: Normal
Venue Fit: Rare
Overall: 2 stars
Guest note: "The heat built with the music instead of fighting it."
Watch for: The small cold plunge was close to capacity.
```

Later sessions do not repeat the full reveal card unless the player opens program history. They contribute normal guest feedback, weekly reviews and the venue's results.

### Click-to-Understand Program UI

Every selectable program component has an original compact pixel icon. Tapping its card or icon opens a short English explanation rather than a hidden-stat breakdown. The same pattern applies to intent, heat profile, duration, material, delivery form, performance style, music direction and recovery finish.

| Performance style | Original icon concept | Player-facing card meaning |
| --- | --- | --- |
| `Classic Towelwork` | Folded towel with two curved heat lines | Controlled traditional heat distribution. |
| `Quiet Ritual` | Small bowl with a single rising steam line | Calm pacing, scent and deliberate pauses. |
| `Rhythmic Flow` | Towel arc with two beat marks | Towel movements that work with a clear rhythm. |
| `Choreographed Show` | Three sequential motion marks around a towel | Planned visual sequences and stronger performance demand. |
| `Story-led Performance` | Open card/book with one steam line | A simple beginning, development and ending supported by the whole program. |

Each card also has a small `Works well with` and `Watch for` area. It provides qualitative, contextual guidance, for example:

```text
Rhythmic Flow
Works well with: Rhythmic Pulses, Electronic & Techno, an Energetic Master.
Watch for: a relaxed heat plan can feel disconnected unless the contrast is intentional.
```

Cards teach through short, varied descriptive copy and contextual `Good to know` sentences, rather than a live compatibility map. For example, a material may say it is often chosen for relaxation, that it gives a busy program somewhere to slow down, or that it belongs naturally beside woods or evening notes. The UI never says "required" except for real physical capability or equipment. A player can deliberately create an unusual combination; the descriptions make the trade-off understandable without revealing a tier formula before scheduling.

`aufguss-program-language-v0.1.md` defines the shared plain-language tags used by every program component, Master, tool, venue card and feedback sentence.

### Aufguss Master

Masters are linked to programs or program styles, not permanently assigned to rooms. Each has three visible `0-10` craft ratings plus a style tag:

- Heat Craft: heat distribution, demanding heat curves and fan use
- Aroma Craft: dosage, blends, herbs and ice rounds
- Performance Craft: rhythm, audience connection, choreography and story-led delivery

Courses improve one rating at a time and become progressively more expensive near the exceptional maximum of `10`. Workload is calculated from scheduled session volume, not displayed as a fourth stat. Better Master equipment improves one narrow delivery component and never becomes an unrestricted final-result multiplier.
- Style tag: Traditional, Meditative, Energetic or Theatrical as a strength, not a restriction

The system automatically uses the best available compatible Master when a program runs. A player may change which Masters are eligible for a program, but never needs to place a person in a specific room or time slot.

## 2. Program Capability Unlocks

The program builder only offers phases the venue can physically deliver.

| Venue capability | Program option it enables |
| --- | --- |
| Basic sauna | Core program with restrained atmosphere and no facility-dependent finish |
| Program Sauna | Stronger Special Aufguss fit, premium/show presentation and program capacity |
| Outdoor Gus field | Outdoor Special Aufguss, its own guest capacity and exterior performance anchors |
| Cold plunge | Plunge recovery phase |
| Bathing bridge/natural water | Natural-water ritual phase |
| Outdoor relaxation deck | Outdoor recovery finish |
| Reception Shop/water service | Refreshment or product-linked finish |
| Additional sauna room | Parallel program lane |

This is a physical capability system, not a generic research tree. Incompatible finishes are shown in the builder as visible but unavailable options, with the exact required upgrade named.

### Repertoire Access

The game uses a small repertoire library instead of a large linear unlock tree:

- basic intent, heat, duration, all approved materials and music directions are available from the start;
- materials are bought as displayed per-session inputs, not unlocked behind a catalogue gate;
- paid courses improve a concrete Master's Heat, Aroma or Performance Craft;
- purchasable towel sets, hand fans and infusion kits improve one narrow delivery component for that Master;
- a physical facility enables an outdoor ritual or recovery finish;
- advanced choices can be used early with money, but still need a venue and Master capable of delivering them well.

`aufguss-material-library-v0.1.md` defines the first 30 materials, their per-session price classes, ingredient marks and delivery forms. Player-facing material cards use factual sensory context and in-game fit, never medical promises.

### Recovery Finish Library

Every program may have one highlighted recovery finish. It is an actual guest route after the session, not a menu-only bonus; the required facility must be visibly built and have authored route/interaction anchors. Other compatible facilities may still be used during a visit, but they do not become extra mandatory program phases.

| Recovery finish | Required visible facility | Program role |
| --- | --- | --- |
| `No Added Finish` | None | Guests return to ordinary lounge or continue their visit. |
| `Cold Plunge` | Cold-water tub or pool | Deliberate heat/cold contrast. |
| `Natural Water Dip` | Bathing bridge or approved water access | Destination-like lake, canal or sea recovery. |
| `Outdoor Shower` | Outdoor shower | Simple cooling transition with a compact shared animation. |
| `Rest Deck` | Terrace, loungers or recovery deck | Calm landing after a longer or quieter program. |
| `Refreshment Finish` | Water station, Reception Shop or compatible service point | Water, tea or an appropriate shop-linked refreshment. |

The editor shows unavailable finishes greyed out with the missing physical upgrade named. A player may always run the program without the finish rather than being blocked from the core Aufguss.

### Derived Program Timing

The player chooses a broad `Base format`, but the game calculates actual time from the composition. It shows both durations before the player schedules frequency:

```text
Sauna room time:  Standard base + 2 aroma rounds + ice pause = 14 min
Guest journey:    Room time + Natural Water Dip = 22 min
```

| Timing layer | It includes | It constrains |
| --- | --- | --- |
| `Sauna room time` | Base format, heat curve, aroma-round count, delivery forms, performance transitions and exit/reset | Number of sessions that the room and Master can run during opening hours. |
| `Guest journey time` | Sauna room time plus the highlighted recovery finish and its return | Cold water, shower, deck, shop and guest-flow capacity after the room has become free. |

- A `Scented Ice Round` or `Herbal Infusion` adds a small deliberate sauna-room phase.
- A more elaborate performance style adds transition time only when the Master can deliver it cleanly.
- `Cold Plunge`, `Natural Water Dip`, `Outdoor Shower`, `Rest Deck` and `Refreshment Finish` extend guest-journey time, not occupancy of the sauna room.
- A long program with multiple phases is valid, but the editor shows its resulting lower possible frequency and recovery-capacity demand.

Exact minute values are balance data. The player sees rounded whole minutes and a clear capacity consequence, never a hidden timing formula.

### Aroma Round Structure

The player selects one, two or three aroma rounds in order. Each round contains exactly one material and one delivery form.

| Round count | Intended role | Operational consequence |
| --- | --- | --- |
| `One Round` | One clear sensory moment; valid for classic, simple and recovery programmes. | Lowest input cost and smallest added room-time phase. |
| `Two Rounds` | A deliberate development, such as fresh to warm or forest to herb. | Adds material cost, one timing phase and a small Aroma Craft demand. |
| `Three Rounds` | A complete opening, centre and close for a longer ritual or show. | Adds two timing phases, higher cost and meaningful Aroma Craft demand. |

More rounds are never a quality bonus by themselves. Every selected round must have a distinct role in the sensory and heat progression. The editor explains whether the current sequence reads as focused, developing or overcrowded, without prescribing one exact material.

## 3. Internal Appeal Model

The player never sees the full numbers. The simulation calculates a motivation-fit vector for every program:

```text
program appeal =
  core experience
  + optional phase fit
  + Master style/execution
  + venue atmosphere and reputation
  - price friction
  - capacity/service failure
```

The vector has one value for each visit motivation:

- rest and recovery
- ritual and tradition
- social experience
- convenient routine
- special premium experience

Examples:

| Program choice | Tends to strengthen | Possible trade-off |
| --- | --- | --- |
| Calm scent, moderate heat, deck finish | Recovery and ritual | Less exciting for social/event guests |
| Energetic music, towel performance, premium supplement | Social and premium | Higher cost and weaker fit for quiet routines |
| Bathing-bridge cold-water phase | Recovery, ritual and destination pull | Requires water capacity and can create queues |
| Short, reliable included program | Convenience and routine | Less premium distinction |
| Specialist Master with traditional fit | Ritual quality and repeat visits | Wage cost; less advantage for a show-led program |

These are tendencies, not rigid categories. Strong execution and a coherent venue can make unusual combinations work.

`aufguss-combination-model-v0.1.md` defines the score and feedback contract behind coherence, delivery, guest fit, value and repetition. The editor exposes only the two directly actionable checks: Craft Coherence and Delivery Readiness.

## 4. Demand, Delivery and Price

For every potential guest, the game evaluates three separate questions:

1. **Interest:** Does this program attract this guest at this time and place?
2. **Affordability/value:** Is the entry plus any supplement worth it to this guest?
3. **Delivery:** Did the session have the staff, capacity and supporting facility to fulfil the promise?

This keeps premium pricing fair. A high price can reduce initial interest but still be good value if the experience delivers. A low price can create demand but strain the venue.

## 5. Frequency and Automatic Scheduling

The player sets desired session quantity per program. The system schedules automatically:

- prioritise the venue's busiest compatible opening windows
- place Special Aufguss in the best compatible available room/field before using weaker or smaller alternatives
- avoid scheduling beyond room, staff, turnaround and operating capacity
- allow parallel sessions in different rooms when Masters are available
- surface a clear warning when requested frequency cannot be delivered, would use a weaker room or would create untenable capacity pressure

Suggested UI language:

```text
Pine Ritual
Desired sessions:  [ - ] 3 / day [ + ]
Suggested setting: Cedar Program Sauna
Master pool: Traditionalists (2 available)
Price: Included with entry
Running cost: 18 kr per guest
```

The player retains meaningful control without managing a diary.

## 6. Visual Output

The exterior venue does not show rooms, but it can show program activity through:

- program poster/emblem updating at the entrance
- steam and chimney intensity near program times
- guest arrival and movement to outdoor recovery facilities
- cold-water use after relevant programs
- existing evening lighting around the building, where the scene already has it
- a short visible flourish when a signature program begins

### Program-to-Scene Contract

Every program produces a compact visual profile from the same data used by the simulation:

| Program field | Reusable visual result |
| --- | --- |
| Intent and heat curve | Steam density, pulse and warmth of the effect. |
| Aroma rounds | Subtle approved colour accent and phase change in steam; never opaque coloured fog. |
| Performance language | The correct Master pose set: classic towel, rhythmic flow or show flourish. |
| Music direction | Program rhythm and shared audio mood; no extra world-light asset requirement. |
| Room/field | Correct chimney, outdoor stage or Program Sauna effect anchor. |
| Recovery finish | Guest route to cold water, shower, rest or warm facility after session. |

The renderer combines a small reusable effect and animation library. A new program selects existing approved variants; it does not require an entirely new building, scene or animation sheet.

## 7. Feedback

Program feedback should distinguish the failure source:

- poor **fit**: the wrong experience for the guests attracted
- poor **value**: price does not match perceived delivery
- poor **execution**: Master/style mismatch or excessive workload
- poor **capacity**: demand exceeds room, changing or recovery capacity

The player must always be able to change a program, price, Master eligibility, frequency, staff level or physical facility in response.

## Questions to Approve

1. Should Masters be assigned to program styles/programs and automatically scheduled, rather than assigned to particular rooms?
2. Should players set program frequency with a `- / +` session count per room and day?
3. Should paid premium sessions use an exact extra per-guest price, while ordinary programs stay included in entry?
4. Should a program's appeal remain hidden but be reported through the five visit motivations and guest feedback?
