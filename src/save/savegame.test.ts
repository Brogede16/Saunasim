import { describe, expect, it } from "vitest";
import { initialState, type GameState } from "../sim/game";
import { exportSave, importSave, MINIMUM_READABLE_SCHEMA_VERSION, SAVE_SCHEMA_VERSION } from "./savegame";

describe("local save backup", () => {
  it("round-trips a valid local save with all current state", () => {
    const state: GameState = {
      ...initialState,
      cash: 8_200,
      venueName: "Steam & Stone",
      built: ["shower"],
      repertoire: [{ id: "program-1-1", savedAtWeek: 1, composition: "Normal", program: { ...initialState.activeProgram, revealedTier: "Normal" } }],
    };
    const restored = importSave(exportSave(state));
    expect(restored).toMatchObject({ cash: 8_200, venueName: "Steam & Stone", built: ["shower"], schedule: initialState.schedule, repertoire: [{ composition: "Normal", program: { name: "Canal Ritual" } }] });
  });

  it("does not persist scene or guest selection as save data", () => {
    const exported = JSON.parse(exportSave({ ...initialState, selectedGuestId: "guest-1", selectedModuleId: "arrival" }));
    expect(exported.gameState).not.toHaveProperty("selectedGuestId");
    expect(exported.gameState).not.toHaveProperty("selectedModuleId");
  });

  it("refuses a malformed or genuinely incompatible backup instead of partially loading it", () => {
    expect(importSave("not json")).toBeUndefined();
    expect(importSave(JSON.stringify({ schemaVersion: MINIMUM_READABLE_SCHEMA_VERSION - 1, exportedAt: new Date().toISOString(), gameState: initialState }))).toBeUndefined();
  });

  it("imports a backup exported from a still-compatible older schema version, same as the local autosave floor", () => {
    const state: GameState = { ...initialState, cash: 6_100, venueName: "Old Export" };
    const olderExport = JSON.stringify({ schemaVersion: MINIMUM_READABLE_SCHEMA_VERSION, exportedAt: new Date().toISOString(), gameState: state });
    expect(importSave(olderExport)).toMatchObject({ cash: 6_100, venueName: "Old Export" });
    // SAVE_SCHEMA_VERSION stays imported in the same way at the current version.
    expect(SAVE_SCHEMA_VERSION).toBeGreaterThanOrEqual(MINIMUM_READABLE_SCHEMA_VERSION);
  });
});
