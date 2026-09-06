# Source Building Drafts

## Repair Workshop Base Draft v01

- File: `repair-workshop-base-draft-v01.png`
- Status: `rejected source reference`; never load into the game.
- Reason: the generator visually showed a checkerboard but exported an RGB image with no alpha channel. It cannot serve as a layered building asset.
- Useful reference: compact brick workshop massing, loading-port position, warm entrance, roof-side extension zone and material direction.

The final production building must be emitted or cleaned as a true alpha PNG, then aligned against `src/content/canalWorkshopScene.ts` before it is reviewed for runtime use.

## Repair Workshop Base Draft v02

- File: `repair-workshop-base-draft-v02.png`
- Status: `source reference`, not approved for runtime use.
- Dimensions: `1312 x 1199`, RGBA with a verified alpha channel.
- Useful reference: substantial brick workshop massing, gabled charcoal roof, warm entry, original loading port, small shop-hatch field and the dense, believable architecture approved for the game.
- Required before promotion: redraw at the locked tile/pixel scale without simplifying its architectural character; split only the parts that must change independently (base, entrance/shop frontage and later attached modules); preserve the visible door, service opening, chimney, window rhythm and planter/threshold detail; align the final transparent sprites to the authored Canal anchors and depth layers.

Unlike v01, this export is technically usable as a layered source because it has real alpha. It remains a reference image only: its dense pixel scale and three-quarter viewpoint do not yet match the production scene's fixed 960 x 640 coordinate contract. Its architectural density and proportions are the approved direction; the scene adapts around it rather than replacing it with a smaller house.

## Canal Repair Workshop Draft v03

- File: `canal-repair-workshop-draft-v03.png`
- Status: `source reference`, not approved for runtime use.
- Origin: built-in image generation, 2026-08-26. Prompt and purpose: a simple exterior-only former repair workshop used to test the approved Canal direction.
- Useful reference: warm brick mass, dark roof, compact chimney, visible sauna entry and clear side-extension zone.
- Required before promotion: remove the generated dark backdrop/halo, simplify the brick and roof detail, cut the base from its side wing, and align the final transparent layers to the authored workshop footprint, door and chimney anchors.
