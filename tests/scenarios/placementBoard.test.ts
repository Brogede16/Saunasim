import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildingBases, locationBases } from "../../src/content/spatialEnvelopes";

describe("placement board", () => {
  // The review board carries a browser-safe serialisation of canonical geometry. It cannot import
  // TypeScript directly, so this test guards the stable map extent, arrival edge and protected
  // geography that every placement profile relies on.
  const board = readFileSync(new URL("../../public/design/location-placement-board.html", import.meta.url), "utf8");
  const boardData: Array<{ n: string; s: [number, number]; e: [number, number, number, number]; p: Array<[string, number, number, number, number]>; b: Array<[string, number, number, number, number]> }> =
    JSON.parse(board.slice(board.indexOf("const L = [") + "const L = ".length, board.indexOf("];", board.indexOf("const L = [")) + 1)
      .replace(/(\{|,)\s*([a-z])\s*:/g, '$1"$2":').replace(/'/g, '"'));

  const boardLocationName: Record<string, string> = { industrial: "Industrial", kursted: "Kursted" };
  const boardBuildingName: Record<string, string> = { "country-estate-barn": "Country Estate + Barn", kursted: "Kursted" };
  const displayName = (id: string, name: string, aliases: Record<string, string>) => aliases[id] ?? name;

  it("shows the same world size and building footprints as the spec", () => {
    for (const location of locationBases) {
      const card = boardData.find((entry) => entry.n === displayName(location.id, location.name, boardLocationName));
      expect(card, `board card for ${location.id}`).toBeDefined();
      expect(card!.s).toEqual([location.world.width, location.world.height]);
      expect(card!.e).toEqual([location.arrival.x, location.arrival.y, location.arrival.width, location.arrival.height]);

      const boardProtectedRects = card!.p.map(([, x, y, width, height]) => `${x}:${y}:${width}:${height}`);
      for (const zone of location.protectedZones) {
        expect(boardProtectedRects, `board protected zone for ${location.id}:${zone.id}`)
          .toContain(`${zone.x}:${zone.y}:${zone.width}:${zone.height}`);
      }

      const expected = buildingBases
        .filter((building) => (building.legalLocations as readonly string[]).includes(location.id))
        .map((building) => [displayName(building.id, building.name, boardBuildingName), building.footprint.width, building.footprint.height]);
      const shown = card!.b.map(([name, , , width, height]) => [name, width, height]);
      expect(shown.slice().sort()).toEqual(expected.slice().sort());
    }
  });
});
