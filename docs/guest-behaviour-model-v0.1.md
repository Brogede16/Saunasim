# Sauna Sim Guest Behaviour Model v0.1

## Purpose

Guests are the bridge between the hidden local market and the player-visible venue. The player should learn from what individual people do, say and return for, without being handed a demographic spreadsheet or asked to manage every person manually.

This document locks the behavioural structure. Exact probabilities, prices, capacity values and the final guest-content library belong to the later balance pass.

## Core Rule

A guest is a **visit**, not a permanent character the player must collect. Visible guests receive a generated name, age and appearance so they feel individual. Their decisions are driven by current needs, available time, price sensitivity, queue tolerance, preferred experience and the actual venue offer.

Age is shown as human context, never as a shortcut for taste. The simulation may use broad life rhythm and availability, but no age group automatically likes or dislikes a particular sauna style.

## Guest Profile

Every simulated visit has the following internal information.

| Field | What it governs | What the player can infer |
| --- | --- | --- |
| Name and age | Human identity and profile-card context | A real person is having this visit, not a bar-chart unit. |
| Main visit motivation | The strongest desired outcome for this visit | What the person is looking for, in natural language. |
| Secondary preference | A useful but less decisive preference | Why two guests seeking recovery may behave differently. |
| Available time | Maximum realistic visit duration on this visit | Whether the guest is likely to leave early, wait or stay for recovery. |
| Price comfort | How the current entrance/program/shop price feels | Value reaction, not a visible budget score. |
| Queue tolerance | How much delay the guest accepts before changing plan or leaving | Visible waiting, avoidance or abandonment. |
| Social preference | Whether the guest seeks company, quiet or a mixed experience | Terrace, program and recovery behaviour. |
| Experience preferences | Heat, intensity, traditional/show orientation and recovery needs | Program and facility fit through behaviour/comments. |
| Equipment mode | Own towel, venue-rented towel, purchased towel or no towel-required path | Shop use, towel-return activity or no visible towel task. |
| Memory | Recent outcome and return tendency | Repeat visits and later feedback patterns. |

## Visit Motivations

Every visit has one primary motivation and may have one secondary preference. These are not fixed population labels; the local market, opening time, venue reputation and marketing influence which motivations appear.

| Motivation | Guest is trying to get | Usually values | Can be disappointed by |
| --- | --- | --- | --- |
| Recovery | A complete heat/cold/rest reset | Sauna, shower, cold water, warm bath, quiet rest | No recovery route, overcrowding, rushed stay |
| Ritual | A credible sauna and Aufguss experience | Good Master, fitting heat/scents, tradition, natural water | Weak program fit, poor timing, inauthentic-feeling setup |
| Social | A shared occasion or entertaining program | Friends, show Aufguss, seating, linger spaces | No group capacity, no social room, an overly quiet offer |
| Routine | A reliable, efficient recurring visit | Convenient hours, fair price, predictable flow | Long queues, irregular programs, slow entry/changing |
| Special premium | A memorable destination treat | Setting, presentation, premium program, complete recovery | Price without delivery, weak setting use, poor service |

## Location Demographic Tendencies

Every venue's guest tendency is built from two independent layers, then merged - never authored as one fixed number per location name. This matters because the same location can host different compatible buildings, and the same building can sit on different locations (`building-library-v0.1.md`); neither layer alone fixes the outcome.

All numbers below are soft tendencies, never a hard rule: they set what is *more common*, not what is possible. An atypical guest for a given combination must always remain able to show up, just proportionally rarer (owner, 2026-08-26: "a guest or several may well like something the others don't at all, it just has to be proportionally fewer visits"). Age itself never drives taste (unchanged from the Core Rule above) - only how often a given age shows up, and how much price/value headroom the visit has.

### Layer 1: Location appeal and age (independent of which building sits there)

