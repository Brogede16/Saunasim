# Sauna Sim Venue Operations Model v0.1

## Purpose

This document defines how one sauna operates over time. It connects the guest-behaviour model to player controls, facilities, staff, programs, cash flow and feedback without yet assigning final balance numbers.

The player manages a coherent place, not a minute-by-minute queue dashboard. The simulation can be rich behind the scenes while the interface stays compact.

## Time Model

- One in-game week equals one real 24-hour day. A venue keeps operating while the player is away.
- The player chooses opening days plus opening and closing times for each venue.
- The scheduler treats day and evening windows as part of demand fit. Quiet/recovery-led programmes commonly reach more natural demand when enough daytime hours exist; social or show-led programmes commonly gain a fit advantage from a clearly later opening window. This is driven by visit purpose and programme promise, never guest age, appearance, gender or nationality.
- The simulation resolves guest arrivals and operations continuously in small invisible operating blocks. The scene shows a believable live sample of this activity: arrivals, queues, entrances, exterior facilities, programs and departures.
- Daily and weekly reports aggregate the real operational result. The player never needs to click a “collect” button.
- Construction uses separate real-time completion rules. A venue continues operating where physically plausible, but an affected facility/field cannot be used until its project is complete.

## What the Player Controls

| Control | Player chooses | Direct trade-off |
| --- | --- | --- |
| Opening schedule | Days and opening/closing hours | More possible demand and program space versus higher wages, heat and workload. |
| Entry price | One visible standard admission price per venue | Revenue per visit versus conversion, routine fit and whether the delivered place/program/recovery experience genuinely justifies the price. |
| Aufguss offer | Which programs exist, price if premium, frequency and eligible sauna rooms | Stronger draw and program income versus seats, Master time, consumables and queue pressure. |
| Venue facilities | Approved building/location upgrades | Capacity, recovery, shop, appeal and visible activity versus purchase/running cost and construction time. |
| Staff | Hire, pay, keep or dismiss owner-support staff, Hosts, Masters and later Managers | Better delivery/throughput/fit versus wage cost. |
| Shop range | A small automatic 3-5 item range after a visible shop exists | Suitable direct margin versus procurement cost and limited guest demand. |
| Marketing | Concrete campaigns, signs, program promotion or opening events | Awareness and audience mix versus cost; never creates a good experience by itself. |

The player does not assign every guest, move every staff member or manually schedule every session minute. The game places sessions sensibly within opening hours from the chosen frequency, room capacity, turnaround time and available Masters.

## Physical Capacity Model

Capacity is not one generic “venue size” number. Every constrained part of a visit has its own believable limit.

| Capacity source | Limits | Player remedy when pressured |
| --- | --- | --- |
| Entry/changing flow | How many arrivals can begin their visit without excessive delay | Arrival/changing upgrades, a Host, less concentrated program timing. |
| Sauna rooms | Seats for normal sauna use | Extra sauna room or a different venue scale. |
| Program sauna / outdoor Gus field | Program seats and parallel paid-session capacity | Program Sauna, a second eligible room, outdoor Gus space, frequency/staff change. |
| Master availability | Simultaneous premium/program delivery | Hire a fitting Master, lower frequency, use different programs. |
| Cold/warm recovery | Simultaneous use of plunge, natural water or spa | Add compatible recovery capacity or guide demand through timing/program design. |
| Rest/social space | Linger and recovery comfort | Terrace, deck, covered rest or site-appropriate seating. |
| Shop | One small purchase-stop flow | Shop is optional; it should not become the main venue bottleneck. |

The scene visually samples these constraints. A full program may create a real queue; a cold plunge may have a short wait; a successful terrace may show guests staying longer. No invisible capacity penalty is allowed without a corresponding physical cause.

Every venue has a natural program maximum. It follows from the number of eligible sauna rooms/fields, seats, opening hours, safe turnaround/cleaning time and available Masters. A player may request more frequency, but the scheduler does not silently create impossible sessions.

## Guest Flow During One Operating Period

```text
awareness + schedule + expected fit
        -> arrival decision
        -> entry/queue decision
        -> admission
        -> normal sauna and/or program
        -> optional recovery, rest and shop
        -> departure, reaction, repeat-memory update
```

1. **Arrival:** demand produces suitable potential guests within the selected hours.
2. **Entry:** guests inspect queue, value and time fit. Some wait, adapt, buy later, or leave.
3. **Core visit:** an admitted guest uses basic sauna capacity. A Program Sauna or eligible outdoor Gus field creates selected program opportunities.
4. **Recovery and linger:** built compatible facilities give the guest additional choices. They improve the experience only if the guest has time, wants them and can reach them.
5. **Shop:** a guest may buy an appropriate item after entry, sauna or recovery. Many guests buy nothing by design.
6. **Outcome:** the visit creates admission/program/shop revenue, variable cost, a personal reaction and a changed chance of returning.

## Aufguss Operations

