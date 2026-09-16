# Portal Door Transition Standard

Status: **approved production direction** (2026-09-16).

This standard defines how guests/staff visually enter and exit buildings without requiring fully rendered interiors or bespoke door animation for every module.

## Visual rule

- Walkable entrances use a dark portal opening inside an authored door/frame.
- The opening may be near-black, deep grey or dark brown to fit the building palette; it should read as interior depth rather than a flat black UI rectangle.
- The character approaches the entrance normally.
- At the threshold the character begins to pass behind the authored foreground/door-frame occlusion.
- Opacity fades from visible to hidden over a short transition while the character moves the last small distance into the portal.
- The logical entity remains in simulation while hidden; entering a building is not deletion/despawn from the domain model.
- Exit is the reverse: entity appears at the declared exit anchor, fades in and moves away from the portal.

Full animated hinged/sliding doors are optional exceptions, not the default requirement.

## Required metadata

An interactive portal should expose stable data rather than runtime hardcoded offsets:

- `portalId`
- `entryAnchor`
- `exitAnchor`
- `portalRect` or portal mask/region
- `insideDestinationId`
- `occlusionLayer` / foreground mask reference
- `fadeDistance`
- optional `entryDirection` / `exitDirection`

Exact coordinates belong to authored asset/content metadata and must be validated by Content Studio.

## Rendering contract

Recommended sequence:

1. route entity to `entryAnchor`;
2. continue movement into `portalRect`;
3. foreground door-frame/wall layer occludes the appropriate part of the sprite;
4. fade entity over roughly 0.15–0.30 real seconds (rendering value, not simulation time);
5. hide world sprite and mark visual presentation as inside;
6. logical simulation continues independently.

For exit, spawn the visual representation hidden at `exitAnchor`, fade in while moving out, then resume normal world rendering.

## Architecture rule

The simulation decides **that** a guest is inside a sauna/shop/changing area/etc. Scene routing and SpriteKit decide **how** the transition is visualized.

Do not place economic, capacity or activity completion logic inside the fade animation. A skipped/interrupted visual animation must not change the canonical simulation result.

## Asset-production consequence

Building families should deliberately author reusable dark portal openings and compatible foreground occlusion pieces. This reduces the need for interior scenes and keeps new building/location combinations modular.
