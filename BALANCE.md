# Sauna Empire Balance

## Purpose

All tuning values should have an explicit owner. The native game must not hide balance numbers in views, rendering code or unrelated services.

## Existing concrete prototype values

Examples currently present in `src/sim/game.ts`:

- starting cash: 4,000;
- starting admission price: 24;
- default opening schedule: 5 days, 10:00-20:00;
- Master candidates include weekly wages from 500 to 750 and hiring fees from 650 to 1,700;
- Master search: free/60 min, 125/20 min, 350/immediate;
- equipment prices currently range from 350 to 650;
- small loan: 7,500, weekly payment 375, 22 weeks;
- standard loan: 20,000, weekly payment 750, 30 weeks;
- large loan: 60,000, weekly payment 1,900, 36 weeks;
- base borrowing-limit formula currently begins at 23,000 and scales with built value/profitable weeks.

These are prototype balance values, not guaranteed launch values.

## Central balance domains

### Pricing
- admission minimum/default/maximum;
- Aufguss supplement ranges;
- shop retail prices;
- memberships/subscriptions if implemented;
- rush/convenience costs if retained.

### Staff
- hiring fees;
- wages;
- training costs;
- recruitment/search costs and times;
- skill caps;
- staffing coverage effects.

### Utilities and operations
- heat/energy usage;
- electricity;
- water;
- cleaning;
- consumables/materials;
- facility operating costs;
- maintenance wear rates;
- repair cost curves.

### Demand
- base guest frequency;
- market segment weights;
- price elasticity;
- queue tolerance;
- opening-hour fit;
- seasonality;
- reputation effects;
- brand reach caps;
- trend/novelty modifiers.

### Satisfaction/reviews
- wait thresholds;
- value thresholds;
- capacity comfort thresholds;
- satisfaction score boundaries;
- review probability;
- rating/reputation update weights;
- loyalty/regular thresholds.

### Sessions
- default session lengths;
- turnaround times;
- requested/feasible frequency;
- capacity;
- material consumption;
- Master skill effects;
- occupancy interpretation.

### Upgrades
- purchase/build price;
- build time;
- capacity effects;
- quality/flow effects;
- operating-cost effects;
- maintenance burden;
- unlock requirements.

### Progression
- unlock criteria;
- opportunity frequency;
- venue-value formulas;
- brand/rank thresholds;
- expansion requirements;
- sale valuation.

### Finance
- loan products;
- interest/repayment model;
- borrowing limit;
- insolvency grace period;
- bankruptcy rules.

## Target implementation

Create a central, inspectable configuration layer, for example:

```text
Data/Balance/
  EconomyBalance.swift
  GuestBalance.swift
  StaffBalance.swift
  ProgramBalance.swift
  ProgressionBalance.swift
  FinanceBalance.swift
```

or equivalent bundled JSON plus strongly typed decoding.

Rules:

- no magic numbers in SwiftUI/SpriteKit;
- tests may override balance configuration;
- simulation runs should record which balance version produced results;
- balance data changes should not require save migrations unless persistent meaning changes;
- agents must document material balance changes and run simulation tests.

## Balance-test targets

The future harness should be able to run thousands of seeded games and report distributions for:

- bankruptcy rate;
- median cash and revenue;
- time to first upgrade;
- time to second venue;
- occupancy;
- satisfaction/rating;
- loan usage;
- staff progression;
- upgrade popularity;
- progression speed.

No single test should enforce one perfect outcome. Balance tests should use acceptable ranges and detect major regressions.