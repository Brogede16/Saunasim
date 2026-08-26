import Dexie, { type EntityTable } from "dexie";
import { z } from "zod";
import { masterCandidates, masterEquipment, type GameState } from "../sim/game";
import { deliveryForms, formats, heatProfiles, intents, materials, musicDirections, performances, recoveryFinishes } from "../sim/program";
import { defaultShopRange, shopItems } from "../sim/shop";
import { venueModuleIds } from "../content/venueModules";

export const SAVE_SCHEMA_VERSION = 12;

const moduleIds = venueModuleIds;

const gameStateSchema = z.object({
  venueName: z.string().min(1).max(80),
  cash: z.number().finite(),
  week: z.number().int().positive(),
  built: z.array(z.enum(moduleIds)),
  masterHired: z.boolean().default(false),
  master: z.object({ name: z.string(), style: z.enum(["Traditional", "Meditative", "Energetic", "Theatrical"]), heatCraft: z.number().int().min(0).max(10), aromaCraft: z.number().int().min(0).max(10), performanceCraft: z.number().int().min(0).max(10), weeklyWage: z.number().int().positive().default(500), equipment: z.array(z.enum(masterEquipment.map((item) => item.id) as [typeof masterEquipment[number]["id"], ...typeof masterEquipment[number]["id"][]])).default([]) }).optional(),
  masterCandidates: z.array(z.object({ id: z.string(), name: z.string(), style: z.enum(["Traditional", "Meditative", "Energetic", "Theatrical"]), heatCraft: z.number().int().min(0).max(10), aromaCraft: z.number().int().min(0).max(10), performanceCraft: z.number().int().min(0).max(10), weeklyWage: z.number().int().positive(), hiringFee: z.number().int().nonnegative(), note: z.string() })).default([masterCandidates[0]]),
  masterSearch: z.object({ tier: z.enum(["patient", "standard", "immediate"]), completesAt: z.number().finite() }).optional(),
  masterSearchCount: z.number().int().nonnegative().default(0),
  admissionPrice: z.number().int().min(16).max(45).default(24),
  schedule: z.object({ openDays: z.number().int().min(1).max(7), opensAt: z.number().int().min(0).max(22), closesAt: z.number().int().min(2).max(24) }),
  activeProgram: z.object({
    name: z.string().min(1).max(60),
    intent: z.enum(intents),
    heat: z.enum(heatProfiles),
    format: z.enum(formats),
    performance: z.enum(performances),
    music: z.enum(musicDirections),
    recoveryFinish: z.enum(recoveryFinishes),
    aromaRounds: z.array(z.object({ material: z.enum(materials), delivery: z.enum(deliveryForms) })).min(1).max(3),
    requestedSessions: z.number().int().min(1).max(8),
    supplementPrice: z.number().int().min(0).max(40),
    revealedTier: z.enum(["Bad", "Normal", "Rare", "Iconic", "Ultimate"]).optional(),
  }),
  repertoire: z.array(z.object({ id: z.string(), savedAtWeek: z.number().int().positive(), composition: z.enum(["Bad", "Normal", "Rare", "Iconic", "Ultimate"]), program: z.object({
    name: z.string().min(1).max(60), intent: z.enum(intents), heat: z.enum(heatProfiles), format: z.enum(formats), performance: z.enum(performances), music: z.enum(musicDirections), recoveryFinish: z.enum(recoveryFinishes), aromaRounds: z.array(z.object({ material: z.enum(materials), delivery: z.enum(deliveryForms) })).min(1).max(3), requestedSessions: z.number().int().min(1).max(8), supplementPrice: z.number().int().min(0).max(40), revealedTier: z.enum(["Bad", "Normal", "Rare", "Iconic", "Ultimate"]),
  }) })).default([]),
  shopRange: z.array(z.enum(shopItems.map((item) => item.id) as [typeof shopItems[number]["id"], ...typeof shopItems[number]["id"][]])).max(3).default(defaultShopRange),
  construction: z.array(z.object({ moduleId: z.enum(moduleIds), completesAt: z.number().finite() })).default([]),
  loans: z.array(z.object({ id: z.enum(["small", "standard", "large"]), weeklyPayment: z.number().int().positive(), remainingWeeks: z.number().int().positive() })).default([]),
  profitableWeeks: z.number().int().nonnegative().default(0),
  financialDecisionPending: z.boolean().default(false),
  condition: z.object({ program: z.number().min(0).max(100).optional(), shower: z.number().min(0).max(100).optional(), "cold-plunge": z.number().min(0).max(100).optional() }).default({}),
  hostHired: z.boolean().default(false),
  serviceHostCount: z.number().int().min(0).max(3).default(0),
  technicianHired: z.boolean().default(false),
  repairTask: z.object({ moduleId: z.enum(["program", "shower", "cold-plunge"]), completesAt: z.number().finite() }).optional(),
  lastReport: z.object({
    admissions: z.number().int().nonnegative(),
    specialSeats: z.number().int().nonnegative(),
    specialCapacity: z.number().int().nonnegative().optional(),
    specialOccupancy: z.number().int().min(0).max(100).optional(),
    shopSales: z.number().int().nonnegative(),
    shopLines: z.array(z.object({ itemId: z.enum(shopItems.map((item) => item.id) as [typeof shopItems[number]["id"], ...typeof shopItems[number]["id"][]]), name: z.string(), units: z.number().int().nonnegative(), revenue: z.number().finite(), procurement: z.number().finite() })).default([]),
    revenue: z.number().finite(),
    operatingCosts: z.number().finite(),
    loanRepayment: z.number().finite(),
    netResult: z.number().finite(),
    revenueBreakdown: z.object({ admissions: z.number().finite(), specialGus: z.number().finite(), shop: z.number().finite() }).default({ admissions: 0, specialGus: 0, shop: 0 }),
    costBreakdown: z.object({ venueBase: z.number().finite(), staff: z.number().finite(), utilitiesAndCleaning: z.number().finite(), programMaterials: z.number().finite(), shopProcurement: z.number().finite(), facilities: z.number().finite() }).default({ venueBase: 0, staff: 0, utilitiesAndCleaning: 0, programMaterials: 0, shopProcurement: 0, facilities: 0 }),
    requestedSessions: z.number().int().positive().optional(),
    feasibleSessions: z.number().int().nonnegative().optional(),
    scheduleFit: z.enum(["Natural", "Mixed", "Awkward"]).default("Natural"),
    scheduleNote: z.string().default("The opening window reaches both daytime recovery and early-evening demand."),
    venueDemandNote: z.string().optional(),
    signal: z.string(),
    recoveryDemand: z.number().int().nonnegative().optional(),
    queueLoss: z.number().int().nonnegative().optional(),
    bottleneck: z.string().optional(),
    guestSnapshots: z.array(z.object({
      id: z.string(),
      name: z.string(),
      age: z.number().int().min(0),
      visitGoal: z.string(),
      programFit: z.enum(["Strong match", "Open to it", "Not their main reason today"]).default("Not their main reason today"),
      latestActivity: z.string(),
      visitPath: z.array(z.enum(["arrival", "queue", "basic-sauna", "program", "outdoor-gus", "shower", "cold-plunge", "shop", "exit"])).min(1),
      currentStop: z.enum(["arrival", "queue", "basic-sauna", "program", "outdoor-gus", "shower", "cold-plunge", "shop", "exit"]),
      likes: z.string(),
      dislikes: z.string(),
      reaction: z.string(),
      outcome: z.enum(["satisfied", "mixed", "frustrated", "aborted"]),
      palette: z.enum(["sand", "moss", "clay", "slate", "coral"]),
    })).optional(),
    programReview: z.object({
      composition: z.enum(["Bad", "Normal", "Rare", "Iconic", "Ultimate"]),
      execution: z.enum(["Bad", "Normal", "Rare", "Iconic"]),
      venueFit: z.enum(["Bad", "Normal", "Rare", "Iconic"]),
      stars: z.number().int().min(1).max(5),
      note: z.string(),
    }).optional(),
  }).optional(),
});

