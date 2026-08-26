# Sauna Sim Staff and Maintenance Model v0.1

## Purpose

Staff should create visible, understandable operating choices. They are people with limited time, wages and real jobs, not detached percentage bonuses. Maintenance should matter more as the chain grows, without becoming repetitive repair spam.

All player-facing names and copy are English. Exact salary, hiring, material and travel values are deferred to the balance pass.

## Core Roles

| Role | Player choice | Concrete contribution | Limitation |
| --- | --- | --- | --- |
| Owner | Starts alone and makes strategic choices | Covers basic owner-management work | Cannot be present at every venue as the chain grows. |
| Aufguss Master | Hire/fire; choose programs and desired frequency | Delivers scheduled Basic and Special Aufguss | Cannot run simultaneous sessions. |
| Service Host | Hire/fire per venue | Helps entry, queues, basic guest comfort and simple service flow | Does not add sauna seats or replace a Master. |
| Technician | Hire/fire for the chain; dispatch to repairs | Travels to affected venues and restores technical facilities | Has travel time and cannot repair multiple places at once. |
| Operations Manager | Later chain hire | Procurement, actual operating-resource efficiency and marketing effectiveness | Is expensive and only earns their cost at sufficient scale. |

## Aufguss Masters

Each Master has three visible 0-10 craft ratings plus a style tag:

| Field | Meaning |
| --- | --- |
| Heat Craft | Heat distribution, demanding heat profiles, fan use and controlled finales. |
| Aroma Craft | Dosage, multi-round blends, herbs and ice-infusion delivery. |
| Performance Craft | Rhythm, audience connection, choreography and story-led presentation. |
| Style tag | Best natural fit, such as Traditional, Meditative, Energetic or Theatrical. It is a strength, not a hard restriction. |

Basic Aufguss can run in all sauna rooms. Special Aufguss can also run in any viable room with a suitable Master, but receives the best capacity, presentation and satisfaction potential in a Program Sauna or fitting outdoor Gus field. Workload is calculated from schedule volume rather than appearing as a fourth visible stat. `master-development-and-equipment-v0.1.md` defines course and equipment rules.

## Recruitment

- The normal recruitment flow offers candidates through a search with a cost/time tier: cheap and slower, normal, or expensive and immediate.
- Candidate quality, wage expectation and traits vary. Staff are available from the start; there is no level gate.
- The player may fire staff at any time. Staff leave on their own only when wages are not paid.
- Rare special candidates are separate authored events, not the default hiring system. They have original identities, striking visual direction and unusual but still balanced strengths. Their specific content is reviewed later.
- Staff appear as people in the hiring interface. Visible scene staff use their own uniform palette and role props. Hosts can later walk the site, help guest flow and perform small readable tasks such as collecting towels; Masters receive richer program frames.

## Operations Manager

Operations Managers are expensive chain-level staff and are normally economically sensible only from several venues. They have broad traits rather than one fixed specialty:

| Trait | Credible effect |
| --- | --- |
| Procurement | Better terms for shop goods, program consumables and other real chain purchases. |
| Operations | Less waste in heat, water and cleaning caused by actual venue activity. |
| Marketing | Better conversion or lower spend for concrete campaigns; never invented demand. |

They cost a significant hiring fee and recurring wage. Optional expensive courses improve a trait over time. Their effect is shown in the relevant finance/campaign view so the player can judge whether they are earning their cost.

## Maintenance and Condition

### Eligible Facilities

Only functional/technical assets use the condition system: sauna rooms and heaters, program equipment, showers, cold plunges, spas/wild baths, water systems and shop equipment. Decorative plants, ordinary seating and passive facade finish do not create routine repair tasks.

### Condition States

| Condition | Facility state | Gameplay effect |
| --- | --- | --- |
| `70-100%` | Healthy | Full function. Planned service is optional. |
| `40-69%` | Worn | Small, visible functional reduction; repair is inexpensive. |
| `10-39%` | Degraded | Clear capacity/quality/throughput reduction and a visible maintenance signal. |
| `0-9%` | Critical | Strongly reduced function; urgent repair is sensible. |
| `0%` | Out of service | The facility is unavailable and supplies no capacity, route or asset effect until repaired. |

The condition percentage and the current consequence are shown when the player taps the facility. The map uses a restrained maintenance marker or work-state only; entire buildings do not become visually ruined.

### Repair Price and Urgency

Repair pricing is derived from three understandable inputs:

```text
repair bill = facility tier + missing condition + required parts + travel/urgency
```

- A planned repair at moderate wear is cheaper than waiting until the same facility fails.
- Higher-tier facilities require more expensive parts, but do not become disproportionately punishing solely because they are premium.
- Emergency/call-out priority costs more, while a scheduled visit can be cheaper but waits for technician travel.
- Exact curves are balance data. The player always sees the expected bill and estimated arrival/completion time before confirming.

## Technician Dispatch and Travel

- Technicians are hireable chain staff. The player pays their hiring cost and wage; each repair also has a transparent material cost.
- A technician has one current location and one task at a time. They can travel between the player's venues, including while the player is offline. There is no permanent visible repair queue; the affected facility card shows the relevant status: `On route`, `Under maintenance` or restored.
- The chain's technician-team card shows one compact combined workload signal: `Light`, `Busy` or `Stretched`. It reflects the total work and travel commitment across all hired technicians, warns when new maintenance may wait, and avoids a separate repair-management screen.
- Travel time depends on the simulated location distance and is represented by real elapsed time. It prevents a single technician from instantly fixing an entire large chain.
- When a technician reaches a venue, the target field enters a short `under maintenance` state. Its function is unavailable until the repair completes; other unrelated facilities continue operating.
- Urgent dispatch can move a job ahead in the queue for extra in-game money. It is an economic choice, not a paid skip.
- The venue scene later shows a technician at the affected field during the work phase. Produce at least two uniformed technician sprite identities with tool bag/tool props and shared repair actions; appearance variation can expand from that base.

## Scale Behaviour

One early technician is usually enough for a small chain. As the chain grows, maintenance becomes a light planning layer: the player may hire another technician, schedule preventive work or pay for urgent travel. The game must not generate so much deterioration that the player spends most of the session repairing assets.

## First Implementation Scope

The first maintenance slice uses only Program Sauna, outdoor shower and cold plunge:

1. Condition reduces slowly through real use.
2. Tapping the module shows its condition, current effect and repair option.
3. One hired technician can be dispatched to a single venue.
4. Repair cost rises as the condition falls and the module returns to full function after travel/work time.
5. The scene shows a temporary maintenance marker now; technician sprite/repair animation follows with the production character pack.
