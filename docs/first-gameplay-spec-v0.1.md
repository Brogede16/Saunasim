# Sauna Sim: First Gameplay Specification v0.1

Last updated: August 23, 2026

## Status and Purpose

This is the first coherent gameplay specification for `Sauna Sim`. It turns the decisions in `decision-log.md` into a playable model and evaluates them against three requirements:

1. **Good management-game play**: decisions must be understandable, consequential and satisfying to revisit.
2. **Player psychology**: the game should sustain autonomy, competence and anticipation without traps, coercive timers or opaque punishment.
3. **Future fair competition**: the local prototype must not establish rules that become unfair when shared ranking and multiplayer arrive.

If this document conflicts with `decision-log.md`, the decision log wins.

## 1. Product Thesis

`Sauna Sim` is a real-time management game about building a respected sauna brand by making a recognisable sauna concept work in real locations.

The player does not optimise an exposed demographic spreadsheet. They read a place, shape a venue, watch guests respond, improve the concept, and compare their standing with nearby rivals.

The player observes a compact top-down pixel-art exterior scene and makes decisions through a flexible management interface. The scene is a living consequence of the simulation; it is not the source of simulation truth.

## 2. Design Guardrails

### 2.1 Every decision needs a readable consequence

The player should be able to make a reasonable prediction before a decision and understand the result afterwards.

```text
Site + local context
       +
Venue concept, price, programs, staff, facilities and marketing
       |
       v
Awareness, guest expectations, demand and operational load
       |
       v
Attendance, queues, experience, spending, reviews and costs
       |
       v
Cash, venue reputation, brand reputation, Standing and venue value
       |
       v
Upgrade, adapt, expand, standardise or sell
```

### 2.2 No objective trap sites

Every generated site offer must enable a viable strategy. A player can make a poor choice for their desired concept, but the generator must not offer an unwinnable start or three properties that cannot be afforded.

### 2.3 No mobile-game waiting model

Time is always running, but time must create operational context rather than empty waiting:

- no paid skips
- no manual claim buttons
- no construction timer whose only purpose is retention
- no time penalty for merely rejecting a site offer; a new broker search is a separate, visible action

The player can pay more in normal game currency for faster construction. This competes with other investments and is therefore a legitimate strategic choice.

### 2.4 Hidden formulas, visible causes

The player should not see a full appeal equation. They must, however, receive human explanations such as:

- "The new rooftop plunge has become a talking point for evening guests."
- "Visitors enjoy the program, but the changing area cannot handle the late rush."
- "Your premium opening campaign is drawing interest beyond the local area."

Avoid feedback such as `appeal -6` without a cause.

## 3. The First Playable Loop

### 3.1 Start a venue

The game presents three generated, affordable site offers. Every offer has an existing physical starter base: a converted building, a container compound, a tent camp or a floating sauna. Every offer is priced so the player can afford the site plus its essential opening work.

The player sees:

- a name and short description of the place
- building or site type
- purchase/rent price and recurring cost
- size and obvious expansion potential
- visible surroundings, including water or outdoor potential
- qualitative market clues

The exterior scene is assembled in layers: an authored environment backdrop, a reusable venue/building layer, visible upgrades, a small prop layer and guests/ambient effects. A controlled library of roughly 10-20 backdrops creates distinct sites without needing a bespoke full illustration for every offer. Backdrops provide limited simulation tags such as urban flow, outdoor room, natural-water access, destination potential and acquisition pressure; these shape price and appeal but never dictate a single viable concept. Every backdrop and building also carries setting tags, and the generator only combines plausible pairs: a warehouse can appear by a harbour, canal or railway district, while a cabin belongs at a forest, lake or coast.

Each backdrop also uses reusable day, evening and night layers rather than three separately illustrated versions. Palette shifts, exterior/window light, steam/smoke and a few contextual ambient effects make opening hours and evening programs readable at low asset cost.

### 3.2 Find further sites

