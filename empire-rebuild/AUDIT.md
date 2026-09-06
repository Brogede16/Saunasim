# Sauna Empire rebuild audit

Date: 2026-09-06

## Source and preservation

Located the requested `sauna-empire-no-sprites-rc.html` in the temporary ChatGPT file-preview directory. It is 100,216 bytes and contains a standalone simulation and UI with 48 markets. The main workspace also contains a separate React/Phaser Sauna Sim implementation with extensive existing uncommitted changes. No existing application or reference files have been modified in this audit.

## Mobile investigation

A fresh Chromium session at 390 × 844 successfully renders the supplied HTML. The main content begins at y=60, has width 390 and height 4710, and contains the Empire view. No page errors were reported during this boot check. This does not reproduce or resolve the user's black-content report. Saved-state recovery, the actual preview environment, WebKit and screenshot QA still require investigation.

## Confirmed economy blocker

The Goose editor lets players set ticket prices and operating costs. `runGoose` computes attendance without using the Goose ticket price. Two isolated fresh-state scenarios with the same fixed attendance random input each admitted 12 guests:

| Ticket price | Run cost | Attendance | Session revenue |
| --- | --- | --- | --- |
| 65 kr. | 1 kr. | 12 | 780 kr. |
| 1,000,000 kr. | 1 kr. | 12 | 12,000,000 kr. |

Staff are randomized by the existing state factory, so this is not a complete controlled balance comparison; the missing ticket-price term is also directly confirmed in the attendance code. This exploit defeats finance and progression regardless of visual quality.

Decision required under the user's explicit instruction to stop for substantive balance/design choices: should operating costs be derived from program ingredients, duration and equipment, with player-controlled ticket prices constrained by guest willingness to pay? The alternative is retaining player-entered costs as a sandbox feature, which would require a distinct campaign/sandbox boundary.

## Decision and implementation

The user approved derived operating costs and ticket-price-sensitive demand. These are implemented in `core.js`; manual cost overrides no longer control settlement. In the regression test, a million-kr ticket sells zero seats and still incurs its calculated session cost.

The rebuild also fixes inactive-Master assignment, parallel resource allocation, opening-hour and duration conflicts, repeated victory prompts, invalid loan amounts, unstaffed admissions, immediate purchase/resale arbitrage, and repeatable offline credits. It includes state migration and a visible recovery screen rather than leaving the content area blank on a render failure.

The exact original black-screen cause remains unconfirmed. A fresh copy did not reproduce it. Both the new served build and standalone HTML boot successfully in Chromium and WebKit at mobile sizes. Damaged-save recovery is tested explicitly. This is not a physical iPhone test.

## Current verification

See `README.md` and `qa/browser-results-chromium.json` / `qa/browser-results-webkit.json`. The local suite contains 24 passing system/scenario tests, including a funded 48-location scenario. Historical test counts from the prior conversation are not carried forward as evidence.

This implementation continues the standalone HTML's game rules and market catalog. It does not replace the separate React/Phaser Sauna Sim application. The broader design-document catalog and its distinct composition tiers, 30-material library, modular building families and detailed guest-memory systems have not all been ported into this standalone branch. It must not be represented as complete parity with every project design document.
