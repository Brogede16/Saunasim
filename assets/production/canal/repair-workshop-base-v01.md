# Repair Workshop Base v01 - Asset Data Card

## Status

`repair-workshop-base-v01` is the first production building target. Its approved visual source is `assets/source/buildings/repair-workshop-base-draft-v02.png`. The source is a style and massing reference, not a bitmap to resize directly into the game.

The building establishes the standard for all substantial venue bases: detailed brick or timber material, a deep dark roof, warm practical light, a readable operational entrance and a real service-facing facade. Future buildings may use different materials, but must feel equally credible at the shared character scale.

## Runtime Composition

| Layer | Asset responsibility | Independent changes allowed |
| --- | --- | --- |
| `workshop-base` | Brick shell, roof, permanent chimney, warm front door, loading opening, permanent window rhythm, threshold planters and drainage | None; it is always present. |
| `workshop-frontage` | Entry sign and shop frontage treatment at the existing hatch/port | Arrival and shop families only. |
| `workshop-attached` | A connected rear/side sauna volume where a module explicitly requires it | Sauna-volume family only. |
| `workshop-exterior-fields` | Program sauna, outdoor Gus, shower, plunge and recovery facilities | Separate exterior fields only; never roof overlays. |
| `workshop-effects` | Chimney steam, window glow and later door-state effects | Effects remain separate sheets. |

The player can own any legal combination. One active tier from a module family is rendered at a time; independent families stack through their own anchors rather than generating a new full-building bitmap for every combination.

## Native Envelope

| Item | Contract |
| --- | --- |
| Shared world grid | `16 x 16 px` tiles; characters keep the locked `32 x 32 px` frame and foot anchor. |
| Ground footprint | `22 x 16` tiles (`352 x 256 px`) after every building-owned module. This is what the location reserves and what routes and collision use. |
| Drawn silhouette | `22 x 19` tiles (`352 x 304 px`), i.e. the footprint plus roof and upper mass in the 3/4 view. This is the PNG canvas size. It is a large landmark base, not a small house. |
| Placement rule | The production sprite is placed at native pixels only. Camera zoom changes the whole world; the renderer never rescales this building to solve a layout problem. |
| Required clear perimeter | One walkable tile around free sides, except the explicitly connected sauna-volume seam. |
| Occlusion | Guests can pass in front of the entrance threshold and frontage. No activity anchor may sit on the roof or opaque facade. |

The exact transparent crop and final canvas are set when the clean runtime export is drawn. If its true native silhouette needs one additional tile, the Canal parcel grows around it; the character scale does not change.

## Required Anchors

These are semantic anchors. Final integer coordinates are committed only with the runtime PNG and its `.scene.json` data.

| Anchor ID | Visible source feature | Runtime use |
| --- | --- | --- |
| `workshop-door` | Lit front entrance and threshold | Guest arrival, entry, exit and shop return. |
| `workshop-shop-frontage` | Existing small service hatch/frontage zone | Shop overlay and purchase stop. |
| `workshop-loading-port` | Roller/loading door and ramp | Optional building-specific attached module; not the normal guest entrance. |
| `workshop-chimney` | Brick chimney cap | Low chimney-steam effect, behind front roof pixels. |
| `workshop-front-walk` | Paved front threshold | Depth-sort line and route continuation. |
| `workshop-side-seam` | Right/rear service side | Only legal direct-connection seam for an added sauna volume. |

## Canal Adaptation

The Canal workshop parcel must reserve exterior space for separate facilities, in this order of priority:

1. A clear path from street arrival to `workshop-door`.
2. A side/rear zone for a connected extra sauna volume.
3. A distinct Program Sauna or outdoor Gus field, with its own visible entrance/activity positions.
4. Shower, cold-plunge and recovery fields that guests reach by the promenade without crossing a roof, wall or unpurchased module.
5. The fixed canal route, terrace and water entry.

The present primitive Canal scene remains a layout study. It must be re-anchored from this data card when the clean workshop sprite is produced; raw source art is not inserted into the running scene as a shortcut.

## Production Acceptance

- The building reads as the attached reference at normal phone zoom: substantial, brick-built and warm, not miniature or generic.
- The door, service hatch and loading port are visually distinct.
- A guest walking to the door never crosses opaque pixels or appears on the roof.
- Shop, entrance and later facade upgrades visibly alter their authorised frontage zones.
- A Program Sauna, outdoor Gus, shower, plunge and recovery setup can all be placed beside the building with clear paths and at least one-tile visual breathing room.
