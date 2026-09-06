import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DRAWN_BEARINGS, isValidAssetFilename, MIRRORED_BEARINGS, sheetFamilies } from "../../src/content/artContract";
import { assetChecklistTotals, buildAssetChecklist, renderAssetChecklist, SHARED_FOOT_PIVOT } from "../../src/content/assetChecklist";

const CHECKLIST = new URL("../../docs/asset-production-checklist-generated.md", import.meta.url);

describe("asset production checklist", () => {
  const rows = buildAssetChecklist();

  it("gives every file a unique name and a real native canvas", () => {
    const names = rows.map((row) => row.file);
    expect(new Set(names).size).toBe(names.length);
    for (const row of rows) {
      expect(row.canvas.width, row.file).toBeGreaterThan(0);
      expect(row.canvas.height, row.file).toBeGreaterThan(0);
      expect(row.pivot.x, row.file).toBeLessThanOrEqual(row.canvas.width);
      expect(row.pivot.y, row.file).toBeLessThanOrEqual(row.canvas.height);
    }
  });

  it("exports every layer of one building on the same canvas", () => {
    // Overlays that share a canvas align by construction. This is what makes "one base plus a short
    // overlay sequence per family" cheaper than drawing a house per purchased combination.
    const workshop = rows.filter((row) => row.file.startsWith("bld-repair-workshop-"));
    expect(workshop).toHaveLength(22);
    expect(new Set(workshop.map((row) => `${row.canvas.width}x${row.canvas.height}`)).size).toBe(1);
    expect(workshop[0].canvas).toEqual({ width: 352, height: 304 });
    expect(workshop.map((row) => row.file)).toEqual(expect.arrayContaining([
      "bld-repair-workshop-roof-material-l1-v01.png",
      "bld-repair-workshop-roof-material-l2-v01.png",
      "bld-repair-workshop-roof-material-l3-v01.png",
    ]));
  });

  it("keeps one shared foot pivot across every land character sheet", () => {
    const land = sheetFamilies.filter((family) => family.depth === "guest" && !/(water|plunge|spa)/.test(family.id));
    for (const family of land) expect(family.pivot, family.id).toEqual(SHARED_FOOT_PIVOT);
  });

  it("uses the foot pivot for water transitions and the waterline only for floating holds", () => {
    // One principle: contact with a surface means the foot pivot. An enter/exit sequence starts on
    // ground and ends on the basin floor, so it is a foot-pivot sheet.
    const pivotOf = (id: string) => sheetFamilies.find((family) => family.id === id)!.pivot.y;
    for (const id of ["guest-cold-plunge-enter-exit", "guest-warm-spa-enter-exit", "guest-natural-water-entry"]) {
      expect(pivotOf(id), id).toBe(SHARED_FOOT_PIVOT.y);
    }
    for (const id of ["guest-water-idle", "guest-spa-seated-idle"]) expect(pivotOf(id), id).toBe(22);
  });

  it("gives every generated file a name the asset contract accepts", () => {
    // Host, Technician and UI sheets previously produced names the project's own validator rejected.
    for (const row of rows) expect(isValidAssetFilename(row.file), row.file).toBe(true);
  });

  it("commissions only the five drawn bearings and mirrors the western three", () => {
    const walk = rows.find((row) => row.file === "guest-walk-8dir-v01.png")!;
    expect(walk.rows).toBe(DRAWN_BEARINGS.length);
    expect(walk.frames).toBe(8 * 5);
    expect(walk.canvas).toEqual({ width: 256, height: 160 });
    expect(walk.purpose).toContain(Object.keys(MIRRORED_BEARINGS).join("/"));
  });

  it("includes the complete approved guest, Master, Host and Technician action library", () => {
    const names = rows.filter((row) => row.group === "character").map((row) => row.file);
    expect(names).toEqual(expect.arrayContaining([
      "guest-walk-8dir-v01.png",
      "guest-warm-spa-enter-exit-v01.png",
      "master-rain-pour-v01.png",
      "staff-host-towel-collect-v01.png",
      "staff-tech-repair-roof-v01.png",
    ]));
  });

  it("matches the committed generated checklist", () => {
    const rendered = renderAssetChecklist(rows);
    if (process.env.UPDATE_ART_SPEC === "1" || !existsSync(CHECKLIST)) {
      writeFileSync(CHECKLIST, rendered);
    }
    expect(readFileSync(CHECKLIST, "utf8"), "run `UPDATE_ART_SPEC=1 pnpm test` to regenerate").toBe(rendered);
  });

  it("reports a production scope the owner can plan a batch against", () => {
    const totals = assetChecklistTotals(rows);
    expect(totals.characters).toBe(43);
    expect(totals.effects).toBe(9);
    expect(totals.buildings).toBe(328);
    expect(totals.locations).toBe(223);
    expect(totals.ui).toBe(6);
  });
});
