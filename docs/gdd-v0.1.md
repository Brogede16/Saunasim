# Sauna Sim Game Design Document v0.1

Last updated: August 22, 2026

## 1. Product Statement

`Sauna Sim` is a management game about creating, refining, and expanding a recognizable sauna concept. The fantasy is not just to earn money, but to discover what kind of sauna brand the player wants to build and how that concept performs in different local markets.

Short pitch:

> Build a sauna empire with your own sauna concept.

Internal design reading:

> Create your own sauna concept, prove it in the market, and grow it into a respected sauna brand.

## 2. Design Pillars

### 2.1 Concept Over Spreadsheet

The player should feel that they are shaping a concept, not just optimizing visible stats. Numbers can exist under the hood, but the visible layer should feel human, tactile, and thematic.

### 2.2 Discovery Through Hidden Simulation

The game should not explain every local variable directly. Players learn by watching guest turnout, revenue mix, review patterns, ranking movement, and recurring preferences.

### 2.3 Meaningful Growth

Growth matters because each new site tests the concept in a new market. Expansion is not just bigger numbers; it is a strategic bet.

### 2.4 Light Building, Strong Identity

The player should make clear design and expansion choices without needing a detailed room-drawing tool. Identity comes from selected modules, materials, style, programs, and service mix.

## 3. Player Fantasy

The player starts with a modest sauna business and turns it into a respected brand by combining:

- the right location
- the right sauna concept
- the right Aufguss programs
- the right staff personalities
- the right amenities and wellness expansions
- the right timing for expansion or sale

## 4. Prototype Success Criteria

The first prototype should prove:

1. A generated location can feel different from another generated location.
2. A chosen concept can succeed in one place and underperform in another.
3. The player can read outcomes and adapt without seeing every hidden number.
4. A single location is already interesting before the full empire layer arrives.

## 5. Core Game Loop

Working v0.1 loop:

1. Review your current site, guest response, staff status, and finances.
2. Adjust the concept through programs, amenities, pricing, staffing, and small upgrades.
3. Run time forward and observe attendance, guest sentiment, revenue, and ranking movement.
4. Invest in expansions, support functions, or a new generated site opportunity when cash or borrowing capacity permits.
5. Decide whether to keep, scale, or sell a location.

## 6. Simulation Model

### 6.1 Site Generator

The player does not browse an open city list. Instead, the game presents three generated, financially viable site opportunities. Each is built from a template plus hidden modifiers. A site can be an existing building, a vacant lot, a plot of land, or a raw outdoor area.

Examples of hidden or partially hidden factors:

- population density
- income profile
- age mix
- tourism
- local wellness interest
- social behavior
- competition
- seasonal patterns
- rent pressure
- outdoor potential
- water access

The player may see concrete property information and flavored summaries rather than raw market values. Existing buildings can open with a basic layout; vacant or outdoor sites require construction and are mainly later-game opportunities. Natural water increases both cold-water potential and property cost.

Examples of player-facing clues:

- "Young evening traffic is strong here."
- "Guests in this district prefer quieter rituals."
- "High rent, but premium spending is common."

### 6.2 Guests and Preferences

The market model should generate guests from local conditions plus the player's concept. The game should avoid crude stereotypes and instead work with preference dimensions.

Candidate preference axes for v0.1:

- ritual vs casual
- calm vs social
- budget vs premium
- traditional vs performative
- low-intensity vs high-intensity

The player should experience these mostly through demand patterns, reviews, and attendance behavior.

### 6.3 Sauna Concept

A sauna concept is the combination of decisions that makes a venue recognizable.

Concept inputs include:

- brand tone
- visual style
- heat profile
- Aufguss programming
- sound and lighting mood
- staff style
- amenity mix
- wellness depth
- pricing posture

The chain may reuse a successful concept across multiple locations or adapt it locally.

### 6.4 Aufguss System