| Location | Appeal (why guests come for the *place*) | Age tendency |
| --- | --- | --- |
| Canal | Water/canal charm, walkable city convenience, tourist + young professional crossover | City: peaks 20-35 |
| Coast | Open sea, weather-exposed, holiday atmosphere, seasonal tourism | Broad 25-55, no sharp peak (holiday mix) |
| Beach | Casual, family-friendly, everyday swim-life rather than a destination holiday | Broad, lightly youth/family-skewed 20-45 |
| Forest Lake | Quiet nature retreat, wellness-oriented | Countryside: peaks 40-65 |
| Rural Plot | Agricultural/estate countryside, the most established local community of all locations | Countryside: peaks 45-70, the oldest tendency in the game |
| Industrial | Raw, working-city fringe, grittiest identity, authentic over generational | Broad 25-50 |
| Harbour | Working waterfront with some transient/tourist crossover from boat traffic | Broad, slightly older than Industrial 30-55 |
| Water Plot | Isolated, requires a deliberate trip - self-selects for experience-seekers | Broad but skewed toward those who plan ahead, 30-60 |
| Urban Lot | Dense city block, everyday convenience, no waterfront glamour, no tourist draw | Young-to-midlife 22-45 |
| Hotel Rooftop | Hotel guest base - business travellers and well-off couples, not local residents | Skewed older/established 35-65 |

Every location tendency is 18-100 in full range regardless of its peak - see the Core Rule above and `src/sim/guestWeek.ts`'s `sampleAge()`.

### Layer 2: Building appeal (independent of which location it sits on)

| Building | Appeal (why guests prefer the *building*) |
| --- | --- |
| Small Timber Cabin | Intimate, calm, nature-integrated -> pulls toward Recovery/Ritual |
| Pavilion | Light, purpose-built, view-oriented, higher investment -> pulls toward Ritual/Special premium |
| Saunatelt Camp | Cheapest, temporary, informal -> pulls toward price-sensitive Social/Routine, away from Special premium |
| Container Compound | Modular, raw, repeatable -> pulls toward Routine/value |
| Country Estate with Barn | Grand, destination-scale, high investment -> pulls toward Special premium/Social (barn gatherings) |
| Boathouse | Compact, direct water relationship -> pulls toward Recovery/Ritual |
| Repair Workshop | Honest industrial conversion, adaptable (see the tagged routes above) -> pulls toward Ritual/Social |
| Small Depot | Modest, practical, capacity-capped -> pulls toward Routine |
| Warehouse | Large volume, event-capable -> pulls toward Social/Special premium |
| Fiskehus | Robust maritime material character -> pulls toward Social/Recovery |
| Floating Sauna | Intimate, novelty, small capacity -> pulls toward Special premium/Social, away from Routine |
| Rooftop Sauna | Exclusive materials, skyline, luxury -> pulls toward Special premium |
| Former Kursted / Badesanatorium | Rare, historic premium destination, large restored building -> pulls toward Special premium/Ritual, away from Social/Routine |

### Merged result (location x building -> the actual venue profile)

All 36 location x building pairs permitted by `building-library-v0.1.md` are covered below - not a hand-picked sample. Only Canal + Repair Workshop is actually implemented; every other row is a documented target the owner has reviewed at the level of *how* it is derived, not line by line - treat any row as open to correction the first time its location is actually built, not as finished balance. Revised 2026-08-26 against three owner corrections to the first pass:

1. **Location pulls roughly as hard as the building, not a minor nudge on top of a building-dominant shape.** Industrial, Forest Lake and Rooftop should each feel clearly different even for the same building.
2. **Special premium follows the felt uniqueness of the actual combination, not the building's construction cost alone.** A cheap tent at sunset on an empty beach can genuinely feel special; a Small Depot in a mid-city industrial estate cannot, no matter how well run. Every row below was reconsidered by asking "what would a real guest actually feel here", not by a fixed formula.
3. **The building may shift age slightly, but the location still leads.** A Country Estate or Former Kursted skews a couple of years older than a tent camp on the same plot; it never overrides the location's own range.

