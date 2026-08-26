# Sauna Sim Design Audit v0.1

Last updated: August 22, 2026

## Purpose

`Sauna Sim` has a coherent premise: build a recognisable sauna concept, read a local market, and grow a brand. The next design phase is not a feature prototype. It is a coherence pass that makes every major choice legible, consequential, and aesthetically part of the same world.

This audit distinguishes three things:

- **Locked direction**: decisions already supported by the design canon.
- **Gaps to resolve**: missing rules that would otherwise create arbitrary or frustrating play.
- **Later depth**: good ideas that should wait until the foundational loop is clear.

## 1. The Required Cause-and-Effect Chain

Every meaningful player decision must travel through the same visible chain:

```text
Venue + local market
        +
Concept choices (programs, staff, price, atmosphere, amenities)
        |
        v
Guest expectations and operational capacity
        |
        v
Attendance, spend, queueing, reviews, staff strain and wear
        |
        v
Cash flow, local reputation, brand movement, ranking and venue value
        |
        v
More options: improve, standardise, adapt, expand or sell
```

If a system does not change something in this chain, it is either cosmetic or not yet needed. If it changes the chain but the player cannot see why, it needs better feedback rather than a more exposed formula.

## 2. What Already Holds Together

### The fantasy and the progression agree

The central idea is stronger than a generic business sim: the player is building a point of view about sauna. The modular Aufguss system, staff style, atmosphere, amenities, branding and light architecture all reinforce that idea.

### Hidden market information is the right amount of mystery

Generated sites are a good answer to avoiding map-game sprawl. The player should receive clues, not a table of demographic values. This supports discovery and makes the venue feel located in a real place.

### Standardisation versus adaptation is a real strategic tension

The game correctly permits both a repeatable chain concept and local adaptation. That is the basis of a genuine expansion game, not an obligation to make every venue a different novelty.

### The economy is appropriately narrow

Removing taxes, weather systems and unrelated investments prevents the game from becoming general business administration. Money remains a consequence of sauna decisions.

## 3. High-Priority Design Gaps

These are not requests for additional features. They are the rules needed to make the present feature set feel fair and connected.

### A. Define the player-facing concept identity

The game currently lists many concept inputs, but does not define what makes a player able to say: "this is my sauna." The answer should be a small set of visible, persistent concept signals, not an invisible score.

Recommended shape:

- **Atmosphere**: calm, ceremonial, social, energetic.
- **Ritual**: traditional, sensory, performative.
- **Service**: simple, hosted, premium.
- **Price posture**: accessible, standard, premium.

Individual choices contribute to these signals, but the player sees them as a changing venue identity. Avoid a permanent label that locks the player into a class; the identity should describe what they are currently doing.

Why it matters: it gives choices a shared language and makes a chain readable at a glance.

### B. Separate demand from capacity

Guest preference explains why people want to come. Capacity explains whether the sauna can serve them well. Those must be distinct.

Minimum capacity factors:

- available session seats and schedule
- service throughput and queues
- staff availability and fatigue
- cleanliness/condition between sessions
- amenity capacity where relevant

Why it matters: without capacity, the best answer is always to attract more guests. With it, a popular show Aufguss can be profitable but damaging if the venue cannot carry it.

### C. Make feedback diagnostic, not numerical

The design correctly hides exact market values, but it needs a defined diagnostic language. A poor week should be attributable to one of four categories:

- **Fit**: the wrong experience for this demand.
- **Execution**: a good idea delivered badly by schedule, staff, price or quality.
- **Capacity**: demand exists, but guests cannot be served well.
- **Timing**: a temporary event or trend changed the week.

Each weekly or monthly report should surface 1-3 concrete observations. For example: "Evening sessions sold out, but late guests left after the second queue" or "Your quiet morning ritual is generating unusually strong repeat visits." Do not use opaque messages such as "guest satisfaction -8." 

### D. Decide the ranking's single question

Ranking is already a core promise, but it cannot simply be a revenue leaderboard. It should answer: "How respected is this sauna brand?"

Recommendation: rank venues on a visible composite called **Standing**, made from guest regard, consistency, local relevance and concept strength. Profit matters indirectly because bad operations hurt the other ingredients, but it should not be the headline score.

The player should always see:

- their current rank
- the next venue above and the gap
- one stated reason the next venue is ahead
- the most direct current route to closing the gap

This preserves the competitive tension without turning the game into a cash race.

### E. Give brand a specific role distinct from ranking

There are currently three overlapping ideas: local venue reputation, chain brand value, and ranking. They need separate jobs.