Three current offers remain available until the player chooses a site or a broker search completes. Rejecting one is free. A completed search replaces the entire batch of three, so the player weighs three directions instead of preserving one ideal offer indefinitely. To generate a new batch, the player starts a broker search in one of three financial bands:

| Search | Intended site range | Baseline wait | Cost principle |
| --- | --- | --- | --- |
| Budget | Low-cost plots, tents, containers and modest conversions | ~1 in-game hour | Lowest immediate-result commission |
| Standard | Typical conversions and mixed opportunities | ~2 in-game hours | Normal immediate-result commission |
| Premium | Expensive, prestigious or unusual opportunities | ~3 in-game hours | Highest immediate-result commission |

The wait represents an active search while the rest of the game continues and has no separate fee. The player can pay the clearly stated commission for immediate results. This pays for service and access to a different property market; it must never be a hidden purchase of a stronger random roll. Values are balance targets to validate in playtests.

The player does not see raw demographics, demand values or a calculation of the "best" option.

### 3.2 Set an initial concept

Before opening, the player chooses a small number of concrete decisions:

- name and visual identity
- visible price
- initial sauna installation and facilities
- offered Aufguss programs and frequency
- first marketing choice, if any
- staff hires, if any

The player begins alone as the unseen owner. They can cover basic operation, but cannot create consistently high capacity or high-quality specialist service alone.

Every venue has dedicated management menus. The first menu structure is:

- **Overview:** exterior view, current pulse, cash and urgent signal
- **Programs:** offered Aufguss and frequency
- **Team:** staff, cost, workload and program fit
- **Venue:** facilities, upgrades and construction
- **Shop:** small product assortment and sales performance
- **Guests:** comments, retention signals and weekly patterns
- **Finances:** entry price, revenue mix, costs, debt and valuation

The shop is deliberately light. It opens with a visible Reception Shop or service hatch. The player chooses a small 3-5-product range from drinks, towels/bathrobes, wellness products and snacks; the system handles replenishment and product pricing in v0.1. Every sale has an underlying procurement cost, and automatic restocks appear as visible costs in reporting. Stronger brand identity can later support venue or signature-Program merchandise, which carries a higher small-batch procurement cost but a higher system-managed sale value.

### Current Canal shop implementation

Canal uses a three-item active range rather than a stock-count minigame. The initial selection is Cold Water, Sauna Towel and House Blend Oil; the player may switch among cold water, herbal tea, towel, house-blend oil, fruit/nut pack and a higher-cost `Signature Towel`. Each item has a visible retail price, procurement cost and concise purpose. The weekly ledger allocates all actual purchases across the selected items and shows the concrete line-item quantities alongside aggregate shop revenue and procurement. `Signature Towel` is the first small venue-logo product: its purchase cost and sales price are both higher, not a generic revenue multiplier.

### 3.3 Observe a live operating period

The shared game clock runs continuously. The exterior scene communicates the venue's pulse:

- guests arrive and enter
- an entrance queue forms when relevant
- guests use visible outdoor facilities
- a busier site visibly attracts more guests
- chimney smoke, water, city movement, steam and lighting communicate activity

The game simulates individual visits, normally in the range of 30-100 guests per venue. The renderer may pool or simplify sprites, but visible activity must scale honestly with demand.

### 3.4 Review and adapt

At weekly and monthly boundaries, the management interface presents a concise review. Under the current pacing target, an in-game week equals one real 24-hour day, so the weekly review arrives once per real day. Rolling signals and small operational summaries provide useful feedback before then:

- financial result
- notable demand and capacity patterns
- top guest comments
- strongest and weakest program
- local reputation/Standing movement
- one useful explanation and one unresolved opportunity

The review must always point to an actionable next decision.

## 4. Site Offers and Property Types

### 4.1 Property forms

