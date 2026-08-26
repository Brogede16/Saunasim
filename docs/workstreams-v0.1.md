# Sauna Sim Workstreams v0.1

Last updated: August 22, 2026

## 1. Operating Principle

Keep `Sauna Sim` inside one ChatGPT Work project so files, instructions, and shared context stay attached. Split work across separate chats when the outputs can stand on their own.

Use the same chat when:

- a long-running build is in progress
- the task is a direct continuation of the same output
- a design decision is still being actively negotiated

Use a separate chat when:

- the task can run independently
- you want a clean artifact without mixed discussion
- you want review, research, or implementation to happen in parallel

Use a side chat when:

- you want a status recap
- you want an explanation of an existing approach
- you do not want to interrupt the main working chat

This matches the current official OpenAI Docs guidance for projects, chats, and long-running work.

## 2. Source Of Truth Files

Every meaningful chat should treat these files as the shared canon:

- `docs/decision-log.md`
- `docs/gdd-v0.1.md`
- `docs/technical-blueprint-v0.1.md`

For a system-specific task, also read the matching dedicated current model before making a decision: guest behaviour, venue operations, staff/maintenance, finance/property, brand/ranking, site market, player agency or Aufguss. `docs/README.md` defines the precedence order when older planning documents differ.

If a chat changes project truth, it should update one of those files before closing.

## 3. Recommended Workstreams

### 3.1 Design Canon

Purpose:

- preserve gameplay decisions
- refine pillars
- resolve open questions

Outputs:

- updated GDD
- decision log updates
- named system proposals

### 3.2 Simulation And Economy

Purpose:

- model site generation
- guest preference logic
- brand, ranking, and valuation formulas

Outputs:

- formulas
- state diagrams
- balance assumptions
- test cases

### 3.3 Frontend And UX

Purpose:

- app shell
- screen flows
- dashboard structure
- prototype interaction model

Outputs:

- UI specs
- wireframes
- component plans
- first implementation tasks

### 3.4 Content And Flavor

Purpose:

- site templates
- amenity descriptions
- staff trait lists
- event writing
- guest feedback text

Outputs:

- content tables
- copy decks
- naming decisions

### 3.5 Platform And Delivery

Purpose:

- repo setup
- savegame strategy
- testing
- build pipeline
- deployment

Outputs:

- repo structure
- CI plan
- save schema decisions
- technical tasks

## 4. Chat Naming Convention

Use explicit names with one outcome per chat.

Examples:

- `Sauna Sim - GDD v0.1`
- `Sauna Sim - Site Generator Rules`
- `Sauna Sim - Savegame Architecture`
- `Sauna Sim - Dashboard UX`
- `Sauna Sim - Repo Bootstrap`

Pin the chats that define current truth. Archive old branches once their output is merged into docs.

## 5. Handoff Format Between Chats

When a chat finishes meaningful work, end with this structure:

### Outcome

One sentence describing what became true.

### Files Updated

List the docs or code files changed.

### Decisions Made

Short bullets for stable decisions.

### Open Questions

Only the unresolved items that need another chat.

### Next Best Chat

One specific follow-up chat title and purpose.

## 6. Practical Weekly Rhythm

Recommended rhythm for iterative progress:

1. Start in `Design Canon` when a decision is still fuzzy.
2. Split into `Simulation`, `Frontend`, or `Platform` chats once the target is clear.
3. Merge stable outputs back into the source-of-truth docs.
4. Archive finished chats and keep only the active canon chats pinned.

## 7. Suggested Next Four Chats

1. `Sauna Sim - GDD v0.1 Review`
   - tighten open questions and lock the naming vocabulary
2. `Sauna Sim - Site Generator And Guest Preferences`
   - turn hidden simulation ideas into concrete prototype rules
3. `Sauna Sim - Web Prototype Architecture`
   - translate the blueprint into actual repo scaffolding and module boundaries
4. `Sauna Sim - First Playable Scope`
   - reduce the concept to the smallest testable build
