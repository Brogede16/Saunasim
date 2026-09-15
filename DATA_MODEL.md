# Sauna Empire Data Model

## Principles

- Stable IDs, not display names, define identity.
- Domain entities must not contain SpriteKit or SwiftUI types.
- Persistent entities must be Codable/versionable in the native project.
- Catalog definitions and owned/runtime state should be separate types.
- Transient animation/UI selection state is not canonical game state.

## Core entities

### GameState
Top-level persistent snapshot.

Relationships: owns Player/Chain state, GameTime, owned Venues, Finance, progression, active events/trends and save metadata.

### Player / Chain
Represents the player's sauna company rather than the human avatar.

Fields should eventually include: id, name, cash, debt summary, brand value, rank/progression, unlocked opportunities.

Relationships: owns many Venues and Loans.

### Location
A site/market definition.

Typical fields: id, family, region, market profile, purchase/rent terms, physical tags, water/shore/roof/road access, compatible building bases, scene layout metadata.

A Location is not the same as an owned Venue.

### Venue
One operating sauna business.

Fields: id, locationId, name, buildingBaseId, facility states, prices, opening schedule, local reputation, staff assignments, programs, condition, construction, local financial history.

Relationships: belongs to one Location and Chain; contains Facilities/Upgrades, Staff assignments, Sessions and local Reviews.

### Sauna / Facility
An installed functional module.

Fields: instanceId, definitionId, condition, capacity channels, operational state, construction/repair status.

Use a catalog definition for immutable balance/compatibility and an instance for owned state.

### Upgrade
A catalog definition and/or installed module that changes capacity, quality, flow, cost or offer.

Fields: id, compatible location/building tags, purchase/build cost, build duration, effects, route/visual metadata.

### Guest
Persistent identity only when needed for memory/regulars. Otherwise a visit can use a generated guest snapshot.

Fields may include id, name, age band/age, preferences, tolerances, memory/loyalty, appearance seed.

Appearance must be mechanically independent from guest worth/preferences.

### GuestType / MarketSegment
Data-driven preference archetype used to generate or weight guests.

Fields: id, demand tendencies, price sensitivity, queue tolerance, facility/program preferences, time preferences.

### Visit
One guest's visit attempt.

Fields: id, guestId/guestSnapshot, venueId, arrival time, selected path, activities, waits, purchases, session attendance, outcome, satisfaction signals.

### StaffMember
Base staff entity.

Fields: id, name, role, wage, skills, traits, assignedVenueId, availability/schedule.

### GusMaster
Specialized StaffMember with Heat Craft, Aroma Craft, Performance Craft, style strengths and equipment.

### Session
One scheduled/executed sauna or Aufguss session.

Fields: id, venueId, programId, start time, capacity, attendance, MasterId, execution result, costs/revenue attribution.

### AufgussProgram
Reusable authored program.

Existing concepts: name, intent, heat, format, ordered aroma rounds, performance, music, recovery finish, requested sessions, supplement price, revealed composition tier.

### Review
Public/local feedback record derived from a visit or aggregated period.

Fields: id, venueId, guest/anonymous source, rating, tags, copy key/flavor text, createdAtGameTime.

### Rating / Reputation
Aggregated venue-level state. Keep separate from individual Review records.

### Expense
Ledger entry or category summary.

Categories should include staff, utilities, cleaning, materials, procurement, facility operation, maintenance, property/rent and finance.

### Revenue
Ledger entry/category summary.

Categories: admission, Aufguss supplement, shop/merchandise, subscription/membership and later event/other revenue if approved.

### Loan
Fields: id, productId, principal/remaining balance, payment schedule, interest/rate model, originated date, remaining periods.

The current prototype stores simplified weekly payment and remaining weeks. Native model should be extensible without overengineering Vertical Slice 0.1.

### Event
Temporary simulation modifier/opportunity with start/end time and explicit effects.

### Trend
Time-bounded market preference/novelty modifier. Planned, not yet production-implemented.

### Subscription
Membership/subscription product and/or customer relationship. Product behavior is TBD.

### Item
Shop/merchandise catalog entry with price, procurement cost, tags and availability.

### GameTime
Canonical game calendar/time value. Must not be a UI timer.

Suggested fields: totalTicks or absolute game timestamp plus derived day/week/month/year. Real wall-clock/offline metadata should be stored separately from simulated calendar state.

### ConstructionProject / RepairTask
Timed operational jobs with target entity, start/completion time, cost and status.

## Important relationships

```text
Chain 1 ---- many Venue
Venue 1 ---- 1 Location
Venue 1 ---- many FacilityInstance
Venue 1 ---- many StaffAssignment
Venue 1 ---- many AufgussProgram
Venue 1 ---- many Session
Venue 1 ---- many Visit
Venue 1 ---- many Review
Chain 1 ---- many Loan
Guest 1 ---- many Visit        (when persistent memory is enabled)
Session many ---- 1 AufgussProgram
Session many ---- 1 GusMaster
```

## Catalog versus runtime state

Keep these distinct:

- `LocationDefinition` vs `Venue`;
- `FacilityDefinition` vs `FacilityInstance`;
- `StaffArchetype/CandidateDefinition` vs `StaffMember`;
- `LoanProduct` vs `Loan`;
- `ShopItemDefinition` vs stock/assortment state;
- balance configuration vs calculated ledgers.

This separation is essential for save compatibility and agent readability.