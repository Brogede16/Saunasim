# Runtime Content Data

This folder will hold validated, player-facing data derived from approved design documents: materials, music, program templates, guest names/comments, venue definitions and asset cards. Code imports data from here; it does not duplicate content strings across simulation files.
# Runtime Content

`canalWorkshopScene.ts` is the first machine-readable scene contract. It owns the fixed Canal field rectangles, activity/effect anchors, camera limits and route graph. The renderer and later asset pack must consume these values rather than introducing ad hoc coordinates.

`venueModules.ts` is the first machine-readable venue catalogue. Every module owns one full data card: location/building ownership, compatibility tags, capacity channels, route anchors, economy, condition rule and visual package. A venue derives its build list from its selected location and building tags; it must not introduce a second flat module list.

`guestFeedback.ts` is the first reviewed-style content bank for player-facing guest reactions. Simulation selects only a fitting family and a deterministic variant; it never invents a fact not present in the visit.
