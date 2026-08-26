# Sauna Sim Site and Market Generator v0.1

## Purpose

New venues should feel like believable opportunities, not selections from a complete world map or a demographic spreadsheet. The player reads a real-looking place, makes an investment decision and gradually learns who the venue can serve.

## Offer Flow

- The player normally receives three credible site offers at a time.
- A site is generated from a compatible **location family + building base + local market + economic variation**.
- The generator only uses plausible setting combinations. A Cabin belongs by forest, lake or coast; a Boathouse belongs on water; a Warehouse belongs in a harbour/canal/industrial context.
- Early offers always include at least one realistic path through available cash or a responsible first loan. Later offers may require an established chain, stronger assets or larger borrowing capacity.
- A player may reject offers without a time penalty. A new broker search is a separate visible action, with its own established cost/time rules.

## What the Player Sees Before Purchase

The player sees a concise, human-readable property card:

- asking price or realistic acquisition pressure;
- building form and approximate scale;
- setting and visible surroundings;
- water access and outdoor potential where relevant;
- practical constraints and available physical expansion potential;
- qualitative local clues, such as “strong after-work rhythm”, “quiet destination”, “seasonal visitors” or “price-conscious local demand”.

The player does not see exposed demographic values, hidden appeal scores or an instruction saying which concept is correct.

## Hidden Local Market

Each site has a hidden starting mix that shapes the visits it can generate:

- routine/convenience demand;
- recovery interest;
- social/program interest;
- premium/destination potential;
- tourism/seasonal influence where appropriate;
- price sensitivity;
- daypart and weekday/weekend availability.

These inputs create individual guest visits through the guest-behaviour model. They are starting conditions, not permanent restrictions or cultural stereotypes.

## Player Influence

A good venue can change its effective audience over time:

- a distinctive program and reliable delivery can attract guests beyond the immediate area;
- a successful premium destination can draw people who would otherwise choose a city sauna;
- strong reputation and concrete marketing can broaden awareness;
- price, opening rhythm and facilities determine whether attracted people actually return.

This is gradual. A new concept does not instantly rewrite a local market, and a famous brand does not make a poor venue work automatically.

## Water and Physical Potential

- Natural water improves the potential for cold recovery, ritual and destination appeal.
- Water-adjacent sites normally cost more, have stricter physical fields or carry greater construction/safety expense.
- The site layout already contains every approved expansion field. The player may choose the order of compatible upgrades but cannot invent a shoreline, roof, yard or water access that the base scene does not contain.
- The location/building rules remain the source of truth for exact compatibility and physical capacity.

## Market Change Without Local Rivals

The market changes slowly through the player's own reputation, concept, prices, programs, marketing and guest memory. Slow, legible guest-interest trends may also create demand for different program/recovery/social qualities or make overly repeated content less novel. They never function as abrupt unexplained penalties. The game has no active local competitor system: no rival venue steals customers, undercuts price, sabotages the player or causes opaque demand swings.

Standing/ranking is a separate recognition and comparison layer. It does not create local market interference, now or in later multiplayer.

## First Implementation Scope

1. Generate three offers from approved location/building combinations.
2. Show price, setting, scale, water/outdoor clues and qualitative local-market clues.
3. Store hidden market inputs with the acquired venue.
4. Let guest generation use those inputs plus the player's actual venue offer.
5. Allow reputation, price and marketing to alter the effective audience gradually.
