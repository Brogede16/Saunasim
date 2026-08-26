# Sauna Sim Finance and Property Model v0.1

## Purpose

Finance should make expansion, renovation and risk meaningful without turning Sauna Sim into tax software. The player runs one chain: venues have individual results and value, but cash, debt and borrowing capacity belong to the whole chain.

Exact prices, interest rates, term lengths and valuation weights are balance data. The rules below are locked.

## Chain and Venue Finances

| Level | Owns | Player sees |
| --- | --- | --- |
| Venue | Revenue, operating costs, Local Reputation, condition, physical assets and an estimated sale value | Venue finances and valuation explanation. |
| Chain | Cash, total debt, repayment schedule, borrowing limit, Brand Value and Standing | Chain finance overview. |

A successful venue can therefore support a new venue. The player never administers separate loans or isolated cash piles for each sauna.

## New Sites and Investment

- The generator shows a small set of credible site offers at a time. Early offers are priced so at least one is realistically reachable with start capital or a responsible first loan.
- A player may buy, renovate or expand aggressively if they can fund it. The game does not prohibit a risky project merely because its future return is uncertain.
- Construction, staff, marketing, loan repayments and operating costs draw from the same chain cash balance.
- There are no taxes, stocks, bonds or unrelated investment systems. Money goes into the player's own venues, people, programs, upgrades, debt and marketing.

## Borrowing Limit

The chain has one combined borrowing limit. Behind the scenes, it is based on:

- the credible value of owned buildings and visible upgrades;
- sustained actual earnings rather than a single unusually good period;
- current debt and repayment obligations;
- condition and Local Reputation where these materially affect a venue's sale/security value.

The player sees a rounded, understandable available amount. Borrowing and repayment amounts use whole currency units and sensible round increments; no arbitrary decimal figures or false precision.

## Loan Products

Loans are general chain capital, not project-financed loans. The player chooses one of three size bands when it fits the available borrowing limit.

| Band | Intended use | Term structure | Trade-off |
| --- | --- | --- | --- |
| Small bridge loan | Covering a short cash gap or a small improvement | Shorter term and faster repayment | Lower total commitment but higher payment pressure per period. |
| Standard expansion loan | Normal renovation, capacity or a new early venue | Medium term and balanced repayment | Main general-purpose option. |
| Large secured loan | Major property, prestigious build or established-chain expansion | Longer term and lower payment pressure per period | Requires stronger asset/earnings basis and creates a larger long-term debt burden. |

Larger loans therefore have different terms, not merely a larger number. Exact interest/repayment curves are tuned later, but every offer clearly shows:

- borrowed amount;
- regular automatic repayment;
- term and total expected repayment;
- resulting total chain debt;
- remaining borrowing room after acceptance.

The game does not offer a success forecast or a patronising warning about whether the player's plan is wise.

## Repayment and Negative Cash

- Repayment begins automatically on the normal schedule immediately after a loan is taken, regardless of what the player spends the money on.
- When chain cash reaches negative territory, the game presents an immediate financial decision card. The player can take an available loan, sell a venue, wait for the next financial settlement if they consciously choose to take that risk, or declare bankruptcy.
- The card states current cash, due obligations, next financial settlement, available borrowing room and viable sale candidates. It does not claim to know whether a proposed upgrade will save the chain.
- Bankruptcy is not an arbitrary automatic surprise. It occurs only when a completed financial settlement leaves due obligations unpaid and the player has no realistic approved loan or venue-sale option remaining.
- The game remains live; this is a clear financial decision, not an energy-style timer or a manual claim gate.

## Venue Valuation and Sale

Each venue has an estimated sale value. It is explained in player language from:

- the base building/property value;
- visible upgrades and their current condition;
- sustained actual profitability;
- Local Reputation and appropriate Brand Value effect;
- location demand/market conditions;
- debt and any material unresolved liabilities.

A well-built place may therefore lose value through poor condition, sustained weak performance or damaged reputation. Conversely, a successful venue can help finance the next one. Selling returns the resulting net chain cash after relevant debt/liabilities; it is a meaningful strategic choice, not a reset button.

## First Implementation Scope

1. One chain cash balance and one venue ledger.
2. One rounded borrowing limit and the three loan bands with placeholder terms.
3. Automatic repayment entries in the daily/weekly ledger.
4. Negative-cash decision card with loan, sell and bankruptcy paths.
5. One transparent venue valuation breakdown.

Exact cash values and loan terms enter the full balance pass only after the guest and venue-operation simulation produces reliable data.