No single need exceeds ~45% anywhere (even at the most extreme premium destinations) and none is ever 0%, per the existing "never mega-locked" rule.

| Combination | Age | Price | Recovery | Ritual | Social | Routine | Special premium |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Canal** + Repair Workshop | Peaks 20-35 | Medium-high | 20% | 20% | 25% | 25% | 10% |
| Canal + Boathouse | Peaks 20-35 | Medium-high | 25% | 25% | 20% | 20% | 10% |
| **Coast** + Small Timber Cabin | Broad 25-55 | Medium | 30% | 20% | 20% | 10% | 20% |
| Coast + Pavilion | Broad 25-55 | Medium-high | 20% | 20% | 20% | 5% | 35% |
| Coast + Boathouse | Broad 25-55 | Medium | 25% | 20% | 25% | 15% | 15% |
| Coast + Country Estate with Barn | Broad 25-55, slightly older | Medium-high | 15% | 20% | 25% | 5% | 35% |
| Coast + Former Kursted/Badesanatorium | Broad 25-55, noticeably older | High | 15% | 25% | 10% | 5% | 45% |
| **Beach** + Saunatelt Camp | 20-45 | Low-medium | 20% | 5% | 30% | 25% | 20% |
| Beach + Container Compound | 20-45 | Low-medium | 15% | 10% | 35% | 30% | 10% |
| Beach + Small Timber Cabin | 20-45 | Low-medium | 30% | 15% | 25% | 10% | 20% |
| Beach + Pavilion | 20-45, slightly older | Medium | 20% | 15% | 25% | 5% | 35% |
| **Forest Lake** + Saunatelt Camp | Peaks 40-65 | Low-medium | 35% | 10% | 20% | 20% | 15% |
| Forest Lake + Container Compound | Peaks 40-65 | Low-medium | 30% | 10% | 15% | 35% | 10% |
| Forest Lake + Small Timber Cabin | Peaks 40-65 | Medium | 35% | 30% | 10% | 10% | 15% |
| Forest Lake + Pavilion | Peaks 40-65, slightly older | Medium-high | 25% | 20% | 10% | 5% | 40% |
| Forest Lake + Country Estate with Barn | Peaks 40-65, slightly older | Medium-high | 20% | 20% | 20% | 5% | 35% |
| Forest Lake + Former Kursted/Badesanatorium | Peaks 45-70 | High | 20% | 25% | 5% | 5% | 45% |
| **Rural Plot** + Saunatelt Camp | Peaks 45-70 | Low-medium | 30% | 15% | 20% | 25% | 10% |
| Rural Plot + Container Compound | Peaks 45-70 | Low-medium | 25% | 15% | 15% | 35% | 10% |
| Rural Plot + Small Timber Cabin | Peaks 45-70 | Medium | 35% | 25% | 10% | 15% | 15% |
| Rural Plot + Country Estate with Barn | Peaks 45-70, slightly older | Medium-high | 15% | 25% | 25% | 5% | 30% |
| Rural Plot + Former Kursted/Badesanatorium | Peaks 50-75, the oldest in the game | High | 20% | 30% | 5% | 5% | 40% |
| **Industrial** + Saunatelt Camp | Broad 25-50 | Low-medium | 15% | 5% | 35% | 35% | 10% |
| Industrial + Container Compound | Broad 25-50 | Low-medium | 15% | 10% | 30% | 25% | 20% |
| Industrial + Repair Workshop | Broad 25-50 | Low-medium, rewards a genuine concept | 10% | 25% | 30% | 25% | 10% |
| Industrial + Small Depot | Broad 25-50 | Low-medium | 15% | 5% | 25% | 45% | 10% |
| Industrial + Warehouse | Broad 25-50, event nights skew slightly younger | Medium, rewards a genuine concept | 10% | 5% | 35% | 15% | 35% |
| Industrial + Fiskehus | Broad 25-50 | Low-medium | 20% | 15% | 30% | 25% | 10% |
| **Harbour** + Container Compound | Broad 30-55 | Low-medium | 15% | 10% | 30% | 30% | 15% |
| Harbour + Boathouse | Broad 30-55 | Medium | 25% | 20% | 20% | 20% | 15% |
| Harbour + Warehouse | Broad 30-55, event nights skew slightly younger | Medium, rewards a genuine concept | 10% | 15% | 30% | 15% | 30% |
| Harbour + Fiskehus | Broad 30-55 | Low-medium | 20% | 20% | 25% | 25% | 10% |
| **Water Plot** + Floating Sauna (only base) | 30-60 | High | 15% | 10% | 30% | 5% | 40% |
| **Urban Lot** + Saunatelt Camp | 22-45 | Medium | 15% | 5% | 25% | 45% | 10% |
| Urban Lot + Container Compound | 22-45 | Medium | 15% | 10% | 20% | 40% | 15% |
| **Hotel Rooftop** + Rooftop Sauna (only base) | Peaks 35-65 | Very high | 15% | 20% | 15% | 5% | 45% |

