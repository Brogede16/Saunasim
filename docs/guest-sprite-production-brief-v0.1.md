# Guest Sprite Production Brief v0.1

## Status

Ready for production. This turns the approved style direction and the locked variation scope into one concrete brief someone (or an image-generation pass) can execute against, without further design decisions. It does not replace `pixel-art-production-guide-v0.1.md` or `character-animation-contract-v0.1.md`; it is the guest-specific execution plan those two contracts require before art starts.

## Approved Reference

- `assets/source/sprites/guest-walk-reference-draft-v01.png` is the approved proportions/style target (owner review, 2026-08-25 - see `assets/source/sprites/README.md`). Match its silhouette, head-to-body ratio, towel drape and readable four-phase walk rhythm.
- What must change from that draft: resolution and format only. It is currently illustration-scale (`1214 x 1295` for a 4x4 grid, so roughly `300 x 320` per cell) and three-quarter on the side frames. Production needs it reduced to the locked game scale below with a truer top-down side view, everything else about the look stays.

## Locked Technical Scale

- **Body base: 28 px tall**, within the approved 24-32 px range and matched to the world's locked `16 x 16 px` native tile (`canal-workshop-production-spec-v0.1.md`) - a standing guest reads as slightly under two tiles tall, consistent with a top-down 3/4 handheld-RPG scale.
- **Cell size: 32 x 32 px** per frame (28 px body + margin for hair overshoot and the small optional contact shadow).
- **Foot anchor:** fixed at the bottom-centre of every land cell, per `pixel-art-production-guide-v0.1.md`. All body types and all hairstyles share this exact anchor so route/effect placement never needs a per-variant offset.
- **Grid layout:** 4 rows (down, up, left, right) x 4 columns (walk phases), matching the approved reference draft's own layout - do not redesign the grid, only rescale it.

## First Production Pass: Scope

Produce only the **walk-4dir** and **idle-stand** actions first (per `character-animation-contract-v0.1.md` section 1), on **one body type**, **one hairstyle**, **one skin tone**, **no accessory**. This is the neutral master base every later layer and every later action derives from - do not start layer variants or additional actions before this base is approved at native and phone scale. The remaining 24 actions in the character animation contract, and the full variation matrix below, are later passes once this one is locked.

## Variation Matrix (for the layer system, not all needed in pass one)

Per `decision-log.md` (2026-08-25, extended 2026-08-26): 3 genders (feminine, masculine, non-binary flat-chested with a small chest scar) x 3 body types x 10 hairstyles, realistic skin-tone and hair-colour ramps, optional eye-colour variant, optional single accessory (sunglasses / piercing / sauna hat). All of this is **runtime palette and layer swaps on the one shared master body** (`pixel-art-production-guide-v0.1.md`'s palette-variation rule) - never a separately drawn sheet per combination. Concretely, the source art must separate into these independent layers, each swappable without touching the others:

1. Body silhouette (3 body types x 3 genders - feminine, masculine, non-binary flat-chested with a small top-surgery-style chest scar - = 9 base bodies, same action rig and foot anchor. The scar is a restrained pixel-art detail like any other body mark, not a focal point or a bare-chest pose; see `decision-log.md`, 2026-08-26.)
2. Skin tone (one shared shade ramp, applied identically across all 9 bodies)
3. Hair silhouette (10 styles, each with its own small overshoot mask but the same attach point)
4. Hair colour (one shared shade ramp, applied to any hair silhouette)
5. Eye colour (a 1-2 px palette swap, only visible on close/idle frames)
6. Towel/swimwear (existing shared layer, unchanged by this brief)
7. Optional accessory (sunglasses, piercing, sauna hat - each a small overlay tied to the head anchor, mutually exclusive per guest)

## Ready-to-Use Prompt (first pass only)

```text
Use case: stylized-concept
Asset type: production sprite sheet
Primary request: neutral sauna-guest walk-cycle base, one body type, one hairstyle, one skin tone, plain white towel, no accessory.
Scene/backdrop: genuinely transparent background only.
Composition: 4 rows (down, up, left, right) x 4 columns (walk phases), 32 x 32 px cells, 28 px tall body, fixed foot anchor at bottom-centre of every cell, true top-down 3/4 angle on every row including left/right.
Constraints: consistent body proportions, same silhouette and palette across frames; no scenery, floor, shadow beyond a small optional contact shadow, text or watermark. Match the proportions and readable walk rhythm of assets/source/sprites/guest-walk-reference-draft-v01.png, scaled down to this cell size.
Style/medium: original 16-bit pixel art for a top-down sauna management game. Classic handheld-RPG clarity in a 3/4 top-down view; warm Nordic bathhouse atmosphere; readable silhouettes, broad colour areas, controlled texture, crisp deliberate pixel clusters and a 1px dark warm-navy/brown outline. Use a limited cohesive palette with cedar, muted terracotta, teal-blue water, soft sage/pine greens, amber light and restrained cream highlights. Preserve a fixed gameplay-scale proportion and anchor. No blur, gradients, anti-aliasing, painterly rendering, fantasy motifs, text, labels, UI or watermark. Create original art; do not copy or imitate a named game, artist or asset pack.
```

## Acceptance Checklist (apply `pixel-art-production-guide-v0.1.md`'s production method)

1. True alpha PNG - verify before anything else (see the guide's step 3 and its Pillow check command).
2. 28 px body inside a 32 x 32 px cell, foot anchor identical across all 16 cells.
3. True top-down 3/4 angle on left/right rows, not the reference draft's more three-quarter lean.
4. Walk rhythm still reads clearly at native size and at typical mobile gameplay zoom.
5. Silhouette and proportions still match the approved reference draft's character, just smaller.

Once this base passes, treat body/hair/skin/eye/accessory layer separation (the variation matrix above) as its own follow-up pass, not part of accepting the base.
