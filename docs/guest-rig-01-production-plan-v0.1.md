# Guest Rig 01 Production Plan v0.1

## Purpose

Before producing the full guest library, make one finished and playable guest rig. It is the visual and technical approval point for every later guest, Master, Host and Technician.

`Guest Rig 01` is a neutral internal asset name. The silhouette, clothing and colours do not determine a guest's personality, ability, preferences or gender in simulation data.

## Approved Base Visual

The approved basis is a simple front-facing adult guest with short dark hair, a small neutral face, bare feet and an opaque high-wrap white towel. It is deliberately lower-detail than the earlier generated animation studies: strong outline, restrained palette and readable shape at phone scale.

The approved image is a style reference, not a runtime file. Before use in the game it must be recreated in a transparent authoring canvas with the source-cell padding and pivot rules below. No generated black or brown background is allowed in a production sprite.

## Provisional Walk Source

`assets/source/characters/guest-rig-01-walk-south-provisional-v01.png` is accepted as the first forward-facing walk source after runtime normalization locks its body centre and foot baseline. It is not yet a final packed `32 x 32 px` production sheet, but it is the approved movement reference for the first guest.

For the next movement directions, draw one genuine `East` side strip and mirror it for `West`; do not spend art time drawing a separate western strip. `North` remains a later separately drawn rear strip, never a flipped face. The current diagonal-bearing contract stays available for later routing fidelity; it does not block the first playable guest.

## Temporary Prototype Placeholder

`public/assets/sprites/guest-placeholder-8dir-v01.gif` is a user-supplied eight-direction idle placeholder. It may be used while venue, route and interface work continues, but it is explicitly outside the final art contract: it has no approved walking cycle, modular appearance layers or production asset metadata. Confirm its original licence before any public release.

The first direct code-drawing experiment was rejected in review. Simple geometric blocks are useful for route debugging only; they are not an acceptable substitute for authored pixel animation and must not define the final visual style.

## The Rig Is Not One Flattened Sprite

The game composes the guest from aligned image layers. Every layer uses the same cell size, frame order and foot pivot. The renderer draws the chosen layers together, so a hair colour or towel colour changes without making a new walk cycle.

| Layer | What is drawn separately | What can vary without redrawing motion |
| --- | --- | --- |
| Body motion | Skin, limbs and base silhouette | Skin palette and approved silhouette |
| Garment | Towel, swim shorts or one-piece swimsuit | Garment type and palette |
| Hair | Hair shape for each visible direction | Hair colour palette |
| Face | Small front and diagonal facial pixels | Eye and skin palette; no face layer for back views |
| Optional accessory | Water bottle, bag, towel bundle or tool | Whether the guest carries it |

The first playable test uses one body silhouette, one high-wrap towel, one short hairstyle and one face. It must look good before variants are produced.

## Garments And Coverage

Garments are visual choices, never rules about a guest's identity. The initial guest catalogue should include these separate layers:

| Garment layer | Coverage and silhouette | Use |
| --- | --- | --- |
| `towel-high-wrap` | Opaque towel secured under the arms, covering chest and upper thigh | Suitable for silhouettes with a chest contour and anyone choosing the high wrap |
| `towel-waist-wrap` | Opaque towel at the waist, covering from waist to knee | A separate silhouette, not the high wrap moved down |
| `swim-shorts` | Short swimwear silhouette | Pool, water and active outdoor routes |
| `one-piece-swimsuit` | Opaque one-piece swimsuit | Pool, water and active outdoor routes |

Each garment gets a small approved palette set. Palette substitution changes only the garment colours; it never changes the outline, folds or body shape. This is why the game can offer different colours without needing a new animation for every colour.

## Direction-First Source Production

Do not ask an image model to make the final eight-direction sheet in one image. It makes the four walk phases harder to inspect and it encourages cropped feet or a direction that only changes the upper body.

Each walk direction is commissioned, reviewed and stored as its own eight-frame source strip:

`guest-rig-01-walk-s-v01.png`

`guest-rig-01-walk-se-v01.png`

...through `sw`.

Every strip has one exact direction and these eight poses: left contact, left down, left passing, left up, right contact, right down, right passing, right up. A walk is rejected if the planted foot shifts during its contact/down interval, if the free foot does not pass the planted leg, or if the two contact poses are not clean opposites. Only after all eight strips pass this check are they packed into the runtime sheet. The runtime can still address them as one `walk-8dir` animation.

## Fixed Technical Contract

- Authoring cell: `32 x 32 px`, identical to the runtime cell. There is no larger source cell. Downscaling authored pixel art is the same contract breach as the renderer's current `0.16x` source sprites, and the walk contract's one-pixel weight transfer cannot survive it: one pixel at `64 x 80` is 0.4 of a pixel at `32 x 32`, so the rise and fall that makes the cycle read would be lost in the export.
- Clear space: the 28 px body leaves room above the hair and below the lowest foot inside the same 32 px cell. Detail is removed until it fits; the cell is not enlarged to hold it.
- Foot pivot: centered at the same ground point in every land frame. The production export records its final normalized coordinate.
- Waterline pivot: `(16, 22)` for water and spa frames.
- Land movement: eight bearings, eight walk frames each - but only five bearings are drawn.
- Bearing order: `S, SE, E, NE, N, NW, W, SW`. Drawn: `S, SE, E, NE, N`. Mirrored at runtime: `SW` from `SE`, `W` from `E`, `NW` from `NE`.
- Mirroring flips the image only, never the frame order. After a flip the cycle leads with the other leg, which is still a valid loop; do not correct it.
- Characters are shaded ambient/top. A directional side light would arrive from the wrong side on every mirrored bearing. Buildings keep directional light because they are never mirrored.
- A tool or carried-item anchor is stored as an offset from the pivot so its sign flips with the sprite. An item that must stay on one side of the body needs its own drawn western variant instead of a mirror.
- Every composable layer exports the identical grid and transparent background.
- The character keeps one world scale. Pools, spas and showers are sized around the character; the character is never shrunk to fit an asset.
- The actual door anchor supplied by a building asset is the point where the guest disappears. A route ends at that anchor, never at the building centre.

