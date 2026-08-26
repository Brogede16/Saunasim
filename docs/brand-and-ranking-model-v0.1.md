# Sauna Sim Brand and Ranking Model v0.1

## Purpose

The game needs visible recognition and competition without turning cash or early success into an unstoppable advantage. Local reputation describes trust in one specific sauna; Brand Value describes what the chain name means beyond a single site; Standing is the one score that determines rank.

Exact formulas and score weights are balance data. The structural rules below are locked.

## Two Visible Reputation Layers

| Layer | Owner | Player sees | What it represents |
| --- | --- | --- | --- |
| Local Reputation | Each venue | A clear value in that venue's overview | Trust, recognition and lived guest experience at that specific sauna. |
| Brand Value | Entire chain | A clear value in the chain overview and relevant expansion/marketing views | Recognition of the overall chain promise across places. |

Both values can rise or fall. They are visible as simple named values, not buried in hidden formulas.

## Brand Value Effects

Brand Value has restrained, diminishing effects:

- makes suitable guests more willing to consider a distinctive venue beyond their immediate area;
- makes concrete marketing and a new venue's initial awareness more effective;
- supports reasonable price confidence only when the delivered experience still matches it.

It does **not** create automatic demand, erase bad queues, make an unsuitable venue attractive, or let the biggest player ignore quality. Strong Brand Value decays through repeated poor delivery, price/value mismatch, unresolved breakdowns, closures and visible service failure.

Local delivered experience remains the dominant cause of local demand, return and willingness to pay. Brand Value never creates capacity, direct income or lower operating costs. Its consideration, marketing and premium-confidence effects are capped and diminish as the chain grows, so each new venue still has to earn Local Reputation.

## Standing and Rank

- Every chain has one dynamic **Standing Score**.
- Rank is determined only by the current Standing Score. The player-facing primary display is simply the current rank, for example `Rank #48`.
- The score combines delivered guest experience, stable venue operation, Local Reputation/Brand Value, financial strength and a recognisable, well-executed concept. Raw cash alone cannot dominate it.
- Because rank follows the current score, it may move up or down quickly when performance changes. There is no artificial smoothing or delayed rank update.
- The player does not see a “distance to next rank” or a prescribed explanation in the primary rank view.
- Rank has no direct effect on revenue, local demand, site-offer quality or borrowing capacity.
- When the wider competitive feature is built, the player may browse a full ranking list. The first prototype needs only the player's own rank.

## Concept Coherence Without Clone Incentives

The game does not punish a player for making venues different. It rewards a coherent promise where each individual sauna's price, program, facilities, marketing and guest experience agree with each other.

Running fifty identical venues does not receive a growing “same concept” score bonus. Repetition can still be commercially valid, but it faces ordinary local-demand, capacity, cost and execution limits. A chain gains Brand Value from consistently delivering its promise, not from mechanically cloning the same building.

## Destination Quality

A small, expensive destination sauna can earn strong Local Reputation and contribute strongly to Standing when it genuinely delivers its premium promise. It does not need the highest raw attendance. Conversely, an expensive setting with weak program, service or price fit cannot rely on appearance alone.

## Future Multiplayer

Later multiplayer uses the same Standing Score contract for every player. A server becomes authoritative for the score, rank periods and anti-cheat checks. Before that, the player can see their rank within the same model against simulated reference chains; the rank UI does not need to change when real competition arrives. Neither reference chains nor real players alter a venue's local guest market.

## First Implementation Scope

1. Show Local Reputation on the venue overview and Brand Value on the chain overview.
2. Let individual guest outcomes change Local Reputation.
3. Derive a small, capped Brand Value effect from sustained delivery across venues.
4. Calculate Standing Score and show the current rank only.
5. Add score weights and simulated comparison chains only after the first economy/guest loop can be balanced.
