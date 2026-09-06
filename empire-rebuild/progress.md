Original prompt: Rebuild Sauna Empire from sauna-empire-no-sprites-rc.html with a visual Empire map, improved tycoon UI, building scene, complete Goose workflow, management mechanics, mobile recovery, scenario tests and screenshot QA. Stop for substantive unresolved design/balance decisions.

## 2026-09-06

- User approved derived Goose running costs and price-sensitive attendance after the million-kr ticket exploit was demonstrated.
- Extracted the original HTML into an isolated `empire-rebuild` folder, preserving the separate React/Phaser codebase and existing user changes.
- Implemented four schematic atlas regions, network expansion gates, owned-location overview, exterior building scene, room/build-slot interactions, mobile touch alternatives and a light Nordic management theme.
- Expanded Goose composition with ordered aroma rounds and equipment; added derived costs, willingness-to-pay, room lanes, available-Master allocation, session history and editor schedule validation.
- Fixed unstaffed guest admission, purchase/resale money creation, malformed loan amounts, repeated campaign victory and repeat offline settlement. Added migration, import/export and visible render recovery.
- 24 core/scenario tests pass, including 30-day strategy comparisons, 15-day two-location operations and three days with all 48 locations funded and operational.
- Chromium and WebKit flows pass desktop/mobile, damaged-save boot and the standalone HTML at 320px. Screenshots inspected; contrast, modal buttons, mobile controls and stretched venue layout corrected.
- Standard game Playwright client run and screenshot inspected. Standalone HTML assembled with `build.mjs`.

## Remaining release scope

- Do not describe this as complete parity with the project's wider design. The 30-material catalog, composition/execution/venue tiers, authored building-family system and detailed guest memories remain outside this standalone implementation. See README Scope boundary.
- The original black screen did not reproduce with a clean original build. New recovery and browser tests reduce the failure class but do not prove the specific historical root cause.
- Physical iPhone/Safari verification and broader long-term campaign balance remain separate acceptance work.