type SaveRecord = {
  id: "autosave";
  schemaVersion: typeof SAVE_SCHEMA_VERSION;
  updatedAt: string;
  gameState: GameState;
};

// Only the envelope's version/shape is validated here; gameState itself is re-validated by
// gameStateSchema in readGameState() below, once we know its schemaVersion is worth reading at
// all. Exported backups therefore accept the exact same version floor as the local IndexedDB
// autosave (see readGameState) - a JSON backup from a slightly older prototype version must be
// just as importable as an equivalent local save, not silently rejected for being a file instead
// of a database row.
const exportedSaveEnvelopeSchema = z.object({
  schemaVersion: z.number().int(),
  exportedAt: z.string().datetime(),
  gameState: z.unknown(),
});

class SaunaSimDatabase extends Dexie {
  saves!: EntityTable<SaveRecord, "id">;

  constructor() {
    super("sauna-sim");
    // Dexie v6 is the deployed IndexedDB store/index layout. It is intentionally independent
    // from SAVE_SCHEMA_VERSION, which versions the serialised game state and its migrations.
    this.version(6).stores({ saves: "id, updatedAt" });
  }
}

const database = new SaunaSimDatabase();

type CanonicalSaveState = Omit<GameState, "selectedGuestId" | "selectedModuleId">;