Aufguss is a headline identity system and should be treated as modular rather than a single recipe.

Likely program components:

- program name
- heat target
- duration
- scent set
- music profile
- performance style
- intensity
- lighting mood
- assigned master

The simulation should evaluate how different guest groups respond without fully exposing the formula.

Aufguss should also be the venue's visual headline. Programs may differ in towel movement, steam shape, scent-colour accents, lighting and sound. This visual layer should communicate the program's character, while the underlying guest response remains driven by the program's actual configuration.

### 6.5 Staff

Staff should be driven by traits, style, and reliability rather than looks.

Important staff qualities for early design:

- personality traits
- performance style
- consistency
- training level
- guest fit
- burnout risk

### 6.6 Amenities and Wellness

Support functions make the venue feel alive and should affect both mood and business performance.

Early amenity candidates:

- vending machine
- reception shop
- cafe
- towels
- bathrobes
- water station
- smoothie bar

Wellness progression can expand beyond the core sauna through modules such as:

- cold plunge
- relaxation area
- spa features
- massage
- food and beverage

### 6.7 Ranking and Brand

The game should support an external ladder or reputation table so the player can compare themselves with nearby competitors.

Important ranking behaviors:

- the player can see how far they are from the next competitor above them
- brand value can rise or fall
- success at one venue should influence future opportunities
- bad execution should damage the brand, not only reduce cash

### 6.8 Selling a Sauna

The player should be able to sell a location through a simple interface. Sale price should react to:

- current profit
- revenue trend
- invested capital
- wear or condition
- concept strength
- local market outlook
- brand effect

Selling should be a strategic exit, not just a reset button.

## 7. Building and Visual Customization

The game should be presented as a top-down pixel-art bathhouse exterior, with the building, its grounds, outdoor facilities and guests visible as a small living world. Interior rooms are managed through the phone-like UI rather than shown as cutaways. The player should not start with a detailed tile editor. The better fit is a lightweight modular builder where the player chooses:

- venue size
- expansion modules
- material or color direction
- selected functional zones
- signature details that reinforce the concept

The result should feel expressive without becoming a construction sim. New rooms and functional zones should arrive as readable modules that visibly extend the venue.

The player manages through a phone-like control interface rather than a customisable owner avatar. The phone is the decision surface; the pixel venue is the observable result.

## 8. Economy Rules

Locked for the current design track:

- weather is cosmetic
- taxes are excluded
- external financial investing is excluded
- debt handling should stay streamlined and mostly automatic

Economic focus should remain on:

- venue performance
- operating choices
- upgrades
- staffing
- expansions
- property sale

## 9. Time Model

Working assumption for the prototype:

- simulation advances in days
- operations can be reviewed weekly
- financial reporting and strategic review can happen monthly

This keeps the pace readable while preserving meaningful operational feedback.

## 10. Prototype Scope v0.1

The first playable should focus on one venue plus the possibility of seeing future expansion logic.

Recommended v0.1 slice:

- one playable venue
- one generated starting site
- two or three alternative site profiles for comparison during setup
- a small set of guest preference dimensions
- a basic Aufguss builder
- a small amenity set
- one or two wellness upgrades
- a trait-based staff roster
- simple ranking feedback
- simple local save and load

Hold for later:

- deep multi-site logistics
- taxes
- weather gameplay
- detailed construction tools
- advanced loan negotiation
- cloud accounts

## 11. Out of Scope For v0.1

- open-world city browsing
- hyper-detailed architecture placement
- investment portfolio systems
- appearance-based character optimization
- realistic tax administration
- multiplayer

## 12. Open Design Questions

- How visible should the ranking system be: weekly list, regional season, or always-on ladder?
- How many guest preference axes are readable before the system becomes too opaque?
- How much concept standardization should the game reward compared with local adaptation?
- How much visual customization is enough to create identity without creating production overhead?
- When should selling a sauna become available: always, after stabilization, or after a minimum operating period?
