# Source Background Drafts

## Canal 01 Base Day Draft v01

- File: `canal-01-base-day-draft-v01.png`
- Status: `draft`, not approved for runtime use.
- Dimensions: `1536 x 1024`.
- Role: composition and palette reference for Canal's neutral environment base.
- Required before promotion: simplify to the locked gameplay pixel scale, remove any unapproved context architecture, align the clear workshop footprint and all six fixed fields to `src/content/canalWorkshopScene.ts`, then review at phone scale.

The draft deliberately contains no player-owned workshop or upgrade. It must never be used as a one-piece scene; final Canal art remains a layered environment base plus building and module assets.

## Canal 01 Quay Parcel Draft v02

- File: `canal-01-quay-parcel-draft-v02.png`
- Status: `draft`, source-only and not approved for runtime use.
- Dimensions: `1024 x 1536`.
- Role: a cleaner waterfront-parcel composition reference with an unoccupied central workshop footprint, discrete independent expansion pads, street, fixed quay and canal water.
- Required before promotion: reduce visual density and texture at the locked 16 px tile scale; remove surplus pads; map the final workshop footprint, six module fields and route/effect anchors one-to-one to `src/content/canalWorkshopScene.ts`; validate the mobile camera crop; export the environment, building and upgrades as separate transparent layers.

This is the stronger layout reference than v01 because the empty base already reads as a plausible complete quay parcel. It still cannot be used directly: its image-generation scale, perspective and pad geometry do not match the production scene contract.