function canonicalSaveState(gameState: GameState): CanonicalSaveState {
  const { selectedGuestId: _selectedGuestId, selectedModuleId: _selectedModuleId, ...canonical } = gameState;
  return canonical;
}

// Every field added since schema v9 carries a Zod default, so a save from any v9+ prototype
// version parses successfully as long as its *shape* is still compatible - there is no need to
// hand-maintain a literal allow-list of known-good version numbers here, which previously had
// to be edited by hand on every schema bump (and would otherwise reject the *current* version's
// own saves the next time SAVE_SCHEMA_VERSION increases without this list being updated too).
// Only genuinely incompatible pre-v9 saves (for example the old `Silence` music value, which
// cannot truthfully map to the current music vocabulary) are rejected up front.
export const MINIMUM_READABLE_SCHEMA_VERSION = 9;

type ReadGameStateResult = { ok: true; state: GameState } | { ok: false; reason: "version" | "shape" };

// Shared by loadAutosave and importSave so a local save and an exported backup are held to
// exactly the same compatibility floor: only genuinely incompatible pre-v9 data (for example the
// old `Silence` music value, which cannot truthfully map to the current music vocabulary) is
// rejected on version alone. Everything else is decided by gameStateSchema's actual shape check,
// since every field added since v9 carries a Zod default.
function readGameState(schemaVersion: number | undefined, gameStateRaw: unknown): ReadGameStateResult {
  if (schemaVersion === undefined || schemaVersion < MINIMUM_READABLE_SCHEMA_VERSION) return { ok: false, reason: "version" };
  const parsed = gameStateSchema.safeParse(gameStateRaw);
  if (!parsed.success) return { ok: false, reason: "shape" };
  return { ok: true, state: { ...parsed.data, serviceHostCount: parsed.data.serviceHostCount || (parsed.data.hostHired ? 1 : 0) } };
}

export async function loadAutosave(): Promise<GameState | undefined> {
  const saved = await database.saves.get("autosave");
  if (!saved) return undefined;
  const result = readGameState(saved.schemaVersion as number | undefined, saved.gameState);
  if (!result.ok) {
    throw new Error(
      result.reason === "version"
        ? "This local save belongs to an unsupported prototype version and has been preserved."
        : "This local save could not be read and has been preserved.",
    );
  }
  return result.state;
}

export async function saveAutosave(gameState: GameState) {
  await database.saves.put({
    id: "autosave",
    schemaVersion: SAVE_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    gameState: canonicalSaveState(gameState),
  });
}

export function exportSave(gameState: GameState) {
  return JSON.stringify({ schemaVersion: SAVE_SCHEMA_VERSION, exportedAt: new Date().toISOString(), gameState: canonicalSaveState(gameState) }, null, 2);
}

export function importSave(serialized: string): GameState | undefined {
  try {
    const envelope = exportedSaveEnvelopeSchema.safeParse(JSON.parse(serialized));
    if (!envelope.success) return undefined;
    const result = readGameState(envelope.data.schemaVersion, envelope.data.gameState);
    return result.ok ? result.state : undefined;
  } catch {
    return undefined;
  }
}