- Every sauna room can host Basic Aufguss. It is part of ordinary sauna operation and need not create a premium-event queue.
- Every sauna room can also host a Special Aufguss if a suitable Master and a viable slot exist, but its satisfaction, capacity, presentation and premium potential depend on the room's physical fit.
- A Program Sauna is the strongest fit for richer and/or premium Aufguss: it has its own suitable seats, stronger visible program identity and more reliable satisfaction potential. It is an advantage, not the only way to run a Special Aufguss.
- An eligible outdoor Gus field is a distinct program point, not an interior replacement. It needs a Master, a scheduled program and its own visible capacity.
- The player chooses programs and desired frequency. The scheduler first places a Special Aufguss in the best compatible free room/field, based on room fit, seats, time and Master availability. If the desired program cannot fit or would be put in a weaker/smaller room, the interface shows the concrete consequence before the player confirms the plan.
- A large venue with multiple program-capable rooms can run parallel Aufguss when it has physical seats and a Master for each session.
- Guests may wait for a fitting scheduled program, choose a normal sauna instead, recover/linger, or leave if their available time and queue tolerance make waiting unreasonable.

## Staff Responsibilities

| Role | Operational responsibility | Cannot do |
| --- | --- | --- |
| Owner | Starts the venue, makes all strategic choices and covers basic management | Be everywhere at once as the chain expands. |
| Aufguss Master | Delivers scheduled programs according to their skills and program fit | Magically remove queues or operate several simultaneous sessions alone. |
| Service Host | Protects arrival, guest comfort and simple service flow | Create sauna seats or substitute for a Master. |
| Technician | Travels to installation, repair and special-work tasks for the chain | Become a permanent generic efficiency bonus or choose strategic projects alone. |
| Venue Manager, later | Handles low-risk venue operations within player-selected strategy | Replace strategic player decisions or create unexplained income. |
| Chain Operations Manager, later | Adds trait-based scale benefits across the chain | Affect one individual venue without a credible chain-level mechanism. |

## Finance Per Operating Period

### Revenue

- standard admissions
- paid/premium Aufguss seats where selected
- shop sales minus the automatic procurement cost
- later: venue-specific premium/brand effects through willingness to pay and return, never a flat unexplained bonus

### Costs

- rent/property obligation where applicable
- wages for hired staff
- heat, water, cleaning and consumables caused by actual sauna, program and recovery use
- shop procurement for sold/restocked goods
- scheduled loan repayment
- construction purchase/rush cost as a separate project expense
- optional marketing spend

The daily/weekly view explains revenue and costs by category. It does not pretend every guest uses every facility or buys every product.

### Current Canal Report

The first live report separates entry, Gus and shop income from venue base, staff, operating/facility, program-input and loan costs. It also states how many requested Gus sessions fit into the selected opening window and gives one short `Natural`, `Mixed` or `Awkward` schedule-fit sentence for the active program. The default `10:00-20:00`, five-day Canal plan is deliberately neutral, not an automatic best answer.

## What a Good and Bad Day Looks Like

| Situation | Observable scene | Management interpretation |
| --- | --- | --- |
| Well-matched routine venue | Steady arrival, manageable flow, some repeat guests | Reliable value and schedule are working. |
| Strong premium Aufguss | Program activity, satisfied recovery use, some waiting that remains acceptable | Consider capacity/frequency only if queues become the constraint; keep the price aligned with the delivered experience. |
| Popular but overloaded venue | Queues, abandoned arrivals, rushed exterior flow | Demand is real; throughput, rooms, timing or staffing must improve. |
| Attractive setting but weak conversion | People consider/arrive but few stay or return | Price, offer clarity, program fit or delivery is weaker than first impression. |
| Overbuilt/poorly timed venue | Sparse use of a costly facility | The asset may be valid but mismatched to audience, price or opening rhythm. |

## Reporting

The player sees three levels of explanation:

1. **Live venue:** crowd level, queues, programs, visible facilities and tappable guests.
2. **Daily pulse:** revenue/cost direction, attendance, one notable operational signal and active construction.
3. **Weekly/monthly review:** financial result, strongest/weakest program, retention, top guest patterns, workload/capacity pressure and one actionable opportunity.

Reports identify the likely category of a problem: fit, execution, capacity or awareness. They do not expose the full hidden formula.

## First Simulation Scope

The first working version needs only one venue, one standard entry price and these modules:

- basic sauna capacity
- Program Sauna
- outdoor Gusgård
- shop port
- copper shower
- cold plunge

It must prove:

1. opening time creates arrivals;
2. guest motivation affects whether a person enters, waits, uses a program or leaves;
3. the six modules alter real choices, not only cosmetic numbers;
4. admissions, programs and shop sales create separate revenue lines;
5. costs and queue/capacity feedback make trade-offs legible;
6. a short report explains the result in player language.

The numerical balance pass begins only after this loop is observable and testable.
