# Sauna Sim Design Consistency Audit v0.2

## Scope

Audit completed after the building and location review. Canonical content sources are:

- `building-library-v0.1.md` for building bases and building-owned fields.
- `venue-composition-v0.1.md` for location-owned fields.
- `asset-effect-model-v0.1.md` and `asset-registry-v0.1.md` for gameplay, visual and route contracts.

Older mixed Canal/Harbour lists are explicitly retired and must not enter production.

## Resolved

1. **Ownership:** buildings own facade/room/roof fields; locations own ground, shore, quay, water and access fields.
2. **Purchase order:** every upgrade owns an independent authored field. Base routes always exist; no water, stair or activity route requires another upgrade purchase.
3. **Visibility:** every upgrade requires an exterior change, guest activity/route or persistent/timed effect. Menu-only numerical upgrades are prohibited.
4. **Water logic:** floating sauna has direct deck jump and ladder exit; Water Plot owns safe zone. Coast water access is limited to sheltered coves; floating structures are not used on exposed coast.
5. **Aufguss coverage:** every sauna room supports Basic Aufguss. Program Saunas add capacity and richer/parallel premium programming, so small venues are viable and larger venues still have a differentiated advantage.
6. **Recovery coverage:** every location family has a credible heat/cold/rest route or an explicit constrained alternative. Warm pools are variants of one shared mechanic, not separate unbounded systems.
7. **Repeated showers:** extra outdoor showers are independent authored fields that improve recovery throughput only.
8. **False mechanics removed:** undocumented storage, generic operations and staff-efficiency bonuses remain prohibited.

## Findings Requiring Later Proof

1. **Scene proof:** the contract is complete, but route patches, activity anchors and field boundaries need validation once each scene is actually laid out.
2. **Balance:** price, capacity, energy/water cost, appeal and return effects remain intentionally unnumbered. The full price/effect audit is on the later-review list.
3. **Asset scope:** the content list is rich. Before production, it must be divided into prototype, first-release and later asset packages without altering the approved design canon.
4. **Water Plot density:** it has many approved water facilities. Its final base scene needs a fixed pontoon layout with non-overlapping fields for recovery, spa, swim net, fire bowl and outdoor Aufguss.
5. **Weather/season effects:** snow, wind and ambient life still need their own layer and performance plan.

## Audit Verdict

The current design has no known logical contradiction that would make a venue impossible to build or operate. The next required validation is visual/layout proof, then numeric balance proof. Neither can honestly be claimed complete before implementation and playtesting.
