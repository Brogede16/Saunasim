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

Relationships: owns Player/Chain state, GameTime, owned Venues, Finance, progression, trends and save metadata.

A broad generic Event collection is not required for current scope.

### Player / Chain
Represents the player's sauna company rather than the human avatar.

Fields should eventually include: id, name, cash, debt summary, brand value, rank/progression, unlocked opportunities, chainStaff, currentSiteOfferBatch.

Relationships: owns many Venues, Loans and ChainStaffMembers.

### LocationDefinition
A reusable approved site/environment definition, not a city name invented at runtime.

Typical fields: id, family, market-generation constraints, physical tags, water/shore/roof/road access, compatible building bases, scene layout metadata, expansion/anchor capabilities, approval/provenance status.

A LocationDefinition is not the same as an owned Venue or a generated SiteOffer.

### SiteOffer
A generated opportunity created only from approved compatible content definitions plus market/economy variation.

Suggested fields: id, locationDefinitionId, buildingBaseDefinitionId, generatedMarketProfile, acquisitionTerms, operatingPressureProfile, visiblePropertyClues, affordabilitySnapshot, expires/replaced state if needed, generationSeed.

The player sees concrete clues, not a universal attractiveness score.

### SiteOfferBatch
The currently available set of normally three SiteOffers.

Fields: id, offerIds, generatedAtGameTime, brokerSearchTier/source, generationSeed.

Rules:

- contains three meaningfully different opportunities;
- at least one must be realistically financeable for the current player state;
- new broker search replaces the whole batch;
- generation never creates new canonical location/building definitions.

### Venue
One operating sauna business.

Fields: id, siteOffer/sourceDefinition references, name, buildingBaseId, facility states, prices, opening schedule, local reputation, venueStaff assignments, programs, condition, construction, local financial history.

Relationships: belongs to one Chain; contains Facilities/Upgrades, VenueStaffAssignments, Sessions and local Reviews.

### Sauna / Facility
An installed functional module.

Fields: instanceId, definitionId, condition, capacity channels, operational state, construction/repair status.

Use a catalog definition for immutable balance/compatibility and an instance for owned state.

### Upgrade
A catalog definition and/or installed module that changes capacity, quality, flow, cost or offer.

Fields: id, parent/content class, compatible location/building tags, purchase/build cost, build duration, effects, route/visual metadata.

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
Base person record for hired staff.

Fields: id, name, role, hourlyWage, skills, traits, scope, employmentState.

`scope` distinguishes normal venue-operation staff from chain-level employees.

Do not model detailed manual rota state as core player-authored data.

### VenueStaffAssignment
Links eligible staff to venue operating coverage.

Fields: staffMemberId, venueId, effectiveFrom/effectiveTo if needed, eligibleFunctions, generatedCoverageState.

The simulation automatically resolves working coverage from opening hours, required functions, workload and planned Aufguss sessions.

Generated coverage/timetable detail should be reproducible and may be recalculated rather than treated as player-authored schedule truth.

### StaffingRequirement
A derived requirement for one venue and operating period.

Suggested fields: venueId, period, requiredFunctions, loadBand, requiredCoverageHours, uncoveredFunctions, severity/consequence.

This drives the player-facing staffing overview.

### ChainStaffMember
A StaffMember whose operational scope is the chain rather than one venue.

Examples include technicians and later explicitly designed chain-management roles.

Chain roles must have concrete operational responsibilities; avoid generic bonus-only jobs.

### Technician
Specialized ChainStaffMember.

Fields/concepts: hourly/period wage model, currentJobId, travel state, skill/eligibility if needed.

Rules:

- not permanently assigned to one venue;
- travels between venues;
- may hold one active technical job at a time;
- contributes to chain-wide repair/installation concurrency.

### GusMaster
Specialized StaffMember with Heat Craft, Aroma Craft, Performance Craft, style strengths and equipment.

A Master may be venue-assigned for normal operation but scheduling is automatically derived from requested sessions. A Master cannot execute overlapping sessions.

### Session
One scheduled/executed sauna or Aufguss session.

