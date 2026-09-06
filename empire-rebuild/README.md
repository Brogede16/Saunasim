# Sauna Empire — no-sprite rebuild

Open `sauna-empire-no-sprites-rc.html` directly in a browser, or serve this folder and open `index.html`. The standalone file includes its scripts, styles and vector scenes and requires no network requests.

## Play

- The Empire atlas contains 48 locations across Denmark, the Nordic region, Europe and overseas markets. Level and network-size requirements gate expansion. Select a pin to inspect an acquisition or manage an owned sauna. Phones also have full-size location buttons below the map.
- Open a location, prepare its staff and program, then use **Open doors** or the play button. Each closed operating day pauses automatically. The Game menu exposes time speeds on mobile.
- Click a building to repair, upgrade or inspect it. Choose a facility in Build, then an empty slot. Reception, sauna and showers are required; an active Host is necessary to admit visitors.
- Create or edit a Goose with duration, seat limit, ticket price, intensity, performance equipment, music, mood, tags and up to three ordered aroma rounds. Costs are derived from the selected composition. Expensive tickets reduce attendance; ticket prices cannot force guests to pay arbitrary amounts.
- Schedule a session into an available sauna room. You may assign a Master or let the simulation choose an available one. Sessions record attendance, quality, revenue, costs and cancellations. Format reviews and aggregate performance remain accessible.
- Staff, guests, reviews and finance retain the source game's operating controls: hiring, training, active status, traits, fatigue, morale, prices, membership, merch, marketing, repair, automation, loans, repayment, asset sales, events, trends, competition pressure, objectives and rankings.
- The campaign victory condition is eight locations, 1.5 million kr. empire value and a 4.25 average rating. Continue after victory without repeated win dialogs. Insolvency rules remain visible in Finance.

## Save and recovery

Autosave uses the separate `saunaEmpireRebuild` browser-storage key and can migrate the original `saunaEmpireRC` state. Export/import JSON backups through Game. A new game requires a second confirmation. File previews and browsers may use different storage origins; export/import is the portable method.

Idle settlement uses the recent net result of open locations, including losses, at 35% efficiency and an eight-hour cap. Reopening consumes the interval once. Bankrupt empires and pending decision events do not earn idle income. A loaded game begins paused.

Invalid saves fall back to a fresh session. Unexpected render failures produce an explicit recovery panel with an export option. The original reported black screen did not reproduce in a clean browser; the recovery paths and mobile startup are tested, but its exact original cause is not claimed to be established.

## Verification

Run from the project root:

```sh
node --test empire-rebuild/core.test.mjs
python3 -m http.server 5188 --bind 127.0.0.1 --directory empire-rebuild
node empire-rebuild/browser-qa.mjs
QA_ENGINE=webkit node empire-rebuild/browser-qa.mjs
node empire-rebuild/build.mjs
```

The suite has 24 passing system/scenario tests. Browser flows cover 1440×1000 desktop and 390×844 mobile in Chromium and WebKit, plus a 320px standalone-file boot and damaged-save recovery. Coverage includes all navigation surfaces and map regions, format creation, scheduling, construction, reload, daily simulation, session history, acquisition, hiring, memberships, merch, marketing, loans, repayment, export/import, events and bankruptcy/new-game confirmation. Screenshots in `qa/` were visually inspected, with follow-up fixes for contrast, touch targets, modal actions and layout stretching. The standard develop-web-game Playwright client was also run and its image inspected.

Thirty-day seeded scenarios produce these operating results, excluding acquisition/training costs and objective/event cash from the lifetime-profit column:

| Scenario | Lifetime operating profit | Closing cash | Rating |
| --- | ---: | ---: | ---: |
| No staff, overpriced entry | −31,794 kr. | 13,506 kr. | 3.52 |
| Standard staffing | 350,259 kr. | 430,659 kr. | 3.74 |
| Manager, maintenance, merch, membership | 372,481 kr. | 427,384 kr. | 3.97 |

The managed scenario spends money on staff and maintenance, so cash is not directly comparable to operating profit. These are regression scenarios, not a claim that every long-term strategy is balanced. An additional funded 48-location scenario checks three complete days for state integrity.

## Rendering boundary

`core.js` owns the simulation and has no DOM/rendering dependency. `ui.js` reads it and draws SVG map/building/guest placeholders with stable room and location IDs. Future room and character sprites belong in the `venueRooms` rendering path; they do not require changing cash settlement, scheduling, progression or save data. `style.css` preserves the original management surfaces and `theme.css` supplies the rebuilt visual theme and mobile adaptations. `build.mjs` assembles these into one HTML file.

## Scope boundary

This is a substantial playable rebuild of the supplied standalone HTML, not verified complete parity with every document in the larger Sauna Sim project. The separate React/Phaser version and its existing local changes are preserved. Its broader authored catalog, composition/venue/execution tiers, detailed guest memories and modular building-family system are not all implemented here. Therefore the standalone filename is retained for continuity, but the full requested feature-complete release remains unapproved. WebKit tests are desktop-hosted mobile emulation, not testing on a physical iPhone.