| Form | Early availability | Main promise | Main cost |
| --- | --- | --- | --- |
| Existing building | First site and common | Opens quickly | Existing limitations and rent/purchase cost |
| Tent camp | First site where compatible | Low-cost small-scale outdoor start | Limited capacity and comfort |
| Container compound | First site where compatible | Modular industrial/outdoor start | Limited capacity and comfort |
| Floating sauna | Water Plot only | Direct water ritual in a tiny footprint | Very limited capacity and one building family |

Tent, container and floating-sauna offers are existing starter bases, not blank land that the player builds from scratch. They can expand in visible stages while retaining their original building family.

Natural water is valuable because it enables distinctive cold-water facilities. It should usually increase acquisition cost, not act as a free bonus.

### 4.2 Site context is not an aesthetic rulebook

Do not make rules such as "glass only works in cities". The model has three separate questions:

| Layer | Question | Example |
| --- | --- | --- |
| Feasibility | Can this be built here, and what does it cost? | A city plunge becomes a costly rooftop facility. |
| First impression | Does the exterior support the promise? | A well-lit roof terrace helps an evening concept feel deliberate. |
| Experience | Does the actual visit deliver? | Good Aufguss and service turn initial interest into reviews. |

Most fit effects should be subtle. Strong negative effects are reserved for obvious mismatches or badly executed operations.

### 4.3 Creating demand instead of only matching it

Local conditions define a starting audience, not a permanent cap. A distinctive, expensive or exclusive sauna can attract guests from outside its normal area through its reputation, program identity and marketing.

This prevents the game from saying "city means one correct concept, countryside means another." The player's concept can change the market over time.

## 5. The Exterior Pixel World

### 5.1 What the player sees

The primary view is an exterior diorama: the building, its surroundings, its outdoor facilities and guests moving between relevant visible locations. The interior is never a detailed cutaway.

The management interface controls the venue. The venue scene communicates outcome, atmosphere and growth.

### 5.2 Building variation without asset explosion

Do not author 40 mechanically unique buildings with ten bespoke animations each. Build a compositional system:

```text
location palette + base building family + growth silhouette + exterior modules + ambience
```

Examples of reusable exterior modules:

- deck or terrace
- cold plunge
- outdoor pool
- natural-water bathing bridge
- roof facility
- glass extension
- signage
- lighting
- planting
- small cafe/service hatch

The player should not see empty, pre-marked building slots. A completed upgrade should be a reveal: the familiar building becomes visibly more ambitious.

### 5.3 Visual language and animation budget

Use a classic 16-bit handheld-RPG clarity: broad colour areas, readable silhouettes, small reusable tiles and restrained texture.

Static by default:

- buildings
- furniture and plant props
- most decorative choices

Small looping activity:

- water
- chimney smoke
- fire
- street or harbour movement
- guest walking and sitting

Aufguss is the visual exception. It gets reusable multi-frame towel, steam, lighting and scent effects that make programs memorable.

### 5.4 Guest routes and visible use

Each environment template defines a compact authored route graph rather than requiring free-form pathfinding. It supplies shared route nodes such as arrival, entrance, exit, terrace, service hatch and water access. Base buildings and outdoor upgrades attach to fixed compatible route anchors. This keeps paths plausible and easy to draw while allowing the same building to work in several compatible environments.

The simulation chooses visible actions from actual guest use. The renderer then plays a short shared sequence: walk to entrance, disappear inside, later reappear, sit on a terrace, pause at the service hatch, enter water, bob/swim briefly, then return. A built pool also enables a contained shared swim loop, rather than unrestricted swimming/pathfinding. Facilities that are not built have no active route. The required shared animation set is eight-bearing walking with four phases per bearing, door enter/exit, sit/stand, shop stop, water enter/exit, water idle and a pool-swim loop, with a winter ice-opening variant. Aufguss remains the richer exception.

### 5.5 Guest inspection

The player can tap any visible guest in the venue scene. This opens a compact profile card rather than a full character-management screen. It shows:

- generated name and age
- current activity and visit stage
- the guest's main visit motivation in natural language
- one or two things the current venue is delivering well for them
- one concrete friction or unmet need when relevant, such as a queue, lack of recovery, price mismatch or program fit
- a short reaction once the guest has enough experience to form one

