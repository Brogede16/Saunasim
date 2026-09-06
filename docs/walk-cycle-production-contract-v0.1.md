# Walk Cycle Production Contract v0.1

## Why The First Test Failed

A walk loop cannot be made by placing four separate character pictures next to each other. It needs planned contact, weight transfer and a relationship between the artwork's stride and the character's world movement. Without those, the figure slides sideways or appears to walk on ice.

## Required Eight Poses

Each of the eight directions uses this exact order:

1. Left contact: left foot reaches forward and is visibly planted; right toe remains behind.
2. Left down: left foot remains planted; body is one source pixel lower as it takes weight.
3. Left passing: left foot is planted below the body; right leg passes it while lifted.
4. Left up: left foot pushes off; body is one source pixel higher.
5. Right contact: mirror of left contact.
6. Right down: mirror of left down.
7. Right passing: mirror of left passing.
8. Right up: mirror of left up.

Frame 8 must lead cleanly back into frame 1. No frame may be a separately invented pose.

## Foot And Root Rules

- Contact and down retain the same planted-foot pixel coordinate within the sprite frame.
- The free foot travels forward only while lifted.
- The torso may sway at most one source pixel sideways. It moves one source pixel down in both down poses and one pixel up in both up poses.
- Each frame uses the same transparent cell, bottom anchor and canvas padding. The image is never re-centred around its outline.
- The route system uses a constant world speed. Segment duration is `distance / speed`, not a fixed duration per segment.
- The walk frame rate and world speed are calibrated from one authored stride distance. These three values are stored together and tested together.
- `16` world pixels per cycle at `8 fps` is a **provisional** starting point, not an approved number. Sixteen pixels is roughly 48 cm per step for a 28 px (about 1.7 m) figure, which will read as a short shuffle. Animate the approved `S` strip first, then set the stride and frame rate by eye and record the result here.

## Direction Rules

- `South` is approved first, because both legs and the towel silhouette are visible.
- `North` is a separately drawn rear view, not a flipped face.
- `East` and `West` are side views with a clear leading and trailing foot, not a front figure shifted sideways.
- Diagonals use their own silhouette and do not rotate a bitmap at runtime.
- Only `S`, `SE`, `E`, `NE` and `N` are drawn. `SW`, `W` and `NW` are those eastern bearings mirrored at runtime with `flipX`. Mirroring is not rotation: it preserves the pixel grid exactly, and the foot anchor survives because it sits on the flip axis at x = 16 of a 32 px cell.
- Mirroring flips the image, never the frame order. Shade characters ambient/top so a mirrored bearing is not lit from the wrong side.
- Hair, face, towel and optional accessories follow the same pose timing and fixed foot anchor as the body.

## Review Procedure

1. View the eight frames as stills in a fixed grid.
2. Loop at slow speed and at final game speed.
3. Place a horizontal guide through the planted foot and compare contact/down frames.
4. Run the animation on a route at the calibrated speed.
5. Reject it if a planted foot visibly drifts, the body does not transfer weight, the loop seam snaps, or a direction reads as a sideways slide.
