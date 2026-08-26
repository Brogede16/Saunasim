# Sauna Sim Aufguss Combination Model v0.1

## Purpose

An Aufguss must not have a single hidden "best recipe". The system evaluates whether a chosen program makes sense as a promise, can be delivered well, fits the guests it reaches and earns its price. A quiet, one-aroma classic session can therefore outperform an overbuilt show program when it is the better experience.

The principles follow current professional Aufguss judging and practice: a program needs an understandable concept, controlled heat progression, appropriate use of aromas and convincing execution; technical elements should support the ritual rather than exist for their own sake. [Aufguss WM Jury Catalogue](https://aufguss-wm.com/wp-content/uploads/2026/01/aufguss_wm_jury_catalog_a3_2026_01.pdf), [Modern Classic Cup](https://aufguss-wm.com/modern-classic-cup/). Rain pouring and ice rounds are delivery choices with different intensity and pacing, not automatic quality bonuses. [Rain ladle practice](https://www.saunagut.de/produkte/regenkelle/handhabung-regenkelle), [ice-infusion practice](https://www.saunagut.de/produkte/eisaufguss-kugel/der-eisaufguss).

## Five Internal Scores

Each score is calculated internally on `0-100`. They are deliberately not merged into one universal rating: an impressive program can be poorly priced, badly delivered or simply wrong for the guests currently reached. Music is a first-class input to Craft Coherence, Guest Fit and the relevant part of Performance Craft.

| Score | It answers | Player visibility |
| --- | --- | --- |
| `Craft Coherence` | Do intent, heat, duration, aromas, delivery forms, performance and atmosphere support one clear experience? | Visible number and bar while editing. |
| `Delivery Readiness` | Can the selected Master, equipped tool, room/field, capacity and recovery facilities credibly deliver it? | Visible number and bar while editing and scheduling. |
| `Guest Fit` | Does it suit the actual local motivations, opening window and guests who are likely to attend? | Hidden number; taught through guest cards, Steam Guide and results. |
| `Value Fit` | Does the entry plus any program supplement feel fair for the delivered experience and running cost? | Hidden number; taught through feedback and sales results. |
| `Novelty` | Is this a fresh choice relative to the venue's recent programme, without making a consistent concept a penalty? | Hidden number; taught through reviews and attendance patterns. |

`Craft Coherence` and `Delivery Readiness` are shown because the player can directly correct them before committing. `Guest Fit`, `Value Fit` and `Novelty` remain evidence-led: showing every number would turn guests into a solved spreadsheet and reveal a false universal answer.

## Combination Rules

### 1. Intent Is the Promise

The selected intent establishes a broad direction, not a hard genre lock.

| Intent | Strong natural direction | Can still work when |
| --- | --- | --- |
| `Classic Ritual` | clear natural materials, controlled heat, towelwork or vihta | it stays respectful and legible rather than overloaded. |
| `Quiet Recovery` | gentle/steady heat, calm pacing, restrained scent and recovery finish | a stronger round has clear preparation and a calm landing. |
| `Social Energy` | clear rhythmic pacing, lively but readable atmosphere and good throughput | it does not create queue, noise or heat pressure beyond the venue's ability. |
| `Show Journey` | a visible arc, performance language and appropriate production support | spectacle remains subordinate to safe heat and a credible sensory story. |

An unusual pairing is never automatically forbidden. It starts with less coherence evidence and earns the score only if its other choices make the reason clear.

Intent also guides the editor's one optional English name suggestion. The generator combines an intent-appropriate naming pattern with factual selected inputs such as material, music direction, delivery form, setting and recovery finish. It must not invent ingredients, claim a style the program does not contain or repeat the same suggestion too frequently. Player-entered names always take precedence.

### 2. Heat, Duration and Capacity Form One Plan

- `Gentle Build` and `Steady Heat` favour broad comfort, recovery and reliable repeat use.
- `Progressive Rounds` and `Rhythmic Pulses` need a readable escalation across the session.
- `High-Heat Finale` can be excellent, but needs enough derived room time, Heat Craft, capacity headroom and a credible recovery route.
- A short base format cannot credibly contain many major phases. Selected rounds, delivery forms and performance transitions add actual room time; a recovery finish adds guest-journey time and recovery-capacity demand after the room is free.
- Starting at maximum intensity or adding intensity without purpose reduces `Craft Coherence` and may damage `Delivery Readiness`.

### 3. Aroma Rounds Need an Arc, Not a Quantity Bonus

- One well-chosen material can achieve `Exceptional` Craft Coherence.
- Two or three rounds must have a distinct progression: for example opening, centre and close; fresh to warm; or forest to recovery.
- Materials with closely related sensory tags can reinforce one another when their role differs. Multiple strong, competing or unrelated materials lower coherence unless the performance and pacing establish a clear story.
- Material price class affects cost and potential perceived value, never inherent quality. A badly placed Premium material is waste; a well-run Everyday material can be excellent.
- The material library provides tendencies, not rules such as "forest only belongs in a forest". Location, program promise and guest feedback decide the actual outcome. Every venue family must retain viable low-cost, craft-led and capacity-appropriate premium material routes; no house or location is balanced around one required scent family.
- Event Essences are expensive special-program materials with higher novelty potential, not power-ups. At most one Event Essence may appear in one program; its concept, music, Master and marketing must make the unusual choice understandable.

### 4. Delivery Form Must Have a Job

| Form | Best use in the model | Common weak use |
| --- | --- | --- |
| `Water Pour` | dependable standard round | none; it is a valid complete choice. |
| `Scented Ice Round` | deliberate timed release or reflective pause | added only to make a basic program look premium. |
| `Herbal Infusion` / `Botanical Water` | a natural, craft-led phase supported by Aroma Craft | used with no sensory or pacing role. |
| `Fresh Vihta` | a clearly framed traditional ritual moment | presented as an unwanted universal guest interaction. |
| `Rain Pour` | controlled, broad steam phase in a capable setting | used as a generic power-up without the right tool, heat plan or capacity. |

The game evaluates dosage, method and timing abstractly through `Aroma Craft`; it never asks the player to micromanage real-world safety quantities.

### 5. Master, Tool and Place Are Delivery Evidence

- `Heat Craft`, `Aroma Craft` and `Performance Craft` contribute only to the matching parts of a program.
- A compatible towel set, hand fan, infusion kit or rain ladle gives a bounded improvement to its delivery moment. Gear never repairs an incoherent programme by itself.
- Program Sauna, outdoor Gus field, cold water, natural water, showers and recovery decks improve readiness only when the program actually uses their capability.
- A Master can run any available program. Mismatched style and low relevant craft reduce execution; they do not make the session illegal.
- Automatic scheduling must warn before it chooses a weaker room, overloads a Master or creates recovery congestion.

### 6. Music Has Genre, Pace and Purpose

Music direction is an audible genre profile, not a licensed track catalogue. It lets the player make a clear promise without the production, rights and balance burden of hundreds of individual songs. A profile can contain several original short loops and later gain additional variants without changing the program system.

| Music direction | Natural use | Deliberate contrast that can work |
| --- | --- | --- |
| `Silence & Natural Sound` | intimate classic, recovery and nature settings | a stark, heat-focused ritual with no performance spectacle. |
| `Ambient` | slow heat, quiet recovery and spacious premium sessions | a controlled cold-water finale. |
| `Acoustic & Folk` | Nordic, herbal and traditional programmes | a social outdoor ritual with simple participatory rhythm. |
| `Classical & Instrumental` | composed classic sessions and elegant premium programmes | clear towelwork built around a recognisable musical structure. |
| `Soul & Jazz` | warm, relaxed evening and social programmes | a low-key premium lounge setting. |
| `Pop & Disco` | welcoming social sessions and accessible events | a deliberately playful, well-marketed program with enough capacity. |
| `Electronic & Techno` | rhythmic towelwork, urban venues and late sessions | a precise progressive heat program led by an Energetic Master. |
| `Rock & Metal` | high-energy, industrial or destination events | a tightly controlled heat arc with an authentic Master and clear audience promise. |
| `Ritual Percussion` | outdoor, breath-led and physical rhythm programmes | a spare traditional ritual where the percussion supports rather than overwhelms it. |
| `Film Scores` | story-led performance and large program rooms | a restrained narrative session with a clear beginning, middle and end. |

No direction belongs exclusively to one location or one intent. For example, `Rock & Metal` can be coherent in a floating sauna, a forest clearing or an industrial hall if the program has a credible heat arc, material logic, delivery and audience expectation. A random metal track added to an otherwise silent recovery session is weak; a deliberately framed "Steel & Steam" program can become exceptional.

Each Aufguss Master has one or two **music affinity tags** in addition to their existing style tag, such as `Ambient`, `Folk`, `Electronic` or `Rock & Metal`. This is not a fourth stat and does not block any program. It gives a small execution advantage when the Master can perform naturally to that direction, particularly for beat-led towelwork, choreography and transitions.

Guest response uses existing motivations and individual learned preferences, never demographic stereotypes. A guest may enjoy a particular music direction because they seek social energy, a distinctive event, quiet craft or a familiar routine; no music taste is assigned from age, gender, ethnicity, body or appearance. Marketing and program description help the right guests self-select.

### 7. Guests, Price and Repetition Complete the Result

- `Guest Fit` uses the five locked visit motivations, local market, time/day, current season, music expectation and visible venue promise. No age, gender, body or ethnicity stereotype may determine suitability.
- `Value Fit` compares entry price, optional supplement and per-guest material cost against the delivery guests experienced. Premium is good when it feels earned, not merely expensive.
- `Novelty` softens attendance and reviews when the same venue repeats almost identical programme experiences too often. It never penalises a coherent concept simply for being consistent, and it cannot create a sudden collapse.
- A recovery finish must have one clear job. Cold water or natural water supports contrast; a rest deck supports a calm landing; refreshment supports a social or hospitable close. Adding a finish without physical capacity or narrative purpose reduces Delivery Readiness or Craft Coherence rather than creating free value.
- Feedback names the real cause: confusing concept, heat too abrupt, scent progression weak, Master execution, queue/recovery pressure, price/value or repetition.

## Player-Facing Editor

The editor shows only two direct readiness checks:

```text
Craft Coherence      78 / 100  Coherent
Delivery Readiness   62 / 100  At risk: recovery congestion after 3 daily sessions
```

Suggested bands:

| Score | Label | Meaning |
| --- | --- | --- |
| `0-39` | `Fragile` | A visible contradiction or missing support. |
| `40-59` | `Developing` | Plausible but with an unresolved weak point. |
| `60-79` | `Coherent` | A clear, viable programme. |
| `80-100` | `Exceptional` | Strongly aligned choices, not guaranteed universal demand. |

The editor explains only actionable reasons, for example:

- `High-Heat Finale is demanding for this short session.`
- `Rain Pour requires a Master with a Rain Ladle.`
- `Three strong aroma rounds currently compete rather than progress.`
- `Rock & Metal can work here, but this Master has no matching performance affinity.`
- `The relaxed heat plan and fast electronic tempo currently send different expectations.`
- `Cold-water finish is available, but this venue has limited recovery throughput.`

It must not say which exact material the player should select or show hidden guest-preference numbers.

### Component Cards and Relationship Hints

Every program component is represented by a reusable original pixel icon and a tappable English information card. A card explains what the choice does, its visual language and its likely relationships with the current program. This applies equally to heat, performance, materials, delivery, music and recovery; none of them may become an unexplained abstract modifier.

Relationship hints use only these two categories:

- `Works well with`: a natural supporting choice or a concrete reason the current selection is coherent.
- `Watch for`: a potential mismatch, unmet capability or deliberate contrast needing stronger support.

The hints are contextual. `Rock & Metal` with `High-Heat Finale` and a matching Master may say `Works well with`; the same music direction in a `Quiet Recovery` program may say `Watch for`, but never be forbidden. Material and delivery cards follow the same logic, for example a vihta card explains its traditional ritual role and its guest-contact constraint.

## Result and Feedback Contract

After a program, the game combines all five scores with actual attendance, capacity and Master availability. It returns human evidence rather than formula fragments:

```text
Steam Guide: The gradual heat and birch close felt deliberate.
Guest comment: "The last round was beautiful, but the plunge queue broke the calm."
Weekly review: Quiet evening programs retain well; the premium supplement is accepted.
```

The result system should select from authored sentence components and approved vocabulary. Before implementation, the user reviews representative sentence combinations so feedback never becomes generic or misleading.

## Composition Tier and Delivered Result

The saved Gus combination is `Unproven` until it completes its first real session. That first execution reveals one visible tier: `Bad`, `Normal`, `Rare`, `Iconic` or the highest fixed tier, `Ultimate`. The tier is calculated only from composition: intent, heat, base format, ordered material/delivery rounds, performance, music and highlighted recovery finish. The active program card uses a neutral question mark before the reveal, then restrained red, neutral grey, deep blue, warm gold or platinum-white with a restrained warm shimmer respectively. `Ultimate` is limited to the six internal authored patterns in `aufguss-ultimate-patterns-v0.1.md`.

### Prototype repertoire implementation

After a first real session reveals Composition, the player may save that exact combination to the reusable `Saved Gus` repertoire. The saved card keeps the player-written name, ordered combination and discovered Composition tier. It does **not** freeze Execution, Venue Fit or stars: those remain a fresh result of the current Master, equipment, physical venue and attendance whenever the program is run again. Duplicate component combinations are not saved twice merely because the player renamed them.

This tier is a composition discovery, not a sixth score, a drop chance or an operating result. It deliberately excludes Master, venue, price, attendance and session history. Those factors continue to decide the separate delivered result. An `Iconic` composition can fail if overpriced or performed by an unsuitable Master in a weak venue; a `Normal` composition can be a beloved, profitable standard program.

Changing any core composition choice creates an `Unproven` revised version, which reveals its new tier after one completed session. Changing Master eligibility, schedule, venue placement, price or staffing does not change the tier, but does change execution, value and guest feedback.

Every completed session separately receives an Execution Tier with the same vocabulary: `Bad`, `Normal`, `Rare` or `Iconic`. It reflects real Master fit, craft, music affinity, equipment, workload, scheduling, price and guest response. Execution may change from session to session.

The active venue also receives a Venue Fit tier with the same vocabulary. It is based on location plus building base plus visible compatible upgrades, including room/field scale, capacity, recovery flow and local guest rhythm. It rewards an appropriate use of a venue's real strengths, never a generic visual bias such as "city is better" or "forest belongs with all wood scents".

Venue Fit changes real program outcomes: targeted attendance, price acceptance, post-session retention and word of mouth for that program at that venue. It does not create capacity, waive material cost or award a generic chain-revenue multiplier. Rare and Iconic benefits are capped, only activate after at least Normal execution, and must remain comparable to alternative strengths available to other venue families.

Venue Fit uses six and only six evidence families: Landscape Connection, Building Character & Scale, Physical Program Facilities, Flow Fit, Local Market Fit and Visible Promise. Each compatible location-plus-building combination must have at least two or three realistic Rare/Iconic routes at comparable investment levels; the balance pass validates this explicitly rather than assuming expensive city or water sites are universally best.

The current overall whole-star rating is deliberately not an average: take the lower tier point value across composition, execution and Venue Fit, then add one star only when all three are at least `Rare`, capped at five. Thus an Iconic composition with Bad execution earns one star, Rare composition plus Rare execution plus Normal Venue Fit earns two, and three Iconic tiers earn five. Tapping the stars exposes all three sources and the actionable weak point.

Every first completed session produces a compact mandatory review card: revealed composition tier, an actual-delivery summary, one guest/Steam Guide observation and, when relevant, one actionable warning. This review reports the difference between a strong combination and a successful first execution. Later sessions use ordinary feedback rather than repeating the reveal.

## Implementation Contract

```ts
type AufgussEvaluation = {
  craftCoherence: number;     // 0-100, visible
  deliveryReadiness: number;  // 0-100, visible
  guestFit: number;           // 0-100, hidden
  valueFit: number;           // 0-100, hidden
  novelty: number;            // 0-100, hidden
  reasons: EvaluationReason[];
};
```

Scores must be deterministic from saved program, venue, staff, schedule and market state. Balance values and thresholds remain data, not hard-coded rules, so they can be tuned during the later economy and playtest pass.

## Out of Scope

- No real-life health claims or dosage instruction.
- No hard recipe catalogue where a single exact blend is objectively best.
- No artificial research tree for basic materials or music.
- No forced guest contact from vihta or any other ritual element.
