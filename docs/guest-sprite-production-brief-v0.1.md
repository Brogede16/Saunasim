# Guest Sprite Production Brief v0.1

## Status

Ready for production. This turns the approved style direction and the locked variation scope into one concrete brief someone (or an image-generation pass) can execute against, without further design decisions. It does not replace `pixel-art-production-guide-v0.1.md` or `character-animation-contract-v0.1.md`; it is the guest-specific execution plan those two contracts require before art starts.

## Approved Reference

- `assets/source/sprites/guest-walk-reference-draft-v01.png` is the approved proportions/style target (owner review, 2026-08-25 - see `assets/source/sprites/README.md`). Match its silhouette, head-to-body ratio and towel drape. Walking now follows the eight-phase planted-foot contract in `walk-cycle-production-contract-v0.1.md`; the older reference supplies only the cardinal-direction style, while diagonal bearings are a required production extension.
- What must change from that draft: resolution and format only. It is currently illustration-scale (`1214 x 1295` for a 4x4 grid, so roughly `300 x 320` per cell) and three-quarter on the side frames. Production needs it reduced to the locked game scale below with a truer top-down side view, everything else about the look stays.

## Locked Technical Scale

- **Body base: 28 px tall**, within the approved 24-32 px range and matched to the world's locked `16 x 16 px` native tile (`canal-workshop-production-spec-v0.1.md`) - a standing guest reads as slightly under two tiles tall, consistent with a top-down 3/4 handheld-RPG scale.
- **Cell size: 32 x 32 px** per frame (28 px body + margin for hair overshoot and the small optional contact shadow).
- **Foot anchor:** fixed at the bottom-centre of every land cell, per `pixel-art-production-guide-v0.1.md`. All body types and all hairstyles share this exact anchor so route/effect placement never needs a per-variant offset.
- **Grid layout:** 5 rows (`S`, `SE`, `E`, `NE`, `N`) x 8 columns (the eight walk phases in `walk-cycle-production-contract-v0.1.md`). The three western bearings `SW`, `W` and `NW` are not drawn: they are the eastern rows mirrored at runtime with `flipX`, which preserves the pixel grid exactly and keeps the foot anchor because it sits on the flip axis at x = 16. The approved reference supplies the cardinal motion language; the diagonals are a production extension at the same body scale and foot pivot.
- **Four frames is not a walk.** The earlier 4-column layout is the failure `walk-cycle-production-contract-v0.1.md` was written to prevent. Eight phases - contact, down, passing, up, twice - are mandatory.

## First Production Pass: Scope

Produce only the **walk-8dir** and **idle-stand** actions first (per `character-animation-contract-v0.1.md` section 1), on **one body silhouette**, **one hairstyle**, **one skin-tone ramp**, **no accessory**. This is the neutral master base every later layer and every later action derives from - do not start layer variants or additional actions before this base is approved at native and phone scale. The remaining actions in the character animation contract, and the full variation matrix below, are later passes once this one is locked.

## Variation Matrix (for the layer system, not all needed in pass one)

Per `decision-log.md` (2026-08-25, extended 2026-08-26): three distinct body silhouettes, ten hairstyles, realistic skin-tone and hair-colour ramps, optional eye-colour variant and one optional accessory (sunglasses, piercing or sauna hat). These visible variations must not encode personality, ability, taste or gender stereotypes. Non-binary guests are part of the ordinary population without a labelled visual trope. All variation is **runtime palette and layer swapping on shared action rigs** (`pixel-art-production-guide-v0.1.md`'s palette-variation rule), never a separately drawn sheet per individual combination. Concretely, the source art must separate into these independent layers, each swappable without touching the others:

1. Body silhouette (three body types, sharing the same action rig and foot anchor)
2. Skin tone (shared shade ramps, applied consistently across every body silhouette)
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
Composition: 5 rows (S, SE, E, NE, N) x 8 columns (left contact, left down, left passing, left up, right contact, right down, right passing, right up), 32 x 32 px cells, 28 px tall body, fixed foot anchor at bottom-centre of every cell, true top-down 3/4 angle on every row including diagonals. Draw no western bearings; they are mirrored in engine. Shade the figure with ambient/top light only, never a directional side light, so a mirrored bearing is not lit from the wrong side.
Constraints: consistent body proportions, same silhouette and palette across frames; no scenery, floor, shadow beyond a small optional contact shadow, text or watermark. Match the proportions and readable walk rhythm of assets/source/sprites/guest-walk-reference-draft-v01.png, scaled down to this cell size.
Style/medium: original 16-bit pixel art for a top-down sauna management game. Classic handheld-RPG clarity in a 3/4 top-down view; warm Nordic bathhouse atmosphere; readable silhouettes, broad colour areas, controlled texture, crisp deliberate pixel clusters and a 1px dark warm-navy/brown outline. Use a limited cohesive palette with cedar, muted terracotta, teal-blue water, soft sage/pine greens, amber light and restrained cream highlights. Preserve a fixed gameplay-scale proportion and anchor. No blur, gradients, anti-aliasing, painterly rendering, fantasy motifs, text, labels, UI or watermark. Create original art; do not copy or imitate a named game, artist or asset pack.
```

## Acceptance Checklist (apply `pixel-art-production-guide-v0.1.md`'s production method)

1. True alpha PNG - verify before anything else (see the guide's step 3 and its Pillow check command).
2. 28 px body inside a 32 x 32 px cell, foot anchor identical across all 40 cells and sitting exactly on x = 16 so the mirrored bearings register.
2b. Eight distinct walk phases per row, with a planted foot that does not move a pixel through its contact/down interval.
3. True top-down 3/4 angle on cardinal and diagonal rows, not the reference draft's more three-quarter lean.
4. Walk rhythm still reads clearly at native size and at typical mobile gameplay zoom.
5. Silhouette and proportions still match the approved reference draft's character, just smaller.

Once this base passes, treat body/hair/skin/eye/accessory layer separation (the variation matrix above) as its own follow-up pass, not part of accepting the base.