Money/price tolerance is intended to move the same direction as the location's general economic context; this is expressed today only through Canal's existing `credibleAdmissionPrice` price-resistance curve in `canalBalance.ts`. See `remaining-work-overview-v0.1.md` for the priority order in which these locations actually get built.

All ten locked location families are now covered (Canal, Coast, Beach, Forest Lake, Rural Plot, Industrial, Harbour, Water Plot, Urban Lot, Hotel Rooftop). Money/price tolerance is intended to move the same direction as the location's general economic context; this is expressed today only through Canal's existing `credibleAdmissionPrice` price-resistance curve in `canalBalance.ts`. The other rows are a documented target for when those locations are actually implemented, not a claim that they already behave this way - see `remaining-work-overview-v0.1.md` for the priority order.

## Visit Lifecycle

```text
discover -> decide -> arrive -> queue/check-in -> sauna/program -> recovery/linger -> shop (optional) -> leave -> memory/return decision
```

1. **Discover:** awareness, marketing and reputation determine whether the guest considers the venue.
2. **Decide:** location, price, opening hours, current offer and expected fit determine whether they come today.
3. **Arrive:** the exterior provides first impression; the guest may inspect the queue and change their mind.
4. **Queue/check-in:** queue tolerance and available time decide whether they wait, buy, choose an alternative session or leave.
5. **Sauna/program:** capacity, program availability, Master fit and heat style determine the central experience.
6. **Recovery/linger:** guests use only built, compatible routes such as shower, cold plunge, natural water, spa, terrace or rest seating.
7. **Shop and equipment:** some guests buy a suitable item, rent a venue towel, bring their own equipment or buy nothing, which are all valid behaviours. Venue towels use an authored return basket or a capped recovery-field return prop; a Service Host may visibly collect them.
8. **Leave:** the visit becomes a short personal reaction and contributes to finances, reputation and return probability.

## Queue and Capacity Behaviour

Queues are a real visible signal, not a random penalty.

| Situation | Typical guest response | Player remedies |
| --- | --- | --- |
| Queue is short and expected value is high | Waits; may browse shop or talk with companions | No action needed. |
| Queue conflicts with available time | Leaves or returns at another time | Adjust opening hours/program timing, add capacity, reduce price pressure. |
| Queue exceeds personal tolerance | Avoids entry, abandons queue or leaves a negative queue-specific comment | Improve changing/entry/sauna capacity, add a relevant host, spread program demand. |
| Program is full but another fitting activity exists | Uses recovery/terrace, buys, waits for next session or returns later | Add another program, increase frequency, improve surrounding experience. |
| Venue is quiet but the offer fits | Stays longer and may become a repeat visitor | Keep/market the successful concept. |