| Layer | What it measures | What it changes |
| --- | --- | --- |
| Venue reputation | How this location is perceived now | Demand, reviews, local standing |
| Brand reputation | What the wider chain is known for | Site offers, staff interest, starting awareness at new sites, valuation |
| Ranking/Standing | Relative public prestige | Competitive goal and comparison |

Brand must be able to go negative, as already decided. The player should understand whether the harm came from an isolated troubled venue or a chain-wide pattern.

### F. Give selling a distinct purpose

Selling needs to be an answer to a situation, not simply a button for cash. Define three legitimate reasons:

- sell a stable, valuable venue to fund a new strategic move
- exit a poor market without continuing to damage the brand
- sell a venue that no longer fits the chain's direction

The valuation breakdown should use the existing factors, but always name the major positive and negative driver. A sale should have a modest brand consequence so it cannot be used as a frictionless reset.

## 4. Medium-Priority Rules to Lock Before Expansion

### Standardise versus adapt

Standardisation should lower operating complexity and strengthen brand recognition. Local adaptation should improve market fit but introduce more operational complexity and possibly dilute clarity. Neither should be universally superior.

### Staff should create operational stories

Traits must not only alter a hidden multiplier. A reliable traditionalist should make programs consistent; an energetic show master may create demand and higher fatigue; a calm host may improve recovery and repeat visits. Give each staff member one strength, one trade-off, and one observable behaviour.

### Amenities need a clear job

Every amenity should primarily do one thing: improve spend, reduce friction, extend dwell time, increase comfort, or reinforce a concept. Do not make each amenity provide a little of every benefit.

### Wear needs player agency

Wear is a useful consequence only if the player has deliberate ways to manage it: maintenance, schedule changes, investment, or accepting short-term quality loss. Passive decay alone is admin.

## 5. Do Not Expand Yet

Hold these until the design above is specified and visually communicated:

- large multi-site operational logistics
- advanced loans and property deals
- a broad content catalogue
- complex construction or floorplan tools
- elaborate macro trends, seasonality or weather effects
- dozens of staff stats

They will amplify a good core, but will not repair an unclear one.

## 6. Visual Direction: What We Need to Prove

The game should feel like a contemporary Nordic bathhouse brand with warmth, grain, steam and a hint of editorial confidence. It should not look like a spa booking website, a sterile analytics dashboard, or a cartoon mobile tycoon game.

Recommended visual thesis:

> **Warm modern bathhouse editorialism:** dark mineral surfaces, honeyed wood, steam-softened light, bold display type, and concise operational information.

Visual principles:

- A venue should have a strong atmospheric image or illustrated cutaway as its emotional anchor.
- Information should live in deliberate reports, tickets, schedules and cards, not an endless grid of identical dashboard boxes.
- Brand identity should be seen in materials, programme posters, signage and staff presentation.
- The palette should allow different venue concepts to feel related, while giving each venue a distinct accent, wood tone or lighting mood.
- Motion should be slow and material: steam, soft transitions, timer movement and a satisfying reveal after a simulated period.

Before a full app is built, create three high-fidelity UI views in the same visual system:

1. **Opening venue dashboard**: atmosphere, current day, a concise operational pulse, next Aufguss and the relevant decision.
2. **Aufguss editor**: a program assembled from meaningful choices, with immediate human-readable implications rather than raw optimisation scores.
3. **Weekly review / ranking movement**: results, guest comments, one diagnosis, and the nearest competitor.

These three views will prove whether the game feels desirable and whether the mechanics are comprehensible. They are a visual and interaction benchmark, not a disposable prototype.

## 7. Recommended Next Work Package

### Design coherence sprint

Deliverables:

- lock the four concept identity signals
- specify the first five guest preference dimensions and their player-facing language
- specify capacity, quality, and queue rules at a high level
- write the weekly review's diagnostic vocabulary and example feedback
- lock the relationship between venue reputation, brand reputation and Standing
- define three site archetypes with a plausible demand profile and visible clues

### Visual benchmark sprint

Deliverables:

- a one-page art direction board: material language, palette, typography, texture and reference mood
- the three key UI screens named above
- a small component language for reports, program cards, ranking rows and decision panels

### Only then: implementation plan

Once those artefacts have been reviewed, implementation becomes straightforward: build the simulation rules behind the proven three-screen flow, then broaden the system in controlled steps.

## 8. Acceptance Test for the Design

The design is ready to build when a new player can answer all five questions after one simulated week:

1. What kind of sauna am I building?
2. Who is responding well, and who is not?
3. Was my result caused by fit, execution, capacity or timing?
4. What one decision would I make next, and why?
5. How does that decision connect to my brand and current competitive position?

If a screen cannot help answer one of these questions, it should be simplified, moved later, or removed.
