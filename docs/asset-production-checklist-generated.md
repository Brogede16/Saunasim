# Sauna Sim Asset Production Checklist (generated)

Do not edit by hand. This file is derived from `src/content/artContract.ts` and
`src/content/spatialEnvelopes.ts`; regenerate with `UPDATE_ART_SPEC=1 pnpm test`.

Files: **609** - 43 character sheets, 9 effect sheets, 328 building layers, 223 location bases and field states, 6 UI atlases. Total drawn frames: **1100**.

The pivot is the point inside the canvas that the renderer aligns to a scene anchor.

| File | Group | Owner | Canvas px | Frames | Rows | Pivot | Purpose |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| `guest-walk-8dir-v01.png` | character | shared character library | 256 x 160 | 40 | 5 | 16,30 | Eight-phase planted-foot land movement for every guest route. Rows s/se/e/ne/n; sw/w/nw are mirrored at runtime. |
| `guest-idle-stand-v01.png` | character | shared character library | 128 x 160 | 20 | 5 | 16,30 | Standing hold at any visible land stop; also the fallback pose. Rows s/se/e/ne/n; sw/w/nw are mirrored at runtime. |
| `guest-door-enter-exit-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Doorway approach, threshold and disappear/appear. |
| `guest-queue-shift-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Small waiting shuffle in a queue line. |
| `guest-arrival-read-sign-v01.png` | character | shared character library | 128 x 32 | 4 | 1 | 16,30 | Brief arrival pause at a sign, gate or lift portal. |
| `guest-bench-sit-stand-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Sit down, hold, and rise on reverse. |
| `guest-lounge-recline-rise-v01.png` | character | shared character library | 256 x 32 | 8 | 1 | 16,30 | Recline at an explicit lounger, hold, and rise on reverse. |
| `guest-fire-rest-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Seated recovery loop facing an authored fire field. |
| `guest-shop-browse-buy-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Shop stop and purchase gesture. |
| `guest-refill-water-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Refill and drink pause at a water station. |
| `guest-shower-rinse-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Under any shower field; pairs with fx-shower-water. |
| `guest-cascade-rinse-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Bucket/cascade rinse; pairs with a triggered splash effect. |
| `guest-cold-plunge-enter-exit-v01.png` | character | shared character library | 256 x 32 | 8 | 1 | 16,30 | Step in, submerge, hold, exit. Feet are on the basin floor throughout, so this is a foot-pivot sheet. |
| `guest-natural-water-entry-v01.png` | character | shared character library | 256 x 32 | 8 | 1 | 16,30 | Fixed safe natural-water entry and exit at a shore, ladder or bridge. |
| `guest-water-idle-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,22 | Bounded water idle at a natural water route. |
| `guest-ladder-return-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Fixed ladder ascent from an authored water route. |
| `guest-warm-spa-enter-exit-v01.png` | character | shared character library | 256 x 32 | 8 | 1 | 16,30 | Step into a warm spa, hold, and exit. Feet stay on the basin floor, so this is a foot-pivot sheet. |
| `guest-spa-seated-idle-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,22 | Seated warm-spa idle; pairs with bubble and steam effects. |
| `guest-program-participate-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Seated participation inside an outdoor Gus field. |
| `guest-program-exit-recover-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Short warm recovery reaction before the chosen exit route. |
| `master-walk-8dir-v01.png` | character | shared character library | 256 x 160 | 40 | 5 | 16,30 | Eight-phase Master movement with planted feet and a fixed tool hand anchor. Rows s/se/e/ne/n; sw/w/nw are mirrored at runtime. |
| `master-idle-stand-v01.png` | character | shared character library | 128 x 160 | 20 | 5 | 16,30 | Tool-ready Master idle at an outdoor program field. Rows s/se/e/ne/n; sw/w/nw are mirrored at runtime. |
| `master-prepare-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Bucket and towel preparation at a Master Ritual Station. |
| `master-towel-classic-v01.png` | character | shared character library | 256 x 32 | 8 | 1 | 16,30 | Master body action; the tool is a separate aligned overlay. |
| `master-fan-heat-v01.png` | character | shared character library | 256 x 32 | 8 | 1 | 16,30 | Master body action for fan-driven heat distribution. |
| `master-infusion-v01.png` | character | shared character library | 256 x 32 | 8 | 1 | 16,30 | Ladle/infusion pour onto the stones. |
| `master-rain-pour-v01.png` | character | shared character library | 256 x 32 | 8 | 1 | 16,30 | Broad rain-ladle delivery; pairs with a controlled steam effect. |
| `master-vihta-v01.png` | character | shared character library | 256 x 32 | 8 | 1 | 16,30 | Fresh-bundle ritual pose with a separate vihta overlay. |
| `master-rhythm-v01.png` | character | shared character library | 256 x 32 | 8 | 1 | 16,30 | Rhythmic towel or fan performance body action. |
| `master-show-v01.png` | character | shared character library | 256 x 32 | 8 | 1 | 16,30 | Choreographed broad performance body action. |
| `master-close-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Finish acknowledgement before the Master leaves the field. |
| `staff-walk-8dir-v01.png` | character | shared character library | 256 x 160 | 40 | 5 | 16,30 | Eight-phase shared movement for Hosts and Technicians. Rows s/se/e/ne/n; sw/w/nw are mirrored at runtime. |
| `staff-idle-stand-v01.png` | character | shared character library | 128 x 160 | 20 | 5 | 16,30 | Shared staff pause at an authored work or service anchor. Rows s/se/e/ne/n; sw/w/nw are mirrored at runtime. |
| `staff-host-arrival-guide-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Welcome and queue-guidance gesture at an entry. |
| `staff-host-shop-handoff-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Visible shop, towel or product handoff. |
| `staff-host-towel-collect-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Pick-up and fold loop at an authored towel prop. |
| `staff-host-seat-reset-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Short bench, lounger or recovery-seat reset. |
| `staff-host-water-service-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Water or refreshment handoff at an eligible recovery field. |
| `staff-tech-inspect-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Inspection loop at a technical asset. |
| `staff-tech-repair-ground-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Kneeling tool repair at a ground-level asset. |
| `staff-tech-repair-wall-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Standing panel or pipe repair at a wall asset. |
| `staff-tech-repair-roof-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Safe repair loop at an authored accessible upper field. |
| `staff-tech-complete-leave-v01.png` | character | shared character library | 192 x 32 | 6 | 1 | 16,30 | Pack tools and leave after a completed repair. |
| `fx-water-calm-v01.png` | effect | shared effect library | 256 x 32 | 4 | 1 | 32,32 | Ambient ripple over any calm water tile. |
| `fx-steam-chimney-v01.png` | effect | shared effect library | 192 x 48 | 6 | 1 | 16,48 | Low chimney plume behind the roofline. |
| `fx-steam-program-v01.png` | effect | shared effect library | 576 x 64 | 6 | 1 | 48,64 | Timed dense Gus steam over a program field. |
| `fx-shower-water-v01.png` | effect | shared effect library | 128 x 48 | 4 | 1 | 16,48 | Falling water drawn in front of the rinsing guest. |
| `fx-plunge-splash-v01.png` | effect | shared effect library | 384 x 32 | 6 | 1 | 32,32 | Triggered entry splash at a cold basin. |
| `fx-fire-flicker-v01.png` | effect | shared effect library | 128 x 32 | 4 | 1 | 16,32 | Fire bowl and fire circle flame. |
| `fx-light-warm-v01.png` | effect | shared effect library | 96 x 32 | 3 | 1 | 16,32 | Evening lamp and window glow. |
| `fx-foliage-wind-v01.png` | effect | shared effect library | 128 x 32 | 4 | 1 | 16,32 | Planting, reeds and grass movement. |
| `fx-construction-work-v01.png` | effect | shared effect library | 128 x 32 | 4 | 1 | 16,32 | Work screen dust over a field under construction. |
| `ui-venue-management-kit-v01.png` | ui | shared UI library | 456 x 128 | 1 | 1 | 0,0 | Portrait venue header, panel framing and bottom action-bar art; game text remains rendered. |
| `ui-action-icons-v01.png` | ui | shared UI library | 512 x 32 | 16 | 1 | 0,0 | Shared navigation and venue-management action icon atlas. |
| `ui-program-category-icons-v01.png` | ui | shared UI library | 1024 x 32 | 32 | 1 | 0,0 | Reusable Gus editor icon atlas for intent, heat, format, delivery, performance, music and recovery. |
| `ui-material-marks-v01.png` | ui | shared UI library | 512 x 32 | 16 | 1 | 0,0 | Ingredient-mark atlas for the approved Aufguss material library. |
| `ui-tier-marks-v01.png` | ui | shared UI library | 160 x 32 | 5 | 1 | 0,0 | Composition-tier marks: Bad, Normal, Rare, Iconic and Ultimate. |
| `ui-role-status-icons-v01.png` | ui | shared UI library | 512 x 32 | 16 | 1 | 0,0 | Shared staff role, condition, capacity, finance and alert icon atlas. |
| `bld-saunatelt-camp-base-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | A compound of separate tents, not one building. Grows outward inside its own budget. |
| `bld-saunatelt-camp-arrival-l1-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | arrival state 1 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-arrival-l2-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | arrival state 2 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-arrival-l3-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | arrival state 3 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-service-l1-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | service state 1 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-service-l2-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | service state 2 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-service-l3-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | service state 3 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-sauna-a-l1-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | sauna-a state 1 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-sauna-a-l2-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | sauna-a state 2 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-sauna-a-l3-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | sauna-a state 3 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-sauna-b-l1-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | sauna-b state 1 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-sauna-b-l2-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | sauna-b state 2 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-sauna-b-l3-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | sauna-b state 3 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-program-l1-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | program state 1 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-program-l2-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | program state 2 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-program-l3-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | program state 3 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-facade-l1-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | facade state 1 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-facade-l2-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | facade state 2 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-facade-l3-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | facade state 3 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-attached-recovery-l1-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | attached-recovery state 1 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-attached-recovery-l2-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | attached-recovery state 2 of 3, drawn on the shared building canvas. |
| `bld-saunatelt-camp-attached-recovery-l3-v01.png` | building | Saunatelt Camp | 320 x 288 | 1 | 1 | 0,288 | attached-recovery state 3 of 3, drawn on the shared building canvas. |
| `bld-container-compound-base-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | Three to five linked container volumes around a contained yard; roof stair adds upper mass. |
| `bld-container-compound-arrival-l1-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | arrival state 1 of 3, drawn on the shared building canvas. |
| `bld-container-compound-arrival-l2-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | arrival state 2 of 3, drawn on the shared building canvas. |
| `bld-container-compound-arrival-l3-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | arrival state 3 of 3, drawn on the shared building canvas. |
| `bld-container-compound-service-l1-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | service state 1 of 3, drawn on the shared building canvas. |
| `bld-container-compound-service-l2-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | service state 2 of 3, drawn on the shared building canvas. |
| `bld-container-compound-service-l3-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | service state 3 of 3, drawn on the shared building canvas. |
| `bld-container-compound-sauna-a-l1-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | sauna-a state 1 of 3, drawn on the shared building canvas. |
| `bld-container-compound-sauna-a-l2-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | sauna-a state 2 of 3, drawn on the shared building canvas. |
| `bld-container-compound-sauna-a-l3-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | sauna-a state 3 of 3, drawn on the shared building canvas. |
| `bld-container-compound-sauna-b-l1-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | sauna-b state 1 of 3, drawn on the shared building canvas. |
| `bld-container-compound-sauna-b-l2-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | sauna-b state 2 of 3, drawn on the shared building canvas. |
| `bld-container-compound-sauna-b-l3-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | sauna-b state 3 of 3, drawn on the shared building canvas. |
| `bld-container-compound-program-l1-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | program state 1 of 3, drawn on the shared building canvas. |
| `bld-container-compound-program-l2-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | program state 2 of 3, drawn on the shared building canvas. |
| `bld-container-compound-program-l3-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | program state 3 of 3, drawn on the shared building canvas. |
| `bld-container-compound-facade-l1-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | facade state 1 of 3, drawn on the shared building canvas. |
| `bld-container-compound-facade-l2-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | facade state 2 of 3, drawn on the shared building canvas. |
| `bld-container-compound-facade-l3-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | facade state 3 of 3, drawn on the shared building canvas. |
| `bld-container-compound-roof-or-upper-l1-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | roof-or-upper state 1 of 3, drawn on the shared building canvas. |
| `bld-container-compound-roof-or-upper-l2-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | roof-or-upper state 2 of 3, drawn on the shared building canvas. |
| `bld-container-compound-roof-or-upper-l3-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | roof-or-upper state 3 of 3, drawn on the shared building canvas. |
| `bld-container-compound-roof-material-l1-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | roof-material state 1 of 3, drawn on the shared building canvas. |
| `bld-container-compound-roof-material-l2-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | roof-material state 2 of 3, drawn on the shared building canvas. |
| `bld-container-compound-roof-material-l3-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | roof-material state 3 of 3, drawn on the shared building canvas. |
| `bld-container-compound-attached-recovery-l1-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | attached-recovery state 1 of 3, drawn on the shared building canvas. |
| `bld-container-compound-attached-recovery-l2-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | attached-recovery state 2 of 3, drawn on the shared building canvas. |
| `bld-container-compound-attached-recovery-l3-v01.png` | building | Container Compound | 352 x 304 | 1 | 1 | 0,304 | attached-recovery state 3 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-base-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | The loft is vertical volume only; it never claims new ground. |
| `bld-small-timber-cabin-arrival-l1-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | arrival state 1 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-arrival-l2-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | arrival state 2 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-arrival-l3-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | arrival state 3 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-service-l1-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | service state 1 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-service-l2-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | service state 2 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-service-l3-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | service state 3 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-sauna-a-l1-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | sauna-a state 1 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-sauna-a-l2-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | sauna-a state 2 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-sauna-a-l3-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | sauna-a state 3 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-sauna-b-l1-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | sauna-b state 1 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-sauna-b-l2-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | sauna-b state 2 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-sauna-b-l3-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | sauna-b state 3 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-facade-l1-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | facade state 1 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-facade-l2-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | facade state 2 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-facade-l3-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | facade state 3 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-roof-or-upper-l1-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | roof-or-upper state 1 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-roof-or-upper-l2-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | roof-or-upper state 2 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-roof-or-upper-l3-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | roof-or-upper state 3 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-roof-material-l1-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | roof-material state 1 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-roof-material-l2-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | roof-material state 2 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-roof-material-l3-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | roof-material state 3 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-attached-recovery-l1-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | attached-recovery state 1 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-attached-recovery-l2-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | attached-recovery state 2 of 3, drawn on the shared building canvas. |
| `bld-small-timber-cabin-attached-recovery-l3-v01.png` | building | Small Timber Cabin | 256 x 288 | 1 | 1 | 0,288 | attached-recovery state 3 of 3, drawn on the shared building canvas. |
| `bld-pavilion-base-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | Wide, low, view-facing building with an attached recovery wing. |
| `bld-pavilion-arrival-l1-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | arrival state 1 of 3, drawn on the shared building canvas. |
| `bld-pavilion-arrival-l2-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | arrival state 2 of 3, drawn on the shared building canvas. |
| `bld-pavilion-arrival-l3-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | arrival state 3 of 3, drawn on the shared building canvas. |
| `bld-pavilion-service-l1-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | service state 1 of 3, drawn on the shared building canvas. |
| `bld-pavilion-service-l2-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | service state 2 of 3, drawn on the shared building canvas. |
| `bld-pavilion-service-l3-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | service state 3 of 3, drawn on the shared building canvas. |
| `bld-pavilion-sauna-a-l1-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | sauna-a state 1 of 3, drawn on the shared building canvas. |
| `bld-pavilion-sauna-a-l2-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | sauna-a state 2 of 3, drawn on the shared building canvas. |
| `bld-pavilion-sauna-a-l3-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | sauna-a state 3 of 3, drawn on the shared building canvas. |
| `bld-pavilion-program-l1-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | program state 1 of 3, drawn on the shared building canvas. |
| `bld-pavilion-program-l2-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | program state 2 of 3, drawn on the shared building canvas. |
| `bld-pavilion-program-l3-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | program state 3 of 3, drawn on the shared building canvas. |
| `bld-pavilion-facade-l1-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | facade state 1 of 3, drawn on the shared building canvas. |
| `bld-pavilion-facade-l2-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | facade state 2 of 3, drawn on the shared building canvas. |
| `bld-pavilion-facade-l3-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | facade state 3 of 3, drawn on the shared building canvas. |
| `bld-pavilion-roof-or-upper-l1-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | roof-or-upper state 1 of 3, drawn on the shared building canvas. |
| `bld-pavilion-roof-or-upper-l2-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | roof-or-upper state 2 of 3, drawn on the shared building canvas. |
| `bld-pavilion-roof-or-upper-l3-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | roof-or-upper state 3 of 3, drawn on the shared building canvas. |
| `bld-pavilion-roof-material-l1-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | roof-material state 1 of 3, drawn on the shared building canvas. |
| `bld-pavilion-roof-material-l2-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | roof-material state 2 of 3, drawn on the shared building canvas. |
| `bld-pavilion-roof-material-l3-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | roof-material state 3 of 3, drawn on the shared building canvas. |
| `bld-pavilion-attached-recovery-l1-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | attached-recovery state 1 of 3, drawn on the shared building canvas. |
| `bld-pavilion-attached-recovery-l2-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | attached-recovery state 2 of 3, drawn on the shared building canvas. |
| `bld-pavilion-attached-recovery-l3-v01.png` | building | Pavilion | 352 x 304 | 1 | 1 | 0,304 | attached-recovery state 3 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-base-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | House and barn are one compound present from day one; upgrades convert existing bays. |
| `bld-country-estate-barn-arrival-l1-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | arrival state 1 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-arrival-l2-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | arrival state 2 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-arrival-l3-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | arrival state 3 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-service-l1-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | service state 1 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-service-l2-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | service state 2 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-service-l3-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | service state 3 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-sauna-a-l1-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | sauna-a state 1 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-sauna-a-l2-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | sauna-a state 2 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-sauna-a-l3-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | sauna-a state 3 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-sauna-b-l1-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | sauna-b state 1 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-sauna-b-l2-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | sauna-b state 2 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-sauna-b-l3-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | sauna-b state 3 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-program-l1-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | program state 1 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-program-l2-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | program state 2 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-program-l3-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | program state 3 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-facade-l1-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | facade state 1 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-facade-l2-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | facade state 2 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-facade-l3-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | facade state 3 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-roof-or-upper-l1-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | roof-or-upper state 1 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-roof-or-upper-l2-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | roof-or-upper state 2 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-roof-or-upper-l3-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | roof-or-upper state 3 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-roof-material-l1-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | roof-material state 1 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-roof-material-l2-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | roof-material state 2 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-roof-material-l3-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | roof-material state 3 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-attached-recovery-l1-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | attached-recovery state 1 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-attached-recovery-l2-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | attached-recovery state 2 of 3, drawn on the shared building canvas. |
| `bld-country-estate-barn-attached-recovery-l3-v01.png` | building | Country Estate with Barn | 448 x 384 | 1 | 1 | 0,384 | attached-recovery state 3 of 3, drawn on the shared building canvas. |
| `bld-boathouse-base-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | Narrow water-facing shed with a land-facing expansion edge. |
| `bld-boathouse-arrival-l1-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | arrival state 1 of 3, drawn on the shared building canvas. |
| `bld-boathouse-arrival-l2-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | arrival state 2 of 3, drawn on the shared building canvas. |
| `bld-boathouse-arrival-l3-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | arrival state 3 of 3, drawn on the shared building canvas. |
| `bld-boathouse-service-l1-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | service state 1 of 3, drawn on the shared building canvas. |
| `bld-boathouse-service-l2-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | service state 2 of 3, drawn on the shared building canvas. |
| `bld-boathouse-service-l3-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | service state 3 of 3, drawn on the shared building canvas. |
| `bld-boathouse-sauna-a-l1-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | sauna-a state 1 of 3, drawn on the shared building canvas. |
| `bld-boathouse-sauna-a-l2-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | sauna-a state 2 of 3, drawn on the shared building canvas. |
| `bld-boathouse-sauna-a-l3-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | sauna-a state 3 of 3, drawn on the shared building canvas. |
| `bld-boathouse-program-l1-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | program state 1 of 3, drawn on the shared building canvas. |
| `bld-boathouse-program-l2-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | program state 2 of 3, drawn on the shared building canvas. |
| `bld-boathouse-program-l3-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | program state 3 of 3, drawn on the shared building canvas. |
| `bld-boathouse-facade-l1-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | facade state 1 of 3, drawn on the shared building canvas. |
| `bld-boathouse-facade-l2-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | facade state 2 of 3, drawn on the shared building canvas. |
| `bld-boathouse-facade-l3-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | facade state 3 of 3, drawn on the shared building canvas. |
| `bld-boathouse-roof-material-l1-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | roof-material state 1 of 3, drawn on the shared building canvas. |
| `bld-boathouse-roof-material-l2-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | roof-material state 2 of 3, drawn on the shared building canvas. |
| `bld-boathouse-roof-material-l3-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | roof-material state 3 of 3, drawn on the shared building canvas. |
| `bld-boathouse-attached-recovery-l1-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | attached-recovery state 1 of 3, drawn on the shared building canvas. |
| `bld-boathouse-attached-recovery-l2-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | attached-recovery state 2 of 3, drawn on the shared building canvas. |
| `bld-boathouse-attached-recovery-l3-v01.png` | building | Boathouse | 320 x 288 | 1 | 1 | 0,288 | attached-recovery state 3 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-base-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | Substantial brick landmark: dense mass, dark slate roof, loading port and lit entry. |
| `bld-repair-workshop-arrival-l1-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | arrival state 1 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-arrival-l2-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | arrival state 2 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-arrival-l3-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | arrival state 3 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-service-l1-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | service state 1 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-service-l2-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | service state 2 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-service-l3-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | service state 3 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-sauna-a-l1-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | sauna-a state 1 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-sauna-a-l2-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | sauna-a state 2 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-sauna-a-l3-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | sauna-a state 3 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-program-l1-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | program state 1 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-program-l2-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | program state 2 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-program-l3-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | program state 3 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-facade-l1-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | facade state 1 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-facade-l2-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | facade state 2 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-facade-l3-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | facade state 3 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-roof-material-l1-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | roof-material state 1 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-roof-material-l2-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | roof-material state 2 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-roof-material-l3-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | roof-material state 3 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-attached-recovery-l1-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | attached-recovery state 1 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-attached-recovery-l2-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | attached-recovery state 2 of 3, drawn on the shared building canvas. |
| `bld-repair-workshop-attached-recovery-l3-v01.png` | building | Repair Workshop | 352 x 304 | 1 | 1 | 0,304 | attached-recovery state 3 of 3, drawn on the shared building canvas. |
| `bld-small-depot-base-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | Low compact industrial box; attached yard use stays inside the envelope. |
| `bld-small-depot-arrival-l1-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | arrival state 1 of 3, drawn on the shared building canvas. |
| `bld-small-depot-arrival-l2-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | arrival state 2 of 3, drawn on the shared building canvas. |
| `bld-small-depot-arrival-l3-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | arrival state 3 of 3, drawn on the shared building canvas. |
| `bld-small-depot-service-l1-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | service state 1 of 3, drawn on the shared building canvas. |
| `bld-small-depot-service-l2-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | service state 2 of 3, drawn on the shared building canvas. |
| `bld-small-depot-service-l3-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | service state 3 of 3, drawn on the shared building canvas. |
| `bld-small-depot-sauna-a-l1-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | sauna-a state 1 of 3, drawn on the shared building canvas. |
| `bld-small-depot-sauna-a-l2-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | sauna-a state 2 of 3, drawn on the shared building canvas. |
| `bld-small-depot-sauna-a-l3-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | sauna-a state 3 of 3, drawn on the shared building canvas. |
| `bld-small-depot-program-l1-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | program state 1 of 3, drawn on the shared building canvas. |
| `bld-small-depot-program-l2-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | program state 2 of 3, drawn on the shared building canvas. |
| `bld-small-depot-program-l3-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | program state 3 of 3, drawn on the shared building canvas. |
| `bld-small-depot-facade-l1-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | facade state 1 of 3, drawn on the shared building canvas. |
| `bld-small-depot-facade-l2-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | facade state 2 of 3, drawn on the shared building canvas. |
| `bld-small-depot-facade-l3-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | facade state 3 of 3, drawn on the shared building canvas. |
| `bld-small-depot-roof-or-upper-l1-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | roof-or-upper state 1 of 3, drawn on the shared building canvas. |
| `bld-small-depot-roof-or-upper-l2-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | roof-or-upper state 2 of 3, drawn on the shared building canvas. |
| `bld-small-depot-roof-or-upper-l3-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | roof-or-upper state 3 of 3, drawn on the shared building canvas. |
| `bld-small-depot-roof-material-l1-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | roof-material state 1 of 3, drawn on the shared building canvas. |
| `bld-small-depot-roof-material-l2-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | roof-material state 2 of 3, drawn on the shared building canvas. |
| `bld-small-depot-roof-material-l3-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | roof-material state 3 of 3, drawn on the shared building canvas. |
| `bld-small-depot-attached-recovery-l1-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | attached-recovery state 1 of 3, drawn on the shared building canvas. |
| `bld-small-depot-attached-recovery-l2-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | attached-recovery state 2 of 3, drawn on the shared building canvas. |
| `bld-small-depot-attached-recovery-l3-v01.png` | building | Small Depot | 288 x 272 | 1 | 1 | 0,272 | attached-recovery state 3 of 3, drawn on the shared building canvas. |
| `bld-warehouse-base-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | The hall exists from the start; conversions change bay states, not outer mass. |
| `bld-warehouse-arrival-l1-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | arrival state 1 of 3, drawn on the shared building canvas. |
| `bld-warehouse-arrival-l2-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | arrival state 2 of 3, drawn on the shared building canvas. |
| `bld-warehouse-arrival-l3-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | arrival state 3 of 3, drawn on the shared building canvas. |
| `bld-warehouse-service-l1-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | service state 1 of 3, drawn on the shared building canvas. |
| `bld-warehouse-service-l2-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | service state 2 of 3, drawn on the shared building canvas. |
| `bld-warehouse-service-l3-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | service state 3 of 3, drawn on the shared building canvas. |
| `bld-warehouse-sauna-a-l1-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | sauna-a state 1 of 3, drawn on the shared building canvas. |
| `bld-warehouse-sauna-a-l2-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | sauna-a state 2 of 3, drawn on the shared building canvas. |
| `bld-warehouse-sauna-a-l3-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | sauna-a state 3 of 3, drawn on the shared building canvas. |
| `bld-warehouse-sauna-b-l1-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | sauna-b state 1 of 3, drawn on the shared building canvas. |
| `bld-warehouse-sauna-b-l2-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | sauna-b state 2 of 3, drawn on the shared building canvas. |
| `bld-warehouse-sauna-b-l3-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | sauna-b state 3 of 3, drawn on the shared building canvas. |
| `bld-warehouse-program-l1-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | program state 1 of 3, drawn on the shared building canvas. |
| `bld-warehouse-program-l2-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | program state 2 of 3, drawn on the shared building canvas. |
| `bld-warehouse-program-l3-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | program state 3 of 3, drawn on the shared building canvas. |
| `bld-warehouse-facade-l1-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | facade state 1 of 3, drawn on the shared building canvas. |
| `bld-warehouse-facade-l2-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | facade state 2 of 3, drawn on the shared building canvas. |
| `bld-warehouse-facade-l3-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | facade state 3 of 3, drawn on the shared building canvas. |
| `bld-warehouse-roof-or-upper-l1-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | roof-or-upper state 1 of 3, drawn on the shared building canvas. |
| `bld-warehouse-roof-or-upper-l2-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | roof-or-upper state 2 of 3, drawn on the shared building canvas. |
| `bld-warehouse-roof-or-upper-l3-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | roof-or-upper state 3 of 3, drawn on the shared building canvas. |
| `bld-warehouse-roof-material-l1-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | roof-material state 1 of 3, drawn on the shared building canvas. |
| `bld-warehouse-roof-material-l2-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | roof-material state 2 of 3, drawn on the shared building canvas. |
| `bld-warehouse-roof-material-l3-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | roof-material state 3 of 3, drawn on the shared building canvas. |
| `bld-warehouse-attached-recovery-l1-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | attached-recovery state 1 of 3, drawn on the shared building canvas. |
| `bld-warehouse-attached-recovery-l2-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | attached-recovery state 2 of 3, drawn on the shared building canvas. |
| `bld-warehouse-attached-recovery-l3-v01.png` | building | Warehouse | 448 x 384 | 1 | 1 | 0,384 | attached-recovery state 3 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-base-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | Broad processing building with three independently converted existing rooms. |
| `bld-fiskehus-arrival-l1-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | arrival state 1 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-arrival-l2-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | arrival state 2 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-arrival-l3-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | arrival state 3 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-service-l1-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | service state 1 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-service-l2-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | service state 2 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-service-l3-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | service state 3 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-sauna-a-l1-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | sauna-a state 1 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-sauna-a-l2-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | sauna-a state 2 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-sauna-a-l3-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | sauna-a state 3 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-sauna-b-l1-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | sauna-b state 1 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-sauna-b-l2-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | sauna-b state 2 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-sauna-b-l3-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | sauna-b state 3 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-program-l1-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | program state 1 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-program-l2-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | program state 2 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-program-l3-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | program state 3 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-facade-l1-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | facade state 1 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-facade-l2-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | facade state 2 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-facade-l3-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | facade state 3 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-roof-or-upper-l1-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | roof-or-upper state 1 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-roof-or-upper-l2-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | roof-or-upper state 2 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-roof-or-upper-l3-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | roof-or-upper state 3 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-roof-material-l1-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | roof-material state 1 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-roof-material-l2-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | roof-material state 2 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-roof-material-l3-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | roof-material state 3 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-attached-recovery-l1-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | attached-recovery state 1 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-attached-recovery-l2-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | attached-recovery state 2 of 3, drawn on the shared building canvas. |
| `bld-fiskehus-attached-recovery-l3-v01.png` | building | Fiskehus | 384 x 336 | 1 | 1 | 0,336 | attached-recovery state 3 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-base-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | Moored unit only. The gangway and every pontoon are location-owned water fields. |
| `bld-floating-sauna-arrival-l1-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | arrival state 1 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-arrival-l2-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | arrival state 2 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-arrival-l3-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | arrival state 3 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-service-l1-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | service state 1 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-service-l2-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | service state 2 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-service-l3-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | service state 3 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-sauna-a-l1-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | sauna-a state 1 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-sauna-a-l2-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | sauna-a state 2 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-sauna-a-l3-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | sauna-a state 3 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-program-l1-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | program state 1 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-program-l2-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | program state 2 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-program-l3-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | program state 3 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-facade-l1-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | facade state 1 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-facade-l2-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | facade state 2 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-facade-l3-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | facade state 3 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-attached-recovery-l1-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | attached-recovery state 1 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-attached-recovery-l2-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | attached-recovery state 2 of 3, drawn on the shared building canvas. |
| `bld-floating-sauna-attached-recovery-l3-v01.png` | building | Floating Sauna | 256 x 240 | 1 | 1 | 0,240 | attached-recovery state 3 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-base-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | Compact roof compound beside the fixed lift core. |
| `bld-rooftop-sauna-arrival-l1-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | arrival state 1 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-arrival-l2-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | arrival state 2 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-arrival-l3-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | arrival state 3 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-service-l1-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | service state 1 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-service-l2-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | service state 2 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-service-l3-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | service state 3 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-sauna-a-l1-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | sauna-a state 1 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-sauna-a-l2-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | sauna-a state 2 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-sauna-a-l3-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | sauna-a state 3 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-sauna-b-l1-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | sauna-b state 1 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-sauna-b-l2-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | sauna-b state 2 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-sauna-b-l3-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | sauna-b state 3 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-program-l1-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | program state 1 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-program-l2-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | program state 2 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-program-l3-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | program state 3 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-facade-l1-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | facade state 1 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-facade-l2-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | facade state 2 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-facade-l3-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | facade state 3 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-roof-or-upper-l1-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | roof-or-upper state 1 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-roof-or-upper-l2-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | roof-or-upper state 2 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-roof-or-upper-l3-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | roof-or-upper state 3 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-roof-material-l1-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | roof-material state 1 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-roof-material-l2-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | roof-material state 2 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-roof-material-l3-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | roof-material state 3 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-attached-recovery-l1-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | attached-recovery state 1 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-attached-recovery-l2-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | attached-recovery state 2 of 3, drawn on the shared building canvas. |
| `bld-rooftop-sauna-attached-recovery-l3-v01.png` | building | Rooftop Sauna | 288 x 288 | 1 | 1 | 0,288 | attached-recovery state 3 of 3, drawn on the shared building canvas. |
| `bld-kursted-base-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | Landmark base with existing side wings; its mass is present from day one. |
| `bld-kursted-arrival-l1-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | arrival state 1 of 3, drawn on the shared building canvas. |
| `bld-kursted-arrival-l2-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | arrival state 2 of 3, drawn on the shared building canvas. |
| `bld-kursted-arrival-l3-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | arrival state 3 of 3, drawn on the shared building canvas. |
| `bld-kursted-service-l1-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | service state 1 of 3, drawn on the shared building canvas. |
| `bld-kursted-service-l2-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | service state 2 of 3, drawn on the shared building canvas. |
| `bld-kursted-service-l3-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | service state 3 of 3, drawn on the shared building canvas. |
| `bld-kursted-sauna-a-l1-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | sauna-a state 1 of 3, drawn on the shared building canvas. |
| `bld-kursted-sauna-a-l2-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | sauna-a state 2 of 3, drawn on the shared building canvas. |
| `bld-kursted-sauna-a-l3-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | sauna-a state 3 of 3, drawn on the shared building canvas. |
| `bld-kursted-sauna-b-l1-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | sauna-b state 1 of 3, drawn on the shared building canvas. |
| `bld-kursted-sauna-b-l2-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | sauna-b state 2 of 3, drawn on the shared building canvas. |
| `bld-kursted-sauna-b-l3-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | sauna-b state 3 of 3, drawn on the shared building canvas. |
| `bld-kursted-program-l1-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | program state 1 of 3, drawn on the shared building canvas. |
| `bld-kursted-program-l2-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | program state 2 of 3, drawn on the shared building canvas. |
| `bld-kursted-program-l3-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | program state 3 of 3, drawn on the shared building canvas. |
| `bld-kursted-facade-l1-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | facade state 1 of 3, drawn on the shared building canvas. |
| `bld-kursted-facade-l2-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | facade state 2 of 3, drawn on the shared building canvas. |
| `bld-kursted-facade-l3-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | facade state 3 of 3, drawn on the shared building canvas. |
| `bld-kursted-roof-or-upper-l1-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | roof-or-upper state 1 of 3, drawn on the shared building canvas. |
| `bld-kursted-roof-or-upper-l2-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | roof-or-upper state 2 of 3, drawn on the shared building canvas. |
| `bld-kursted-roof-or-upper-l3-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | roof-or-upper state 3 of 3, drawn on the shared building canvas. |
| `bld-kursted-roof-material-l1-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | roof-material state 1 of 3, drawn on the shared building canvas. |
| `bld-kursted-roof-material-l2-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | roof-material state 2 of 3, drawn on the shared building canvas. |
| `bld-kursted-roof-material-l3-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | roof-material state 3 of 3, drawn on the shared building canvas. |
| `bld-kursted-attached-recovery-l1-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | attached-recovery state 1 of 3, drawn on the shared building canvas. |
| `bld-kursted-attached-recovery-l2-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | attached-recovery state 2 of 3, drawn on the shared building canvas. |
| `bld-kursted-attached-recovery-l3-v01.png` | building | Former Kursted / Badesanatorium | 512 x 448 | 1 | 1 | 0,448 | attached-recovery state 3 of 3, drawn on the shared building canvas. |
| `env-canal-base-v01.png` | location | Canal | 1152 x 832 | 1 | 1 | 0,0 | Terrain, water, roads, protected structures and neutral empty fields only. No purchasable module. |
| `loc-canal-terrace-base-v01.png` | location | Canal | 224 x 128 | 1 | 1 | 0,128 | Quay Terrace (land) state 1 of 3, drawn complete. |
| `loc-canal-terrace-l1-v01.png` | location | Canal | 224 x 128 | 1 | 1 | 0,128 | Quay Terrace (land) state 2 of 3, drawn complete. |
| `loc-canal-terrace-l2-v01.png` | location | Canal | 224 x 128 | 1 | 1 | 0,128 | Quay Terrace (land) state 3 of 3, drawn complete. |
| `loc-canal-shower-base-v01.png` | location | Canal | 96 x 96 | 1 | 1 | 0,96 | Outdoor Shower (land) state 1 of 3, drawn complete. |
| `loc-canal-shower-l1-v01.png` | location | Canal | 96 x 96 | 1 | 1 | 0,96 | Outdoor Shower (land) state 2 of 3, drawn complete. |
| `loc-canal-shower-l2-v01.png` | location | Canal | 96 x 96 | 1 | 1 | 0,96 | Outdoor Shower (land) state 3 of 3, drawn complete. |
| `loc-canal-bathing-bridge-base-v01.png` | location | Canal | 192 x 224 | 1 | 1 | 0,224 | Bathing Bridge (water-edge) state 1 of 3, drawn complete. |
| `loc-canal-bathing-bridge-l1-v01.png` | location | Canal | 192 x 224 | 1 | 1 | 0,224 | Bathing Bridge (water-edge) state 2 of 3, drawn complete. |
| `loc-canal-bathing-bridge-l2-v01.png` | location | Canal | 192 x 224 | 1 | 1 | 0,224 | Bathing Bridge (water-edge) state 3 of 3, drawn complete. |
| `loc-canal-quay-lights-base-v01.png` | location | Canal | 256 x 64 | 1 | 1 | 0,64 | Quay Lights (land) state 1 of 1, drawn complete. |
| `loc-canal-planting-base-v01.png` | location | Canal | 256 x 96 | 1 | 1 | 0,96 | Quay Planting (land) state 1 of 1, drawn complete. |
| `env-harbour-base-v01.png` | location | Harbour | 1280 x 896 | 1 | 1 | 0,0 | Terrain, water, roads, protected structures and neutral empty fields only. No purchasable module. |
| `loc-harbour-terrace-base-v01.png` | location | Harbour | 224 x 128 | 1 | 1 | 0,128 | Quay Terrace (land) state 1 of 3, drawn complete. |
| `loc-harbour-terrace-l1-v01.png` | location | Harbour | 224 x 128 | 1 | 1 | 0,128 | Quay Terrace (land) state 2 of 3, drawn complete. |
| `loc-harbour-terrace-l2-v01.png` | location | Harbour | 224 x 128 | 1 | 1 | 0,128 | Quay Terrace (land) state 3 of 3, drawn complete. |
| `loc-harbour-outdoor-gus-base-v01.png` | location | Harbour | 192 x 160 | 1 | 1 | 0,160 | Quay Outdoor Gus Sauna (land) state 1 of 3, drawn complete. |
| `loc-harbour-outdoor-gus-l1-v01.png` | location | Harbour | 192 x 160 | 1 | 1 | 0,160 | Quay Outdoor Gus Sauna (land) state 2 of 3, drawn complete. |
| `loc-harbour-outdoor-gus-l2-v01.png` | location | Harbour | 192 x 160 | 1 | 1 | 0,160 | Quay Outdoor Gus Sauna (land) state 3 of 3, drawn complete. |
| `loc-harbour-bathing-steps-base-v01.png` | location | Harbour | 256 x 256 | 1 | 1 | 0,256 | Harbour Bathing Steps (water-edge) state 1 of 4, drawn complete. |
| `loc-harbour-bathing-steps-l1-v01.png` | location | Harbour | 256 x 256 | 1 | 1 | 0,256 | Harbour Bathing Steps (water-edge) state 2 of 4, drawn complete. |
| `loc-harbour-bathing-steps-l2-v01.png` | location | Harbour | 256 x 256 | 1 | 1 | 0,256 | Harbour Bathing Steps (water-edge) state 3 of 4, drawn complete. |
| `loc-harbour-bathing-steps-l3-v01.png` | location | Harbour | 256 x 256 | 1 | 1 | 0,256 | Harbour Bathing Steps (water-edge) state 4 of 4, drawn complete. |
| `loc-harbour-shower-row-base-v01.png` | location | Harbour | 160 x 96 | 1 | 1 | 0,96 | Shower Row (land) state 1 of 3, drawn complete. |
| `loc-harbour-shower-row-l1-v01.png` | location | Harbour | 160 x 96 | 1 | 1 | 0,96 | Shower Row (land) state 2 of 3, drawn complete. |
| `loc-harbour-shower-row-l2-v01.png` | location | Harbour | 160 x 96 | 1 | 1 | 0,96 | Shower Row (land) state 3 of 3, drawn complete. |
| `loc-harbour-cargo-net-loungers-base-v01.png` | location | Harbour | 160 x 96 | 1 | 1 | 0,96 | Cargo-Net Loungers (land) state 1 of 2, drawn complete. |
| `loc-harbour-cargo-net-loungers-l1-v01.png` | location | Harbour | 160 x 96 | 1 | 1 | 0,96 | Cargo-Net Loungers (land) state 2 of 2, drawn complete. |
| `loc-harbour-fire-bowl-base-v01.png` | location | Harbour | 128 x 128 | 1 | 1 | 0,128 | Dockside Fire Bowl (land) state 1 of 2, drawn complete. |
| `loc-harbour-fire-bowl-l1-v01.png` | location | Harbour | 128 x 128 | 1 | 1 | 0,128 | Dockside Fire Bowl (land) state 2 of 2, drawn complete. |
| `loc-harbour-lanterns-base-v01.png` | location | Harbour | 224 x 64 | 1 | 1 | 0,64 | Quay Lanterns (land) state 1 of 1, drawn complete. |
| `loc-harbour-salt-planting-base-v01.png` | location | Harbour | 192 x 80 | 1 | 1 | 0,80 | Salt Planting (land) state 1 of 1, drawn complete. |
| `env-industrial-base-v01.png` | location | Industrial District | 1280 x 896 | 1 | 1 | 0,0 | Terrain, water, roads, protected structures and neutral empty fields only. No purchasable module. |
| `loc-industrial-shower-row-base-v01.png` | location | Industrial District | 160 x 96 | 1 | 1 | 0,96 | Covered Shower Row (land) state 1 of 3, drawn complete. |
| `loc-industrial-shower-row-l1-v01.png` | location | Industrial District | 160 x 96 | 1 | 1 | 0,96 | Covered Shower Row (land) state 2 of 3, drawn complete. |
| `loc-industrial-shower-row-l2-v01.png` | location | Industrial District | 160 x 96 | 1 | 1 | 0,96 | Covered Shower Row (land) state 3 of 3, drawn complete. |
| `loc-industrial-cold-basin-base-v01.png` | location | Industrial District | 192 x 128 | 1 | 1 | 0,128 | Long Cold Basin (land) state 1 of 3, drawn complete. |
| `loc-industrial-cold-basin-l1-v01.png` | location | Industrial District | 192 x 128 | 1 | 1 | 0,128 | Long Cold Basin (land) state 2 of 3, drawn complete. |
| `loc-industrial-cold-basin-l2-v01.png` | location | Industrial District | 192 x 128 | 1 | 1 | 0,128 | Long Cold Basin (land) state 3 of 3, drawn complete. |
| `loc-industrial-sunken-spa-base-v01.png` | location | Industrial District | 224 x 160 | 1 | 1 | 0,160 | Sunken Yard Spa (land) state 1 of 3, drawn complete. |
| `loc-industrial-sunken-spa-l1-v01.png` | location | Industrial District | 224 x 160 | 1 | 1 | 0,160 | Sunken Yard Spa (land) state 2 of 3, drawn complete. |
| `loc-industrial-sunken-spa-l2-v01.png` | location | Industrial District | 224 x 160 | 1 | 1 | 0,160 | Sunken Yard Spa (land) state 3 of 3, drawn complete. |
| `loc-industrial-recovery-canopy-base-v01.png` | location | Industrial District | 224 x 128 | 1 | 1 | 0,128 | Recovery Canopy (land) state 1 of 3, drawn complete. |
| `loc-industrial-recovery-canopy-l1-v01.png` | location | Industrial District | 224 x 128 | 1 | 1 | 0,128 | Recovery Canopy (land) state 2 of 3, drawn complete. |
| `loc-industrial-recovery-canopy-l2-v01.png` | location | Industrial District | 224 x 128 | 1 | 1 | 0,128 | Recovery Canopy (land) state 3 of 3, drawn complete. |
| `loc-industrial-outdoor-gus-base-v01.png` | location | Industrial District | 224 x 160 | 1 | 1 | 0,160 | Yard Outdoor Gus Sauna (land) state 1 of 3, drawn complete. |
| `loc-industrial-outdoor-gus-l1-v01.png` | location | Industrial District | 224 x 160 | 1 | 1 | 0,160 | Yard Outdoor Gus Sauna (land) state 2 of 3, drawn complete. |
| `loc-industrial-outdoor-gus-l2-v01.png` | location | Industrial District | 224 x 160 | 1 | 1 | 0,160 | Yard Outdoor Gus Sauna (land) state 3 of 3, drawn complete. |
| `loc-industrial-social-port-base-v01.png` | location | Industrial District | 224 x 128 | 1 | 1 | 0,128 | Social Port (land) state 1 of 3, drawn complete. |
| `loc-industrial-social-port-l1-v01.png` | location | Industrial District | 224 x 128 | 1 | 1 | 0,128 | Social Port (land) state 2 of 3, drawn complete. |
| `loc-industrial-social-port-l2-v01.png` | location | Industrial District | 224 x 128 | 1 | 1 | 0,128 | Social Port (land) state 3 of 3, drawn complete. |
| `loc-industrial-green-wall-base-v01.png` | location | Industrial District | 256 x 64 | 1 | 1 | 0,64 | Green Wall (land) state 1 of 1, drawn complete. |
| `loc-industrial-event-lights-base-v01.png` | location | Industrial District | 256 x 64 | 1 | 1 | 0,64 | Event Lights (land) state 1 of 1, drawn complete. |
| `env-forest-lake-base-v01.png` | location | Forest Lake | 1280 x 1024 | 1 | 1 | 0,0 | Terrain, water, roads, protected structures and neutral empty fields only. No purchasable module. |
| `loc-forest-lake-terrace-base-v01.png` | location | Forest Lake | 224 x 128 | 1 | 1 | 0,128 | Clearing Terrace (land) state 1 of 3, drawn complete. |
| `loc-forest-lake-terrace-l1-v01.png` | location | Forest Lake | 224 x 128 | 1 | 1 | 0,128 | Clearing Terrace (land) state 2 of 3, drawn complete. |
| `loc-forest-lake-terrace-l2-v01.png` | location | Forest Lake | 224 x 128 | 1 | 1 | 0,128 | Clearing Terrace (land) state 3 of 3, drawn complete. |
| `loc-forest-lake-lake-bridge-base-v01.png` | location | Forest Lake | 192 x 224 | 1 | 1 | 0,224 | Lake Bridge (water-edge) state 1 of 3, drawn complete. |
| `loc-forest-lake-lake-bridge-l1-v01.png` | location | Forest Lake | 192 x 224 | 1 | 1 | 0,224 | Lake Bridge (water-edge) state 2 of 3, drawn complete. |
| `loc-forest-lake-lake-bridge-l2-v01.png` | location | Forest Lake | 192 x 224 | 1 | 1 | 0,224 | Lake Bridge (water-edge) state 3 of 3, drawn complete. |
| `loc-forest-lake-shower-base-v01.png` | location | Forest Lake | 96 x 96 | 1 | 1 | 0,96 | Outdoor Shower (land) state 1 of 3, drawn complete. |
| `loc-forest-lake-shower-l1-v01.png` | location | Forest Lake | 96 x 96 | 1 | 1 | 0,96 | Outdoor Shower (land) state 2 of 3, drawn complete. |
| `loc-forest-lake-shower-l2-v01.png` | location | Forest Lake | 96 x 96 | 1 | 1 | 0,96 | Outdoor Shower (land) state 3 of 3, drawn complete. |
| `loc-forest-lake-rest-platform-base-v01.png` | location | Forest Lake | 192 x 160 | 1 | 1 | 0,160 | Floating Rest Platform (water-edge) state 1 of 3, drawn complete. |
| `loc-forest-lake-rest-platform-l1-v01.png` | location | Forest Lake | 192 x 160 | 1 | 1 | 0,160 | Floating Rest Platform (water-edge) state 2 of 3, drawn complete. |
| `loc-forest-lake-rest-platform-l2-v01.png` | location | Forest Lake | 192 x 160 | 1 | 1 | 0,160 | Floating Rest Platform (water-edge) state 3 of 3, drawn complete. |
| `loc-forest-lake-outdoor-gus-base-v01.png` | location | Forest Lake | 192 x 160 | 1 | 1 | 0,160 | Lakeside Outdoor Gus Sauna (land) state 1 of 3, drawn complete. |
| `loc-forest-lake-outdoor-gus-l1-v01.png` | location | Forest Lake | 192 x 160 | 1 | 1 | 0,160 | Lakeside Outdoor Gus Sauna (land) state 2 of 3, drawn complete. |
| `loc-forest-lake-outdoor-gus-l2-v01.png` | location | Forest Lake | 192 x 160 | 1 | 1 | 0,160 | Lakeside Outdoor Gus Sauna (land) state 3 of 3, drawn complete. |
| `loc-forest-lake-rock-spa-base-v01.png` | location | Forest Lake | 224 x 160 | 1 | 1 | 0,160 | Rock Spa (land) state 1 of 3, drawn complete. |
| `loc-forest-lake-rock-spa-l1-v01.png` | location | Forest Lake | 224 x 160 | 1 | 1 | 0,160 | Rock Spa (land) state 2 of 3, drawn complete. |
| `loc-forest-lake-rock-spa-l2-v01.png` | location | Forest Lake | 224 x 160 | 1 | 1 | 0,160 | Rock Spa (land) state 3 of 3, drawn complete. |
| `loc-forest-lake-fire-clearing-base-v01.png` | location | Forest Lake | 192 x 160 | 1 | 1 | 0,160 | Fire Clearing (land) state 1 of 3, drawn complete. |
| `loc-forest-lake-fire-clearing-l1-v01.png` | location | Forest Lake | 192 x 160 | 1 | 1 | 0,160 | Fire Clearing (land) state 2 of 3, drawn complete. |
| `loc-forest-lake-fire-clearing-l2-v01.png` | location | Forest Lake | 192 x 160 | 1 | 1 | 0,160 | Fire Clearing (land) state 3 of 3, drawn complete. |
| `loc-forest-lake-shelter-base-v01.png` | location | Forest Lake | 160 x 128 | 1 | 1 | 0,128 | Lakeside Shelter (land) state 1 of 1, drawn complete. |
| `loc-forest-lake-stone-circle-base-v01.png` | location | Forest Lake | 128 x 128 | 1 | 1 | 0,128 | Stone Bench Circle (land) state 1 of 1, drawn complete. |
| `loc-forest-lake-view-frame-base-v01.png` | location | Forest Lake | 96 x 80 | 1 | 1 | 0,80 | View Frame (land) state 1 of 1, drawn complete. |
| `loc-forest-lake-ritual-path-base-v01.png` | location | Forest Lake | 224 x 64 | 1 | 1 | 0,64 | Ritual Path (land) state 1 of 1, drawn complete. |
| `env-coast-base-v01.png` | location | Coast | 1280 x 1024 | 1 | 1 | 0,0 | Terrain, water, roads, protected structures and neutral empty fields only. No purchasable module. |
| `loc-coast-outlook-deck-base-v01.png` | location | Coast | 224 x 128 | 1 | 1 | 0,128 | Outlook Deck (land) state 1 of 3, drawn complete. |
| `loc-coast-outlook-deck-l1-v01.png` | location | Coast | 224 x 128 | 1 | 1 | 0,128 | Outlook Deck (land) state 2 of 3, drawn complete. |
| `loc-coast-outlook-deck-l2-v01.png` | location | Coast | 224 x 128 | 1 | 1 | 0,128 | Outlook Deck (land) state 3 of 3, drawn complete. |
| `loc-coast-cove-steps-base-v01.png` | location | Coast | 192 x 224 | 1 | 1 | 0,224 | Cove Steps (water-edge) state 1 of 3, drawn complete. |
| `loc-coast-cove-steps-l1-v01.png` | location | Coast | 192 x 224 | 1 | 1 | 0,224 | Cove Steps (water-edge) state 2 of 3, drawn complete. |
| `loc-coast-cove-steps-l2-v01.png` | location | Coast | 192 x 224 | 1 | 1 | 0,224 | Cove Steps (water-edge) state 3 of 3, drawn complete. |
| `loc-coast-shower-changing-base-v01.png` | location | Coast | 192 x 128 | 1 | 1 | 0,128 | Shower and Changing (land) state 1 of 3, drawn complete. |
| `loc-coast-shower-changing-l1-v01.png` | location | Coast | 192 x 128 | 1 | 1 | 0,128 | Shower and Changing (land) state 2 of 3, drawn complete. |
| `loc-coast-shower-changing-l2-v01.png` | location | Coast | 192 x 128 | 1 | 1 | 0,128 | Shower and Changing (land) state 3 of 3, drawn complete. |
| `loc-coast-outdoor-gus-base-v01.png` | location | Coast | 192 x 160 | 1 | 1 | 0,160 | Screened Outdoor Gus Sauna (land) state 1 of 3, drawn complete. |
| `loc-coast-outdoor-gus-l1-v01.png` | location | Coast | 192 x 160 | 1 | 1 | 0,160 | Screened Outdoor Gus Sauna (land) state 2 of 3, drawn complete. |
| `loc-coast-outdoor-gus-l2-v01.png` | location | Coast | 192 x 160 | 1 | 1 | 0,160 | Screened Outdoor Gus Sauna (land) state 3 of 3, drawn complete. |
| `loc-coast-rock-spa-base-v01.png` | location | Coast | 224 x 160 | 1 | 1 | 0,160 | Rock Spa (land) state 1 of 3, drawn complete. |
| `loc-coast-rock-spa-l1-v01.png` | location | Coast | 224 x 160 | 1 | 1 | 0,160 | Rock Spa (land) state 2 of 3, drawn complete. |
| `loc-coast-rock-spa-l2-v01.png` | location | Coast | 224 x 160 | 1 | 1 | 0,160 | Rock Spa (land) state 3 of 3, drawn complete. |
| `loc-coast-cliff-niche-base-v01.png` | location | Coast | 128 x 96 | 1 | 1 | 0,96 | Cliff Niche (land) state 1 of 1, drawn complete. |
| `loc-coast-lanterns-base-v01.png` | location | Coast | 224 x 64 | 1 | 1 | 0,64 | Coastal Lanterns (land) state 1 of 1, drawn complete. |
| `loc-coast-planting-base-v01.png` | location | Coast | 192 x 80 | 1 | 1 | 0,80 | Wind Planting (land) state 1 of 1, drawn complete. |
| `loc-coast-wind-screens-base-v01.png` | location | Coast | 160 x 64 | 1 | 1 | 0,64 | Wind Screens (land) state 1 of 1, drawn complete. |
| `env-beach-base-v01.png` | location | Beach | 1280 x 1024 | 1 | 1 | 0,0 | Terrain, water, roads, protected structures and neutral empty fields only. No purchasable module. |
| `loc-beach-deck-base-v01.png` | location | Beach | 224 x 128 | 1 | 1 | 0,128 | Boardwalk Deck (land) state 1 of 3, drawn complete. |
| `loc-beach-deck-l1-v01.png` | location | Beach | 224 x 128 | 1 | 1 | 0,128 | Boardwalk Deck (land) state 2 of 3, drawn complete. |
| `loc-beach-deck-l2-v01.png` | location | Beach | 224 x 128 | 1 | 1 | 0,128 | Boardwalk Deck (land) state 3 of 3, drawn complete. |
| `loc-beach-cove-bridge-base-v01.png` | location | Beach | 192 x 224 | 1 | 1 | 0,224 | Cove Bridge (water-edge) state 1 of 3, drawn complete. |
| `loc-beach-cove-bridge-l1-v01.png` | location | Beach | 192 x 224 | 1 | 1 | 0,224 | Cove Bridge (water-edge) state 2 of 3, drawn complete. |
| `loc-beach-cove-bridge-l2-v01.png` | location | Beach | 192 x 224 | 1 | 1 | 0,224 | Cove Bridge (water-edge) state 3 of 3, drawn complete. |
| `loc-beach-shower-changing-base-v01.png` | location | Beach | 192 x 128 | 1 | 1 | 0,128 | Shower and Changing (land) state 1 of 3, drawn complete. |
| `loc-beach-shower-changing-l1-v01.png` | location | Beach | 192 x 128 | 1 | 1 | 0,128 | Shower and Changing (land) state 2 of 3, drawn complete. |
| `loc-beach-shower-changing-l2-v01.png` | location | Beach | 192 x 128 | 1 | 1 | 0,128 | Shower and Changing (land) state 3 of 3, drawn complete. |
| `loc-beach-outdoor-gus-base-v01.png` | location | Beach | 192 x 160 | 1 | 1 | 0,160 | Dune Outdoor Gus Sauna (land) state 1 of 3, drawn complete. |
| `loc-beach-outdoor-gus-l1-v01.png` | location | Beach | 192 x 160 | 1 | 1 | 0,160 | Dune Outdoor Gus Sauna (land) state 2 of 3, drawn complete. |
| `loc-beach-outdoor-gus-l2-v01.png` | location | Beach | 192 x 160 | 1 | 1 | 0,160 | Dune Outdoor Gus Sauna (land) state 3 of 3, drawn complete. |
| `loc-beach-beach-spa-base-v01.png` | location | Beach | 224 x 160 | 1 | 1 | 0,160 | Beach Spa (land) state 1 of 3, drawn complete. |
| `loc-beach-beach-spa-l1-v01.png` | location | Beach | 224 x 160 | 1 | 1 | 0,160 | Beach Spa (land) state 2 of 3, drawn complete. |
| `loc-beach-beach-spa-l2-v01.png` | location | Beach | 224 x 160 | 1 | 1 | 0,160 | Beach Spa (land) state 3 of 3, drawn complete. |
| `loc-beach-sun-zone-base-v01.png` | location | Beach | 288 x 144 | 1 | 1 | 0,144 | Sun and Recovery Zone (land) state 1 of 3, drawn complete. |
| `loc-beach-sun-zone-l1-v01.png` | location | Beach | 288 x 144 | 1 | 1 | 0,144 | Sun and Recovery Zone (land) state 2 of 3, drawn complete. |
| `loc-beach-sun-zone-l2-v01.png` | location | Beach | 288 x 144 | 1 | 1 | 0,144 | Sun and Recovery Zone (land) state 3 of 3, drawn complete. |
| `loc-beach-recovery-platform-base-v01.png` | location | Beach | 192 x 160 | 1 | 1 | 0,160 | Floating Recovery Platform (water-edge) state 1 of 2, drawn complete. |
| `loc-beach-recovery-platform-l1-v01.png` | location | Beach | 192 x 160 | 1 | 1 | 0,160 | Floating Recovery Platform (water-edge) state 2 of 2, drawn complete. |
| `loc-beach-fire-base-v01.png` | location | Beach | 128 x 128 | 1 | 1 | 0,128 | Beach Fire (land) state 1 of 2, drawn complete. |
| `loc-beach-fire-l1-v01.png` | location | Beach | 128 x 128 | 1 | 1 | 0,128 | Beach Fire (land) state 2 of 2, drawn complete. |
| `loc-beach-dune-niches-base-v01.png` | location | Beach | 160 x 96 | 1 | 1 | 0,96 | Dune Niches (land) state 1 of 1, drawn complete. |
| `loc-beach-lights-base-v01.png` | location | Beach | 224 x 64 | 1 | 1 | 0,64 | Boardwalk Lights (land) state 1 of 1, drawn complete. |
| `loc-beach-planting-base-v01.png` | location | Beach | 192 x 80 | 1 | 1 | 0,80 | Dune Planting (land) state 1 of 1, drawn complete. |
| `loc-beach-refill-base-v01.png` | location | Beach | 96 x 64 | 1 | 1 | 0,64 | Refill Station (land) state 1 of 1, drawn complete. |
| `env-rural-base-v01.png` | location | Rural Plot | 1280 x 1024 | 1 | 1 | 0,0 | Terrain, water, roads, protected structures and neutral empty fields only. No purchasable module. |
| `loc-rural-meadow-terrace-base-v01.png` | location | Rural Plot | 224 x 128 | 1 | 1 | 0,128 | Meadow Terrace (land) state 1 of 3, drawn complete. |
| `loc-rural-meadow-terrace-l1-v01.png` | location | Rural Plot | 224 x 128 | 1 | 1 | 0,128 | Meadow Terrace (land) state 2 of 3, drawn complete. |
| `loc-rural-meadow-terrace-l2-v01.png` | location | Rural Plot | 224 x 128 | 1 | 1 | 0,128 | Meadow Terrace (land) state 3 of 3, drawn complete. |
| `loc-rural-shower-base-v01.png` | location | Rural Plot | 160 x 96 | 1 | 1 | 0,96 | Outdoor Shower (land) state 1 of 3, drawn complete. |
| `loc-rural-shower-l1-v01.png` | location | Rural Plot | 160 x 96 | 1 | 1 | 0,96 | Outdoor Shower (land) state 2 of 3, drawn complete. |
| `loc-rural-shower-l2-v01.png` | location | Rural Plot | 160 x 96 | 1 | 1 | 0,96 | Outdoor Shower (land) state 3 of 3, drawn complete. |
| `loc-rural-cold-plunge-base-v01.png` | location | Rural Plot | 160 x 128 | 1 | 1 | 0,128 | Built Cold Plunge (land) state 1 of 3, drawn complete. |
| `loc-rural-cold-plunge-l1-v01.png` | location | Rural Plot | 160 x 128 | 1 | 1 | 0,128 | Built Cold Plunge (land) state 2 of 3, drawn complete. |
| `loc-rural-cold-plunge-l2-v01.png` | location | Rural Plot | 160 x 128 | 1 | 1 | 0,128 | Built Cold Plunge (land) state 3 of 3, drawn complete. |
| `loc-rural-outdoor-gus-base-v01.png` | location | Rural Plot | 192 x 160 | 1 | 1 | 0,160 | Field-Edge Outdoor Gus Sauna (land) state 1 of 3, drawn complete. |
| `loc-rural-outdoor-gus-l1-v01.png` | location | Rural Plot | 192 x 160 | 1 | 1 | 0,160 | Field-Edge Outdoor Gus Sauna (land) state 2 of 3, drawn complete. |
| `loc-rural-outdoor-gus-l2-v01.png` | location | Rural Plot | 192 x 160 | 1 | 1 | 0,160 | Field-Edge Outdoor Gus Sauna (land) state 3 of 3, drawn complete. |
| `loc-rural-garden-spa-base-v01.png` | location | Rural Plot | 224 x 160 | 1 | 1 | 0,160 | Garden Spa (land) state 1 of 3, drawn complete. |
| `loc-rural-garden-spa-l1-v01.png` | location | Rural Plot | 224 x 160 | 1 | 1 | 0,160 | Garden Spa (land) state 2 of 3, drawn complete. |
| `loc-rural-garden-spa-l2-v01.png` | location | Rural Plot | 224 x 160 | 1 | 1 | 0,160 | Garden Spa (land) state 3 of 3, drawn complete. |
| `loc-rural-fire-circle-base-v01.png` | location | Rural Plot | 192 x 160 | 1 | 1 | 0,160 | Fire Circle (land) state 1 of 3, drawn complete. |
| `loc-rural-fire-circle-l1-v01.png` | location | Rural Plot | 192 x 160 | 1 | 1 | 0,160 | Fire Circle (land) state 2 of 3, drawn complete. |
| `loc-rural-fire-circle-l2-v01.png` | location | Rural Plot | 192 x 160 | 1 | 1 | 0,160 | Fire Circle (land) state 3 of 3, drawn complete. |
| `loc-rural-covered-recovery-base-v01.png` | location | Rural Plot | 224 x 128 | 1 | 1 | 0,128 | Covered Recovery (land) state 1 of 3, drawn complete. |
| `loc-rural-covered-recovery-l1-v01.png` | location | Rural Plot | 224 x 128 | 1 | 1 | 0,128 | Covered Recovery (land) state 2 of 3, drawn complete. |
| `loc-rural-covered-recovery-l2-v01.png` | location | Rural Plot | 224 x 128 | 1 | 1 | 0,128 | Covered Recovery (land) state 3 of 3, drawn complete. |
| `loc-rural-orchard-benches-base-v01.png` | location | Rural Plot | 224 x 128 | 1 | 1 | 0,128 | Orchard Benches (land) state 1 of 1, drawn complete. |
| `loc-rural-windbreak-base-v01.png` | location | Rural Plot | 256 x 80 | 1 | 1 | 0,80 | Windbreak Planting (land) state 1 of 1, drawn complete. |
| `loc-rural-ritual-path-base-v01.png` | location | Rural Plot | 224 x 64 | 1 | 1 | 0,64 | Ritual Path (land) state 1 of 1, drawn complete. |
| `env-water-plot-base-v01.png` | location | Water Plot | 1152 x 960 | 1 | 1 | 0,0 | Terrain, water, roads, protected structures and neutral empty fields only. No purchasable module. |
| `loc-water-plot-shore-deck-base-v01.png` | location | Water Plot | 192 x 192 | 1 | 1 | 0,192 | Shore Deck (land) state 1 of 3, drawn complete. |
| `loc-water-plot-shore-deck-l1-v01.png` | location | Water Plot | 192 x 192 | 1 | 1 | 0,192 | Shore Deck (land) state 2 of 3, drawn complete. |
| `loc-water-plot-shore-deck-l2-v01.png` | location | Water Plot | 192 x 192 | 1 | 1 | 0,192 | Shore Deck (land) state 3 of 3, drawn complete. |
| `loc-water-plot-changing-cabin-base-v01.png` | location | Water Plot | 128 x 96 | 1 | 1 | 0,96 | Changing Cabin (land) state 1 of 2, drawn complete. |
| `loc-water-plot-changing-cabin-l1-v01.png` | location | Water Plot | 128 x 96 | 1 | 1 | 0,96 | Changing Cabin (land) state 2 of 2, drawn complete. |
| `loc-water-plot-recovery-pontoon-base-v01.png` | location | Water Plot | 160 x 128 | 1 | 1 | 0,128 | Recovery Pontoon (water-edge) state 1 of 3, drawn complete. |
| `loc-water-plot-recovery-pontoon-l1-v01.png` | location | Water Plot | 160 x 128 | 1 | 1 | 0,128 | Recovery Pontoon (water-edge) state 2 of 3, drawn complete. |
| `loc-water-plot-recovery-pontoon-l2-v01.png` | location | Water Plot | 160 x 128 | 1 | 1 | 0,128 | Recovery Pontoon (water-edge) state 3 of 3, drawn complete. |
| `loc-water-plot-floating-spa-base-v01.png` | location | Water Plot | 192 x 160 | 1 | 1 | 0,160 | Floating Spa (water-edge) state 1 of 3, drawn complete. |
| `loc-water-plot-floating-spa-l1-v01.png` | location | Water Plot | 192 x 160 | 1 | 1 | 0,160 | Floating Spa (water-edge) state 2 of 3, drawn complete. |
| `loc-water-plot-floating-spa-l2-v01.png` | location | Water Plot | 192 x 160 | 1 | 1 | 0,160 | Floating Spa (water-edge) state 3 of 3, drawn complete. |
| `loc-water-plot-swim-net-base-v01.png` | location | Water Plot | 224 x 192 | 1 | 1 | 0,192 | Bounded Swim Room (water-edge) state 1 of 3, drawn complete. |
| `loc-water-plot-swim-net-l1-v01.png` | location | Water Plot | 224 x 192 | 1 | 1 | 0,192 | Bounded Swim Room (water-edge) state 2 of 3, drawn complete. |
| `loc-water-plot-swim-net-l2-v01.png` | location | Water Plot | 224 x 192 | 1 | 1 | 0,192 | Bounded Swim Room (water-edge) state 3 of 3, drawn complete. |
| `loc-water-plot-gangway-shower-base-v01.png` | location | Water Plot | 96 x 96 | 1 | 1 | 0,96 | Gangway Shower (water-edge) state 1 of 2, drawn complete. |
| `loc-water-plot-gangway-shower-l1-v01.png` | location | Water Plot | 96 x 96 | 1 | 1 | 0,96 | Gangway Shower (water-edge) state 2 of 2, drawn complete. |
| `loc-water-plot-fire-pontoon-base-v01.png` | location | Water Plot | 128 x 128 | 1 | 1 | 0,128 | Floating Fire Bowl (water-edge) state 1 of 2, drawn complete. |
| `loc-water-plot-fire-pontoon-l1-v01.png` | location | Water Plot | 128 x 128 | 1 | 1 | 0,128 | Floating Fire Bowl (water-edge) state 2 of 2, drawn complete. |
| `loc-water-plot-pontoon-gus-base-v01.png` | location | Water Plot | 192 x 160 | 1 | 1 | 0,160 | Pontoon Outdoor Gus Sauna (water-edge) state 1 of 3, drawn complete. |
| `loc-water-plot-pontoon-gus-l1-v01.png` | location | Water Plot | 192 x 160 | 1 | 1 | 0,160 | Pontoon Outdoor Gus Sauna (water-edge) state 2 of 3, drawn complete. |
| `loc-water-plot-pontoon-gus-l2-v01.png` | location | Water Plot | 192 x 160 | 1 | 1 | 0,160 | Pontoon Outdoor Gus Sauna (water-edge) state 3 of 3, drawn complete. |
| `env-urban-lot-base-v01.png` | location | Urban Lot | 1152 x 832 | 1 | 1 | 0,0 | Terrain, water, roads, protected structures and neutral empty fields only. No purchasable module. |
| `loc-urban-lot-social-deck-base-v01.png` | location | Urban Lot | 192 x 128 | 1 | 1 | 0,128 | Social Deck (land) state 1 of 3, drawn complete. |
| `loc-urban-lot-social-deck-l1-v01.png` | location | Urban Lot | 192 x 128 | 1 | 1 | 0,128 | Social Deck (land) state 2 of 3, drawn complete. |
| `loc-urban-lot-social-deck-l2-v01.png` | location | Urban Lot | 192 x 128 | 1 | 1 | 0,128 | Social Deck (land) state 3 of 3, drawn complete. |
| `loc-urban-lot-canopy-base-v01.png` | location | Urban Lot | 192 x 128 | 1 | 1 | 0,128 | Low Canopy (land) state 1 of 3, drawn complete. |
| `loc-urban-lot-canopy-l1-v01.png` | location | Urban Lot | 192 x 128 | 1 | 1 | 0,128 | Low Canopy (land) state 2 of 3, drawn complete. |
| `loc-urban-lot-canopy-l2-v01.png` | location | Urban Lot | 192 x 128 | 1 | 1 | 0,128 | Low Canopy (land) state 3 of 3, drawn complete. |
| `loc-urban-lot-shower-base-v01.png` | location | Urban Lot | 96 x 96 | 1 | 1 | 0,96 | Yard Shower (land) state 1 of 3, drawn complete. |
| `loc-urban-lot-shower-l1-v01.png` | location | Urban Lot | 96 x 96 | 1 | 1 | 0,96 | Yard Shower (land) state 2 of 3, drawn complete. |
| `loc-urban-lot-shower-l2-v01.png` | location | Urban Lot | 96 x 96 | 1 | 1 | 0,96 | Yard Shower (land) state 3 of 3, drawn complete. |
| `loc-urban-lot-plunge-base-v01.png` | location | Urban Lot | 160 x 128 | 1 | 1 | 0,128 | Compact Plunge (land) state 1 of 3, drawn complete. |
| `loc-urban-lot-plunge-l1-v01.png` | location | Urban Lot | 160 x 128 | 1 | 1 | 0,128 | Compact Plunge (land) state 2 of 3, drawn complete. |
| `loc-urban-lot-plunge-l2-v01.png` | location | Urban Lot | 160 x 128 | 1 | 1 | 0,128 | Compact Plunge (land) state 3 of 3, drawn complete. |
| `loc-urban-lot-outdoor-gus-base-v01.png` | location | Urban Lot | 192 x 160 | 1 | 1 | 0,160 | Courtyard Outdoor Gus Sauna (land) state 1 of 3, drawn complete. |
| `loc-urban-lot-outdoor-gus-l1-v01.png` | location | Urban Lot | 192 x 160 | 1 | 1 | 0,160 | Courtyard Outdoor Gus Sauna (land) state 2 of 3, drawn complete. |
| `loc-urban-lot-outdoor-gus-l2-v01.png` | location | Urban Lot | 192 x 160 | 1 | 1 | 0,160 | Courtyard Outdoor Gus Sauna (land) state 3 of 3, drawn complete. |
| `loc-urban-lot-wild-bath-base-v01.png` | location | Urban Lot | 160 x 128 | 1 | 1 | 0,128 | Screened Wild Bath (land) state 1 of 2, drawn complete. |
| `loc-urban-lot-wild-bath-l1-v01.png` | location | Urban Lot | 160 x 128 | 1 | 1 | 0,128 | Screened Wild Bath (land) state 2 of 2, drawn complete. |
| `loc-urban-lot-fire-courtyard-base-v01.png` | location | Urban Lot | 160 x 128 | 1 | 1 | 0,128 | Fire Courtyard (land) state 1 of 2, drawn complete. |
| `loc-urban-lot-fire-courtyard-l1-v01.png` | location | Urban Lot | 160 x 128 | 1 | 1 | 0,128 | Fire Courtyard (land) state 2 of 2, drawn complete. |
| `loc-urban-lot-mural-wall-base-v01.png` | location | Urban Lot | 256 x 64 | 1 | 1 | 0,64 | Wall / Mural (land) state 1 of 1, drawn complete. |
| `loc-urban-lot-greenery-base-v01.png` | location | Urban Lot | 192 x 64 | 1 | 1 | 0,64 | Potted Greenery (land) state 1 of 1, drawn complete. |
| `loc-urban-lot-lights-base-v01.png` | location | Urban Lot | 192 x 64 | 1 | 1 | 0,64 | Yard Lights (land) state 1 of 1, drawn complete. |
| `loc-urban-lot-refill-bench-base-v01.png` | location | Urban Lot | 96 x 64 | 1 | 1 | 0,64 | Refill Bench (land) state 1 of 1, drawn complete. |
| `loc-urban-lot-sitting-window-base-v01.png` | location | Urban Lot | 128 x 64 | 1 | 1 | 0,64 | Street-Facing Sitting Window (land) state 1 of 1, drawn complete. |
| `env-hotel-rooftop-base-v01.png` | location | Hotel Rooftop | 1152 x 832 | 1 | 1 | 0,0 | Terrain, water, roads, protected structures and neutral empty fields only. No purchasable module. |
| `loc-hotel-rooftop-skyline-deck-base-v01.png` | location | Hotel Rooftop | 192 x 128 | 1 | 1 | 0,128 | Skyline Deck (land) state 1 of 3, drawn complete. |
| `loc-hotel-rooftop-skyline-deck-l1-v01.png` | location | Hotel Rooftop | 192 x 128 | 1 | 1 | 0,128 | Skyline Deck (land) state 2 of 3, drawn complete. |
| `loc-hotel-rooftop-skyline-deck-l2-v01.png` | location | Hotel Rooftop | 192 x 128 | 1 | 1 | 0,128 | Skyline Deck (land) state 3 of 3, drawn complete. |
| `loc-hotel-rooftop-wind-canopy-base-v01.png` | location | Hotel Rooftop | 192 x 128 | 1 | 1 | 0,128 | Wind Canopy (land) state 1 of 3, drawn complete. |
| `loc-hotel-rooftop-wind-canopy-l1-v01.png` | location | Hotel Rooftop | 192 x 128 | 1 | 1 | 0,128 | Wind Canopy (land) state 2 of 3, drawn complete. |
| `loc-hotel-rooftop-wind-canopy-l2-v01.png` | location | Hotel Rooftop | 192 x 128 | 1 | 1 | 0,128 | Wind Canopy (land) state 3 of 3, drawn complete. |
| `loc-hotel-rooftop-shower-base-v01.png` | location | Hotel Rooftop | 128 x 96 | 1 | 1 | 0,96 | Roof Shower (land) state 1 of 3, drawn complete. |
| `loc-hotel-rooftop-shower-l1-v01.png` | location | Hotel Rooftop | 128 x 96 | 1 | 1 | 0,96 | Roof Shower (land) state 2 of 3, drawn complete. |
| `loc-hotel-rooftop-shower-l2-v01.png` | location | Hotel Rooftop | 128 x 96 | 1 | 1 | 0,96 | Roof Shower (land) state 3 of 3, drawn complete. |
| `loc-hotel-rooftop-plunge-base-v01.png` | location | Hotel Rooftop | 160 x 128 | 1 | 1 | 0,128 | Roof Cold Plunge (land) state 1 of 3, drawn complete. |
| `loc-hotel-rooftop-plunge-l1-v01.png` | location | Hotel Rooftop | 160 x 128 | 1 | 1 | 0,128 | Roof Cold Plunge (land) state 2 of 3, drawn complete. |
| `loc-hotel-rooftop-plunge-l2-v01.png` | location | Hotel Rooftop | 160 x 128 | 1 | 1 | 0,128 | Roof Cold Plunge (land) state 3 of 3, drawn complete. |
| `loc-hotel-rooftop-spa-base-v01.png` | location | Hotel Rooftop | 192 x 160 | 1 | 1 | 0,160 | Roof Spa (land) state 1 of 3, drawn complete. |
| `loc-hotel-rooftop-spa-l1-v01.png` | location | Hotel Rooftop | 192 x 160 | 1 | 1 | 0,160 | Roof Spa (land) state 2 of 3, drawn complete. |
| `loc-hotel-rooftop-spa-l2-v01.png` | location | Hotel Rooftop | 192 x 160 | 1 | 1 | 0,160 | Roof Spa (land) state 3 of 3, drawn complete. |
| `loc-hotel-rooftop-outdoor-gus-base-v01.png` | location | Hotel Rooftop | 192 x 160 | 1 | 1 | 0,160 | Rooftop Outdoor Gus Sauna (land) state 1 of 3, drawn complete. |
| `loc-hotel-rooftop-outdoor-gus-l1-v01.png` | location | Hotel Rooftop | 192 x 160 | 1 | 1 | 0,160 | Rooftop Outdoor Gus Sauna (land) state 2 of 3, drawn complete. |
| `loc-hotel-rooftop-outdoor-gus-l2-v01.png` | location | Hotel Rooftop | 192 x 160 | 1 | 1 | 0,160 | Rooftop Outdoor Gus Sauna (land) state 3 of 3, drawn complete. |
| `loc-hotel-rooftop-fire-bowl-base-v01.png` | location | Hotel Rooftop | 128 x 128 | 1 | 1 | 0,128 | Roof Fire Bowl (land) state 1 of 3, drawn complete. |
| `loc-hotel-rooftop-fire-bowl-l1-v01.png` | location | Hotel Rooftop | 128 x 128 | 1 | 1 | 0,128 | Roof Fire Bowl (land) state 2 of 3, drawn complete. |
| `loc-hotel-rooftop-fire-bowl-l2-v01.png` | location | Hotel Rooftop | 128 x 128 | 1 | 1 | 0,128 | Roof Fire Bowl (land) state 3 of 3, drawn complete. |
| `loc-hotel-rooftop-planted-corners-base-v01.png` | location | Hotel Rooftop | 160 x 64 | 1 | 1 | 0,64 | Planted Corners (land) state 1 of 1, drawn complete. |
| `loc-hotel-rooftop-roof-lights-base-v01.png` | location | Hotel Rooftop | 192 x 64 | 1 | 1 | 0,64 | Roof Lights (land) state 1 of 1, drawn complete. |
| `loc-hotel-rooftop-lift-refill-base-v01.png` | location | Hotel Rooftop | 96 x 64 | 1 | 1 | 0,64 | Lift-Core Refill (land) state 1 of 1, drawn complete. |