The card is evidence, not an exposed formula: it never shows exact hidden preference values or implies that age alone determines taste. It closes quickly and leaves most of the venue visible on mobile.

## 6. Appeal, Expectation and Guest Experience

### 6.1 Three stages of guest response

| Stage | Main inputs | What it changes |
| --- | --- | --- |
| Before visiting | Site, exterior appeal, price, brand awareness, marketing | Who considers booking or visiting |
| During the visit | Capacity, staff, facilities, program and execution | Satisfaction, spend and likelihood of returning |
| After the visit | Experience against expectations | Reviews, word of mouth, venue reputation and brand movement |

Marketing must amplify a real promise. It should not be a separate bait-and-switch meter that deliberately creates bad reviews. Poor execution or insufficient capacity can still mean that an honest promise is not delivered.

### 6.2 Preference model

Use a small number of hidden preference dimensions. The first player-facing visit motivations are:

- rest and recovery
- ritual and tradition
- social experience
- convenient routine
- special premium experience

Guests may hold more than one preference, but one main visit motivation should be legible in behaviour and feedback. The local mix remains hidden. Some guests value proximity; others will travel for a distinctive program, destination quality or a strong brand.

Supporting experience axes can remain hidden for later balancing:

- ritual-oriented vs casual
- calm vs social
- accessible vs premium
- traditional vs show-oriented
- low-intensity vs high-intensity

Guests are not stereotypes. These are experience preferences, not demographic labels.

An upgrade or program may be excellent for one preference and merely adequate for another. The player learns from guest behaviour, reports and comments, not a visible percentage formula.

### 6.3 Capacity is a separate system from demand

Demand says who wants to come. Capacity says whether the venue can deliver a good visit.

Core capacity pressures:

- sessions and sauna seats
- opening hours and number of programs
- changing and shower throughput
- cold-water capacity
- staff availability
- service throughput

This prevents the optimal strategy from simply being "attract more guests." A popular program can create a good problem, then require an upgrade or staffing solution.

## 7. Aufguss: The Signature System

### 7.1 Player-facing construction

An Aufguss program consists of:

- player-chosen name
- heat
- duration
- scent
- music or mood
- performance style

A program may also use optional facility-backed phases, such as a cold-water/recovery phase or an outdoor water ritual. These become available when the venue has the relevant physical upgrade.

The player chooses which programs each sauna room offers and how often. The game places them sensibly within opening hours and capacity; the player does not operate a detailed manual timetable in v0.1. Multiple rooms may operate parallel programs if the venue has the staff and capacity.

The player sets the venue's opening and closing time and its operating days. Longer hours create more potential capacity and more program space, but increase wage, workload and operating costs. Guest availability varies across dayparts and between weekdays and weekends based on visit motivation and local rhythm, not hard demographic stereotypes.

### 7.2 Availability and cost

Do not use a deep unlock tree. Most content is available, with premium scents, styles and ingredients limited by their running cost. This protects player autonomy and lets concepts exist early, while preserving a real financial trade-off.

### 7.3 Visual identity

Every program receives a clear signature through a reusable combination of:

- emblem or poster
- scent/steam colour accent
- steam pattern
- lighting choice
- towel-work pattern
- sound cue

These are combinations from a shared asset library, not bespoke animation sets for every recipe.

### 7.4 Program outcome

Programs should be excellent for some preferences and only average for others. A poor session should primarily hurt that session and local reviews, not permanently destroy the whole chain's brand.

## 8. Staff

### 8.1 Player role

The owner is not a visible avatar and has no appearance customisation. The management interface is their operational tool. Starting alone means the owner covers basic work invisibly.

### 8.2 Hiring model

All staff roles can appear from the start. Do not gate roles behind arbitrary research. Cost, scarcity and fit decide when an employee is useful.

Staff have only 2-3 meaningful attributes, for example:

