# Canal Production Package

This directory is reserved for runtime-ready Canal art. It is intentionally empty until every file below is produced at the locked pixel scale, checked for alpha and aligned to `src/content/canalWorkshopScene.ts`. `repair-workshop-base-v01.md` is the approved data card for the first building; it locks the architectural direction before the final PNG is drawn.

## Runtime Layer Order

| Order | Asset ID | Role | Fixed scene contract | Status |
| ---: | --- | --- | --- | --- |
| 1 | `canal-01-environment-base` | Street, paving, fixed quay and water only | Whole final `1152 x 832` world (`72 x 52` tiles) | Planned |
| 2 | `canal-01-workshop-base` | Exterior-only Repair Workshop base | Workshop footprint / `workshop-door` | Source reference ready |
| 3 | `canal-01-arrival` | Restored entrance/sign overlay | `ws-arrival`, `arrival-street` | Planned |
| 3 | `canal-01-shop-port` | Reception shop port overlay | `ws-shop`, `shop-stop` | Planned |
| 3 | `canal-01-bench-refit` | Visible bench treatment in existing sauna threshold | `ws-capacity` | Planned |
| 3 | `canal-01-program-sauna` | Additional programme volume | `ws-program`, `program-door`, `workshop-chimney` | Planned |
| 3 | `canal-01-gus-yard` | Outdoor Aufguss field | `ws-gus-yard`, yard guest/master anchors | Planned |
| 3 | `canal-01-rain-shower` | Copper shower module | `ws-shower`, `shower-workshop` | Planned |
| 3 | `canal-01-cold-plunge` | Compact plunge module | `ws-cold`, plunge/queue anchors | Planned |
| 4 | `fx-water-calm` | Shared canal ripple loop | `canal-ripple-a`, behind guests | Planned |
| 4 | `fx-steam-chimney` | Shared subtle chimney steam | `workshop-chimney`, effect layer | Planned |
| 4 | `fx-steam-aufguss` | Timed outdoor Gus steam | `aufguss-steam-yard`, effect layer | Planned |
| 4 | `fx-shower-water` | Triggered falling-water/splash | Shower anchor, front of guest | Planned |
| 4 | `fx-plunge` | Triggered ripple/splash | Plunge anchors, behind/front guest split | Planned |

## Runtime Motion Study

| Asset ID | File | Runtime use | Status |
| --- | --- | --- | --- |
| `motion-guest-v01` | `motion-guest-v01.png` | A 4 x 4 sheet: walk frames 0-3, sit frames 4-7, shower frames 8-11. Loaded only by the empty-venue animation study. | Runtime test asset |

It is intentionally not yet the final inclusive character system: it proves a real PNG sheet, frame indexing and action playback in Phaser. The final guest bases must retain the same action keys while meeting the approved palette/appearance-layer contract.

## Source Inputs

- `assets/source/backgrounds/canal-01-quay-parcel-draft-v02.png`: source-only parcel composition. Never load it directly.
- `assets/source/buildings/repair-workshop-base-draft-v02.png`: source-only workshop silhouette, with verified alpha and the approved architectural density. Never load it directly; follow `repair-workshop-base-v01.md` when creating its clean runtime layers.

## Production Rules

1. Files use a real alpha channel wherever the layer is not a full environment base.
2. Every module fits only its authored field and must remain complete when purchased in any order.
3. No asset contains a player-facing name, UI text or baked status marker.
4. Effects are separate from static architecture; guests remain under or over an effect according to the scene anchor layer.
5. The runtime renderer may consume an asset only after its `README` row and `canalWorkshopScene.ts` fields/anchors agree.