No guest should be angry merely because the venue is popular. A bad reaction needs a visible friction: excessive wait, missed session, poor fallback, unsuitable price or inadequate capacity.

## Time and Visit Length

Guests do not all stay equally long.

| Visit shape | Behaviour | Common causes |
| --- | --- | --- |
| Quick reset | Sauna plus one recovery activity, limited queue tolerance | Routine visit, short available time, daytime slot. |
| Program visit | Arrives around a booked/expected Aufguss, may use recovery before or after | Ritual or social motivation. |
| Social linger | Uses seating, warm recovery or shop more often after sauna/program | Social motivation and compatible outdoor space. |
| Destination stay | Uses several facilities and accepts a longer journey/price when delivery matches promise | Premium/recovery motivation and strong setting. |
| Aborted visit | Leaves before entering or after a failed queue/program decision | Time, queue, price or fit conflict. |

The renderer may simplify interior time, but exterior return/exit timing must honestly reflect these visit shapes.

## Player Inspection Card

Tapping a visible guest opens a compact, dismissible card. It must not become an exposed-stat inspector.

```text
Nora, 34
Here for: Quiet recovery
Now: Waiting for the 18:30 Aufguss

Enjoying
• The canal-side cold-water option

Frustrated by
• The queue is close to her limit

Visit so far
“This is nearly the reset I needed.”
```

Rules:

- Show one or two current positives and at most one concrete friction.
- Before enough of the visit has happened, show intent and current state, not a final review.
- Show natural language, never raw preference scores, queue-tolerance numbers or hidden probability.
- A profile updates as the guest's visit changes.
- Returning guests may show one short memory such as “Came back after last week’s Birch After Work.”

## Feedback Contract

Every dislike, abandonment or weak return outcome must map to a meaningful decision area.

| Guest signal | Underlying decision area |
| --- | --- |
| “Too crowded to unwind” | Capacity, program frequency, opening hours, recovery capacity. |
| “The queue was not worth it tonight” | Entry/changing/sauna throughput, session timing, alternative offer. |
| “Great Aufguss, too intense for me” | Program composition, Master fit, alternative gentler program. |
| “I wanted a proper cooldown” | Shower, cold plunge, natural-water access, terrace/recovery route. |
| “Beautiful place, but not worth that price” | Price versus actual program/service/presentation delivery. |
| “I had what I needed and left” | Valid quick visit; not automatically a failure or shop problem. |

The game may show mixed experience: one guest can love the Aufguss and still dislike the queue. This is evidence for improving a specific part of a successful concept, not proof that the concept is wrong.

## First Playable Implementation

The first working guest simulation needs only a small, legible subset:

1. Generate guests with name, age, main motivation, available time and queue tolerance.
2. Let them arrive, inspect capacity, enter or leave, and use one selected activity.
3. Let Program Sauna, Gusgård, shower and cold plunge alter the available choices.
4. Show a clickable profile card with current state plus one positive or friction.
5. Record a simple leave outcome: satisfied, mixed, frustrated or aborted.
6. Aggregate these outcomes into a short daily/weekly venue report.

All other axes, richer groups, repeat memories and extensive guest content build on the same model rather than requiring a redesign.

### Current Canal implementation

The Canal sample now assigns every visible visit one of six motivation profiles: quiet recovery, reliable ritual, social reset, cold-water recovery, small treat or new-program curiosity. Profiles express a natural-language goal, positive/negative consideration, compatible Gus intents and whether a shop stop is plausible. A visible guest attends a compatible Gus where possible, remains open to one representative Gus if the sample would otherwise hide all program activity, or uses basic sauna when the active Gus is not their reason for visiting. The inspection card states `Strong match`, `Open to it` or `Not their main reason today`; it never exposes a score. This is intentionally still a representative sample over aggregate admissions, not the full returning-guest pool.