## Guest Animation Inventory

This is the complete guest-only animation inventory currently required by the approved venues and upgrades. Effects such as steam, splashes, water and shower spray are separate effect sheets, layered behind or in front of the guest as appropriate.

| Sheet | Frames | Drawn bearings | What the guest does | Layer needs |
| --- | ---: | ---: | --- | --- |
| `guest-walk-8dir` | 8 | 5 (+3 mirrored) | Walks between route anchors | Body, garment, hair, face where visible |
| `guest-idle-stand` | 4 | 5 (+3 mirrored) | Breathes or shifts weight at a stop | Body, garment, hair, face where visible |
| `guest-door-enter-exit` | 6 | 1 | Reaches doorway, crosses threshold, disappears or appears | Body, garment, hair, face |
| `guest-queue-shift` | 6 | 1 | Waits and makes a small queue adjustment | Body, garment, hair, face |
| `guest-bench-sit-stand` | 6 | 1 | Sits, holds, and rises from a bench | Body, garment, hair |
| `guest-lounge-recline-rise` | 8 | 1 | Reclines on a lounger and gets up | Body, garment, hair |
| `guest-fire-rest` | 6 | 1 | Seated recovery near a fire | Body, garment, hair |
| `guest-shop-browse-buy` | 6 | 1 | Browses, picks an item, completes purchase | Body, garment, hair, optional item |
| `guest-shower-rinse` | 6 | 1 | Rinses under a shower | Body, garment, wet hair accent; separate water effect |
| `guest-cascade-rinse` | 6 | 1 | Uses a bucket or cascade shower | Body, garment, hair; separate splash effect |
| `guest-cold-plunge-enter-exit` | 8 | 1 | Steps into a cold plunge, sits at waterline, exits | Body, garment, hair; waterline mask |
| `guest-natural-water-entry` | 8 | 1 | Uses a fixed shore, ladder or bridge entry | Body, garment, hair; waterline mask |
| `guest-water-idle` | 6 | 1 | Floats or treads water at a bounded route point | Head, hair, upper garment; waterline mask |
| `guest-warm-spa-enter-exit` | 8 | 1 | Enters and exits a spa or hot tub | Body, garment, hair; waterline and steam masks |
| `guest-spa-seated-idle` | 6 | 1 | Sits in warm water | Head, hair, upper garment; waterline and bubbles |
| `guest-program-participate` | 6 | 1 | Participates in a visible outdoor Aufguss | Body, garment, hair; optional towel or bottle |
| `guest-program-exit-recover` | 6 | 1 | Brief recovery reaction after a program | Body, garment, hair, face |

## First Test Slice

Do not draw all 17 sheets at once. The first playable proof uses these four sheets and one effect:

1. `guest-walk-8dir` with all eight phases for the first `South` direction before any other direction is drawn.
2. `guest-idle-stand`
3. `guest-bench-sit-stand`
4. `guest-shower-rinse`
5. `fx-shower-water`

This proves directional movement, route arrival, correct seat alignment, the high-wrap towel, hair/face visibility, layer pivots and a character interacting with an outdoor upgrade. After approval, produce the remaining guest sheets in the inventory order above.

## Production Order

1. Block and approve one south-facing eight-frame strip with uncut head and feet before detail work.
2. Produce the four remaining drawn bearings (`SE`, `E`, `NE`, `N`) as separate eight-frame strips and reject any bearing whose feet lack a planted contact/down interval. Do not draw `SW`, `W` or `NW`.
2b. Check each mirrored bearing in engine before approving its source: flip `SE`, `E` and `NE` and confirm the foot anchor, hair and any carried item still read correctly.
3. Normalize the approved strips into the runtime grid with transparent background and fixed pivots.
4. Draw the body-motion source for the first four sheets.
5. Draw `towel-high-wrap` on the same cell grids.
6. Draw one short-hair layer and front/diagonal face layer.
7. Implement one palette swap for hair and one for the towel.
8. Run the sheet in the actual Phaser scene on walk, bench and shower anchors.
9. Approve scale, walk cadence, towel coverage and interaction readability.
10. Only then add the other garment layers, silhouettes and the remaining guest actions.

## Approval Criteria

The rig is ready to multiply only when all of the following are true:

- A guest can walk diagonally toward an angled building door without looking as if they slide sideways.
- The feet remain planted at the same ground level across every walking frame.
- The character is lower by one source pixel in each `down` pose and higher by one source pixel in each `up` pose; the head cannot stay mechanically level throughout the cycle.
- Route speed is calibrated from an authored stride distance. A complete eight-frame loop covers one stride in world space; movement duration cannot be a fixed duration per route segment.
- The towel stays coherent in side and back views and never reveals unwanted gaps while walking or sitting.
- Hair colour and towel colour can change by palette, with no change to the underlying animation timing.
- The guest visibly reaches a bench and a shower rather than merely stopping nearby.
- The same character scale remains plausible beside a building, bench, shower and future pool or spa.

## Reference Status

The generated high-wrap towel sheet shown in the design conversation is a visual reference only. It is not an import-ready runtime sprite: it needs fixed 32 px cells, transparent background, consistent baselines and separate compositing layers before it enters `assets/production/`.
