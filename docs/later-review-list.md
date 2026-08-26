# Sauna Sim: Later Review List

## Use

This is the shared parking list for decisions deliberately postponed during design. Add an item when either of us says “later”, “we should revisit this”, or equivalent. A later item is not approved scope and must not silently enter implementation.

## Open Items

| Item | Why it is deferred | Revisit when |
| --- | --- | --- |
| Complete route-graph standard for paths, stairs, bridges, quay access and roof transitions | Every base scene needs independent routes that do not depend on a particular upgrade purchase order. | Before location art production and guest-path implementation. |
| Order-independent route adaptation | Paths to buildings and upgrades must work when upgrades are purchased in any order. Each route needs a base connection plus adaptable endpoint/overlay behaviour, without requiring the player to buy a preceding path upgrade. | When defining each location's authored route graph. |
| Master equipment balance | The v0.1 model locks towel sets, hand fans and infusion kits as individual-Master equipment with bounded delivery effects. Tune catalogue variants, prices and exact effects without turning it into a gear inventory system. | During Aufguss/staff balance. |
| Outdoor Master animation production | Masters are recognisable hires and visible outdoor sessions show their route, preparation and tool-appropriate performance. Define exact frames and appearance variants from the shared pipeline. | Before staff sprite production. |
| Seasons and ambient world overlays | The calendar and gameplay boundary are now locked in `seasons-and-operating-calendar-contract-v0.1.md`. Later decide only snow/rain/wind/bird/car layer order, location variants and animation budget. | Before final location background and effect production. |
| Cross-venue balance audit | The method is locked in `cross-venue-balance-protocol-v0.1.md`. Execute its low/mid/high scenario matrix once venue cards and provisional numbers exist. | Before public prototype playtests and after each new venue family is added. |
| Full price and effect balance pass | Assign and test purchase prices, energy/water/cleaning costs, capacity, revenue mechanisms, appeal effects and return effects for every asset. Expensive purchases should be meaningfully good, but no single asset or venue path may dominate. | After the content list is locked, before public prototype playtests. |
| Energy retrofit system | Decide whether roof solar panels and small wind turbines reduce the electricity component of eligible venue energy costs. Solar should require a visible, authored roof/canopy field; small wind should be limited to plausible open coast, harbour, Water Plot or rural fields. Balance it as a long-payback investment, not a universal best purchase or decorative object. | When energy/heat costs receive exact numbers in the economy pass. |
| Final production asset inventory and animation frame plan | The full list follows after all building and location reviews are locked. | Before asset production begins. |
| Guest and staff appearance variation | Approve body/silhouette families, hair choices, skin/towel/outfit palettes, uniforms and inclusive variation rules before any final sprite sheet is generated. | At the visual decision gate, before character art. |
| Numerical economy and balance values | Asset effects are specified, but prices, recurring costs and exact appeal values need the first simulation model. | During simulation/balance pass. |
| Future multiplayer/ranking implementation | The game is designed to remain fair for later competition, but multiplayer is outside the first prototype. | After the single-player loop is proven. |
| Optional account/recovery-key save system | Local IndexedDB save is sufficient for the first prototype; cross-device recovery comes later. | After the multi-day prototype test. |
| ~~Clickable venue overview assets~~ Resolved | Tapping a built upgrade in the venue scene (`src/game/CanalScene.ts:105-111`) selects it and shows its name/short effect plus a "View in Venue" link in the overview panel (`src/ui/App.tsx:225-227`), without covering the scene. | Done. |
| Upgrade detail and related-upgrade interaction | Decide whether tapping a built upgrade should only show information, or also open a small detail view with available related upgrades for that building/location field. Keep this discoverable and avoid turning the map into a dense menu. | After the basic clickable overview has been tested on the first venue. |
| Guest values and content tuning | The guest-behaviour structure is locked in `guest-behaviour-model-v0.1.md`. Tune probabilities, queue thresholds, visit durations, generated names, comments and return effects only when the first guest simulation exists. | During guest-simulation balance and playtests. |
| Shop fit, towel rental and branded merchandise | Replace fixed shop-unit allocation with motivation- and local-market-fit demand once the shared venue market model exists. Add towel rental only with the guest equipment/service loop and its visible towel handling. Gate signature merchandise behind real venue/program identity, not merely a player-entered name. | With P2 local-market generation, guest memory and Brand Value. |