## Content Variety and Memory Rules

The simulation must not make a living venue sound like it has six people and six sentences. Variety is authored as content data, then combined with the actual visit state. It is not solved by replacing good feedback with meaningless random flavour.

### Names and returning guests

- Generate names from broad English-language and internationally plausible first-name/surname libraries, with a stable guest ID and palette appearance. The first production library should support at least `1,000` plausible visible full-name combinations before a duplicate is likely in ordinary play.
- Do not duplicate a full name among active/recent guests in the same venue unless it is deliberately the same returning person.
- A returning guest keeps the same name, age progression, visual palette and meaningful memory. Seeing “Nora” return because a prior experience was good is valuable evidence, not repetition.
- The local regular pool is limited and intentional. A venue should have a mixture of recognisable returners and new faces; it must not repeatedly recycle the same few people merely because the simulation needs sprites.
- Age is generated independently of the visit motivation. Appearance variety and name variety never change a guest's hidden mechanical value by themselves.

### Feedback library

Each concrete cause needs a bank of authored phrasing rather than one fixed sentence. The first content pass targets:

| Content family | Minimum authored roots | Contextual variations |
| --- | --- | --- |
| Positive facility/program reaction | 12 | Facility, time of day, motivation, intensity, location |
| Queue/capacity friction | 10 | Queue stage, lost activity, available time, fallback choice |
| Price/value reaction | 10 | Entry/program/shop, expected versus delivered value |
| Recovery/comfort reaction | 12 | Missing or successful shower, cold, warm, rest and setting route |
| Arrival/service reaction | 10 | First visit/return, clarity, welcome, workload, timing |
| Mixed visit reaction | 15 | One success plus one concrete friction |
| Return memory | 10 | Earlier visit, favourite program, changed condition, new facility |

Phrasing combines only truthful facts from the visit. For example, a guest may say a program was “worth staying for” only if they actually attended it; they may not complain about a shower that they never needed or could not plausibly reach.

### Repetition protection

1. The exact same profile-card sentence may not be used again among the previous `30` completed visits at the same venue.
2. The same feedback root is put on cooldown for the next `8` relevant guest outcomes, unless the player has made no change and the condition is severe enough to be the venue's current dominant problem.
3. Weekly reports select patterns, not random individual remarks. They group repeated causes into one observation and choose fresh wording.
4. A guest profile prioritises their newest meaningful state. It does not repeat the same “likes cold water” line across every step of one visit.
5. If a venue has a persistent issue, feedback evolves: first a guest notices it, later a repeat guest may stop returning, and the weekly report identifies the pattern. It must not repeat one complaint unchanged forever.

### Content States

The content bank must cover more than praise and complaints:

- anticipation before a first visit
- queue decision and plan change
- genuine neutral/efficient visit
- partial success and mixed outcome
- complete satisfaction
- frustration and early departure
- regular habit and return recognition
- reaction to a newly built facility or changed program

This keeps individual guests useful as evidence while giving the venue a believable social texture over many real days of play.

### Content Approval Gate

All player-facing guest names, profile-card wording, comments and assembled sentence combinations are English. Before a content batch enters the game, it is presented as a readable review sheet grouped by cause, tone and visit state. The project owner approves, rejects or rewrites the combinations before they are added to the production library. The simulation may combine only approved content fragments.

## Inclusive Appearance and Behaviour

Guest appearance is visual variation, not a behavioural model. Body silhouette, skin palette, hair, clothing/towel palette, name, age and any gender expression are generated independently of price comfort, visit motivation, queue tolerance, spending, cleanliness, staff response and all hidden mechanical values. Several guests are non-binary as an ordinary part of the venue population; the game does not label or announce this, and profile cards have no gender field. The generator must avoid race, gender, age, body and disability stereotypes in names, comments, preferences and actions. `scene-effects-inventory-v0.1.md` defines the related towel/service loop and visual contract.
