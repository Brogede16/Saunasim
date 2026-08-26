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
- Useful reference: compact brick workshop massing, gabled charcoal roof, warm entry, original loading port, small shop-hatch field and roof/side space for later overlays.
- Required before promotion: reduce to the locked tile/pixel scale; remove decorative planters and unsupported architectural detail; separate base, entrance, shop, Program Sauna, courtyard yard, shower and plunge fields; align the final transparent sprites to the authored Canal anchors and depth layers.

Unlike v01, this export is technically usable as a layered source because it has real alpha. It remains a reference image only: its dense pixel scale and three-quarter viewpoint do not yet match the production scene's fixed 960 x 640 coordinate contract.
