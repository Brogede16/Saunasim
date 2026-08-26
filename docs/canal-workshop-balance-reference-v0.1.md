# Sauna Sim Canal + Repair Workshop Balance Reference v0.1

## Purpose

This is the first **numbered reference venue** for Sauna Sim. It turns the locked design into a playable economic loop before numbers are copied across all locations. It is deliberately a tuning sheet, not a claim that these are final global prices.

All values are whole **US dollars**. They are intentionally rounded small-commercial reference values rather than jurisdiction-specific contractor quotes. One `simulation week` is one real 24-hour day.

### Pricing Basis

The reference uses real-world order of magnitude, then compresses it for a playable renovation game. A commercial plunge can range from roughly `$6,500` to `$15,000+` before installation, while a new commercial outdoor sauna can begin above `$50,000`. The `$9,500` plunge therefore represents equipment plus a modest existing-site installation; the `$32,000` Program Sauna is an extension inside an already owned workshop shell, not a complete new standalone sauna building. [Commercial plunge range](https://www.canuckcold.com/commercial), [commercial sauna example](https://www.fritztinyhomes.com/saunas/commercial).

## Success Contract

The venue should teach the player five things in its first several simulation weeks:

1. A coherent, modest programme and sensible opening hours can keep a small venue alive.
2. A Master, program choice and price matter before expensive construction does.
3. Every first upgrade solves a visible physical constraint, not a generic percentage problem.
4. Borrowing can accelerate a good plan, but repayment can make a premature expansion uncomfortable.
5. A popular Gus can reveal a new bottleneck: programme seats, recovery flow, service, or Master availability.

The reference is successful when a careful player can buy a first small upgrade immediately or after 1-2 simulation weeks, save for the first service upgrade within a few weeks, and treat a major programme expansion as a later cash goal or a deliberate financed risk. A player may borrow earlier, but the repayment must remain noticeable.

## 1. Starting State

| Item | Reference value | Reason |
| --- | ---: | --- |
| Chain cash | `$4,000` | Enough to hire a first Master, open responsibly and choose between saving or a small loan. |
| Existing debt | `0` | The first loan is a player decision, not inherited punishment. |
| Combined borrowing room | `$23,000` | Covers one meaningful early project, but not every major upgrade at once. |
| Base property value | `$100,000` | Security value only; it is not liquid starting cash. |
| Base room ordinary seats | `10` | A compact converted workshop should feel intimate rather than tiny. |
| Base Special Gus seats | `8` | A viable early programme, with clear room to improve. |
| Base recovery capacity | `0` dedicated | Guests can leave/rest informally, but no selected recovery finish is enabled. |
| Base shop capacity | `0` | No shop sales until the service port is built. |
| Starting condition | `100%` | Maintenance is not an onboarding tax. |

### Recommended First Opening Plan

| Player choice | Reference setting |
| --- | --- |
| Open days | Five days |
| Opening hours | 10:00-20:00 |
| Standard admission | `$24` |
| Starter special Gus price | `$7` add-on |
| Special Gus frequency | Two sessions per simulation week |
| Marketing | None |

The player can choose other hours, prices and frequency. This plan is the balanced default, not an enforced tutorial schedule.

## 2. First Master And Staffing

The player starts as the owner and must decide whether to hire the first Master. The first candidate is intentionally competent rather than exceptional.

| Starter candidate | Hiring fee | Wage / week | Heat | Aroma | Performance | Style |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `Starter Master` | `$650` | `$500` | `3` | `3` | `2` | `Traditional` |

The owner can open without a Master, but then there are no scheduled Special Gus sessions. The venue can collect routine admissions, but its expected result is close to break-even. This makes the Master a meaningful early investment rather than a forced cosmetic hire.

### Prototype recruitment implementation

The initial shortlist contains `Starter Master`. Before hiring, the player may replace it through a normal non-random shortlist search:

| Search | Upfront fee | Wait | Result |
| --- | ---: | ---: | --- |
| Patient search | `$0` | 60 real minutes | Two ordinary candidates with stated stats, fee and wage. |
| Standard search | `$125` | 20 real minutes | The same quality range, sooner. |
| Immediate shortlist | `$350` | No wait | The same quality range immediately. |

The fee buys service speed, not a stronger roll. The first implementation has one active Master at Canal, so choosing a candidate means choosing one wage and one style for the one viable Special Gus lane. A hired Master may be dismissed at any time; no refund is paid. Later multi-room venues extend this into a roster and automatic compatible-Master scheduling.

No Service Host is needed in the reference start. A Host becomes useful after the shop, higher arrival pressure or longer opening hours; adding one too early should reduce profit.

## 3. Demand And Capacity Reference

These are simulation-facing reference bands, not player-facing scores. The UI reports their consequences as crowd level, queues and guest feedback.

| Measure per simulation week | Weak fit / price | Healthy reference | Pressured |
| --- | ---: | ---: | ---: |
| Potential interested guests | `54-64` | `70-82` | `90+` |
| Admitted guests | `48-58` | `65-75` | `80+` |
| Comfortable ordinary visit capacity | `64` | `72` | `82` maximum before entry/room pressure |
| Special Gus seats sold | `0-8` | `10-16` | `17+` with waiting/crowding risk |
| Guests who abandon an avoidable queue | `0-1` | `0-2` | `3+` |

The base room is never allowed to sell more than `8` seats in one Special Gus session. The scheduler uses real derived room time, cleaning/reset time and Master availability; it cannot create sessions merely because demand exists.

### Reference Guest Mix

The generator supplies varied individual guests. This reference only sets aggregate visit motivations, never appearance, age, gender or nationality assumptions.

| Visit motivation | Share of healthy interested demand | Early venue consequence |
| --- | ---: | --- |
| Routine/convenience | `30%` | Sensitive to entry price, time and unnecessary queues. |
| Recovery | `25%` | More likely to value shower, plunge, deck and calmer Gus options. |
| Ritual/tradition | `20%` | More likely to value clear classic craft and a capable Master. |
| Social | `15%` | Responds to accessible sessions, service and visible shared activity. |
| Special premium | `10%` | Small but important early audience for a credible premium Gus. |

These shares can move slowly with local market state, time of day and later trends. No motivation is inherently better or more profitable.

## 4. Starter Programme Set

Each programme is freely editable by the player. These are reference presets used to test the builder, material costs, timing and feedback.

| Programme | Type | Session seats | Add-on | Materials / session | Intended use |
| --- | --- | ---: | ---: | ---: | --- |
| `Workshop Warm-Up` | Basic, included | `8` | `$0` | `$12` | Simple Steady Heat with one Everyday water-pour round. Reliable ordinary sauna activity. |
| `Canal Ritual` | Special | `8` | `$7` | `$4` | Classic Ritual; Eucalyptus Water Pour; Standard, Classic Towelwork and Silence. This is the actual starter program in the first prototype. |
| `Canal Birch` | Special | `8` | `$7` | To be tuned | Classic Ritual; Nordic Birch Water Pour then Green Tea Botanical Water; Standard, Classic Towelwork, Acoustic & Folk. |
| `Clear Current` | Special | `8` | `$7` | `$20` | Quiet Recovery; Gentle Build, Eucalyptus Scented Ice Round, Quiet Ritual and Ambient. |
| `Citrus Shift` | Upgrade-dependent Special | `8` | `$9` | `$30` | Social Energy; Rhythmic Pulses, Lemon Ice then Orange Water, Rhythmic Flow and Pop & Disco. Cold Plunge makes its recovery finish credible. |
| `Steel & Steam` | Upgrade-dependent Special | `20` | `$14` | `$90` | Show Journey; Progressive Rounds, Beer & Hops then Chilli Orange, Choreographed Show and Rock & Metal. Outdoor Gus Yard is required for the advertised version. |
| `Canal Afterglow` | Upgrade-dependent Special | `24` | `$11` | `$70` | Quiet Recovery; Gentle Build, Cedarwood then Sage, Quiet Ritual and Ambient. A Rest/terrace route is required for the advertised version. |

`Canal Birch` and `Clear Current` are starter candidates, not guaranteed high-tier discoveries. The first Master can deliver them competently but not exceptionally. `Citrus Shift`, `Steel & Steam` and `Canal Afterglow` make the player see greyed-out facility requirements before they can be scheduled as intended.

## 5. Weekly Operating Ledger

This table is the healthy default plan after hiring the Starter Master. It is the primary first balance target.

| Line | Calculation | Amount |
| --- | --- | ---: |
| Admission revenue | `70 guests x $24` | `$1,680` |
| Special Gus revenue | `14 seats x $7` | `$98` |
| Shop revenue | No shop | `0` |
| **Total revenue** |  | **`$1,778`** |
| Rent/property obligation | Canal workshop | `-$400` |
| Starter Master wage | One hired Master | `-$500` |
| Venue obligation | Canal workshop, 50 open hours | `-$400` |
| Heat, water and cleaning | 50 open hours, including basic supplies | `-$312` |
| Special Gus materials | Two `Canal Ritual` sessions | `-$8` |
| **Total operating cost** |  | **`-$1,220`** |
| **Operating result** | Before construction and loan repayment | **`+$558`** |

The acceptable healthy result is `+$400` to `+$650`. A player who opens fewer days, overprices entry, schedules a poor Gus or does not hire a Master may sit around break-even or lose a small amount. That is useful feedback, not immediate failure.

### What Changes The Result

| Player decision | Expected direction | Guardrail |
| --- | --- | --- |
| Raise entry price from `$24` to `$32` before improving the venue | More revenue per admission, fewer accepted visits | A raw price increase cannot outperform a good venue at the same demand. |
| Open an extra day | More potential admissions and programme slots, higher heat/cleaning and workload | Extra hours become weak if demand is outside the local rhythm. |
| Run three starter Special Gus sessions | More add-on revenue and Master work | The third session is only good when demand and recovery/room flow can support it. |
| Use Premium/Event materials early | Higher possible appeal and higher session cost | Price/value and execution must justify the spend. |
| Add a Host before flow is pressured | Small comfort gain, meaningful wage cost | It should usually be premature in week one. |

## 6. First Six Upgrade Data Cards

All projects use their independent, already-authored scene field. Construction can finish while other operations continue, but that field is inactive during the project.

| Upgrade | Field | Purchase | Build time | Recurring cost / week | Primary job | Immediate visible result |
| --- | --- | ---: | ---: | ---: | --- | --- |
| `Renovated Entrance Sign` | `ws-arrival` | `$1,200` | `1h` | `$0` | Arrival quality | Named warm sign, repaired apron and clearer entrance. |
| `Bench Refit` | Existing workshop sauna | `$2,500` | `2h` | `$0` | Compact seat expansion | Three additional physical benches in the current sauna; the sole approved low-visibility capacity exception. |
| `Reception Shop Port` | `ws-shop` | `$4,000` | `3h` | Procurement only | Shop | Lit loading-port hatch, product display and guest stop. |
| `Copper Rain Shower` | `ws-shower` | `$3,000` | `2h` | `$20` | Cold recovery support | Copper shower, falling water and rinse route. |
| `Compact Cold Plunge` | `ws-cold` | `$9,500` | `5h` | `$75` | Cold recovery | Two-person plunge, steam/ripple/splash and full route. |
| `Outdoor Gus Yard` | `ws-gus-yard` | `$16,000` | `6h` | `$100` when used | Aufguss capability | Paved outdoor field, Master activity anchor and timed steam. |
| `Program Sauna Volume` | `ws-program` | `$32,000` | `8h` | `$220` | Aufguss capacity | Added exterior sauna volume, programme door and stronger steam. |

### Upgrade Effects And Pressure They Solve

| Upgrade | Capacity / experience change | Expected healthy weekly contribution | It does **not** solve |
| --- | --- | --- | --- |
| Renovated Entrance Sign | Improves accepted arrivals by roughly `3-5` when price/offer are already credible. | `+$72` to `+$120` admission revenue before extra operating cost. | A weak Gus, high price or a full room. |
| Reception Shop Port | One purchase anchor; approximately `20-26` suitable purchases. | `+$180` to `+$235` net shop margin after procurement. | Entry queues, programme seats or Master availability. |
| Copper Rain Shower | Two quick rinse uses per operating block; enables Outdoor Shower finish. | Protects satisfaction/retention for `8-14` heat-heavy guests; no direct sales. | Cold-plunge demand or ordinary sauna-seat capacity. |
| Compact Cold Plunge | Two simultaneous cold uses; enables Cold Plunge finish. | `+3-6` fitting arrivals plus modest price acceptance after successful Gus delivery. | A bad programme, too many guests arriving at once, or a missing Master. |
| Outdoor Gus Yard | Twenty outdoor Special Gus seats and exterior event presentation. | One well-filled event can add about `+$280` in event revenue before materials/cost. | Simultaneous programs with one Master. |
| Program Sauna Volume | Twenty-four dedicated programme seats and a stronger indoor programme lane. | Can add about `+$264` in programme revenue before materials/cost when demand and schedule support it. | Recovery queues, shop flow or poor delivery. |

`Operating contribution` is deliberately not a permanent flat income bonus. It is the expected result when the asset is used by fitting guests and the related programme is delivered at least Normally.

## 7. Construction And Loan Reference

Construction duration is real elapsed time. The player may pay to accelerate a project, but it is a normal in-game cost rather than a paid skip. The reference rush price is `25%` of the project purchase cost; it can be tuned after testing.

| Loan band | Amount | Repayment / week | Term | Total repayment | Early use |
| --- | ---: | ---: | ---: | ---: | --- |
| Small bridge | `$7,500` | `$375` | `22` weeks | `$8,250` | Shop, shower, sign plus working cash. |
| Standard expansion | `$20,000` | `$750` | `30` weeks | `$22,500` | Cold plunge plus yard, or one major programme investment. |
| Large secured | `$60,000` | `$1,900` | `36` weeks | `$68,400` | Not normally available until a venue has built value and sustained earnings. |

The initial `$23,000` borrowing room permits the Small or Standard loan. The Large loan appears only when the venue's demonstrated result and value expand the chain limit. Loan repayments are paid in the same weekly settlement as wages and rent.

### Borrowing Examples

| Choice | Cash immediately after purchase | Weekly result after repayment | Intended lesson |
| --- | ---: | ---: | --- |
| Save for Entrance Sign | `$2,150` | roughly `+$543` | Slow, low-risk conversion improvement. |
| Small loan + Shop Port | `$6,850` | roughly `+$375` after repayment, then shop margin grows | A sensible early debt example. |
| Standard loan + Outdoor Gus Yard | `$7,350` before rush/hire choices | Around break-even or negative while the `$750` repayment is active, unless its programme, pricing and fit are genuinely strong. | Strong concept can work, but the player has little room for a poor week. |
| Standard loan + Cold Plunge alone | `$13,850` | roughly `-$138` after repayment until it supports a better Gus offer | Recovery before programme demand is a real risk. |

The numbers are examples, not a forecast UI. The game shows facts such as current repayment and remaining borrowing room, never a claim that a project will succeed.

## 8. Bottleneck Tests

The following test cases must work in the first implementation before prices are copied to another venue.

The runnable contract is `src/sim/canalScenarioMatrix.ts`, protected by `tests/scenarios/canalScenarioMatrix.test.ts`. It combines owner-only, healthy starter, high-price, higher-frequency, capacity-before-demand, social-yard, cold-recovery and loan-pressure cases in one fixed matrix. Every new Canal mechanic must preserve these relationships or deliberately revise this document and the tests together.

| Test | Setup | Expected observable result | Player remedy |
| --- | --- | --- | --- |
| Healthy compact workshop | Starter Master, recommended plan, two `Canal Ritual` sessions | `65-75` admissions, low queue loss, about `+$558` operating result. | Keep the routine or save for a first targeted upgrade. |
| Overpriced routine | Entry `$32`, no visible improvement | Fewer accepted entries and price/value comments despite open capacity. | Reduce price or improve visible offer/experience. |
| Popular cold finish | Cold Plunge, three `Citrus Shift` sessions | Plunge becomes the named bottleneck before ordinary room capacity does. | Spread session times, add shower, lower frequency or expand later recovery. |
| Show before readiness | Outdoor Yard, `Steel & Steam`, Starter Master | Strong interest, but mixed execution/price comments if programme is too demanding for the Master. | Train/hire, revise the Gus, lower price or use a simpler event. |
| Capacity before demand | Program Sauna, no schedule/marketing change | Spare programme seats and a visible running-cost increase. | Improve programme, schedule, price/awareness or delay the build. |
| Small debt under pressure | Small loan plus a weak week | Cash remains manageable, but `$375` repayment is visible and saving slows. | Wait, improve operations, borrow only if room remains or sell voluntarily. |

## 9. Tune Order

Adjust the reference in this order. Do not compensate for a broken loop by simply raising income.

1. Admission conversion versus entry price and visible offer.
2. Room/program/recovery capacity and queue tolerance.
3. Master wage, programme materials and programme add-on value.
4. Upgrade purchase cost versus reliable operating contribution.
5. Loan repayment pressure and negative-cash decision timing.
6. Only then Brand Value, trends, maintenance and later chain effects.

## Implementation Boundary

The first code slice needs only the base workshop, one Master, `Workshop Warm-Up`, `Canal Birch`, the six listed upgrades, the three loan offers and the test cases above. It does **not** need all locations, all 30 materials, final Master recruitment, maintenance, seasons, rankings or Ultimate patterns to validate this economic loop.

## Implemented maintenance bridge

The current Canal prototype now uses the approved condition bands for the three technical facilities. `70-100%` is full function, `40-69%` retains `95%` function, `10-39%` retains `75%`, and `1-9%` retains `50%`; at `0%` the facility is unavailable. Program Sauna condition reduces its physical Special Gus seat capacity. Shower and Cold Plunge condition reduce recovery throughput; an overfull/degraded cold route loses real visits, Gus revenue and shop conversion. Wear is driven by actual Gus seats and recovery use, not by calendar weeks, so unused equipment does not decay and a busy recovery route becomes visibly worn in a realistic multi-day test. The Team panel states the percentage, band, concrete consequence and transparent repair quote.