Fields: id, venueId, programId, startTime, room/facilityId, duration, capacity, attendance, MasterId, execution result, costs/revenue attribution, schedulingStatus.

### AufgussScheduleRequest
Player intent rather than a hand-authored calendar.

Fields: venueId, programId, requestedFrequency/sessionCount, eligible days/operating pattern if needed, priority/preferences only where player-facing design approves them.

### AufgussSchedulePlan
Deterministically generated schedule from requests.

Inputs include opening hours, room availability, program duration, expected demand/daypart fit, recovery constraints and Master availability.

Outputs include scheduled Sessions plus explicit unscheduled requests/reasons.

The scheduler must never silently double-book a Master or room.

### AufgussProgram
Reusable authored program.

Existing concepts: name, intent, heat, format, ordered aroma rounds, performance, music, recovery finish, requested sessions, supplement price, revealed composition tier.

### Review
Public/local feedback record derived from a visit or aggregated period.

Fields: id, venueId, guest/anonymous/editorial source, rating where appropriate, tags, copy key/flavor text, createdAtGameTime.

Program first-run diagnostic review and ordinary guest/public reviews are distinct feedback surfaces even when they share underlying recorded factors.

### Rating / Reputation
Aggregated venue-level state. Keep separate from individual Review records.

### Expense
Ledger entry or category summary.

Categories should include staff, utilities, cleaning, materials, procurement, facility operation, maintenance, property/rent and finance.

### Revenue
Ledger entry/category summary.

Categories: admission, Aufguss supplement, shop/merchandise and subscription/membership.

### Loan
Fields: id, productId, principal/remaining balance, payment schedule, interest/rate model, originated date, remaining periods.

The current prototype stores simplified weekly payment and remaining weeks. Native model should be extensible without overengineering Vertical Slice 0.1.

### Trend
Time-bounded market preference/novelty modifier generated automatically from deterministic seed/calendar logic and spread rules.

### SubscriptionProduct
Player-configured membership offer.

Fields should support monthly price and approved benefit model without creating excessive tier complexity.

### Membership
A guest/customer relationship to one venue/chain product.

Purchase/churn behavior derives from fit, repeat behavior, convenience, value, satisfaction and capacity conditions.

### Item
Shop/merchandise catalog entry with price, procurement cost, tags and availability. Keep the broad merchandise catalogue small (roughly maximum 10 meaningful product types).

### GameTime
Canonical game calendar/time value. Must not be a UI timer.

Product rule: one in-game week equals 24 real hours. Suggested fields: canonical game timestamp plus derived day/week/month/year and the wall-clock settlement reference required for offline progression.

### ConstructionProject / RepairTask
Timed operational jobs with target entity, start/completion time, cost and status.

## Important relationships

```text
Chain 1 ---- many Venue
Chain 1 ---- many Loan
Chain 1 ---- many ChainStaffMember
Chain 1 ---- 0..1 current SiteOfferBatch
SiteOfferBatch 1 ---- 3 SiteOffer
SiteOffer many ---- 1 LocationDefinition
Venue 1 ---- many FacilityInstance
Venue 1 ---- many VenueStaffAssignment
Venue 1 ---- many AufgussProgram
Venue 1 ---- many Session
Venue 1 ---- many Visit
Venue 1 ---- many Review
Guest 1 ---- many Visit        (when persistent memory is enabled)
Session many ---- 1 AufgussProgram
Session many ---- 0..1 GusMaster
AufgussScheduleRequest many ---- 1 AufgussProgram
```

## Catalog versus runtime state

Keep these distinct:

- `LocationDefinition` vs generated `SiteOffer` vs owned `Venue`;
- `FacilityDefinition` vs `FacilityInstance`;
- staff candidate/archetype data vs hired `StaffMember`;
- chain staff scope vs venue assignments;
- player-authored `AufgussScheduleRequest` vs generated `AufgussSchedulePlan`;
- `LoanProduct` vs `Loan`;
- `ShopItemDefinition` vs assortment/sales state;
- `SubscriptionProduct` vs guest `Membership`;
- balance configuration vs calculated ledgers.

This separation is essential for save compatibility, Content Studio authoring and agent readability.