- service reliability
- Aufguss style fit
- operating efficiency

An employee's style improves relevant programs without making other programs impossible. Staff can gain modest experience over time.

### 8.3 Operations

Staff follow the selected programs, opening hours and facilities automatically. There is no shift-by-shift micromanagement.

Workload has a simple effect on quality. Staff leave only when dismissed or unpaid, avoiding a separate HR-drama subsystem.

## 9. Marketing and Brand

Marketing should be concrete and legible:

- exterior signage
- a program poster
- local campaign
- opening event

It is optional. A good sauna can grow through reviews and word of mouth.

Specific Aufguss programs can be marketed as named experiences. As chain brand awareness grows, marketing becomes cheaper or more effective.

Keep three public concepts separate:

| Layer | Meaning | Primary effect |
| --- | --- | --- |
| Venue reputation | How this site is viewed now | Local demand, reviews, return visits |
| Brand reputation | What the chain is known for | Awareness, site opportunities, staff interest, valuation |
| Standing | Relative prestige in the ranking | Competitive goal and nearby comparison |

Brand reputation can become negative. The interface must explain whether that is caused by one bad venue or a repeat chain pattern.

## 10. Economy, Ownership and Failure

### 10.1 Money flows

Income:

- admission
- optional facilities and services
- shop, cafe, towel/bathrobe rental or sale where installed

Costs:

- rent or property debt
- wage costs
- program and service operating cost
- construction and upgrades
- optional marketing

Some guests bring their own equipment and therefore do not buy every service. This makes amenity mix matter without making every visitor identical.

### 10.2 Pricing

Show exact currency prices. Each new venue receives a suggested opening price, but the player sets the final visible entry price before opening and may only change it between operating periods. Standard Aufguss is included; selected premium or show sessions may be sold as paid extras. Price is a simple, visible venue decision, not a hidden band.

### 10.3 Loans and bankruptcy

Loans are simple borrowing choices with automatic repayment. Do not model detailed rate negotiation.

The player may sell a venue with debt. Valuation accounts for the property, building, installed upgrades, performance, condition and brand effect, then deducts outstanding debt.

Bankruptcy is possible only after borrowing options are exhausted or the player explicitly declares bankruptcy. Before that, the game should make recovery paths visible: sell, borrow, reduce costs or change operations.

## 11. Real-Time, Construction and Offline Progress

### 11.1 Shared clock

The game has no pause. A future competitive mode needs one shared timeline, so changing client-side speed must never affect results. The current pacing target is one in-game week per real 24-hour day, or approximately one in-game day every 3 hours and 25 minutes. This is a balance target, not an irreversible technical constant.

The prototype may run locally, but every simulation command should accept an authoritative `now` timestamp and be safe to replay from a time interval. This preserves the path to a server-run calendar later.

### 11.2 Construction

| Project type | Completion approach | Player trade-off |
| --- | --- | --- |
| Small operational change | Immediate or next relevant operating period | Small cost; no artificial delay |
| Standard upgrade | Short real-time project | Cost and a temporary operational inconvenience |
| Major/prestige expansion | Longer bounded real-time project | Major cost, construction impact and a meaningful visual reveal |
| Rush construction | Faster completion | Extra in-game contractor cost |

Construction completes automatically when the player is offline. There is no claim action.

### 11.3 Offline operation

Venue activity should catch up deterministically from the last authoritative timestamp. The player should return to an understandable summary, not pages of unreadable events.

## 12. Ranking and Future Multiplayer

### 12.1 The single-player first phase

From the first venue, the player can open a dedicated Ranking screen with a nearby rival and a local Standing ladder. In the prototype, rivals can be simulated competitors. The important promise is already present: the player knows who is just above them, why, and what could close the gap. Ranking is not mixed into the Chain Overview, which stays focused on running and expanding the portfolio.

### 12.2 Competitive multiplayer later

When real-player competition arrives:

