import { CHARACTER_FOOT_PIVOT, DRAWN_BEARINGS, drawnRows, MIRRORED_BEARINGS, sheetFamilies, tilesToPx, UPGRADE_TIERS } from "./artContract";
import { BUILDING_SLOT_STATE_COUNT, buildingBases, locationBases, type TileSize } from "./spatialEnvelopes";

/**
 * The complete list of runtime PNGs the game needs, derived from the art contract and the spatial
 * model rather than maintained by hand. Every row is a self-contained commission: a file name, an
 * exact native canvas in pixels, its frame layout and its pivot.
 *
 * Two production rules are baked into the derivation:
 *
 * 1. Every state of a building-owned upgrade exports on the *same* full building canvas with
 *    alpha. Independent state overlays then align by construction; nobody has to trim or
 *    re-register a facade patch by eye.
 * 2. Every upgrade state of a field is a complete drawn state on that field's own canvas, never a
 *    partial repaint over the previous one.
 */

export type AssetRow = {
  file: string;
  group: "character" | "effect" | "building" | "location" | "ui";
  owner: string;
  canvas: TileSize;
  frames: number;
  /** Rows of frames in the exported sheet: one per approved visual bearing, or one for fixed actions. */
  rows: number;
  pivot: { x: number; y: number };
  purpose: string;
};

const px = (size: TileSize) => ({ width: size.width, height: size.height });

export function buildAssetChecklist(): AssetRow[] {
  const rows: AssetRow[] = [];

  for (const family of sheetFamilies) {
    const isEffect = family.id.startsWith("fx-");
    const group: AssetRow["group"] = family.depth === "ui" ? "ui" : isEffect ? "effect" : "character";
    // An eight-bearing sheet exports only the five drawn rows; the western three are flipped at
    // runtime. The commission is therefore 5 rows, not 8, and this is the number an artist quotes.
    const sheetRows = drawnRows(family);
    const mirrorNote = family.directions === 8
      ? ` Rows ${DRAWN_BEARINGS.join("/")}; ${Object.keys(MIRRORED_BEARINGS).join("/")} are mirrored at runtime.`
      : "";
    rows.push({
      file: `${family.id}-v01.png`,
      group,
      owner: group === "ui" ? "shared UI library" : isEffect ? "shared effect library" : "shared character library",
      canvas: px({ width: family.cell.width * family.frames, height: family.cell.height * sheetRows }),
      frames: family.frames * sheetRows,
      rows: sheetRows,
      pivot: family.pivot,
      purpose: family.purpose + mirrorNote,
    });
  }

  for (const building of buildingBases) {
    const canvas = px({ width: tilesToPx(building.footprint.width), height: tilesToPx(building.silhouetteHeight) });
    rows.push({
      file: `bld-${building.id}-base-v01.png`,
      group: "building",
      owner: building.name,
      canvas,
      frames: 1,
      rows: 1,
      // Buildings register by their bottom-left world tile; the whole canvas is the registration.
      pivot: { x: 0, y: canvas.height },
      purpose: building.note,
    });
    for (const slot of building.slots) {
      for (let state = 0; state < BUILDING_SLOT_STATE_COUNT[slot]; state += 1) {
        const tier = UPGRADE_TIERS[state + 1]!;
      rows.push({
          file: `bld-${building.id}-${slot}-${tier}-v01.png`,
        group: "building",
        owner: building.name,
        canvas,
        frames: 1,
        rows: 1,
        pivot: { x: 0, y: canvas.height },
          purpose: `${slot} state ${state + 1} of ${BUILDING_SLOT_STATE_COUNT[slot]}, drawn on the shared building canvas.`,
      });
      }
    }
  }

  for (const location of locationBases) {
    rows.push({
      file: `env-${location.id}-base-v01.png`,
      group: "location",
      owner: location.name,
      canvas: px({ width: tilesToPx(location.world.width), height: tilesToPx(location.world.height) }),
      frames: 1,
      rows: 1,
      pivot: { x: 0, y: 0 },
      purpose: "Terrain, water, roads, protected structures and neutral empty fields only. No purchasable module.",
    });
    for (const field of location.fields) {
      const canvas = px({ width: tilesToPx(field.size.width), height: tilesToPx(field.size.height) });
      for (let state = 0; state < field.states; state += 1) {
        rows.push({
          file: `loc-${location.id}-${field.id}-${UPGRADE_TIERS[state]}-v01.png`,
          group: "location",
          owner: location.name,
          canvas,
          frames: 1,
          rows: 1,
          pivot: { x: 0, y: canvas.height },
          purpose: `${field.name} (${field.terrain}) state ${state + 1} of ${field.states}, drawn complete.`,
        });
      }
    }
  }

  return rows;
}

export function assetChecklistTotals(rows = buildAssetChecklist()) {
  const byGroup = (group: AssetRow["group"]) => rows.filter((row) => row.group === group).length;
  return {
    files: rows.length,
    characters: byGroup("character"),
    effects: byGroup("effect"),
    buildings: byGroup("building"),
    locations: byGroup("location"),
    ui: byGroup("ui"),
    animationFrames: rows.reduce((total, row) => total + row.frames, 0),
  };
}

export function renderAssetChecklist(rows = buildAssetChecklist()) {
  const totals = assetChecklistTotals(rows);
  const header = [
    "# Sauna Sim Asset Production Checklist (generated)",
    "",
    "Do not edit by hand. This file is derived from `src/content/artContract.ts` and",
    "`src/content/spatialEnvelopes.ts`; regenerate with `UPDATE_ART_SPEC=1 pnpm test`.",
    "",
    `Files: **${totals.files}** - ${totals.characters} character sheets, ${totals.effects} effect sheets, `
      + `${totals.buildings} building layers, ${totals.locations} location bases and field states, ${totals.ui} UI atlases. `
      + `Total drawn frames: **${totals.animationFrames}**.`,
    "",
    "The pivot is the point inside the canvas that the renderer aligns to a scene anchor.",
    "",
    "| File | Group | Owner | Canvas px | Frames | Rows | Pivot | Purpose |",
    "| --- | --- | --- | ---: | ---: | ---: | ---: | --- |",
  ];
  const body = rows.map((row) =>
    `| \`${row.file}\` | ${row.group} | ${row.owner} | ${row.canvas.width} x ${row.canvas.height} | ${row.frames} | ${row.rows} | ${row.pivot.x},${row.pivot.y} | ${row.purpose} |`);
  return `${[...header, ...body].join("\n")}\n`;
}

/** Sanity value used by the tests: a guest's foot pivot must never drift between sheets. */
export const SHARED_FOOT_PIVOT = CHARACTER_FOOT_PIVOT;
