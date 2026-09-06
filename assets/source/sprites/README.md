# Source Sprite Drafts

## Guest Walk Aligned Draft v01

- File: `guest-walk-aligned-draft-v01.png`
- Status: `composition-test source`, not final production art.
- Format: transparent `1230 x 1278` RGBA image with an approximate 4 x 4 cardinal-direction walk grid.
- Current use: the four front-facing walk phases are loaded only for the one visible Canal route test at a common scene scale.
- Required before promotion: redraw/export to the exact `8 x 4` grid of `32 x 32 px` cells, adding diagonal bearings while keeping one shared foot anchor across all 32 frames. Then add the remaining action sheets separately. Do not use its current large, approximate cells as a runtime contract.

## Guest Walk Reference Draft v01

- File: `guest-walk-reference-draft-v01.png`
- Status: `approved visual direction` for the guest character base; still not runtime-ready as a sheet.
- Dimensions: `1214 x 1295`, RGBA with a verified alpha channel.
- Useful reference: four readable cardinal directions and a clear four-phase walking rhythm in a towel-wrapped guest. Production adds the four diagonal bearings at the same scale.
- 2026-08-25: owner reviewed this draft directly and confirmed the character style itself is right ("perfect") - it is the approved look/proportions target for the guest base, overriding the earlier "too chibi/illustration-like" instinct below. What is still missing is production scale and format, not style.
- Still required before this becomes a runtime sheet: reduce to a 24-32 px body base at the locked world scale (currently far larger, at illustration resolution); cut consistent equal cells; separate body silhouette, skin, hair, towel/robe and tool overlay layers; generate the approved walk, stand, shower, plunge, sit, Gus and service action matrix from that neutral base, matching this draft's proportions and readability at the smaller scale. The side frames also still need a truer high top-down view than this draft's three-quarter angle.

The draft is intentionally not associated with a name, goal, age, gender or gameplay attribute. It supplies only motion reference.

## Guest Walk Draft v02

- File: `guest-walk-draft-v02.png`
- Status: `source reference`, not approved for runtime use.
- Origin: built-in image generation, 2026-08-26. Prompt and purpose: a neutral towel-wrapped guest walk study for the first visual prototype.
- Useful reference: readable towel silhouette, high top-down angle and distinct leg phases.
- Required before promotion: remove the generated black/halo backdrop, cut consistent equal cells, reduce to the locked 24-32 px body scale, and separate front/side/back directions from walk phases. This file remains source-only so the renderer is free to adopt a properly authored sheet later.

## Guest Actions Draft v01

- File: `guest-actions-draft-v01.png`
- Status: `source reference`, not approved for runtime use.
- Origin: built-in image generation, 2026-08-26. Prompt and purpose: walk, sit and shower motion-reference sheet for the first isolated animation check.
- Required before promotion: clean the background, split equal cells, preserve a single readable body scale, and separately export the bench/shower props and water effect. The runtime motion study currently uses code-pixel placeholders only to validate timing and anchor intent.