- competitive weekly or monthly periods use the same real shared calendar for everyone and remain separate from in-game weeks
- rankings compare a clear Standing score, not raw cash alone
- client devices send intent, not final financial or ranking results
- server-side simulation becomes the authority for time, cash, construction completion, reviews and ranking
- the exterior scene remains a client-side presentation of trusted simulation data

This is necessary for fairness. Competitive game architectures generally make the server the authoritative state holder rather than trusting clients to determine outcomes.

### 12.3 Do not add social pressure too early

Do not begin with raids, attack mechanics, guild obligations, push notifications or fear-of-missing-out events. The first competitive layer should be an asynchronous, shared-period ranking with transparent results.

## 13. Psychological Test

The game should deliberately support three useful player experiences:

| Need | Sauna Sim expression | Design risk to avoid |
| --- | --- | --- |
| Autonomy | Several viable sites, concept choices, adaptation or standardisation | One hidden optimal build or forced unlock path |
| Competence | Clear diagnosis, visible venue growth, causal feedback | Opaque formulas and unexplained failure |
| Relatedness/recognition | Ranking, reviews, later shared periods | Aggressive social obligation or humiliation |

This framing is consistent with self-determination theory's emphasis on autonomy, competence and relatedness as motivational needs. It is a design lens, not a promise that a game can universally satisfy every player.

## 14. What to Borrow and What to Avoid

### Game Dev Tycoon

Borrow:

- a compact management loop where decisions are easy to make and outcomes are easy to read
- satisfying growth from small operation to recognisable company
- a visible workplace/world that makes an abstract simulation feel tangible
- a rejection of forced wait-times and retention-first friction

Avoid:

- hidden optimal combinations that players solve through guides instead of learning through feedback
- a progression system that delays the player's preferred concept solely because it is locked
- complexity that turns staff into a large stat spreadsheet

### Modern live and mobile management games

Borrow:

- asynchronous operation and concise return summaries
- satisfying visible venue upgrades
- shared periods for clear competition

Avoid:

- real-time waiting as a monetisation lever
- paid speed-ups
- timer pressure, manual claims and event overload
- leaderboards dominated purely by spending or online duration

## 15. Implementation Contract

The first code milestone should not attempt all of the game's content. It should make this contract true for one generated venue:

1. Three viable site offers exist.
2. The player chooses one, sets a price, program frequency and staff choice.
3. Individual guests are simulated over a continuously advancing clock.
4. The exterior pixel scene reflects arrival, exterior use and demand level.
5. A weekly report diagnoses fit, execution, capacity or timing.
6. Cash, local reputation and Standing change from the same simulation result.
7. One small upgrade and one major upgrade demonstrate the construction rule.
8. Save state contains only simulation state; Phaser and management UI derive from it.

## 16. Remaining Decisions Before Code

These decisions need answers before balance work, but do not invalidate the architecture:

- Exact shared-clock rate: how many real minutes equal a game day.
- The initial staff-role list and the exact three staff attributes.
- The initial facility and upgrade catalogue.
- The exact formula ingredients behind Standing and venue valuation.
- The initial set of authored site templates and location palettes.

## Sources and Design References

- Greenheart Games, [Game Dev Tycoon](https://www.greenheartgames.com/app/game-dev-tycoon/): its stated emphasis on casual management play without forced wait-times or virtual-currency retention mechanics is directly relevant to the construction-time constraint.
- Nintendo, [Game Dev Tycoon product page](https://www.nintendo.com/US/store/products/game-dev-tycoon-switch/): useful reference for the compact decision-to-outcome company-growth loop.
- Ryan and Deci, [Self-Determination Theory and the Facilitation of Intrinsic Motivation, Social Development, and Well-Being](https://www.selfdeterminationtheory.org/SDT/documents/2000_RyanDeci_SDT.pdf): source for the autonomy, competence and relatedness design lens.
- Unity, [Game state management](https://docs.unity.com/en-us/cloud-code/game-state-management): reference for authoritative server-side state in asynchronous multiplayer.
